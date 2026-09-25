// Traces the real aramandi-row photograph's silhouette into clean SVG
// path data — the site's ornamental system (BRIEF.md section C of the
// design-elevation pass). Deterministic bitmap tracing (potrace), no
// AI/ML, no generated figures: every path here is derived from real
// students' real silhouettes.
//
// Pipeline:
//   1. Column-scan aramandi-silhouette.png for fully-background gaps to
//      find the true figure clusters (2 solo dancers, 2 overlapping
//      pairs — confirmed by inspection, not assumed).
//   2. Crop each cluster with a small pad, then DOWNSCALE it to a
//      fixed width before tracing. This matters more than it sounds:
//      potrace traces pixel-boundary contours, so tracing at full
//      photo resolution produced enormous paths (12.5KB+ per figure —
//      four of them inline was ~35KB of raw path data, which showed
//      up as measurable render delay in Lighthouse). A silhouette is
//      a solid shape with no fine detail to lose; downscaling first
//      cuts path size by ~70% with no visible quality loss (checked
//      side by side).
//   3. potrace each downscaled crop -> SVG path, turdSize/optTolerance
//      tuned to drop the small closed-loop "speckle" artifacts left
//      over from jewellery glints in the original edge-detected
//      source.
//   4. Write path + viewBox dimensions (kept in the crop's own,
//      downscaled pixel space, not force-normalized — avoids fragile
//      path-string math) to src/lib/ornament.ts.
import sharp from "sharp";
import potrace from "potrace";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const SRC = path.join(root, "assets-inbox", "aramandi-silhouette.png");
const PAD = 10;
const TRACE_WIDTH = 110; // downscale target — see note above

function traceBuffer(buffer, opts) {
  return new Promise((resolve, reject) => {
    const tracer = new potrace.Potrace();
    tracer.setParameters({
      turdSize: 3,
      optCurve: true,
      optTolerance: 1.0,
      threshold: 128,
      blackOnWhite: false, // figures are the LIGHT (gold) shapes here
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

async function findClusters(imgPath) {
  const { data, info } = await sharp(imgPath)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const bg = [data[0], data[1], data[2]];
  const THRESH = 24;

  function isColAllBg(x) {
    for (let y = 0; y < height; y++) {
      const o = (y * width + x) * channels;
      const d =
        Math.abs(data[o] - bg[0]) +
        Math.abs(data[o + 1] - bg[1]) +
        Math.abs(data[o + 2] - bg[2]);
      if (d >= THRESH) return false;
    }
    return true;
  }

  let inFigure = false;
  let start = 0;
  const clusters = [];
  for (let x = 0; x < width; x++) {
    const allBg = isColAllBg(x);
    if (!allBg && !inFigure) {
      inFigure = true;
      start = x;
    }
    if (allBg && inFigure) {
      inFigure = false;
      clusters.push([start, x - 1]);
    }
  }
  if (inFigure) clusters.push([start, width - 1]);
  return { clusters, height };
}

async function run() {
  const { clusters, height: fullHeight } = await findClusters(SRC);
  console.log(
    "found clusters:",
    clusters.map((c) => `${c[0]}-${c[1]} (w=${c[1] - c[0] + 1})`),
  );

  const meta = await sharp(SRC).metadata();
  const results = [];

  for (let i = 0; i < clusters.length; i++) {
    const [x0, x1] = clusters[i];
    const left = Math.max(0, x0 - PAD);
    const right = Math.min(meta.width, x1 + PAD);
    const width = right - left;
    const height = fullHeight;

    const cropBuffer = await sharp(SRC)
      .extract({ left, top: 0, width, height })
      .png()
      .toBuffer();

    const smallBuffer = await sharp(cropBuffer)
      .resize({ width: TRACE_WIDTH })
      .png()
      .toBuffer();
    const smallMeta = await sharp(smallBuffer).metadata();

    const d = await traceBuffer(smallBuffer, {});
    results.push({
      index: i,
      x0,
      x1,
      origWidth: width,
      width: smallMeta.width,
      height: smallMeta.height,
      d,
    });

    // Save a preview PNG so the trace can be visually sanity-checked.
    await sharp(smallBuffer).resize({ width: 300 }).toFile(
      path.join(root, "scripts", `.trace-preview-${i}.png`),
    );
  }

  const single = results.filter((r) => r.origWidth < 350);
  const pairs = results.filter((r) => r.origWidth >= 350);
  console.log(
    "classified — single figures:",
    single.map((r) => r.index),
    "pairs:",
    pairs.map((r) => r.index),
  );

  const tsLines = [
    "/**",
    " * Traced from the real aramandi-row photograph (six students, true",
    " * aramandi) via scripts/trace-ornament.mjs — potrace, deterministic,",
    " * no AI. Path data stays in each crop's own pixel space; render with",
    ' * a matching viewBox rather than forcing 0-1 normalization.',
    " */",
    "export interface TracedFigure {",
    "  d: string;",
    "  width: number;",
    "  height: number;",
    "}",
    "",
  ];

  results.forEach((r, i) => {
    const kind = r.origWidth < 350 ? "SOLO" : "PAIR";
    tsLines.push(`// Cluster ${i} — ${kind}, source x:${r.x0}-${r.x1}`);
    tsLines.push(
      `export const figure${i}: TracedFigure = ${JSON.stringify(
        { d: r.d, width: r.width, height: r.height },
        null,
        2,
      )};`,
    );
    tsLines.push("");
  });

  tsLines.push(
    `export const soloFigures = [${single.map((r) => `figure${r.index}`).join(", ")}];`,
  );
  tsLines.push(
    `export const pairFigures = [${pairs.map((r) => `figure${r.index}`).join(", ")}];`,
  );
  tsLines.push(
    `export const rowFigures = [${results.map((r) => `figure${r.index}`).join(", ")}];`,
  );
  tsLines.push("");

  const outPath = path.join(root, "src", "lib", "ornament.ts");
  const fs = await import("node:fs/promises");
  await fs.writeFile(outPath, tsLines.join("\n"));
  console.log("wrote", outPath);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
