// Generates branded OG image placeholders — text/mark only, no photo.
//
// TODO(post-shoot): the brief (section 9) wants the home OG image to
// contain Binni's real face alongside the wordmark and tagline, once
// real photography exists. Until then this ships a text-only branded
// card rather than a fabricated or stock photo, per the section 2
// honesty constraints. Re-run this script (extending it to composite
// the real portrait) after the shoot.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "og");
mkdirSync(outDir, { recursive: true });

const TOKENS = {
  oxblood: "#4A0D18",
  oxbloodDeep: "#2E0810",
  gold: "#C9A227",
  goldLight: "#E3C766",
  sandalwood: "#EFE3D0",
};

const FONT = "Georgia, 'Times New Roman', serif";

function archPath(cx, top, width, domeHeight, baseHeight) {
  const left = cx - width / 2;
  const right = cx + width / 2;
  const domeTop = top;
  const shoulderY = top + domeHeight;
  const bottom = shoulderY + baseHeight;
  return `M${left} ${bottom} L${left} ${shoulderY} C${left} ${shoulderY - domeHeight * 0.65} ${cx - width * 0.32} ${domeTop} ${cx} ${domeTop} C${cx + width * 0.32} ${domeTop} ${right} ${shoulderY - domeHeight * 0.65} ${right} ${shoulderY} L${right} ${bottom}`;
}

function card({ tagline }) {
  const w = 1200;
  const h = 630;
  const mark = archPath(w / 2, 90, 140, 90, 40);

  return `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="jaali" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <path d="M24 0 V48 M0 24 H48" stroke="${TOKENS.goldLight}" stroke-width="1" />
      <rect x="12" y="12" width="24" height="24" fill="none" stroke="${TOKENS.goldLight}" stroke-width="1" />
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="${TOKENS.oxblood}" />
  <rect width="${w}" height="${h}" fill="url(#jaali)" opacity="0.05" />
  <path d="${mark}" fill="none" stroke="${TOKENS.gold}" stroke-width="4" />
  <text x="${w / 2}" y="290" text-anchor="middle" font-family="${FONT}" font-size="76" fill="${TOKENS.goldLight}">Kalika Nrityalay</text>
  <text x="${w / 2}" y="345" text-anchor="middle" font-family="${FONT}" font-size="30" fill="${TOKENS.sandalwood}">Bharatanatyam &#183; Pandanallur tradition</text>
  <rect x="${w / 2 - 60}" y="390" width="120" height="2" fill="${TOKENS.gold}" opacity="0.6" />
  <text x="${w / 2}" y="450" text-anchor="middle" font-family="${FONT}" font-size="38" fill="${TOKENS.sandalwood}">${tagline}</text>
</svg>`;
}

const variants = {
  home: "Live classes for USA &amp; Canada",
  default: "Vastral, Ahmedabad, India",
};

for (const [name, tagline] of Object.entries(variants)) {
  const svg = card({ tagline });
  const outPath = path.join(outDir, `${name}.png`);
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log(`wrote ${outPath}`);
}
