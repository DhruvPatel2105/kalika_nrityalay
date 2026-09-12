/** Shared arch path (objectBoundingBox units) and its approximate
 * length, used by Arch.astro and HeroParallax.astro for both the
 * clip-path and the stroke-draw entrance animation. */
export const ARCH_PATH =
  "M0 1 L0 0.4 C0 0.18 0.15 0.02 0.5 0.02 C0.85 0.02 1 0.18 1 0.4 L1 1 Z";

type Pt = [number, number];

function cubicPoint(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const mt = 1 - t;
  const a = mt * mt * mt,
    b = 3 * mt * mt * t,
    c = 3 * mt * t * t,
    d = t * t * t;
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ];
}

function cubicLength(p0: Pt, p1: Pt, p2: Pt, p3: Pt, steps = 24): number {
  let len = 0;
  let prev = p0;
  for (let i = 1; i <= steps; i++) {
    const pt = cubicPoint(p0, p1, p2, p3, i / steps);
    len += Math.hypot(pt[0] - prev[0], pt[1] - prev[1]);
    prev = pt;
  }
  return len;
}

export function archPathLength(): number {
  return (
    0.6 +
    cubicLength([0, 0.4], [0, 0.18], [0.15, 0.02], [0.5, 0.02]) +
    cubicLength([0.5, 0.02], [0.85, 0.02], [1, 0.18], [1, 0.4]) +
    0.6
  );
}
