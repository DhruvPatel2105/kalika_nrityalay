// Generates branded OG images using the real Kalika Nrityalay logo
// (public/logo/mark-white.png, produced by process-logo.mjs).
//
// TODO(post-shoot): the brief (section 9) wants the home OG image to
// also contain Binni's real face alongside the wordmark and tagline,
// once real photography exists. Until then this uses the real logo
// plus text only — no photo, no stand-in — per the section 2 honesty
// constraints. Re-run this script (extending it to composite the real
// portrait) after the shoot.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "og");
mkdirSync(outDir, { recursive: true });

const TOKENS = {
  oxblood: "#4A0D18",
  gold: "#C9A227",
  goldLight: "#E3C766",
  sandalwood: "#EFE3D0",
};

const FONT = "Georgia, 'Times New Roman', serif";
const W = 1200;
const H = 630;

function backgroundSvg({ tagline }) {
  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="jaali" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <path d="M24 0 V48 M0 24 H48" stroke="${TOKENS.goldLight}" stroke-width="1" />
      <rect x="12" y="12" width="24" height="24" fill="none" stroke="${TOKENS.goldLight}" stroke-width="1" />
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="${TOKENS.oxblood}" />
  <rect width="${W}" height="${H}" fill="url(#jaali)" opacity="0.05" />
  <rect x="${W / 2 - 60}" y="430" width="120" height="2" fill="${TOKENS.gold}" opacity="0.6" />
  <text x="${W / 2}" y="490" text-anchor="middle" font-family="${FONT}" font-size="38" fill="${TOKENS.sandalwood}">${tagline}</text>
</svg>`;
}

const variants = {
  home: "Live classes for USA &amp; Canada",
  default: "Vastral, Ahmedabad, India",
};

const logoPath = path.join(root, "public", "logo", "mark-white.png");
const logo = await sharp(logoPath).resize({ height: 340 }).toBuffer();
const logoMeta = await sharp(logo).metadata();

for (const [name, tagline] of Object.entries(variants)) {
  const bg = await sharp(Buffer.from(backgroundSvg({ tagline }))).png().toBuffer();
  const outPath = path.join(outDir, `${name}.png`);
  await sharp(bg)
    .composite([
      {
        input: logo,
        top: 40,
        left: Math.round((W - logoMeta.width) / 2),
      },
    ])
    .png()
    .toFile(outPath);
  console.log(`wrote ${outPath}`);
}
