/**
 * Tools.tsx — "My Tools & Stack" section
 * Faithful React/TypeScript port of tools-stack-3d.html
 * Uses raw Three.js (no R3F) + GSAP, just like the reference HTML.
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';
import { DecorativeShape } from '../shared/DecorativeShape';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { CmsToolItem } from '../../types/cms';

interface ToolsProps { isDark?: boolean; }

import { DustCanvas } from './tools/DustCanvas';
import { ActiveToolCard } from './tools/ActiveToolCard';
import { FACE_NORMALS_NORMALIZED, rotForFace } from './tools/constants';

/* ─── Face sprite builder ───────────────────────────────────────────────────── */
function makeFaceSprite(tool: CmsToolItem, lang: 'en' | 'ar', isDarkTheme: boolean): THREE.Sprite {
  const SZ = 256;
  const cv = document.createElement('canvas');
  cv.width = SZ; cv.height = SZ;
  const cx = cv.getContext('2d')!;
  const [rv, gv, bv] = tool.rgb;
  const rr = Math.round(rv * 255), gg = Math.round(gv * 255), bb = Math.round(bv * 255);

  const grd = cx.createRadialGradient(128,128,40,128,128,120);
  grd.addColorStop(0, `rgba(${rr},${gg},${bb},.22)`);
  grd.addColorStop(0.6, `rgba(${rr},${gg},${bb},.10)`);
  grd.addColorStop(1, `rgba(${rr},${gg},${bb},0)`);
  cx.beginPath(); cx.arc(128,128,120,0,Math.PI*2);
  cx.fillStyle = grd; cx.fill();

  cx.beginPath(); cx.arc(128,128,88,0,Math.PI*2);
  cx.fillStyle = `rgba(${rr},${gg},${bb},.13)`; cx.fill();

  cx.beginPath(); cx.arc(128,128,88,0,Math.PI*2);
  cx.shadowColor = tool.glow; cx.shadowBlur = 14;
  cx.strokeStyle = `rgba(${rr},${gg},${bb},.85)`;
  cx.lineWidth = 3.5; cx.stroke();
  cx.shadowBlur = 0;

  // Use Space Grotesk to match site font
  cx.font = '700 68px "Space Grotesk",Arial,sans-serif';
  cx.textAlign = 'center'; cx.textBaseline = 'middle';
  
  if (isDarkTheme) {
    cx.shadowColor = tool.glow; 
    cx.shadowBlur = 20;
    cx.fillStyle = tool.glow;
  } else {
    // Darker variant for light mode
    const darkR = Math.floor(rr * 0.5);
    const darkG = Math.floor(gg * 0.5);
    const darkB = Math.floor(bb * 0.5);
    cx.shadowColor = 'rgba(255,255,255,0.8)'; 
    cx.shadowBlur = 4;
    cx.fillStyle = `rgb(${darkR},${darkG},${darkB})`;
  }
  cx.fillText(tool.abbr, 128, 108);
  cx.shadowBlur = 0;

  cx.font = '600 21px "Space Grotesk",Arial,sans-serif';
  cx.fillStyle = isDarkTheme ? 'rgba(240,244,255,.94)' : 'rgba(15,23,42,.94)';
  cx.shadowColor = isDarkTheme ? 'rgba(0,0,0,.8)' : 'rgba(255,255,255,.8)'; 
  cx.shadowBlur = 5;
  cx.fillText(tool.name, 128, 162);
  cx.shadowBlur = 0;

  cx.font = '500 14px "Inter",Arial,sans-serif';
  cx.fillStyle = isDarkTheme ? 'rgba(136,146,170,.8)' : 'rgba(15,23,42,.85)';
  cx.shadowColor = isDarkTheme ? 'transparent' : 'rgba(255,255,255,0.8)';
  cx.shadowBlur = isDarkTheme ? 0 : 3;
  cx.fillText(tool.cat[lang] || tool.cat.en, 128, 188);
  cx.shadowBlur = 0;

  const sp = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(cv),
    transparent: true, depthWrite: false, depthTest: false,
  }));
  sp.scale.set(0.88, 0.88, 1);
  return sp;
}



/* ─── Main component ─────────────────────────────────────────────────────────── */
export function Tools({ isDark = false }: ToolsProps) {
  const { lang } = useLanguage();
  const { cmsData } = useCms();
  const TOOLS = cmsData.tools.toolsList || [];
  const dustRef      = useRef<HTMLCanvasElement>(null);
  const glRef        = useRef<HTMLCanvasElement>(null);
  const wrapRef      = useRef<HTMLDivElement>(null);
  const isInView     = useInView(wrapRef, { margin: "200px" });
  const isInViewRef  = useRef(isInView);
  useEffect(() => { isInViewRef.current = isInView; }, [isInView]);

  const [activeIdx, setActiveIdx]     = useState(0);
  const [cardVisible, setCardVisible] = useState(false);
  const currentIdxRef = useRef(0);

  /* refs to live Three.js objects so we can recolor on isDark change */
  const shellMatRef = useRef<THREE.MeshPhongMaterial | null>(null);
  const wireMatRef  = useRef<THREE.MeshBasicMaterial  | null>(null);
  const ambLightRef = useRef<THREE.AmbientLight       | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight   | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight   | null>(null);
  const fillLightRef= useRef<THREE.PointLight         | null>(null);
  
  const panelsRef = useRef<{ sprite: THREE.Sprite; grp: THREE.Group; idx: number }[]>([]);
  const rebuildSpritesRef = useRef<((forceIsDark?: boolean) => void) | null>(null);


  /* ─── Three.js scene ───────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = glRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.z = 4.8;

    function onResize() {
      const W = canvas!.clientWidth, H = canvas!.clientHeight;
      if (W === 0 || H === 0) return;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    }
    onResize();
    window.addEventListener('resize', onResize);

    /* ── Lights — stored in refs so isDark effect can update them ── */
    const amb = new THREE.AmbientLight(0x9988ff, 0.55);
    scene.add(amb);
    ambLightRef.current = amb;

    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(3, 4, 5); scene.add(key);
    keyLightRef.current = key;

    const rim = new THREE.DirectionalLight(0x38bdf8, 0.75);
    rim.position.set(-4, -1, -3); scene.add(rim);
    rimLightRef.current = rim;

    const fill = new THREE.PointLight(0xa855f7, 0.6, 14);
    fill.position.set(-2, 3, 2); scene.add(fill);
    fillLightRef.current = fill;

    const ROOT = new THREE.Group();
    scene.add(ROOT);

    /* ── Shell — stored in ref ── */
    const shellMat = new THREE.MeshPhongMaterial({
      color: 0x0b0822, emissive: 0x120940, specular: 0x9966ff,
      shininess: 80, transparent: true, opacity: 0.65, side: THREE.DoubleSide,
    });
    shellMatRef.current = shellMat;
    ROOT.add(new THREE.Mesh(new THREE.DodecahedronGeometry(1.55, 0), shellMat));

    /* ── Wireframe — stored in ref ── */
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x5533bb, wireframe: true, transparent: true, opacity: 0.11,
    });
    wireMatRef.current = wireMat;
    ROOT.add(new THREE.Mesh(new THREE.DodecahedronGeometry(1.565, 0), wireMat));

    const PR = 1.55 * 0.794;
    const PANELS = panelsRef.current;
    PANELS.length = 0; // reset on re-init

    for (let fi = 0; fi < 12; fi++) {
      const [nx, ny, nz] = FACE_NORMALS_NORMALIZED[fi];
      const grp = new THREE.Group();
      ROOT.add(grp);
      grp.position.set(nx * PR, ny * PR, nz * PR);
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(nx, ny, nz),
      );
      grp.quaternion.copy(quat);
      const sp = makeFaceSprite(TOOLS[fi], lang, isDark);
      sp.position.set(0, 0, 0.018);
      grp.add(sp);
      PANELS.push({ sprite: sp, grp, idx: fi });
    }

    const rebuildSprites = (forceIsDark?: boolean) => {
      const currentDark = forceIsDark !== undefined ? forceIsDark : isDark;
      for (let fi = 0; fi < 12; fi++) {
        if (!PANELS[fi]) continue;
        const old = PANELS[fi].sprite;
        old.material.map?.dispose();
        old.material.dispose();
        PANELS[fi].grp.remove(old);
        const sp = makeFaceSprite(TOOLS[fi], lang, currentDark);
        sp.position.set(0, 0, 0.018);
        PANELS[fi].grp.add(sp);
        PANELS[fi].sprite = sp;
      }
    };
    rebuildSpritesRef.current = rebuildSprites;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => rebuildSprites());
    }

    let animRX = 0, animRY = 0;
    const r0 = rotForFace(0);
    animRX = r0.rx; animRY = r0.ry;
    ROOT.rotation.x = animRX;
    ROOT.rotation.y = animRY;

    function goTo(i: number) {
      i = ((i % 12) + 12) % 12;
      currentIdxRef.current = i;
      setActiveIdx(i);
      setCardVisible(true);

      const tgt = rotForFace(i);

      // Normalize to shortest angular path so GSAP doesn't spin the long way round
      let trx = tgt.rx, try_ = tgt.ry;
      while (trx - animRX >  Math.PI) trx -= Math.PI * 2;
      while (trx - animRX < -Math.PI) trx += Math.PI * 2;
      while (try_ - animRY >  Math.PI) try_ -= Math.PI * 2;
      while (try_ - animRY < -Math.PI) try_ += Math.PI * 2;

      const proxy = { rx: animRX, ry: animRY };
      gsap.killTweensOf(proxy);
      gsap.to(proxy, {
        rx: trx, ry: try_,
        duration: 1.2, ease: 'power3.inOut',
        onUpdate() { animRX = proxy.rx; animRY = proxy.ry; },
      });
    }

    (canvas as any).__goTo = goTo;

    let autoTimer: ReturnType<typeof setTimeout> | null = null;
    function resetAuto() {
      if (autoTimer) clearTimeout(autoTimer);
      function tick() {
        goTo(currentIdxRef.current + 1);
        autoTimer = setTimeout(tick, 3800);
      }
      autoTimer = setTimeout(tick, 4000);
    }
    (canvas as any).__resetAuto = resetAuto;

    const clock = new THREE.Clock();
    let elapsed = 0;
    let rafId = 0;

    function loop() {
      rafId = requestAnimationFrame(loop);
      
      const delta = clock.getDelta();
      if (!isInViewRef.current) return; // Pause calculations and rendering when off-screen

      elapsed += delta;
      const t = elapsed;

      // Gentle vertical float only — no sway that fights the target rotation
      ROOT.position.y = Math.sin(t * 0.55) * 0.022;
      ROOT.rotation.x = animRX;
      ROOT.rotation.y = animRY;

      const frontFace = currentIdxRef.current;
      for (let ri = 0; ri < PANELS.length; ri++) {
        const isActive = ri === frontFace;
        const [nx, ny, nz] = FACE_NORMALS_NORMALIZED[ri];
        let wx = nx, wy = ny, wz = nz;
        const cosY = Math.cos(ROOT.rotation.y), sinY = Math.sin(ROOT.rotation.y);
        const tx = wx * cosY + wz * sinY, tz0 = -wx * sinY + wz * cosY;
        wx = tx; wz = tz0;
        const cosX = Math.cos(ROOT.rotation.x), sinX = Math.sin(ROOT.rotation.x);
        const ty = wy * cosX - wz * sinX, tz1 = wy * sinX + wz * cosX;
        wy = ty; wz = tz1;

        const targetScale = isActive ? 1.08 : 1.0;
        const curS = PANELS[ri].grp.scale.x;
        PANELS[ri].grp.scale.setScalar(curS + (targetScale - curS) * 0.09);

        let targetO: number;
        if (isActive) {
          targetO = 1.0;
        } else if (wz > 0.18) {
          targetO = wz * 0.38;
        } else {
          targetO = 0.0;
        }
        if (panelsRef.current[ri]) {
          const sp = panelsRef.current[ri].sprite;
          sp.material.opacity += (targetO - sp.material.opacity) * 0.10;
        }
      }

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }

    goTo(0);
    resetAuto();
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      if (autoTimer) clearTimeout(autoTimer);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Recolor 3-D scene whenever isDark flips ────────────────────────────── */
  useEffect(() => {
    const shell = shellMatRef.current;
    const wire  = wireMatRef.current;
    const amb   = ambLightRef.current;
    const key   = keyLightRef.current;
    const rim   = rimLightRef.current;
    const fill  = fillLightRef.current;
    if (!shell || !wire || !amb || !key || !rim || !fill) return;

    if (isDark) {
      /* ── dark palette (original) ── */
      shell.color.set(0x15113d);
      shell.emissive.set(0x241573);
      shell.specular.set(0x9966ff);
      shell.shininess = 80;
      shell.opacity   = 0.65;

      wire.color.set(0x5533bb);
      wire.opacity = 0.11;

      amb.color.set(0x9988ff);  amb.intensity  = 0.55;
      key.color.set(0xffffff);  key.intensity  = 1.2;
      rim.color.set(0x38bdf8);  rim.intensity  = 0.75;
      fill.color.set(0xa855f7); fill.intensity = 0.6;
    } else {
      /* ── light palette — frosted indigo gem ── */
      shell.color.set(0xe0d8fa);    // softer, lighter lavender body
      shell.emissive.set(0x6357e6); // lighter indigo emissive
      shell.specular.set(0xffffff); // pure white highlights = clear 3D facets
      shell.shininess = 140;        // higher shininess = sharper, glassier specular
      shell.opacity   = 0.78;       // slightly more opaque so it reads on light bg

      wire.color.set(0x6366f1);     // site accent indigo
      wire.opacity = 0.28;          // bolder wireframe so edges pop on light bg

      amb.color.set(0xa5b4fc);  amb.intensity  = 0.6;  // cool violet fill
      key.color.set(0xffffff);  key.intensity  = 1.8;  // strong white key = clear shading
      rim.color.set(0x6366f1);  rim.intensity  = 1.1;  // indigo rim = depth on light side
      fill.color.set(0x8b5cf6); fill.intensity = 0.5;  // violet fill
    }

    shell.needsUpdate = true;
    wire.needsUpdate  = true;
    
    // Also rebuild text sprites to match theme contrast
    if (rebuildSpritesRef.current) {
      rebuildSpritesRef.current(isDark);
    }
  }, [isDark]);

  /* ─── Nav handlers ───────────────────────────────────────────────────────── */
  const goTo = useCallback((i: number) => {
    const c = glRef.current as any;
    if (c?.__goTo) c.__goTo(i);
    if (c?.__resetAuto) c.__resetAuto();
  }, []);

  const prev = useCallback(() => goTo(currentIdxRef.current - 1), [goTo]);
  const next = useCallback(() => goTo(currentIdxRef.current + 1), [goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prev();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  const tool = TOOLS[activeIdx] || { name: 'Figma', abbr: 'Fi', cat: { en: 'Design', ar: 'تصميم' }, desc: { en: '', ar: '' }, tags: { en: [], ar: [] }, rgb: [0.62,0.28,1], glow: '#a855f7', proficiency: 98 };
  const pct  = tool.proficiency ?? 50;

  /* ─── Theme tokens (matching Skills.tsx and rest of site) ────────────────── */
  const { fontHeading, fontBody, isRTL } = useLanguage();

  
  // Static tool data - no CMS
  const toolNames = ['Figma', 'Framer', 'Midjourney', 'ChatGPT', 'Advanced', 'Lottie', 'Webflow', 'Design', 'Prototyping', 'Delivery', 'Systems', 'Workflows'];
  const toolCats = lang === 'en' ? ['Design', 'Prototyping', 'AI Art', 'AI Writing', 'Research', 'Animation', 'Web Dev', 'UI/UX', 'Interaction', 'Handoff', 'Tokens', 'Collaboration'] : ['التصميم', 'النماذج', 'فن الذكاء الاصطناعي', 'كتابة الذكاء الاصطناعي', 'البحث', 'الرسوم المتحركة', 'تطوير الويب', 'واجهة المستخدم', 'التفاعل', 'تسليم', 'الرموز', 'التعاون'];
  
  const toolI18n = { cat: toolCats[activeIdx] || 'Tool', desc: 'Professional tool in my workflow' };
  const stackLabel = lang === 'en' ? 'Stack' : 'المكدس';
  const toolsTitle = cmsData.tools.title[lang] || (lang === 'en' ? 'My Arsenal!' : 'ترسانتي!');
  const toolsDesc = cmsData.tools.desc[lang] || (lang === 'en' ? 'Twelve tools. One cohesive workflow.' : 'اثنا عشر أداة. سير عمل متماسك واحد.');
  const clickHint = cmsData.tools.clickHint[lang] || (lang === 'en' ? 'Click any card to explore' : 'انقر على أي بطاقة للاستكشاف');
  const proficiencyLabel = cmsData.tools.proficiency[lang] || (lang === 'en' ? 'Proficiency' : 'الكفاءة');
  const bg        = isDark ? '#080810'                    : '#f5f5fa';
  const headingC  = isDark ? '#f0f0ff'                    : '#0f0f1e';
  const bodyC     = isDark ? 'rgba(255,255,255,0.50)'     : 'rgba(0,0,0,0.50)';
  const mutedC    = isDark ? 'rgba(255,255,255,0.38)'     : 'rgba(0,0,0,0.38)';
  const eyebrowC  = isDark ? '#a5b4fc'                    : '#6366f1';
  const eyebrowBg = isDark ? 'rgba(99,102,241,0.15)'      : 'rgba(99,102,241,0.10)';
  const eyebrowBd = isDark ? 'rgba(99,102,241,0.30)'      : 'rgba(99,102,241,0.25)';
  const cardBg    = isDark ? 'rgba(15,15,30,0.95)'        : 'rgba(255,255,255,0.95)';
  const cardBd    = isDark ? 'rgba(99,102,241,0.25)'      : 'rgba(99,102,241,0.18)';
  const cardShadow= isDark ? '0 8px 30px rgba(0,0,0,0.5)': '0 8px 24px rgba(0,0,0,0.12)';
  const tagBg     = isDark ? 'rgba(99,102,241,0.10)'      : 'rgba(99,102,241,0.08)';
  const tagBd     = isDark ? 'rgba(99,102,241,0.22)'      : 'rgba(99,102,241,0.18)';
  const tagC      = isDark ? '#a5b4fc'                    : '#6366f1';
  const navBd     = isDark ? 'rgba(99,102,241,0.25)'      : 'rgba(99,102,241,0.20)';
  const navBg     = isDark ? 'rgba(99,102,241,0.08)'      : 'rgba(99,102,241,0.06)';
  const navHovBd  = isDark ? '#6366f1'                    : '#6366f1';
  const navHovBg  = isDark ? 'rgba(99,102,241,0.25)'      : 'rgba(99,102,241,0.15)';
  const ringC     = isDark ? 'rgba(255,255,255,0.55)'     : 'rgba(0,0,0,0.25)';
  const hintC     = isDark ? 'rgba(255,255,255,0.30)'     : 'rgba(0,0,0,0.28)';
  const dotInact  = isDark ? 'rgba(255,255,255,0.20)'     : 'rgba(0,0,0,0.15)';
  const barTrack  = isDark ? 'rgba(99,102,241,0.12)'      : 'rgba(99,102,241,0.10)';

  return (
    <section
      id="tools"
      style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 60px', position: 'relative', overflow: 'visible',
        background: bg,
        transition: 'background 0.3s ease',
      }}
    >
      {/* ambient blobs — matching site's indigo/violet/cyan palette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: isDark
          ? [
              'radial-gradient(circle at 80% 50%, rgba(139,92,246,0.10) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 30%, rgba(99,102,241,0.08) 0%, transparent 50%)',
              'radial-gradient(circle at 60% 80%, rgba(6,182,212,0.05) 0%, transparent 45%)',
            ].join(',')
          : [
              'radial-gradient(circle at 80% 50%, rgba(139,92,246,0.07) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 30%, rgba(99,102,241,0.05) 0%, transparent 50%)',
            ].join(','),
      }} />

      {/* dust canvas */}
      <DustCanvas 
        isDark={isDark} 
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]" 
      />


      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.4,0,0.2,1] }}
        style={{ textAlign: 'center', marginBottom: 44, position: 'relative', zIndex: 10 }}
      >

        {/* heading — Space Grotesk to match Skills */}
        <h2
          style={{
            fontWeight: 700,
            fontSize: 'clamp(2.5rem,5vw,4rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            color: 'var(--text-primary)',
            margin: '0 0 16px',
          }}
        >
          <span>{toolsTitle}</span>
        </h2>

        <p className="text-lg" style={{
          fontWeight: 400,
          color: bodyC,
          lineHeight: 1.75,
          maxWidth: 380,
          margin: '0 auto',
        }}>
          {toolsDesc}
        </p>

        {/* decorative bars matching Skills section */}
        
      </motion.div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 w-full max-w-[1200px]">
        {/* ── Canvas wrap ── */}
        <div
          ref={wrapRef}
          style={{
            position: 'relative',
            width: 'min(580px,88vw)', height: 'min(580px,88vw)',
            margin: '0', overflow: 'visible', zIndex: 5,
            flexShrink: 0
          }}
        >
          {/* Three.js GL canvas */}
          <canvas
            ref={glRef}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: '130%', height: '130%',
              display: 'block', cursor: 'default',
            }}
          />

          {/* Active ring overlay */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 160, height: 160, borderRadius: '50%',
            pointerEvents: 'none', zIndex: 10,
            border: cardVisible
              ? isDark
                ? `2px solid ${ringC}`
                : `2.5px solid ${tool.glow}`
              : '2px solid rgba(0,0,0,0)',
            boxShadow: cardVisible
              ? isDark
                ? `0 0 22px 4px ${tool.glow}88, inset 0 0 22px 2px ${tool.glow}44`
                : `0 0 28px 6px ${tool.glow}99, inset 0 0 18px 3px ${tool.glow}55, 0 0 0 4px ${tool.glow}22`
              : 'none',
            transition: 'border-color .4s ease, box-shadow .4s ease',
          }} />
        </div>

        <ActiveToolCard
          tool={tool as any}
          cardVisible={cardVisible}
          lang={lang}
          isRTL={isRTL}
          isDark={isDark}
          proficiencyLabel={proficiencyLabel}
          clickHint={clickHint}
          tools={TOOLS as any}
          activeIdx={activeIdx}
          goTo={goTo}
          prev={prev}
          next={next}
          surfaceBg={cardBg}
          cardBd={cardBd}
          headingC={headingC}
          bodyC={bodyC}
          mutedC={mutedC}
          barTrack={barTrack}
          tagBg={tagBg}
          tagBd={tagBd}
          tagC={tagC}
          navBd={navBd}
          navBg={navBg}
          navHovBd={navHovBd}
          navHovBg={navHovBg}
          dotInact={dotInact}
          hintC={hintC}
        />
      </div>
    </section>
  );
}