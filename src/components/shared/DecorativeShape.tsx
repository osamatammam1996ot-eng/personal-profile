/**
 * DecorativeShape.tsx — Interactive 3D glass/crystal decorative shapes
 *
 * Renders a single abstract 3D shape using raw Three.js (no R3F).
 * Matches the visual language of the Tools section's dodecahedron:
 * translucent glass material and lighting derived from the --brand token, wireframe overlay.
 *
 * Features:
 * - Mouse-follow tilt with spring-damped lerp
 * - Scroll-linked parallax rotation
 * - Smooth return to rest on mouse leave
 * - IntersectionObserver lazy-loading & off-screen pause
 * - prefers-reduced-motion support
 * - Responsive sizing (desktop → tablet → mobile)
 * - Fully decorative: aria-hidden, pointer-events none, no tab focus
 */

import { useRef, useEffect, memo } from 'react';
import * as THREE from 'three';
import { getDecorPalette } from '../../lib/scene-palette';

/* ─── Types ─────────────────────────────────────────────────────────────────── */
type ShapeType = 'icosahedron' | 'octahedron' | 'dodecahedron' | 'torusKnot';
type PositionVariant = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

interface DecorativeShapeProps {
  shape: ShapeType;
  position: PositionVariant;
  /** Base size in px (desktop). Scales down on smaller screens. */
  size?: number;
  /** How far the shape is pushed off the edge (0–50, as %). */
  cropAmount?: number;
  /** Initial Euler rotation offset [x, y, z] in radians. */
  rotationOffset?: [number, number, number];
  isDark: boolean;
}

/* ─── Geometry factory ──────────────────────────────────────────────────────── */
function createGeometry(shape: ShapeType): THREE.BufferGeometry {
  switch (shape) {
    case 'icosahedron':
      return new THREE.IcosahedronGeometry(1.3, 0);
    case 'octahedron':
      return new THREE.OctahedronGeometry(1.3, 0);
    case 'dodecahedron':
      return new THREE.DodecahedronGeometry(1.3, 0);
    case 'torusKnot':
      return new THREE.TorusKnotGeometry(0.7, 0.25, 80, 16, 2, 3);
  }
}

/* ─── Theme colors ──────────────────────────────────────────────────────────── */
interface DecorMaterials {
  shellMat: THREE.MeshPhongMaterial;
  wireMat: THREE.MeshBasicMaterial;
  ambLight: THREE.AmbientLight;
  keyLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
  fillLight: THREE.PointLight;
}

/* Material/light strengths per theme */
const DECOR_LOOK = {
  dark:  { shininess: 80,  shellOpacity: 0.55, wireOpacity: 0.15, amb: 0.45, key: 0.9, rim: 0.5, fill: 0.4 },
  light: { shininess: 140, shellOpacity: 0.60, wireOpacity: 0.18, amb: 0.5,  key: 1.4, rim: 0.8, fill: 0.4 },
};

function applyDecorPalette(s: DecorMaterials, isDark: boolean) {
  const p = getDecorPalette(isDark);
  const look = isDark ? DECOR_LOOK.dark : DECOR_LOOK.light;

  s.shellMat.color.set(p.shell);
  s.shellMat.emissive.set(p.emissive);
  s.shellMat.specular.set(p.specular);
  s.shellMat.shininess = look.shininess;
  s.shellMat.opacity = look.shellOpacity;
  s.wireMat.color.set(p.wire);
  s.wireMat.opacity = look.wireOpacity;
  s.ambLight.color.set(p.ambient); s.ambLight.intensity = look.amb;
  s.keyLight.color.set(p.key);     s.keyLight.intensity = look.key;
  s.rimLight.color.set(p.rim);     s.rimLight.intensity = look.rim;
  s.fillLight.color.set(p.fill);   s.fillLight.intensity = look.fill;
  s.shellMat.needsUpdate = true;
  s.wireMat.needsUpdate = true;
}

/* ─── Position styles (size & crop are props, so these stay inline) ────────── */
function getPositionStyle(
  position: PositionVariant,
  size: number,
  crop: number,
): React.CSSProperties {
  const base: React.CSSProperties = { width: size, height: size };

  switch (position) {
    case 'bottom-left':
      return { ...base, bottom: 0, left: 0, transform: `translate(-${crop}%, ${crop}%)` };
    case 'bottom-right':
      return { ...base, bottom: 0, right: 0, transform: `translate(${crop}%, ${crop}%)` };
    case 'top-left':
      return { ...base, top: 0, left: 0, transform: `translate(-${crop}%, -${crop}%)` };
    case 'top-right':
      return { ...base, top: 0, right: 0, transform: `translate(${crop}%, -${crop}%)` };
  }
}

/* ─── Component ─────────────────────────────────────────────────────────────── */
export const DecorativeShape = memo(function DecorativeShape({
  shape,
  position,
  size = 240,
  cropAmount = 25,
  rotationOffset = [0, 0, 0],
  isDark,
}: DecorativeShapeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    root: THREE.Group;
    shellMat: THREE.MeshPhongMaterial;
    wireMat: THREE.MeshBasicMaterial;
    ambLight: THREE.AmbientLight;
    keyLight: THREE.DirectionalLight;
    rimLight: THREE.DirectionalLight;
    fillLight: THREE.PointLight;
    rafId: number;
    initialized: boolean;
  } | null>(null);

  // Mouse & scroll state stored in refs to avoid re-renders
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const scrollRotRef = useRef(0);
  const currentRotRef = useRef({ x: rotationOffset[0], y: rotationOffset[1] });
  const reducedMotionRef = useRef(false);
  const isVisibleRef = useRef(false);
  const isDarkRef = useRef(isDark);

  // Keep isDarkRef in sync
  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  /* --- Recolor on theme change --- */
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    applyDecorPalette(s, isDark);

    // If reduced motion, do a single re-render with new colors
    if (reducedMotionRef.current && s.initialized) {
      s.renderer.render(s.scene, s.camera);
    }
  }, [isDark]);

  /* ─── Main scene setup & lifecycle ────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    // Check prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = motionQuery.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    motionQuery.addEventListener('change', onMotionChange);

    // Responsive: compute effective size
    const getEffectiveSize = () => {
      const vw = window.innerWidth;
      if (vw <= 768) return size * 0.45;
      if (vw <= 1024) return size * 0.65;
      return size;
    };

    let effectiveSize = getEffectiveSize();

    // ── Three.js init ──
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(dpr);
    renderer.setClearAlpha(0);
    renderer.setSize(effectiveSize, effectiveSize, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 4.2;

    // Lights & materials — colored from the theme tokens by applyDecorPalette
    const ambLight = new THREE.AmbientLight();
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight();
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight();
    rimLight.position.set(-4, -1, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(undefined, 1, 14);
    fillLight.position.set(-2, 3, 2);
    scene.add(fillLight);

    // Root group for rotations
    const root = new THREE.Group();
    root.rotation.set(rotationOffset[0], rotationOffset[1], rotationOffset[2]);
    scene.add(root);

    // Shell mesh
    const geom = createGeometry(shape);
    const shellMat = new THREE.MeshPhongMaterial({ transparent: true, side: THREE.DoubleSide });
    root.add(new THREE.Mesh(geom, shellMat));

    // Wireframe overlay
    const wireGeom = createGeometry(shape);
    const wireMat = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true });
    root.add(new THREE.Mesh(wireGeom, wireMat));

    applyDecorPalette({ shellMat, wireMat, ambLight, keyLight, rimLight, fillLight }, isDarkRef.current);

    // Store refs
    const sceneState = {
      renderer,
      scene,
      camera,
      root,
      shellMat,
      wireMat,
      ambLight,
      keyLight,
      rimLight,
      fillLight,
      rafId: 0,
      initialized: false,
    };
    sceneRef.current = sceneState;

    // ── Mouse tracking ──
    const onMouseMove = (e: MouseEvent) => {
      if (reducedMotionRef.current) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      mouseRef.current.x = ((e.clientX / vw) - 0.5) * 2; // -1 to 1
      mouseRef.current.y = ((e.clientY / vh) - 0.5) * 2;
      mouseRef.current.active = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    // ── Scroll tracking ──
    const onScroll = () => {
      if (reducedMotionRef.current) return;
      const rect = wrapper.getBoundingClientRect();
      const vh = window.innerHeight;
      // How far through the viewport the section center is (-1 to 1)
      const progress = ((rect.top + rect.height / 2) - vh / 2) / vh;
      scrollRotRef.current = progress * 0.26; // max ~15 degrees
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Animation loop ──
    const LERP_SPEED = 0.055;
    const MAX_TILT = 0.85; // ~48 degrees in radians
    const BASE_SPIN = 0.0008; // very slow idle rotation

    const loop = () => {
      if (!isVisibleRef.current) return;

      const targetX = rotationOffset[0]
        + (mouseRef.current.active ? mouseRef.current.y * MAX_TILT : 0)
        + scrollRotRef.current;
      const targetY = rotationOffset[1]
        + (mouseRef.current.active ? mouseRef.current.x * MAX_TILT : 0);

      // Slow idle spin
      currentRotRef.current.x += BASE_SPIN * 0.7;
      currentRotRef.current.y += BASE_SPIN;

      // Spring lerp toward target
      currentRotRef.current.x += (targetX - currentRotRef.current.x) * LERP_SPEED;
      currentRotRef.current.y += (targetY - currentRotRef.current.y) * LERP_SPEED;

      root.rotation.x = currentRotRef.current.x;
      root.rotation.y = currentRotRef.current.y;

      // Gentle float
      root.position.y = Math.sin(performance.now() * 0.0006) * 0.04;

      renderer.render(scene, camera);
      sceneState.rafId = requestAnimationFrame(loop);
    };

    // ── Resize handler ──
    const onResize = () => {
      effectiveSize = getEffectiveSize();
      renderer.setSize(effectiveSize, effectiveSize, false);
      canvas.style.width = effectiveSize + 'px';
      canvas.style.height = effectiveSize + 'px';
      if (wrapper) {
        wrapper.style.width = effectiveSize + 'px';
        wrapper.style.height = effectiveSize + 'px';
      }
    };
    window.addEventListener('resize', onResize);

    // ── IntersectionObserver for lazy init & pause ──
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const wasVisible = isVisibleRef.current;
        isVisibleRef.current = entry.isIntersecting;
        
        if (entry.isIntersecting) {
          if (!sceneState.initialized) {
            sceneState.initialized = true;
            onResize(); // ensure size is correct
            if (reducedMotionRef.current) {
              // Single static render
              renderer.render(scene, camera);
            } else {
              sceneState.rafId = requestAnimationFrame(loop);
            }
          } else if (!wasVisible && !reducedMotionRef.current) {
            // Restart loop when re-entering viewport
            sceneState.rafId = requestAnimationFrame(loop);
          }
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(wrapper);

    // ── Cleanup ──
    return () => {
      observer.disconnect();
      cancelAnimationFrame(sceneState.rafId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      motionQuery.removeEventListener('change', onMotionChange);
      renderer.dispose();
      geom.dispose();
      wireGeom.dispose();
      shellMat.dispose();
      wireMat.dispose();
      sceneRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shape, position, size, cropAmount]);

  /* ─── Render ──────────────────────────────────────────────────────────────── */
  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      role="presentation"
      tabIndex={-1}
      className="absolute z-[18] overflow-visible pointer-events-none"
      style={getPositionStyle(position, size, cropAmount)}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
});
