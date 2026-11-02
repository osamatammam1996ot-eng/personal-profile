/** Longest frame step handed to `frame`, so a pause or a slow frame never makes animations jump */
const MAX_FRAME_MS = 50;

/**
 * Runs `frame` on every animation frame, but only while `target` is on screen
 * (or within `rootMargin` of it). Off-screen it stops requesting frames entirely,
 * so animations below or above the fold cost nothing. `dt` is the time since the
 * previous frame in ms (0 on the first frame after resuming).
 * Returns a function that stops the loop for good.
 */
export function runWhileVisible(
  target: Element,
  frame: (dt: number, now: number) => void,
  { rootMargin = '200px' }: { rootMargin?: string } = {},
): () => void {
  let rafId = 0;
  let visible = false;
  let last: number | null = null;

  const tick = (now: number) => {
    rafId = 0;
    if (!visible) return;
    const dt = last === null ? 0 : Math.min(now - last, MAX_FRAME_MS);
    last = now;
    frame(dt, now);
    rafId = requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !rafId) {
      last = null;
      rafId = requestAnimationFrame(tick);
    }
  }, { rootMargin });
  observer.observe(target);

  return () => {
    visible = false;
    observer.disconnect();
    cancelAnimationFrame(rafId);
  };
}
