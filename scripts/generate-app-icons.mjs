import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const source = join(
  root,
  "public/icons/Gemini_Generated_Image_2zsqdg2zsqdg2zsq.png",
);

const outputs = [
  { path: "public/icons/icon-512.png", size: 512 },
  { path: "public/icons/icon-192.png", size: 192 },
  { path: "public/icons/icon-180.png", size: 180 },
  { path: "public/icons/apple-touch-icon.png", size: 180 },
  { path: "public/icons/favicon-32.png", size: 32 },
  { path: "app/icon.png", size: 512 },
  { path: "app/apple-icon.png", size: 180 },
];

async function generateIcon(size) {
  return sharp(source)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function main() {
  for (const { path, size } of outputs) {
    const outputPath = join(root, path);
    await mkdir(dirname(outputPath), { recursive: true });
    const buffer = await generateIcon(size);
    await writeFile(outputPath, buffer);
    console.log(`Wrote ${path} (${size}x${size})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
