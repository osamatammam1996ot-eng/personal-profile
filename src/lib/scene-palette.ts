/**
 * Brand-derived colors for the Three.js scenes. Everything is computed from the
 * --brand and --scene-light tokens, so the 3D shapes follow the theme and any
 * future re-brand automatically.
 */
import * as THREE from 'three';
import { readToken } from './theme-tokens';

export interface ScenePalette {
  shell: number;
  emissive: number;
  specular: number;
  wire: number;
  point: number;
  rim: number;
  fill: number;
  ambient: number;
  key: number;
}

function brandHsl() {
  const hsl = { h: 0, s: 0, l: 0 };
  new THREE.Color(readToken('--brand')).getHSL(hsl);
  return hsl;
}

function hslHex(h: number, s: number, l: number): number {
  return new THREE.Color().setHSL(h, s, l).getHex();
}

/** Palette for the Tools dodecahedron and the Skills scroll scene. */
export function getScenePalette(isDark: boolean): ScenePalette {
  const { h, s, l } = brandHsl();
  const light = new THREE.Color(readToken('--scene-light')).getHex();
  const point = hslHex(h, s, isDark ? Math.min(1, l + 0.2) : Math.max(0, l - 0.2));
  const base = hslHex(h, s, l);

  return {
    shell: hslHex(h, s, isDark ? Math.max(0.05, l - 0.2) : Math.min(0.95, l + 0.3)),
    emissive: hslHex(h, s, isDark ? Math.max(0.1, l - 0.1) : l),
    specular: isDark ? hslHex(h, Math.min(1, s + 0.2), Math.min(0.9, l + 0.3)) : light,
    wire: base,
    point,
    rim: point,
    fill: base,
    ambient: hslHex(h, Math.max(0, s - 0.2), isDark ? Math.min(0.8, l + 0.2) : Math.max(0.2, l - 0.2)),
    key: light,
  };
}

/** Palette for the small decorative glass shapes scattered across sections. */
export function getDecorPalette(isDark: boolean): ScenePalette {
  const { h, s, l } = brandHsl();
  const light = new THREE.Color(readToken('--scene-light')).getHex();
  const shiftedHue = (h + 0.05) % 1.0;

  if (isDark) {
    return {
      shell: hslHex(h, s * 0.8, l * 0.3),
      emissive: hslHex(h, s, l * 0.5),
      specular: hslHex(h, s, Math.min(l * 1.5, 1)),
      wire: hslHex(h, s, Math.min(l * 1.2, 1)),
      point: hslHex(h, s, Math.min(l * 1.2, 1)),
      rim: hslHex(shiftedHue, s, Math.min(l * 1.5, 1)),
      fill: hslHex(h, s, Math.min(l * 1.2, 1)),
      ambient: hslHex(h, s, Math.min(l * 1.2, 1)),
      key: light,
    };
  }

  return {
    shell: hslHex(h, s * 0.5, Math.min(l * 2.5, 0.95)),
    emissive: hslHex(h, s, Math.min(l * 1.5, 0.9)),
    specular: light,
    wire: hslHex(h, s, l),
    point: hslHex(h, s, l),
    rim: hslHex(h, s, l),
    fill: hslHex(shiftedHue, s, Math.min(l * 1.2, 1)),
    ambient: hslHex(h, s, Math.min(l * 2.5, 0.9)),
    key: light,
  };
}
