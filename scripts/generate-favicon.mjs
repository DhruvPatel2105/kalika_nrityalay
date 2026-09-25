// Builds the favicon set from the traced dancer motif (src/lib/ornament.ts
// figure1 — the cleanest single-figure silhouette) rather than the client's
// full logo mark, per the design-elevation brief (section C): a simplified
// gold-on-oxblood-deep dancer reads clearly at 16-32px where the full
// mandala logo's fine linework does not.
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public");

async function loadFigure1() {
  const src = await fs.readFile(
    path.join(root, "src", "lib", "ornament.ts"),
    "utf8",
  );
  const m = src.match(/export const figure1: TracedFigure = ({[\s\S]*?});/);
  if (!m) throw new Error("figure1 not found in ornament.ts");
  return JSON.parse(m[1]);
}

const figure1 = await loadFigure1();

const OXBLOOD_DEEP = "#2E0810";
const GOLD = "#C9A227";
const MARGIN = 0.14; // fraction of canvas kept clear on each side

async function renderAt(size) {
  const figH = Math.round(size * (1 - MARGIN * 2));
  const figW = Math.round(figH * (figure1.width / figure1.height));
  const x = Math.round((size - figW) / 2);
  const y = Math.round((size - figH) / 2);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect width="100%" height="100%" fill="${OXBLOOD_DEEP}" />
    <svg x="${x}" y="${y}" width="${figW}" height="${figH}" viewBox="0 0 ${figure1.width} ${figure1.height}">
      <path d="${figure1.d}" fill="${GOLD}" />
    </svg>
  </svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function run() {
  const favicon32 = await renderAt(32);
  await sharp(favicon32).toFile(path.join(outDir, "favicon.ico"));

  const favicon512 = await renderAt(512);
  await sharp(favicon512).toFile(path.join(outDir, "favicon-512.png"));

  const appleTouch = await renderAt(180);
  await sharp(appleTouch).toFile(path.join(outDir, "apple-touch-icon.png"));

  console.log("wrote favicon.ico, favicon-512.png, apple-touch-icon.png");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
