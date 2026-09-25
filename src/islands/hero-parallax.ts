/**
 * Hero parallax — pointer only. Rotates the whole layer stack toward
 * the cursor; each layer's own fixed translateZ/scale (set in
 * HeroParallax.astro's CSS) does the rest via real perspective
 * projection. Single rAF loop, lerp factor 0.08.
 *
 * No scroll-linked motion — the design-elevation pass explicitly rules
 * out scroll-scrubbing. Pointer movement is "motion answering a user
 * action," which stays.
 *
 * Desktop + motion-ok only — bails immediately otherwise so no loop
 * ever starts on mobile or under prefers-reduced-motion.
 */

const MAX_TILT_DEG = 6;
const LERP = 0.08;

function desktopMotionOk(): boolean {
  return (
    window.matchMedia("(min-width: 768px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function initHeroParallax(scene: HTMLElement) {
  if (!desktopMotionOk()) return;

  const container = scene.parentElement;
  if (!container) return;

  let targetRX = 0;
  let targetRY = 0;
  let curRX = 0;
  let curRY = 0;
  let raf = 0;
  let active = true;

  function onMouseMove(e: MouseEvent) {
    const rect = container!.getBoundingClientRect();
    const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    targetRY = Math.max(-1, Math.min(1, nx)) * MAX_TILT_DEG;
    targetRX = Math.max(-1, Math.min(1, -ny)) * MAX_TILT_DEG;
  }

  function tick() {
    curRX += (targetRX - curRX) * LERP;
    curRY += (targetRY - curRY) * LERP;
    scene.style.transform = `rotateX(${curRX.toFixed(2)}deg) rotateY(${curRY.toFixed(2)}deg)`;
    if (active) raf = requestAnimationFrame(tick);
  }

  function teardown() {
    active = false;
    cancelAnimationFrame(raf);
    window.removeEventListener("mousemove", onMouseMove);
    scene.style.transform = "";
  }

  window.addEventListener("mousemove", onMouseMove, { passive: true });
  raf = requestAnimationFrame(tick);

  window.addEventListener("resize", () => {
    if (!desktopMotionOk() && active) teardown();
  });
}
