// Generates branded OG images.
//
// `default` uses the real Kalika Nrityalay logo (public/logo/mark-white.png)
// — unchanged from the previous pass.
//
// `home` is rebuilt for the design-elevation pass (item H): composites
// binni-cutout.png (a real, clean alpha cutout) so her face is legible
// at thumbnail size, positioned right-of-centre to echo the hero's own
// composition, with the wordmark + tagline in the clear left space —
// same left/right logic as the hero itself.
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

function backgroundSvg() {
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
</svg>`;
}

function textSvg({ x }) {
  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <text x="${x}" y="255" font-family="${FONT}" font-size="60" fill="${TOKENS.goldLight}">Kalika</text>
  <text x="${x}" y="325" font-family="${FONT}" font-size="60" fill="${TOKENS.goldLight}">Nrityalay</text>
  <rect x="${x}" y="365" width="90" height="3" fill="${TOKENS.gold}" opacity="0.7" />
  <text x="${x}" y="410" font-family="${FONT}" font-size="34" fill="${TOKENS.sandalwood}">Live classes for</text>
  <text x="${x}" y="452" font-family="${FONT}" font-size="34" fill="${TOKENS.sandalwood}">USA &amp; Canada</text>
</svg>`;
}

const logoPath = path.join(root, "public", "logo", "mark-white.png");
const logo = await sharp(logoPath).resize({ height: 340 }).toBuffer();
const logoMeta = await sharp(logo).metadata();

// --- default (unchanged): centred logo + one-line tagline ---
{
  const bg = await sharp(Buffer.from(backgroundSvg())).png().toBuffer();
  const tagline = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect x="${W / 2 - 60}" y="430" width="120" height="2" fill="${TOKENS.gold}" opacity="0.6" />
    <text x="${W / 2}" y="490" text-anchor="middle" font-family="${FONT}" font-size="38" fill="${TOKENS.sandalwood}">Vastral, Ahmedabad, India</text>
  </svg>`;
  const taglineBuf = await sharp(Buffer.from(tagline)).png().toBuffer();
  await sharp(bg)
    .composite([
      { input: logo, top: 40, left: Math.round((W - logoMeta.width) / 2) },
      { input: taglineBuf, top: 0, left: 0 },
    ])
    .png()
    .toFile(path.join(outDir, "default.png"));
  console.log("wrote", path.join(outDir, "default.png"));
}

// --- home: real photo + wordmark, left/right split ---
{
  const cutoutPath = path.join(root, "src", "images", "binni-cutout.png");
  const cutoutMeta = await sharp(cutoutPath).metadata();

  // Crop down to head-through-waist so her face reads at thumbnail
  // size instead of shrinking the full figure into the frame.
  const cropHeight = Math.round(cutoutMeta.height * 0.62);
  const cropped = await sharp(cutoutPath)
    .extract({ left: 0, top: 0, width: cutoutMeta.width, height: cropHeight })
    .toBuffer();

  const targetHeight = H - 40;
  const scale = targetHeight / cropHeight;
  const photo = await sharp(cropped)
    .resize({ height: targetHeight })
    .toBuffer();
  const photoMeta = await sharp(photo).metadata();

  const bg = await sharp(Buffer.from(backgroundSvg())).png().toBuffer();
  const textLeft = 70;
  const textBuf = await sharp(Buffer.from(textSvg({ x: textLeft })))
    .png()
    .toBuffer();

  await sharp(bg)
    .composite([
      { input: textBuf, top: 0, left: 0 },
      {
        input: photo,
        top: H - targetHeight,
        left: W - photoMeta.width - 30,
      },
    ])
    .png()
    .toFile(path.join(outDir, "home.png"));
  console.log("wrote", path.join(outDir, "home.png"), {
    photoWidth: photoMeta.width,
    photoHeight: photoMeta.height,
    scale,
  });
}
