import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';
import { getScenePalette } from '../../lib/scene-palette';
import { createRenderer, releaseRenderer } from '../../lib/webgl';

gsap.registerPlugin(ScrollTrigger);

interface SkillsProps {
  isDark: boolean;
}

const LAST_CHAPTER = 3;
const STEP_SECONDS = 0.9;
// A trackpad flick keeps firing wheel events for a second or more. Events closer together than
// this belong to the same gesture, and one gesture may move at most one chapter.
const GESTURE_GAP_MS = 250;
const SWIPE_PX = 30;

/**
 * One gesture = one chapter. While the sticky stage fills the screen, wheel, swipe and keyboard
 * scrolling are taken over: each gesture plays exactly one chapter transition however strong it is,
 * and further input is ignored until that transition finishes and the gesture has ended.
 * Scrolling past the first or last chapter hands control back to the page, so it never traps you.
 * The window scroll position is kept on the chapter, so the scrollbar and leaving stay natural.
 */
function setupChapterStepper(
  container: HTMLElement,
  tl: gsap.core.Timeline,
  onChapter: (k: number) => void,
  goToRef: React.MutableRefObject<((k: number) => void) | null>,
) {
  let chapter = 0;
  let animating = false;
  let aligned = false;     // snapped to a chapter since arriving on the stage
  let gestureUsed = false; // the current gesture already moved a chapter
  let lastWheel = 0;
  let selfScroll = false;
  let touchStartY = 0;
  let touchStartedEngaged = false;
  let leaving = 0;         // direction this gesture is leaving the section in; it keeps going natively
  let touchActiveUntil = 0; // a swipe and its momentum are still moving the page until then
  let lastScrollY = window.scrollY;
  let lockTimer: ReturnType<typeof setTimeout> | undefined;

  const span = () => container.offsetHeight - window.innerHeight;
  const engaged = () => {
    const r = container.getBoundingClientRect();
    return r.top <= 1 && r.bottom >= window.innerHeight - 1;
  };
  const nearest = () => {
    const progress = Math.min(1, Math.max(0, -container.getBoundingClientRect().top / Math.max(1, span())));
    return Math.round(progress * LAST_CHAPTER);
  };
  const chapterY = (k: number) => container.getBoundingClientRect().top + window.scrollY + span() * (k / LAST_CHAPTER);
  const scrollToChapter = (k: number) => {
    selfScroll = true;
    window.scrollTo({ top: chapterY(k), behavior: 'instant' as ScrollBehavior });
    // A timer, not rAF: if frames are paused the flag would otherwise stick and stop syncing
    setTimeout(() => { selfScroll = false; }, 120);
  };

  const goTo = (k: number, scroll = true) => {
    k = Math.max(0, Math.min(LAST_CHAPTER, k));
    const steps = Math.abs(k - tl.time());
    chapter = k;
    onChapter(k);
    if (scroll) scrollToChapter(k);
    if (steps < 0.001) return;
    animating = true;
    const duration = STEP_SECONDS * Math.min(steps, 1.5);
    gsap.to(tl, { time: k, duration, ease: 'none', overwrite: true, onComplete: () => { animating = false; } });
    // Backup release: if the browser pauses animation frames mid-transition (background tab,
    // battery saver) the tween stalls, and input must not stay locked until frames resume
    clearTimeout(lockTimer);
    lockTimer = setTimeout(() => { animating = false; }, duration * 1000 + 150);
  };
  goToRef.current = (k) => { aligned = true; goTo(k); };

  const step = (dir: number, e: Event, fresh: boolean) => {
    if (!engaged()) { aligned = false; leaving = 0; return; }
    if (leaving === dir) return; // this gesture already chose to leave: let the page carry on
    if (!aligned && fresh && Math.abs(window.scrollY - chapterY(nearest())) < 4) {
      // Arrived some other way (scrollbar, link, reload) and resting on a chapter: a new
      // gesture or key press steps normally instead of being swallowed
      aligned = true;
      chapter = nearest();
    }
    if (!aligned) {
      // First input after arriving: settle on the chapter we entered at (Intro from above,
      // the last one from below) and use up the rest of this gesture, so the flick that brought
      // you here can't also skip ahead or carry you straight through
      e.preventDefault();
      aligned = true;
      gestureUsed = true;
      goTo(fresh ? nearest() : dir < 0 ? LAST_CHAPTER : 0);
      return;
    }
    const next = chapter + dir;
    if (next < 0 || next > LAST_CHAPTER) {
      // Leaving the section: only on a fresh gesture, after the last transition has finished
      if (animating || gestureUsed) e.preventDefault();
      else leaving = dir;
      return;
    }
    e.preventDefault();
    if (animating || gestureUsed) return;
    gestureUsed = true;
    goTo(next);
  };

  const onWheel = (e: WheelEvent) => {
    const now = performance.now();
    const fresh = now - lastWheel > GESTURE_GAP_MS;
    if (fresh) { gestureUsed = false; leaving = 0; }
    lastWheel = now;
    if (Math.abs(e.deltaY) < 1) return;
    step(Math.sign(e.deltaY), e, fresh);
  };

  const onTouchStart = (e: TouchEvent) => {
    touchStartY = e.touches[0]?.clientY ?? 0;
    touchStartedEngaged = engaged();
    gestureUsed = false;
    leaving = 0;
  };
  const onTouchEnd = () => { touchActiveUntil = performance.now() + 1000; }; // momentum keeps going
  const onTouchMove = (e: TouchEvent) => {
    touchActiveUntil = performance.now() + 1000;
    if (!engaged()) { aligned = false; leaving = 0; return; }
    const dy = touchStartY - (e.touches[0]?.clientY ?? touchStartY); // > 0: swiping up = scrolling down
    if (leaving && leaving === (dy < 0 ? -1 : 1)) return;
    if (aligned && Math.abs(dy) < SWIPE_PX) {
      // Under the swipe threshold: hold the stage still, unless this swipe leads out of the section
      const next = chapter + (dy < 0 ? -1 : 1);
      if (next >= 0 && next <= LAST_CHAPTER) e.preventDefault();
      return;
    }
    step(dy < 0 ? -1 : 1, e, touchStartedEngaged);
  };

  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(t.tagName))) return;
    let dir = 0;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) dir = 1;
    else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) dir = -1;
    if (!dir || e.repeat) return;
    gestureUsed = false;
    leaving = 0;
    step(dir, e, true);
  };

  const onScroll = () => {
    const y = window.scrollY;
    const movingUp = y < lastScrollY;
    lastScrollY = y;
    if (!engaged()) { aligned = false; leaving = 0; return; }
    const now = performance.now();
    const userScrolling = now - lastWheel < GESTURE_GAP_MS || now < touchActiveUntil;
    if (leaving) {
      if (userScrolling) return; // a gesture that chose to leave scrolls freely
      leaving = 0;               // ...but only while that gesture lasts
    }

    // A wheel or swipe gesture that began outside the section can't be cancelled once it gets
    // here (browsers only allow cancelling a gesture from its first event), so it would carry
    // the page straight through. Catch it from the scroll position instead: settle on the chapter
    // it entered at, then hold the stage there until that gesture's momentum dies out.
    if (userScrolling) {
      if (!aligned) {
        aligned = true;
        gestureUsed = true;
        goTo(movingUp ? LAST_CHAPTER : 0);
      } else if (Math.abs(y - chapterY(chapter)) > 1) {
        scrollToChapter(chapter);
      }
      return;
    }

    // Scrollbar drags and anchor links: follow the scroll position
    if (selfScroll || animating) return;
    const k = nearest();
    if (k !== chapter) goTo(k, false);
  };

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('keydown', onKey);
  window.addEventListener('scroll', onScroll, { passive: true });

  // Landing mid-section (reload, back button): start on that chapter
  if (engaged()) { chapter = nearest(); tl.time(chapter); onChapter(chapter); }

  return () => {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('scroll', onScroll);
    gsap.killTweensOf(tl);
    clearTimeout(lockTimer);
    goToRef.current = null;
  };
}

export function Skills({ isDark }: SkillsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const { fontHeading, fontBody, isRTL } = useLanguage();
  // The shape sits opposite the chapter text, so RTL mirrors its x offsets
  const xDirRef = useRef(isRTL ? -1 : 1);

  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    xDirRef.current = isRTL ? -1 : 1;
  }, [isRTL]);

  // Set by the stepper: plays the transition and keeps the scroll position on the chapter
  const goToChapterRef = useRef<((chapter: number) => void) | null>(null);

  // Jump to chapter (0=Intro, 1=Research, 2=Design, 3=Proto)
  const scrollToChapter = (chapter: number) => {
    if (goToChapterRef.current) { goToChapterRef.current(chapter); return; }
    const container = containerRef.current;
    if (!container) return;
    const top = container.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (container.offsetHeight - window.innerHeight) * (chapter / 3), behavior: 'smooth' });
  };

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

    // Initial Light setup based on isDark
    if (!isDark) {
      ambLight.intensity = 0.5;
      keyLight.intensity = 1.4;
      rimLight.intensity = 0.8;
    }

    stateRef.current = {
      ambLight, keyLight, rimLight, fillLight,
      shellMat, wireMat, pointsMat,
    };

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
          onUpdate: (self: any) => {
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
  }, []); // End of main ThreeJS init

  // Handle light/dark mode switch for the WebGL scene
  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;

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
  }, [isDark]);

  const { cmsData } = useCms();
  const { lang } = useLanguage();

  // Fallback if cmsData is not loaded yet
  const skills = cmsData?.skills;
  if (!skills) return null;

  const getStr = (field: any) => field?.[lang] || '';
  const getArr = (field: any) => field?.[lang] || [];

  const disc1 = skills.disciplines[0];
  const disc2 = skills.disciplines[1];
  const disc3 = skills.disciplines[2];

  return (
    <section
      ref={containerRef}
      id="skills"
      className="relative w-full h-[300vh] bg-surface-raised transition-colors duration-300"
    >
      {/* svh on phones so the bottom-anchored text never hides under the browser toolbar */}
      <div className="sticky top-0 w-full h-svh md:h-screen overflow-hidden flex items-center justify-center pointer-events-none" dir={isRTL ? 'rtl' : 'ltr'}>

        {/* WebGL Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

        {/* Phones: scrim under the chapter text in case it reaches the shape on short screens */}
        <div aria-hidden className="md:hidden absolute inset-x-0 bottom-0 h-3/5 z-[5] bg-linear-to-t from-surface-raised from-55% to-transparent" />

        {/* Navigation Dots */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:left-auto lg:${isRTL ? 'left-6' : 'right-6'} z-20 flex flex-row lg:flex-col gap-6 lg:gap-4 pointer-events-auto lg:translate-x-0`}>
          {[0, 1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => scrollToChapter(num)}
              className={`text-xs lg:text-sm font-bold transition-colors duration-300 tracking-widest ${activeChapter === num ? 'text-brand-text' : 'text-text-faint hover:text-text-secondary'}`}
              
            >
              {num === 0 ? 'Intro' : `0${num}`}
            </button>
          ))}
        </div>

        <div className="relative z-10 w-full max-w-[1200px] h-full mx-auto px-6 md:px-10">

          {/* Intro State */}
          <div id="ui-intro" className={`absolute bottom-20 md:bottom-auto md:top-1/3 ${isRTL ? 'right-6 md:right-10 pl-12 md:pl-0' : 'left-6 md:left-10 pr-12 md:pr-0'} max-w-lg`}>

            <h1 className="font-bold text-4xl md:text-6xl text-text-primary mb-4 md:mb-6 leading-tight" >
              {getStr(skills.heading1)}<br />{getStr(skills.heading2)}
            </h1>
            <p className="text-text-secondary text-lg md:text-xl leading-relaxed" >
              “{getStr(skills.desc)}”
            </p>
            <div className="mt-6 md:mt-12 flex items-center gap-3 text-text-muted text-sm md:text-base">
              <span className="w-10 h-px bg-text-muted/30"></span>
              Scroll to explore
            </div>
          </div>

          {/* State 1: Research */}
          <div id="ui-01" className={`absolute bottom-20 md:bottom-auto md:top-1/4 ${isRTL ? 'right-6 md:right-10 pl-12 md:pl-0' : 'left-6 md:left-10 pr-12 md:pr-0'} max-w-sm opacity-0 invisible pointer-events-auto`}>
            <h2 className="text-text-secondary text-4xl md:text-5xl font-bold mb-1 md:mb-2" >01</h2>
            <h3 className="text-text-primary text-xl md:text-2xl mb-3 md:mb-4 whitespace-nowrap" >{getStr(disc1?.title).replace(/\n/g, ' ')}</h3>
            <p className="text-text-secondary text-base md:text-lg mb-4 md:mb-8" >
              “{getStr(disc1?.tagline)}”
            </p>
            <ul className={`grid grid-cols-2 gap-x-4 gap-y-2 md:flex md:flex-col md:gap-3 ${isRTL ? 'border-r pr-4 md:pr-5' : 'border-l pl-4 md:pl-5'} border-brand/10 dark:border-border-default `}>
              {getArr(disc1?.tags).map((cap: string) => (
                <li key={cap} className="text-text-secondary text-sm md:text-base tracking-wide hover:text-brand-text transition-colors cursor-default" >
                  {cap}
                </li>
              ))}
            </ul>
          </div>

          {/* State 2: Design */}
          <div id="ui-02" className={`absolute bottom-20 md:bottom-auto md:top-1/4 ${isRTL ? 'left-6 md:left-10 pr-12 md:pr-0' : 'right-6 md:right-10 pl-12 md:pl-0'} max-w-sm opacity-0 invisible pointer-events-auto`}>
            <h2 className="text-text-secondary text-4xl md:text-5xl font-bold mb-1 md:mb-2" >02</h2>
            <h3 className="text-text-primary text-xl md:text-2xl mb-3 md:mb-4 whitespace-nowrap" >{getStr(disc2?.title).replace(/\n/g, ' ')}</h3>
            <p className="text-text-secondary text-base md:text-lg mb-4 md:mb-8" >
              “{getStr(disc2?.tagline)}”
            </p>
            <ul className={`grid grid-cols-2 gap-x-4 gap-y-2 md:flex md:flex-col md:gap-3 ${isRTL ? 'border-r md:border-r-0 md:border-l pr-4 md:pr-0 md:pl-5' : 'border-l md:border-l-0 md:border-r pl-4 md:pl-0 md:pr-5'} border-brand/10 dark:border-border-default `}>
              {getArr(disc2?.tags).map((cap: string) => (
                <li key={cap} className="text-text-secondary text-sm md:text-base tracking-wide hover:text-brand-text transition-colors cursor-default" >
                  {cap}
                </li>
              ))}
            </ul>
          </div>

          {/* State 3: Prototyping */}
          <div id="ui-03" className={`absolute bottom-20 ${isRTL ? 'right-6 md:right-10 pl-12 md:pl-0' : 'left-6 md:left-10 pr-12 md:pr-0'} max-w-3xl opacity-0 invisible pointer-events-auto`}>
            <div className="md:w-1/2">
              <h2 className="text-text-secondary text-4xl md:text-5xl font-bold mb-1 md:mb-2" >03</h2>
              <h3 className="text-text-primary text-xl md:text-2xl mb-3 md:mb-4 whitespace-nowrap" >{getStr(disc3?.title).replace(/\n/g, ' ')}</h3>
              <p className="text-text-secondary text-base md:text-lg mb-4 md:mb-8" >
                “{getStr(disc3?.tagline)}”
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-2 md:gap-4 border-t border-brand/10 dark:border-border-default pt-4 md:pt-6 ">
              {getArr(disc3?.tags).map((cap: string) => (
                <li key={cap} className="text-text-secondary text-sm md:text-base tracking-wide hover:text-brand-text transition-colors cursor-default" >
                  {cap}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}