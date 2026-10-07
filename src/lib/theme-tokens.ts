/**
 * Runtime access to the design tokens defined in src/styles/index.css, for code
 * that paints pixels directly (2D canvas, Three.js) and so can't use CSS classes.
 *
 * Tokens resolve against <html>, where the `.dark` class lives, so read them
 * after the theme class is applied (app/page.tsx toggles it in a layout effect,
 * which runs before any child's regular effects).
 */

export function readToken(name: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

let probe: CanvasRenderingContext2D | null = null;

/** Parses any CSS color into [r, g, b, a] — channels 0–255, alpha 0–1. */
export function parseColor(color: string): [number, number, number, number] {
  probe ??= document.createElement('canvas').getContext('2d');
  if (!probe) return [0, 0, 0, 0];
  // Canvas normalises whatever it's given to "#rrggbb" or "rgba(r, g, b, a)".
  probe.fillStyle = 'transparent';
  probe.fillStyle = color;
  const normalized = String(probe.fillStyle);
  if (normalized.startsWith('#')) {
    return [
      parseInt(normalized.slice(1, 3), 16),
      parseInt(normalized.slice(3, 5), 16),
      parseInt(normalized.slice(5, 7), 16),
      1,
    ];
  }
  const [r = 0, g = 0, b = 0, a = 1] = normalized.match(/[\d.]+/g)?.map(Number) ?? [];
  return [r, g, b, a];
}

/** A token's color as an rgba() string, with its alpha multiplied by `alpha`. */
export function tokenRgba(name: string, alpha = 1): string {
  const [r, g, b, a] = parseColor(readToken(name));
  return `rgba(${r},${g},${b},${a * alpha})`;
}
