/**
 * Card depth — brief section 5: perspective(1000px) with a subtle
 * rotateX/rotateY tilt toward the cursor, max 4deg, pointer devices
 * only. Applied to FeePanel, the nearest thing to a "card" in this
 * design (section 4 otherwise avoids the pattern deliberately).
 */

const MAX_TILT_DEG = 4;

export function initCardTilt(el: HTMLElement) {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  el.style.perspective = "1000px";

  function onMove(e: MouseEvent) {
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    const rx = Math.max(-1, Math.min(1, -ny)) * MAX_TILT_DEG;
    const ry = Math.max(-1, Math.min(1, nx)) * MAX_TILT_DEG;
    el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  }

  function onLeave() {
    el.style.transform = "";
  }

  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);
}
