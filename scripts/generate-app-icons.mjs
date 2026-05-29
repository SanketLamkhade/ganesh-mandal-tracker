import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const source = join(root, "public/Ganpati_bg.png");

const MAROON = "#5C1515";
const GOLD = "#D4AF37";

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
  const circleDiameter = Math.round(size * 0.72);
  const borderWidth = Math.max(2, Math.round(size * 0.018));
  const ringDiameter = circleDiameter + borderWidth * 2;
  const offset = Math.round((size - ringDiameter) / 2);

  const circularImage = await sharp(source)
    .resize(circleDiameter, circleDiameter, { fit: "cover" })
    .png()
    .toBuffer()
    .then((buffer) =>
      sharp(buffer)
        .composite([
          {
            input: Buffer.from(
              `<svg width="${circleDiameter}" height="${circleDiameter}">
                <circle cx="${circleDiameter / 2}" cy="${circleDiameter / 2}" r="${circleDiameter / 2}" fill="white"/>
              </svg>`,
            ),
            blend: "dest-in",
          },
        ])
        .png()
        .toBuffer(),
    );

  const ringSvg = Buffer.from(
    `<svg width="${ringDiameter}" height="${ringDiameter}">
      <circle
        cx="${ringDiameter / 2}"
        cy="${ringDiameter / 2}"
        r="${circleDiameter / 2 + borderWidth / 2}"
        fill="none"
        stroke="${GOLD}"
        stroke-width="${borderWidth}"
      />
    </svg>`,
  );

  const ring = await sharp(ringSvg).png().toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: MAROON,
    },
  })
    .composite([
      {
        input: circularImage,
        top: offset + borderWidth,
        left: offset + borderWidth,
      },
      { input: ring, top: offset, left: offset },
    ])
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
