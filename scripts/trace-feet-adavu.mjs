// Traces the real feet-adavu sketchbook photograph (a student's hand
// drawing of feet in salangai, photographed in a notebook) into a
// clean two-tone illustration matching hasta-detail.png's palette —
// deterministic image processing (edge detection + potrace), no AI.
//
// The source is a lit photo of a physical page, not flat vector art,
// which rules out a direct color-threshold trace: the notebook page
// has an uneven lighting gradient that reads as "dark" in places just
// from shadow, and the skirt's paisley pattern is too fine to survive
// simplification. The approach here:
//
//   1. Crop to the feet + anklets only, excluding the patterned skirt
//      hem (it doesn't simplify to anything clean — see the aborted
//      attempts this was tuned against).
//   2. Sobel edge-detect the crop instead of thresholding brightness.
//      Edges respond to *local* contrast, so pen strokes trace
//      reliably regardless of the photo's lighting gradient, which a
//      flat brightness cutoff cannot do.
//   3. Zero out the residual pattern-bleed corner (still-visible skirt
//      corner) by coordinate, not color — it has no clean color
//      signature of its own.
//   4. Separately mask the red/orange region (nail polish, shoe color)
//      by hue, morphologically close it (blur+threshold twice, at a
//      low then a high cutoff) to fill the ragged holes photo lighting
//      left in it, then potrace both masks and composite: red fill
//      layer under a dark linework layer, on a flat sandalwood ground.
import sharp from "sharp";
import potrace from "potrace";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const SRC = path.join(root, "assets-inbox", "feet-adavu-sketchbook.webp");
const OUT = path.join(root, "src", "images", "feet-adavu.png");

// Crop bounds, hand-picked against the source's actual composition
// (see the module comment — no single rectangle excludes the skirt
// pattern for both legs at once, since they sit at different heights).
const CROP = { left: 205, top: 225, width: 330, height: 273 };
const PATTERN_CUT = { y: 150, x: 140 }; // zero out y<this.y && x>this.x

const SANDALWOOD = "#EFE3D0";
const RED = "#C7292A";
const OXBLOOD = "#4A0D18";

function traceMask(buffer, opts) {
  return new Promise((resolve, reject) => {
    const tracer = new potrace.Potrace();
    tracer.setParameters({
      turdSize: 4,
      optCurve: true,
      optTolerance: 0.4,
      threshold: 128,
      blackOnWhite: false,
      ...opts,
    });
    tracer.loadImage(buffer, (err) => {
      if (err) return reject(err);
      const tag = tracer.getPathTag();
      const d = /\sd="([^"]+)"/.exec(tag)?.[1];
      if (!d) return reject(new Error("no path extracted"));
      resolve(d);
    });
  });
}

async function zeroRegion(buffer, cutY, cutXMin) {
  const { data, info } = await sharp(buffer)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (y < cutY && x > cutXMin) {
        const o = (y * width + x) * channels;
        for (let c = 0; c < channels; c++) data[o + c] = 0;
      }
    }
  }
  return sharp(data, { raw: { width, height, channels } }).png().toBuffer();
}

async function buildLineMask(cropBuffer) {
  const gray = await sharp(cropBuffer).greyscale().toBuffer();
  const edges = await sharp(gray)
    .convolve({ width: 3, height: 3, kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] })
    .normalise()
    .toBuffer();
  const { data, info } = await sharp(edges)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const mask = Buffer.alloc(width * height * 3);
  for (let i = 0; i < width * height; i++) {
    const v = data[i * channels] > 45 ? 255 : 0;
    mask[i * 3] = mask[i * 3 + 1] = mask[i * 3 + 2] = v;
  }
  const maskPng = await sharp(mask, {
    raw: { width, height, channels: 3 },
  })
    .png()
    .toBuffer();
  return zeroRegion(maskPng, PATTERN_CUT.y, PATTERN_CUT.x);
}

async function buildRedMask(cropBuffer) {
  const { data, info } = await sharp(cropBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const mask = Buffer.alloc(width * height * 3);
  for (let i = 0; i < width * height; i++) {
    const o = i * channels;
    const r = data[o],
      g = data[o + 1],
      b = data[o + 2];
    const isDark = Math.max(r, g, b) < 110;
    const isRed = !isDark && r - g > 35 && r - b > 25;
    const v = isRed ? 255 : 0;
    mask[i * 3] = mask[i * 3 + 1] = mask[i * 3 + 2] = v;
  }
  let maskPng = await sharp(mask, { raw: { width, height, channels: 3 } })
    .png()
    .toBuffer();
  maskPng = await zeroRegion(maskPng, PATTERN_CUT.y, PATTERN_CUT.x);

  // Morphological close (dilate then erode via blur+rethreshold twice)
  // to fill the ragged internal holes uneven photo lighting left in
  // the red region — a plain trace of this mask looks blotchy.
  const buf = await sharp(maskPng).blur(5).toBuffer();
  let raw = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < raw.info.width * raw.info.height; i++) {
    const o = i * raw.info.channels;
    const v = raw.data[o] > 60 ? 255 : 0; // low threshold = dilate
    for (let c = 0; c < raw.info.channels; c++) raw.data[o + c] = v;
  }
  let dilated = await sharp(raw.data, {
    raw: { width: raw.info.width, height: raw.info.height, channels: raw.info.channels },
  })
    .png()
    .toBuffer();
  dilated = await sharp(dilated).blur(5).toBuffer();
  raw = await sharp(dilated).raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < raw.info.width * raw.info.height; i++) {
    const o = i * raw.info.channels;
    const v = raw.data[o] > 200 ? 255 : 0; // high threshold = erode back
    for (let c = 0; c < raw.info.channels; c++) raw.data[o + c] = v;
  }
  return sharp(raw.data, {
    raw: { width: raw.info.width, height: raw.info.height, channels: raw.info.channels },
  })
    .png()
    .toBuffer();
}

async function run() {
  const cropBuffer = await sharp(SRC)
    .extract(CROP)
    .modulate({ saturation: 1.15, brightness: 1.04 })
    .linear(1.08, -8)
    .sharpen({ sigma: 0.8 })
    .jpeg({ quality: 95 })
    .toBuffer();

  const lineMask = await buildLineMask(cropBuffer);
  const redMask = await buildRedMask(cropBuffer);

  const lineD = await traceMask(lineMask, { turdSize: 6, optTolerance: 0.6 });
  const redD = await traceMask(redMask, { turdSize: 15, optTolerance: 0.8 });

  const { width, height } = CROP;
  const scale = 3;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="${SANDALWOOD}" />
    <path d="${redD}" fill="${RED}" />
    <path d="${lineD}" fill="${OXBLOOD}" />
  </svg>`;

  await sharp(Buffer.from(svg))
    .resize({ width: width * scale })
    .png()
    .toFile(OUT);

  console.log("wrote", OUT, `${width * scale}x${height * scale}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
