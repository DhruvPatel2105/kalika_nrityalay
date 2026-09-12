// Extracts the real Kalika Nrityalay logo (white line-art on a flat
// green background) into a transparent PNG, plus a recolored variant
// for light surfaces. Chroma-key by distance from the sampled
// background color, so anti-aliased edges fade smoothly instead of
// leaving a green halo.
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "assets-inbox", "logo.png");
const outDir = path.join(root, "public", "logo");

const BG = [4, 55, 50];
const THRESHOLD = 40; // distance at which a pixel is treated as fully opaque

function dist(r, g, b) {
  return Math.sqrt((r - BG[0]) ** 2 + (g - BG[1]) ** 2 + (b - BG[2]) ** 2);
}

async function run() {
  const { data, info } = await sharp(src)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const whiteOut = Buffer.alloc(width * height * 4);
  const oxbloodOut = Buffer.alloc(width * height * 4);
  const OXBLOOD = [74, 13, 24];

  for (let i = 0; i < width * height; i++) {
    const o = i * channels;
    const r = data[o],
      g = data[o + 1],
      b = data[o + 2];
    const d = dist(r, g, b);
    const alpha = Math.max(0, Math.min(255, Math.round((d / THRESHOLD) * 255)));

    const wo = i * 4;
    whiteOut[wo] = 255;
    whiteOut[wo + 1] = 255;
    whiteOut[wo + 2] = 255;
    whiteOut[wo + 3] = alpha;

    oxbloodOut[wo] = OXBLOOD[0];
    oxbloodOut[wo + 1] = OXBLOOD[1];
    oxbloodOut[wo + 2] = OXBLOOD[2];
    oxbloodOut[wo + 3] = alpha;
  }

  await sharp(whiteOut, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(path.join(outDir, "mark-white.png"));

  await sharp(oxbloodOut, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(path.join(outDir, "mark-oxblood.png"));

  console.log("wrote mark-white.png and mark-oxblood.png");
}

run();
