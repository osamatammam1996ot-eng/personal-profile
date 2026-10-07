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

/**
 * Resolves a color that came from the CMS: either a plain CSS color ("#a855f7")
 * or a token reference ("var(--color-brand)"). Empty values use `fallbackToken`.
 */
export function resolveColor(value: string | undefined, fallbackToken = '--brand'): string {
  const v = value?.trim();
  if (!v) return readToken(fallbackToken);
  const ref = v.match(/^var\((--[\w-]+)\)$/);
  if (!ref) return v;
  return readToken(ref[1]) || readToken(ref[1].replace('--color-', '--')) || readToken(fallbackToken);
}

/* ─── Contrast (WCAG 2.x) ──────────────────────────────────────────────────── */

function relativeLuminance([r, g, b]: number[]): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(parseColor(a));
  const lb = relativeLuminance(parseColor(b));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s * 100, l * 100];
}

/**
 * Keeps `color`'s hue but darkens it (on light backgrounds) or lightens it (on
 * dark ones) until it reaches `min` contrast against `background`.
 * Returns the color unchanged when it already passes.
 */
export function ensureContrast(color: string, background: string, min = 4.5): string {
  if (contrastRatio(color, background) >= min) return color;
  const [r, g, b] = parseColor(color);
  const [h, s, l] = rgbToHsl(r, g, b);
  const darken = relativeLuminance(parseColor(background)) > 0.5;
  for (let step = 1; step <= 50; step++) {
    const nl = Math.min(100, Math.max(0, darken ? l - step * 2 : l + step * 2));
    const candidate = `hsl(${h}, ${s}%, ${nl}%)`;
    if (contrastRatio(candidate, background) >= min || nl === 0 || nl === 100) return candidate;
  }
  return color;
}
