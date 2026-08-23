import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';

gsap.registerPlugin(ScrollTrigger);

interface SkillsProps {
  isDark: boolean;
}

export function Skills({ isDark }: SkillsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const { fontHeading, fontBody } = useLanguage();

  const [activeChapter, setActiveChapter] = useState(0);

  // Jump to chapter
  const scrollToChapter = (chapter: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const containerTop = rect.top + scrollTop;
    const totalHeight = rect.height;

    // Chapters: 0=Intro, 1=Research, 2=Design, 3=Proto
    // Mapped roughly to progress
    let progress = 0;
    if (chapter === 1) progress = 0.33;
    if (chapter === 2) progress = 0.66;
    if (chapter === 3) progress = 1;

    const targetY = containerTop + (totalHeight - window.innerHeight) * progress;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);
    resize();

    // Lights
    const ambLight = new THREE.AmbientLight(0x9988ff, 0.45);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
    rimLight.position.set(-4, -1, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xa855f7, 0.4, 14);
    fillLight.position.set(-2, 3, 2);
    scene.add(fillLight);

    const root = new THREE.Group();
    scene.add(root);

    // Geometries
    const geom = new THREE.DodecahedronGeometry(1.4, 0); // 12-sided solid
    const pointsGeom = new THREE.DodecahedronGeometry(1.4, 1); // slightly more dense for points
    const wireGeom = new THREE.WireframeGeometry(new THREE.DodecahedronGeometry(1.4, 0)); // 12-sided wireframe

    // 1. Points (Research)
    const pointsMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.04, transparent: true, opacity: 0 });
    const meshPoints = new THREE.Points(pointsGeom, pointsMat);
    root.add(meshPoints);

    // 2. Wireframe (Design)
    const wireMat = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0 });
    const meshWire = new THREE.LineSegments(wireGeom, wireMat);
    root.add(meshWire);

    // 3. Solid (Prototyping / Intro)
    const shellMat = new THREE.MeshPhongMaterial({
      color: isDark ? 0x15113d : 0xe0d8fa,
      emissive: isDark ? 0x241573 : 0x6357e6,
      specular: isDark ? 0x9966ff : 0xffffff,
      shininess: isDark ? 80 : 140,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const meshSolid = new THREE.Mesh(geom, shellMat);
    root.add(meshSolid);

    // Initial Light setup based on isDark
    if (!isDark) {
      ambLight.color.setHex(0xa5b4fc); ambLight.intensity = 0.5;
      keyLight.intensity = 1.4;
      rimLight.color.setHex(0x6366f1); rimLight.intensity = 0.8;
      fillLight.color.setHex(0x8b5cf6);
      wireMat.color.setHex(0x6366f1);
      pointsMat.color.setHex(0x0284c7);
    }

    stateRef.current = {
      ambLight, keyLight, rimLight, fillLight,
      shellMat, wireMat, pointsMat,
    };

    // Initial position
    const isMobile = window.innerWidth <= 768;
    root.position.x = isMobile ? 0 : 2; // Right side for intro

    let tl: gsap.core.Timeline;

    if (prefersReducedMotion) {
      // Fallback: just show the solid mesh in the center
      root.position.x = 0;
      meshSolid.material.opacity = 0.9;
      // Fade in states based on scroll but no complex 3D transitions
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          onUpdate: (self) => {
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
        .fromTo('#ui-intro', { opacity: 1, x: 0 }, { opacity: 0, x: -10, duration: 1, ease: e })
        .fromTo('#ui-01', { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 1, ease: e }, "<")
        .to({}, { duration: 4 })
        .to('#ui-01', { opacity: 0, x: -10, duration: 1, ease: e })
        .fromTo('#ui-02', { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 1, ease: e }, "<")
        .to({}, { duration: 4 })
        .to('#ui-02', { opacity: 0, x: -10, duration: 1, ease: e })
        .fromTo('#ui-03', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, ease: e }, "<")
        .to({}, { duration: 4 });
    } else {
      // Scroll GSAP Timeline for full 3D experience
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.24) setActiveChapter(0);
            else if (p < 0.5) setActiveChapter(1);
            else if (p < 0.76) setActiveChapter(2);
            else setActiveChapter(3);
          }
        }
      });

      const e = 'power2.inOut';

      // Intro Hold
      tl.to({}, { duration: 4 });

      // Intro -> State 1 (Research)
      tl.fromTo('#ui-intro', { opacity: 1, x: 0 }, { opacity: 0, x: -30, duration: 1, ease: e })
        .fromTo(meshSolid.material, { opacity: 0.9 }, { opacity: 0, duration: 1, ease: e }, "<")
        .fromTo(meshPoints.material, { opacity: 0 }, { opacity: 1, duration: 1, ease: e }, "<")
        .to(meshPoints.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 1, ease: e }, "<")
        .to(root.position, { x: isMobile ? 0 : 1.5, duration: 1, ease: e }, "<")
        .fromTo('#ui-01', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 1, ease: e }, "<")

      // State 1 Hold
      tl.to({}, { duration: 4 })

      // State 1 -> State 2 (Design)
      tl.to('#ui-01', { opacity: 0, x: -30, duration: 1, ease: e })
        .to(meshPoints.material, { opacity: 0, duration: 1, ease: e }, "<")
        .to(meshWire.material, { opacity: 0.85, duration: 1, ease: e }, "<")
        .to(meshWire.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 1, ease: e }, "<")
        .to(root.position, { x: isMobile ? 0 : -2, duration: 1, ease: e }, "<") // Move left, text on right
        .fromTo('#ui-02', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 1, ease: e }, "<")

      // State 2 Hold
      tl.to({}, { duration: 4 })

      // State 2 -> State 3 (Proto)
      tl.to('#ui-02', { opacity: 0, x: -30, duration: 1, ease: e })
        .to(meshWire.material, { opacity: 0, duration: 1, ease: e }, "<")
        .to(meshSolid.material, { opacity: 0.9, duration: 1, ease: e }, "<")
        .to(root.position, { x: isMobile ? 0 : 0, duration: 1, ease: e }, "<") // Center
        .fromTo('#ui-03', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: e }, "<")

      // State 3 Hold
      tl.to({}, { duration: 4 });
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

      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onPointerMove);
      renderer.dispose();
      tl.kill();
      // clean up any floating scrolltriggers
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []); // End of main ThreeJS init

  // Handle light/dark mode switch for the WebGL scene
  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;

    if (isDark) {
      s.shellMat.color.setHex(0x15113d);
      s.shellMat.emissive.setHex(0x241573);
      s.shellMat.specular.setHex(0x9966ff);
      s.shellMat.shininess = 80;

      s.wireMat.color.setHex(0x6366f1);
      s.pointsMat.color.setHex(0x38bdf8);

      s.ambLight.color.setHex(0x9988ff);
      s.ambLight.intensity = 0.45;
      s.keyLight.intensity = 0.9;
      s.rimLight.color.setHex(0x38bdf8);
      s.rimLight.intensity = 0.5;
      s.fillLight.color.setHex(0xa855f7);
    } else {
      s.shellMat.color.setHex(0xe0d8fa);
      s.shellMat.emissive.setHex(0x6357e6);
      s.shellMat.specular.setHex(0xffffff);
      s.shellMat.shininess = 140;

      s.wireMat.color.setHex(0x6366f1);
      s.pointsMat.color.setHex(0x0284c7);

      s.ambLight.color.setHex(0xa5b4fc);
      s.ambLight.intensity = 0.5;
      s.keyLight.intensity = 1.4;
      s.rimLight.color.setHex(0x6366f1);
      s.rimLight.intensity = 0.8;
      s.fillLight.color.setHex(0x8b5cf6);
    }
  }, [isDark]);

  const { cmsData } = useCms();
  const { lang, isRTL } = useLanguage();

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
      className="relative w-full h-[400vh] bg-surface transition-colors duration-300"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center pointer-events-none" dir={isRTL ? 'rtl' : 'ltr'}>

        {/* Ambient Atmospheric Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Subtle gradient overlay to blend top and bottom edges with adjacent sections */}
          <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface opacity-90" />
          
          {/* Core radial glow behind the 3D object */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] rounded-full opacity-10 dark:opacity-15" 
            style={{
              background: 'radial-gradient(circle, var(--brand) 0%, transparent 70%)',
              filter: 'blur(100px)'
            }} 
          />
          
          {/* Secondary ambient glow (Cyan/Info) */}
          <div 
            className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full opacity-5 dark:opacity-10"
            style={{
              background: 'radial-gradient(circle, var(--info) 0%, transparent 70%)',
              filter: 'blur(80px)'
            }}
          />
          
          {/* Tertiary ambient glow (Purple/Brand) */}
          <div 
            className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] rounded-full opacity-5 dark:opacity-[0.10]"
            style={{
              background: 'radial-gradient(circle, var(--brand) 0%, transparent 70%)',
              filter: 'blur(90px)'
            }}
          />
        </div>

        {/* WebGL Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

        {/* Navigation Dots */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:left-auto lg:${isRTL ? 'left-6' : 'right-6'} z-20 flex flex-row lg:flex-col gap-6 lg:gap-4 pointer-events-auto lg:translate-x-0`}>
          {[0, 1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => scrollToChapter(num)}
              className={`text-xs lg:text-sm font-bold transition-colors duration-300 tracking-widest ${activeChapter === num ? 'text-brand' : 'text-white/30 hover:text-white/80'}`}
              
            >
              {num === 0 ? 'Intro' : `0${num}`}
            </button>
          ))}
        </div>

        <div className="relative z-10 w-full max-w-[1200px] h-full mx-auto px-6 md:px-10">

          {/* Intro State */}
          <div id="ui-intro" className={`absolute top-[25%] md:top-1/3 ${isRTL ? 'right-6 md:right-10 pl-12 md:pl-0' : 'left-6 md:left-10 pr-12 md:pr-0'} max-w-lg`}>

            <h1 className="font-bold text-4xl md:text-6xl text-text-primary mb-6 leading-tight" >
              {getStr(skills.heading1)}<br />{getStr(skills.heading2)}
            </h1>
            <p className="text-text-secondary text-lg md:text-xl leading-relaxed" >
              “{getStr(skills.desc)}”
            </p>
            <div className="mt-8 md:mt-12 flex items-center gap-3 text-text-muted text-sm md:text-base">
              <span className="w-10 h-px bg-text-muted/30"></span>
              Scroll to explore
            </div>
          </div>

          {/* State 1: Research */}
          <div id="ui-01" className={`absolute top-[20%] md:top-1/4 ${isRTL ? 'right-6 md:right-10 pl-12 md:pl-0' : 'left-6 md:left-10 pr-12 md:pr-0'} max-w-sm opacity-0 pointer-events-auto`}>
            <h2 className="text-text-secondary text-4xl md:text-5xl font-bold mb-1 md:mb-2" >01</h2>
            <h3 className="text-text-primary text-xl md:text-2xl mb-3 md:mb-4 whitespace-nowrap" >{getStr(disc1?.title).replace(/\n/g, ' ')}</h3>
            <p className="text-text-secondary text-base md:text-lg mb-6 md:mb-8" >
              “{getStr(disc1?.tagline)}”
            </p>
            <ul className={`flex flex-col gap-2 md:gap-3 ${isRTL ? 'border-r pr-4 md:pr-5' : 'border-l pl-4 md:pl-5'} border-brand/10 dark:border-white/10`}>
              {getArr(disc1?.tags).map((cap: string) => (
                <li key={cap} className="text-text-secondary text-sm md:text-base tracking-wide hover:text-[#38bdf8] transition-colors cursor-default" >
                  {cap}
                </li>
              ))}
            </ul>
          </div>

          {/* State 2: Design */}
          <div id="ui-02" className={`absolute top-[20%] md:top-1/4 ${isRTL ? 'left-6 md:left-10 pr-12 md:pr-0' : 'right-6 md:right-10 pl-12 md:pl-0'} max-w-sm opacity-0 pointer-events-auto`}>
            <h2 className="text-text-secondary text-4xl md:text-5xl font-bold mb-1 md:mb-2" >02</h2>
            <h3 className="text-text-primary text-xl md:text-2xl mb-3 md:mb-4 whitespace-nowrap" >{getStr(disc2?.title).replace(/\n/g, ' ')}</h3>
            <p className="text-text-secondary text-base md:text-lg mb-6 md:mb-8" >
              “{getStr(disc2?.tagline)}”
            </p>
            <ul className={`flex flex-col gap-2 md:gap-3 ${isRTL ? 'border-r md:border-r-0 md:border-l pr-4 md:pr-0 md:pl-5' : 'border-l md:border-l-0 md:border-r pl-4 md:pl-0 md:pr-5'} border-brand/10 dark:border-white/10`}>
              {getArr(disc2?.tags).map((cap: string) => (
                <li key={cap} className="text-text-secondary text-sm md:text-base tracking-wide hover:text-brand transition-colors cursor-default" >
                  {cap}
                </li>
              ))}
            </ul>
          </div>

          {/* State 3: Prototyping */}
          <div id="ui-03" className={`absolute bottom-10 md:bottom-20 ${isRTL ? 'right-6 md:right-10 pl-12 md:pl-0' : 'left-6 md:left-10 pr-12 md:pr-0'} max-w-3xl opacity-0 pointer-events-auto`}>
            <div className="md:w-1/2">
              <h2 className="text-text-secondary text-4xl md:text-5xl font-bold mb-1 md:mb-2" >03</h2>
              <h3 className="text-text-primary text-xl md:text-2xl mb-3 md:mb-4 whitespace-nowrap" >{getStr(disc3?.title).replace(/\n/g, ' ')}</h3>
              <p className="text-text-secondary text-base md:text-lg mb-6 md:mb-8" >
                “{getStr(disc3?.tagline)}”
              </p>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 border-t border-brand/10 dark:border-white/10 pt-4 md:pt-6">
              {getArr(disc3?.tags).map((cap: string) => (
                <li key={cap} className="text-text-secondary text-sm md:text-base tracking-wide hover:text-brand transition-colors cursor-default" >
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