import { useEffect, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getScenePalette } from '../../../lib/scene-palette';
import { createRenderer, releaseRenderer } from '../../../lib/webgl';
import { LAST_CHAPTER, setupChapterStepper } from '../../../lib/chapter-stepper';

gsap.registerPlugin(ScrollTrigger);

/** The scene parts the light/dark switch recolors */
interface ThemedParts {
  ambLight: THREE.AmbientLight;
  keyLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
  fillLight: THREE.PointLight;
  shellMat: THREE.MeshPhongMaterial;
  wireMat: THREE.LineBasicMaterial;
  pointsMat: THREE.PointsMaterial;
}

function applyTheme(s: ThemedParts, isDark: boolean) {
  const p = getScenePalette(isDark);
  s.shellMat.color.setHex(p.shell);
  s.shellMat.emissive.setHex(p.emissive);
  s.shellMat.specular.setHex(p.specular);
  s.shellMat.shininess = isDark ? 40 : 140;

  s.wireMat.color.setHex(p.wire);
  s.pointsMat.color.setHex(p.point);

  s.ambLight.color.setHex(p.ambient);
  s.ambLight.intensity = isDark ? 0.15 : 0.5;
  s.keyLight.color.setHex(p.key);
  s.keyLight.intensity = isDark ? 2.4 : 1.4;
  s.rimLight.color.setHex(p.rim);
  s.rimLight.intensity = isDark ? 1.3 : 0.8;
  s.fillLight.color.setHex(p.fill);
}

/**
 * The Skills 3D stage: a dodecahedron that turns from points (Research) to wireframe (Design)
 * to solid (Prototyping) as the chapters change, plus the chapter timeline and stepper that
 * drive it. The chapter text is animated by its ids (#ui-intro, #ui-01 … #ui-03).
 */
export function useSkillsScene({ canvasRef, containerRef, isDark, isRTL }: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLElement | null>;
  isDark: boolean;
  isRTL: boolean;
}) {
  const themedRef = useRef<ThemedParts | null>(null);
  // The shape sits opposite the chapter text, so RTL mirrors its x offsets
  const xDirRef = useRef(isRTL ? -1 : 1);
  const [activeChapter, setActiveChapter] = useState(0);
  // Set by the stepper: plays the transition and keeps the scroll position on the chapter
  const goToChapterRef = useRef<((chapter: number) => void) | null>(null);

  useEffect(() => {
    xDirRef.current = isRTL ? -1 : 1;
  }, [isRTL]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const p = getScenePalette(isDark);

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dpr = Math.min(window.devicePixelRatio, 1.5);
    // Null when WebGL is unavailable: the chapters still scroll, only the 3D is skipped
    const renderer = createRenderer(canvas);
    renderer?.setPixelRatio(dpr);
    renderer?.setClearAlpha(0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    // Lights
    const ambLight = new THREE.AmbientLight(p.ambient, 0.15);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(p.key, 2.4);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(p.rim, 1.3);
    rimLight.position.set(-4, -1, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(p.fill, 0.4, 14);
    fillLight.position.set(-2, 3, 2);
    scene.add(fillLight);

    const root = new THREE.Group();
    scene.add(root);

    // Geometries
    const geom = new THREE.DodecahedronGeometry(1.4, 0); // 12-sided solid
    const pointsGeom = new THREE.DodecahedronGeometry(1.4, 1); // slightly more dense for points
    const wireGeom = new THREE.WireframeGeometry(new THREE.DodecahedronGeometry(1.4, 0)); // 12-sided wireframe

    // 1. Points (Research)
    const pointsMat = new THREE.PointsMaterial({ color: p.point, size: 0.04, transparent: true, opacity: 0 });
    const meshPoints = new THREE.Points(pointsGeom, pointsMat);
    root.add(meshPoints);

    // 2. Wireframe (Design)
    const wireMat = new THREE.LineBasicMaterial({ color: p.wire, transparent: true, opacity: 0 });
    const meshWire = new THREE.LineSegments(wireGeom, wireMat);
    root.add(meshWire);

    // 3. Solid (Prototyping / Intro)
    const shellMat = new THREE.MeshPhongMaterial({
      color: p.shell,
      emissive: p.emissive,
      specular: p.specular,
      shininess: isDark ? 40 : 140,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const meshSolid = new THREE.Mesh(geom, shellMat);
    root.add(meshSolid);

    themedRef.current = { ambLight, keyLight, rimLight, fillLight, shellMat, wireMat, pointsMat };
    applyTheme(themedRef.current, isDark);

    const resize = () => {
      // Phones (below Tailwind's md) size the stage with svh, so read the canvas box there;
      // wider screens keep sizing from the window as before
      const isPhone = window.innerWidth < 768;
      const w = isPhone ? canvas.clientWidth || window.innerWidth : window.innerWidth;
      const h = isPhone ? canvas.clientHeight || window.innerHeight : window.innerHeight;
      renderer?.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      if (isPhone) {
        // Shrink the shape and lift it into the top of the screen, clear of the
        // chapter text that sits at the bottom
        const unitsPerPx = (2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / h;
        const diameterPx = Math.min(w * 0.5, h * 0.26);
        root.scale.setScalar((diameterPx * unitsPerPx) / 2.8);
        root.position.y = (0.5 - 0.27) * h * unitsPerPx;
      } else {
        root.scale.setScalar(1);
        root.position.y = 0;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    // Tweens animate this LTR offset; the loop applies it to root, mirrored for RTL
    const offset = { x: 0 };
    const isMobile = window.innerWidth <= 768;
    offset.x = isMobile ? 0 : 2; // Right side for intro

    let tl: gsap.core.Timeline;
    let teardownStepper = () => {};

    if (prefersReducedMotion) {
      // Fallback: just show the solid mesh in the center
      offset.x = 0;
      meshSolid.material.opacity = 0.9;
      // Fade in states based on scroll but no complex 3D transitions
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          onUpdate: (self: ScrollTrigger) => {
            const p = self.progress;
            if (p < 0.24) setActiveChapter(0);
            else if (p < 0.5) setActiveChapter(1);
            else if (p < 0.76) setActiveChapter(2);
            else setActiveChapter(3);
          }
        }
      });
      const e = 'power2.inOut';
      tl.to({}, { duration: 4 })
        .fromTo('#ui-intro', { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: -10, duration: 1, ease: e })
        .fromTo('#ui-01', { autoAlpha: 0, x: 10 }, { autoAlpha: 1, x: 0, duration: 1, ease: e }, "<")
        .to({}, { duration: 4 })
        .to('#ui-01', { autoAlpha: 0, x: -10, duration: 1, ease: e })
        .fromTo('#ui-02', { autoAlpha: 0, x: 10 }, { autoAlpha: 1, x: 0, duration: 1, ease: e }, "<")
        .to({}, { duration: 4 })
        .to('#ui-02', { autoAlpha: 0, x: -10, duration: 1, ease: e })
        .fromTo('#ui-03', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 1, ease: e }, "<")
        .to({}, { duration: 4 });
    } else {
      // Chapter k sits at time k of this paused timeline. Scrolling no longer scrubs it:
      // each gesture plays exactly one transition (setupChapterStepper).
      tl = gsap.timeline({ paused: true });

      const e = 'power2.inOut';

      // Intro -> State 1 (Research)
      tl.fromTo('#ui-intro', { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: -30, duration: 1, ease: e })
        .fromTo(meshSolid.material, { opacity: 0.9 }, { opacity: 0, duration: 1, ease: e }, "<")
        // Plain opacity: autoAlpha only applies to DOM elements, so the points never faded in
        .fromTo(meshPoints.material, { opacity: 0 }, { opacity: 1, duration: 1, ease: e }, "<")
        .to(meshPoints.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 1, ease: e }, "<")
        .to(offset, { x: isMobile ? 0 : 1.5, duration: 1, ease: e }, "<")
        .fromTo('#ui-01', { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 1, ease: e }, "<")

      // State 1 -> State 2 (Design)
      tl.to('#ui-01', { autoAlpha: 0, x: -30, duration: 1, ease: e })
        .to(meshPoints.material, { opacity: 0, duration: 1, ease: e }, "<")
        .to(meshWire.material, { opacity: 0.85, duration: 1, ease: e }, "<")
        .to(meshWire.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 1, ease: e }, "<")
        .to(offset, { x: isMobile ? 0 : -2, duration: 1, ease: e }, "<") // Move left, text on right
        .fromTo('#ui-02', { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 1, ease: e }, "<")

      // State 2 -> State 3 (Proto)
      tl.to('#ui-02', { autoAlpha: 0, x: -30, duration: 1, ease: e })
        .to(meshWire.material, { opacity: 0, duration: 1, ease: e }, "<")
        .to(meshSolid.material, { opacity: 0.9, duration: 1, ease: e }, "<")
        .to(offset, { x: isMobile ? 0 : 0, duration: 1, ease: e }, "<") // Center
        .fromTo('#ui-03', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, ease: e }, "<");

      teardownStepper = setupChapterStepper(container, tl, setActiveChapter, goToChapterRef);
    }

    // Pointer Interaction
    const pointer = { x: 0, y: 0 };
    const targetRot = { x: 0, y: 0 };

    const onPointerMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onPointerMove);

    // Animation Loop
    let rafId: number;
    const loop = () => {
      rafId = requestAnimationFrame(loop);

      // Base idle rotations
      if (!prefersReducedMotion) {
        root.rotation.y += 0.001;
        root.rotation.x += 0.0005;

        meshPoints.rotation.y -= 0.002;
        meshWire.rotation.x += 0.001;

        // Pointer inertia (smooth scrubbing)
        targetRot.x += (pointer.y * 0.3 - targetRot.x) * 0.05;
        targetRot.y += (pointer.x * 0.3 - targetRot.y) * 0.05;

        root.rotation.x += targetRot.x * 0.1;
        root.rotation.y += targetRot.y * 0.1;
      }

      root.position.x = offset.x * xDirRef.current;
      renderer?.render(scene, camera);
    };
    if (renderer) loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onPointerMove);
      releaseRenderer(renderer);
      teardownStepper();
      // Only this section's trigger: other sections own theirs
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []); // Built once; the theme and RTL effects update it in place

  // Handle light/dark mode switch for the WebGL scene
  useEffect(() => {
    if (themedRef.current) applyTheme(themedRef.current, isDark);
  }, [isDark]);

  // Jump to chapter (0=Intro, 1=Research, 2=Design, 3=Proto)
  const goToChapter = (chapter: number) => {
    if (goToChapterRef.current) { goToChapterRef.current(chapter); return; }
    const container = containerRef.current;
    if (!container) return;
    const top = container.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (container.offsetHeight - window.innerHeight) * (chapter / LAST_CHAPTER), behavior: 'smooth' });
  };

  return { activeChapter, goToChapter };
}
