/**
 * Tools.tsx — "My Tools & Stack" section
 * Faithful React/TypeScript port of tools-stack-3d.html
 * Uses raw Three.js (no R3F) + GSAP, just like the reference HTML.
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion, useInView } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';
import type { CmsToolItem } from '../../types/cms';
import { readToken, parseColor, tokenRgba } from '../../lib/theme-tokens';
import { getScenePalette } from '../../lib/scene-palette';

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
  const brand = readToken('--brand');
  const [rr, gg, bb] = parseColor(brand);
  const brandA = (a: number) => `rgba(${rr},${gg},${bb},${a})`;
  const halo = readToken('--canvas-halo');

  const grd = cx.createRadialGradient(128,128,40,128,128,120);
  grd.addColorStop(0, brandA(0.22));
  grd.addColorStop(0.6, brandA(0.10));
  grd.addColorStop(1, brandA(0));
  cx.beginPath(); cx.arc(128,128,120,0,Math.PI*2);
  cx.fillStyle = grd; cx.fill();

  cx.beginPath(); cx.arc(128,128,88,0,Math.PI*2);
  cx.fillStyle = brandA(0.13); cx.fill();

  cx.beginPath(); cx.arc(128,128,88,0,Math.PI*2);
  cx.shadowColor = brand; cx.shadowBlur = 14;
  cx.strokeStyle = brandA(0.85);
  cx.lineWidth = 3.5; cx.stroke();
  cx.shadowBlur = 0;

  // Use Space Grotesk to match site font
  cx.font = '700 68px "Space Grotesk",Arial,sans-serif';
  cx.textAlign = 'center'; cx.textBaseline = 'middle';

  if (isDarkTheme) {
    cx.shadowColor = brand;
    cx.shadowBlur = 20;
    cx.fillStyle = brand;
  } else {
    // Darker brand variant reads better on the light background
    cx.shadowColor = halo;
    cx.shadowBlur = 4;
    cx.fillStyle = `rgb(${Math.floor(rr * 0.5)},${Math.floor(gg * 0.5)},${Math.floor(bb * 0.5)})`;
  }
  cx.fillText(tool.abbr, 128, 108);
  cx.shadowBlur = 0;

  cx.font = '600 21px "Space Grotesk",Arial,sans-serif';
  cx.fillStyle = readToken('--text-primary');
  cx.shadowColor = halo;
  cx.shadowBlur = 5;
  cx.fillText(tool.name, 128, 162);
  cx.shadowBlur = 0;

  cx.font = '500 14px "Inter",Arial,sans-serif';
  cx.fillStyle = tokenRgba('--text-secondary');
  cx.shadowColor = halo;
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

/* Material/light strengths per theme — light mode reads as a frosted gem. */
const SCENE_LOOK = {
  dark:  { shininess: 80,  shellOpacity: 0.65, wireOpacity: 0.11, amb: 0.55, key: 1.2, rim: 0.75, fill: 0.6 },
  light: { shininess: 140, shellOpacity: 0.78, wireOpacity: 0.28, amb: 0.6,  key: 1.8, rim: 1.1,  fill: 0.5 },
};

/* ─── Main component ─────────────────────────────────────────────────────────── */
export function Tools({ isDark = false }: ToolsProps) {
  const { lang, isRTL } = useLanguage();
  const { cmsData } = useCms();
  const TOOLS = cmsData.tools.toolsList || [];
  const glRef        = useRef<HTMLCanvasElement>(null);
  const wrapRef      = useRef<HTMLDivElement>(null);
  const isInView     = useInView(wrapRef, { margin: "200px" });
  const isInViewRef  = useRef(isInView);
  useEffect(() => { isInViewRef.current = isInView; }, [isInView]);
  const isDarkRef = useRef(isDark);
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

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
  const rebuildSpritesRef = useRef<(() => void) | null>(null);


  /* ─── Three.js scene ───────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = glRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearAlpha(0);

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

    /* ── Lights & materials — colors are applied by the theme effect below ── */
    const amb = new THREE.AmbientLight();
    scene.add(amb);
    ambLightRef.current = amb;

    const key = new THREE.DirectionalLight();
    key.position.set(3, 4, 5); scene.add(key);
    keyLightRef.current = key;

    const rim = new THREE.DirectionalLight();
    rim.position.set(-4, -1, -3); scene.add(rim);
    rimLightRef.current = rim;

    const fill = new THREE.PointLight(undefined, 1, 14);
    fill.position.set(-2, 3, 2); scene.add(fill);
    fillLightRef.current = fill;

    const ROOT = new THREE.Group();
    scene.add(ROOT);

    const shellMat = new THREE.MeshPhongMaterial({ transparent: true, side: THREE.DoubleSide });
    shellMatRef.current = shellMat;
    ROOT.add(new THREE.Mesh(new THREE.DodecahedronGeometry(1.55, 0), shellMat));

    const wireMat = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true });
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
      grp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(nx, ny, nz));
      const sp = makeFaceSprite(TOOLS[fi], lang, isDarkRef.current);
      sp.position.set(0, 0, 0.018);
      grp.add(sp);
      PANELS.push({ sprite: sp, grp, idx: fi });
    }

    const rebuildSprites = () => {
      for (let fi = 0; fi < 12; fi++) {
        if (!PANELS[fi]) continue;
        const old = PANELS[fi].sprite;
        old.material.map?.dispose();
        old.material.dispose();
        PANELS[fi].grp.remove(old);
        const sp = makeFaceSprite(TOOLS[fi], lang, isDarkRef.current);
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

  /* ─── Color the 3-D scene from the theme tokens (on mount and on toggle) ── */
  useEffect(() => {
    const shell = shellMatRef.current;
    const wire  = wireMatRef.current;
    const amb   = ambLightRef.current;
    const key   = keyLightRef.current;
    const rim   = rimLightRef.current;
    const fill  = fillLightRef.current;
    if (!shell || !wire || !amb || !key || !rim || !fill) return;

    const p = getScenePalette(isDark);
    const look = isDark ? SCENE_LOOK.dark : SCENE_LOOK.light;

    shell.color.set(p.shell);
    shell.emissive.set(p.emissive);
    shell.specular.set(p.specular);
    shell.shininess = look.shininess;
    shell.opacity   = look.shellOpacity;

    wire.color.set(p.wire);
    wire.opacity = look.wireOpacity;

    amb.color.set(p.ambient); amb.intensity  = look.amb;
    key.color.set(p.key);     key.intensity  = look.key;
    rim.color.set(p.rim);     rim.intensity  = look.rim;
    fill.color.set(p.fill);   fill.intensity = look.fill;

    shell.needsUpdate = true;
    wire.needsUpdate  = true;

    // Rebuild text sprites to match theme contrast
    rebuildSpritesRef.current?.();
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

  const tool = TOOLS[activeIdx] ?? null;

  const toolsTitle = cmsData.tools.title[lang] || (lang === 'en' ? 'My Arsenal!' : 'ترسانتي!');
  const toolsDesc = cmsData.tools.desc[lang] || (lang === 'en' ? 'Twelve tools. One cohesive workflow.' : 'اثنا عشر أداة. سير عمل متماسك واحد.');
  const clickHint = cmsData.tools.clickHint[lang] || (lang === 'en' ? 'Click any card to explore' : 'انقر على أي بطاقة للاستكشاف');
  const proficiencyLabel = cmsData.tools.proficiency[lang] || (lang === 'en' ? 'Proficiency' : 'الكفاءة');

  return (
    <section
      id="tools"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-visible px-6 pt-20 pb-[60px] bg-surface transition-colors duration-300"
    >
      {/* ambient brand glow */}
      <div className="absolute inset-0 pointer-events-none tools-ambient" />

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
        className="relative z-10 text-center mb-11"
      >
        <h2 className="font-bold text-[clamp(2.5rem,5vw,4rem)] tracking-[-0.02em] leading-[1.15] text-text-primary m-0 mb-4">
          <span>{toolsTitle}</span>
        </h2>

        <p className="text-lg font-normal text-text-muted leading-[1.75] max-w-[380px] mx-auto">
          {toolsDesc}
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 w-full max-w-[1200px]">
        {/* ── Canvas wrap ── */}
        <div ref={wrapRef} className="relative shrink-0 overflow-visible z-[5] size-[min(580px,88vw)]">
          {/* Three.js GL canvas */}
          <canvas
            ref={glRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] block cursor-default"
          />

          {/* Active ring overlay */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-40 rounded-full pointer-events-none z-10 tool-ring ${cardVisible ? 'tool-ring-active' : ''}`}
          />
        </div>

        <ActiveToolCard
          tool={tool}
          cardVisible={cardVisible}
          lang={lang}
          isRTL={isRTL}
          proficiencyLabel={proficiencyLabel}
          clickHint={clickHint}
          tools={TOOLS}
          activeIdx={activeIdx}
          goTo={goTo}
          prev={prev}
          next={next}
        />
      </div>
    </section>
  );
}
