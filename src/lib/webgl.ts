import * as THREE from 'three';

/**
 * Creates a WebGL renderer, or returns null when the browser won't hand out a context
 * (WebGL blocked, no GPU, or the per-browser context limit already used up by other tabs,
 * which is common on phones). Every 3D scene on the site is decoration, so callers
 * skip drawing instead of letting three.js throw and take the page down.
 */
export function createRenderer(
  canvas: HTMLCanvasElement,
  options: { antialias?: boolean } = {},
): THREE.WebGLRenderer | null {
  try {
    return new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: options.antialias ?? true,
      powerPreference: 'low-power',
    });
  } catch (err) {
    console.warn('3D disabled, WebGL unavailable:', err);
    canvas.style.display = 'none';
    return null;
  }
}

/** Frees the renderer's GPU resources. Deliberately no forceContextLoss(): a lost context stays
 *  lost on that canvas, so a remount (React dev double-mount, or re-render) would get a dead
 *  context and the scene would vanish. A remount reuses the same context instead. */
export function releaseRenderer(renderer: THREE.WebGLRenderer | null) {
  renderer?.dispose();
}
