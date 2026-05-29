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

const MAROON = { r: 92, g: 21, b: 21 };
const MAROON_HEX = "#5C1515";

const outputs = [
  { path: "public/icons/icon-512.png", size: 512 },
  { path: "public/icons/icon-192.png", size: 192 },
  { path: "public/icons/icon-180.png", size: 180 },
  { path: "public/icons/apple-touch-icon.png", size: 180 },
  { path: "public/icons/favicon-32.png", size: 32 },
  { path: "app/icon.png", size: 512 },
  { path: "app/apple-icon.png", size: 180 },
];

function isCheckerboardGray(r, g, b) {
  const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
  if (maxDiff > 18) {
    return false;
  }

  const lum = (r + g + b) / 3;
  return lum >= 70 && lum <= 210;
}

async function loadCleanedSource() {
  const { data, info } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (isCheckerboardGray(r, g, b)) {
      data[i] = MAROON.r;
      data[i + 1] = MAROON.g;
      data[i + 2] = MAROON.b;
      data[i + 3] = 255;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .flatten({ background: MAROON_HEX })
    .png()
    .toBuffer();
}

async function generateIcon(cleanedSource, size) {
  const iconSize = Math.round(size * 0.92);

  const resized = await sharp(cleanedSource)
    .resize(iconSize, iconSize, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();

  const offset = Math.round((size - iconSize) / 2);

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: MAROON,
    },
  })
    .composite([{ input: resized, top: offset, left: offset }])
    .png()
    .toBuffer();
}

async function main() {
  const cleanedSource = await loadCleanedSource();
  const cleanedPath = join(root, "public/icons/icon-source-clean.png");
  await writeFile(cleanedPath, cleanedSource);
  console.log("Wrote public/icons/icon-source-clean.png");

  for (const { path, size } of outputs) {
    const outputPath = join(root, path);
    await mkdir(dirname(outputPath), { recursive: true });
    const buffer = await generateIcon(cleanedSource, size);
    await writeFile(outputPath, buffer);
    console.log(`Wrote ${path} (${size}x${size})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
