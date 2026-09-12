// Brand mark only (the torana arch) — no photography needed here.
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const svg = `
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" fill="#4A0D18" />
  <path d="M16 52 L16 30 C16 16 22 8 32 8 C42 8 48 16 48 30 L48 52"
    fill="none" stroke="#C9A227" stroke-width="5" stroke-linecap="round" />
</svg>`;

writeFileSync(path.join(publicDir, "favicon.svg"), svg.trim());

await sharp(Buffer.from(svg)).resize(32, 32).png().toFile(path.join(publicDir, "favicon.ico"));
await sharp(Buffer.from(svg)).resize(180, 180).png().toFile(path.join(publicDir, "apple-touch-icon.png"));

console.log("wrote favicon.svg, favicon.ico, apple-touch-icon.png");
