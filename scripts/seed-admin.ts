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

async function seedAdmin() {
  const bcrypt = (await import("bcryptjs")).default;
  const { connectDB } = await import("../lib/mongodb");
  const { User } = await import("../models/User");

  const username = process.argv[2] || "admin";
  const password = process.argv[3] || "admin123";
  const displayName = process.argv[4] || "Admin";

  await connectDB();

  const existing = await User.findOne({ username });
  if (existing) {
    console.log(`User "${username}" already exists. Skipping.`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ username, passwordHash, displayName });

  console.log(`Admin user created: username="${username}"`);
  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
