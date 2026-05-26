import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      if (key) process.env[key] = value;
    }
  } catch {
    // .env.local may not exist in all environments
  }
}

loadEnv();

async function setupDatabase() {
  const bcrypt = (await import("bcryptjs")).default;
  const { connectDB } = await import("../lib/mongodb");
  const { User } = await import("../models/User");
  const { Pavti } = await import("../models/Pavti");
  const { Expense } = await import("../models/Expense");

  await connectDB();
  console.log("Connected to MongoDB");

  await User.syncIndexes();
  await Pavti.syncIndexes();
  await Expense.syncIndexes();
  console.log("Synced indexes: users, pavtis, expenses");

  const mongoose = (await import("mongoose")).default;
  const collections = await mongoose.connection.db!.listCollections().toArray();
  console.log(
    "Collections:",
    collections.map((c) => c.name).sort().join(", "),
  );

  const username = process.argv[2] || "admin";
  const password = process.argv[3] || "admin123";
  const displayName = process.argv[4] || "Admin";

  const existing = await User.findOne({ username });
  if (existing) {
    console.log(`User "${username}" already exists. Skipping.`);
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({ username, passwordHash, displayName });
    console.log(`Admin user created: username="${username}"`);
  }

  console.log("Database setup complete.");
  process.exit(0);
}

setupDatabase().catch((error) => {
  console.error("Database setup failed:", error);
  if (
    error instanceof Error &&
    error.message.includes("IP that isn't whitelisted")
  ) {
    console.error("\nFix MongoDB Atlas access first:");
    console.error("1. https://cloud.mongodb.com → Network Access");
    console.error("2. Add IP Address → Allow Access from Anywhere (0.0.0.0/0)");
    console.error("3. Database → resume cluster0 if paused");
    console.error("4. Wait 1–2 minutes, then run: npm run db:setup");
  }
  process.exit(1);
});
