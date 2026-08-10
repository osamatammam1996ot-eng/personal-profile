/**
 * Tools.tsx — "My Tools & Stack" section
 * Faithful React/TypeScript port of tools-stack-3d.html
 * Uses raw Three.js (no R3F) + GSAP, just like the reference HTML.
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';
import { DecorativeShape } from '../shared/DecorativeShape';
import type { CmsToolItem } from '../../types/cms';

interface ToolsProps { isDark?: boolean; }

/* ─── Tool data ─────────────────────────────────────────────────────────────── */
const TOOLS = [
  { name: 'Figma',         abbr: 'Fi', cat: 'Design & Prototyping', desc: 'Primary environment for UI systems, components and interactive prototypes.',  tags: ['UI Design','Components','Proto'],  rgb: [0.62,0.28,1.00] as [number,number,number], glow: '#a855f7' },
  { name: 'Framer',        abbr: 'Fr', cat: 'Motion & Web',          desc: 'Turning static designs into production-ready animated web experiences.',       tags: ['Animation','CMS','Web'],          rgb: [0.05,0.60,1.00] as [number,number,number], glow: '#0ea5e9' },
  { name: 'After Effects', abbr: 'Ae', cat: 'Motion Graphics',       desc: 'Micro-interactions, loading states and brand animation sequences.',            tags: ['Motion','Lottie','Brand'],        rgb: [0.55,0.22,0.95] as [number,number,number], glow: '#818cf8' },
  { name: 'Midjourney',    abbr: 'Mj', cat: 'AI Imagery',            desc: 'Ideation and moodboarding with generative visuals for design direction.',     tags: ['AI Art','Moodboard','Concept'],   rgb: [0.10,0.75,0.65] as [number,number,number], glow: '#14b8a6' },
  { name: 'ChatGPT',       abbr: 'Gp', cat: 'AI Collaboration',      desc: 'Research, copywriting and rapid UX strategy ideation.',                       tags: ['Research','Copy','Strategy'],     rgb: [0.25,0.80,0.42] as [number,number,number], glow: '#22c55e' },
  { name: 'Notion',        abbr: 'No', cat: 'Docs & Planning',       desc: 'Design documentation, project wikis and client-facing deliverable hubs.',    tags: ['Docs','Wiki','Delivery'],         rgb: [0.75,0.75,0.90] as [number,number,number], glow: '#cbd5e1' },
  { name: 'Jira',          abbr: 'Ji', cat: 'Project Management',    desc: 'Sprint planning and cross-functional collaboration with engineering.',        tags: ['Agile','Sprints','Backlog'],      rgb: [0.10,0.42,1.00] as [number,number,number], glow: '#3b82f6' },
  { name: 'Photoshop',     abbr: 'Ps', cat: 'Image Editing',         desc: 'Pixel-perfect compositing, retouching and visual asset production.',         tags: ['Compositing','Assets','Photo'],   rgb: [0.18,0.55,1.00] as [number,number,number], glow: '#60a5fa' },
  { name: 'Illustrator',   abbr: 'Ai', cat: 'Vector & Icons',        desc: 'Icon systems, custom illustrations and scalable brand marks.',               tags: ['Icons','Vectors','Brand'],        rgb: [1.00,0.55,0.10] as [number,number,number], glow: '#f97316' },
  { name: 'Mobbin',        abbr: 'Mb', cat: 'User Research',         desc: 'Discover real patterns in how users navigate — before a single line ships.',  tags: ['Testing','Usability','UX'],       rgb: [1.00,0.30,0.50] as [number,number,number], glow: '#f43f5e' },
  { name: 'Lottie',        abbr: 'Lo', cat: 'Animation Export',      desc: 'Lightweight JSON animations for seamless developer handoff.',                tags: ['Export','JSON','Handoff'],        rgb: [1.00,0.84,0.10] as [number,number,number], glow: '#eab308' },
  { name: 'Webflow',       abbr: 'Wf', cat: 'No-Code Web',           desc: 'Visual web building with production-ready HTML & CSS output.',                tags: ['Web','CMS','CSS'],                rgb: [0.35,0.65,1.00] as [number,number,number], glow: '#38bdf8' },
];

const SKILL_LEVELS: Record<string, number> = {
  'Figma': 98, 'Framer': 85, 'After Effects': 80,
  'Midjourney': 78, 'ChatGPT': 88, 'Notion': 90,
  'Jira': 82, 'Photoshop': 85, 'Illustrator': 80,
  'Mobbin': 75, 'Lottie': 78, 'Webflow': 75,
};

/* ─── Face normals — same as reference HTML ──────────────────────────────── */
const PHI = (1 + Math.sqrt(5)) / 2;
const FACE_NORMALS_RAW: [number,number,number][] = [
  // Group B: (±1, 0, ±φ) — face centres, replaces wrong vertex coords (±1,±1,±1)
  [ 1, 0,  PHI], [-1, 0,  PHI], [ 1, 0, -PHI], [-1, 0, -PHI],
  // Group C: (±φ, ±1, 0) — face centres, replaces wrong vertex coords (±1,±1,±1)
  [ PHI, 1, 0], [-PHI, 1, 0], [ PHI, -1, 0], [-PHI, -1, 0],
  // Group A: (0, ±φ, ±1) — already correct, untouched
  [ 0, PHI, 1], [ 0,-PHI, 1], [ 0, PHI,-1], [ 0,-PHI,-1],
];
function normalize3(v: [number,number,number]): [number,number,number] {
  const l = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
  return [v[0]/l, v[1]/l, v[2]/l];
}
const FACE_NORMALS_NORMALIZED = FACE_NORMALS_RAW.map(normalize3);
// REMAP removed — face fi holds TOOLS[fi], goTo(i) brings face i to front directly

/* ─── Dust particles (2-D canvas) ────────────────────────────────────────────── */
function useDustCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>, isDark: boolean) {
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    if (!cx) return;

    let W = 0, H = 0, rafId = 0;
    const pts: { x:number; y:number; r:number; vx:number; vy:number; a:number }[] = [];

    function resize() {
      W = cv!.width  = cv!.offsetWidth;
      H = cv!.height = cv!.offsetHeight;
    }
    function make() {
      pts.length = 0;
      for (let i = 0; i < 60; i++) {
        pts.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.3 + 0.25,
          vx: (Math.random() - 0.5) * 0.09,
          vy: (Math.random() - 0.5) * 0.09,
          a: Math.random() * 0.2 + 0.04,
        });
      }
    }
    function draw() {
      cx!.clearRect(0, 0, W, H);
      // Use indigo/violet matching site's accent palette
      const dustColor = isDark ? '99,102,241' : '139,92,246';
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        cx!.beginPath();
        cx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx!.fillStyle = `rgba(${dustColor},${p.a})`;
        cx!.fill();
      }
      rafId = requestAnimationFrame(draw);
    }

    function onResize() { resize(); make(); }
    resize(); make(); draw();
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, isDark]);
}

/* ─── Face sprite builder ───────────────────────────────────────────────────── */
function makeFaceSprite(tool: CmsToolItem, lang: 'en' | 'ar'): THREE.Sprite {
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
  cx.shadowColor = tool.glow; cx.shadowBlur = 20;
  cx.fillStyle = tool.glow;
  cx.fillText(tool.abbr, 128, 108);
  cx.shadowBlur = 0;

  cx.font = '600 21px "Space Grotesk",Arial,sans-serif';
  cx.fillStyle = 'rgba(240,244,255,.94)';
  cx.shadowColor = 'rgba(0,0,0,.8)'; cx.shadowBlur = 5;
  cx.fillText(tool.name, 128, 162);
  cx.shadowBlur = 0;

  cx.font = '400 14px "Inter",Arial,sans-serif';
  cx.fillStyle = 'rgba(136,146,170,.8)';
  cx.fillText(tool.cat[lang] || tool.cat.en, 128, 188);

  const sp = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(cv),
    transparent: true, depthWrite: false, depthTest: false,
  }));
  sp.scale.set(0.88, 0.88, 1);
  return sp;
}

/* ─── rotForFace — correct derivation ───────────────────────────────────────── */
// We need ROOT rotation (rx around X, then ry around Y in Three.js XYZ Euler order)
// such that face normal [nx,ny,nz] ends up pointing at +Z (toward camera).
//
// Three.js XYZ Euler applies as M = Rx * Ry (Ry is applied first, then Rx).
// Solving  Rx(rx) * Ry(ry) * [nx,ny,nz]ᵀ = [0,0,1]ᵀ  gives:
//   Step 1 — Ry maps x to 0:  ry = atan2(-nx, nz)
//   Step 2 — Rx maps y' to 0: rx = atan2(ny, sqrt(nx²+nz²))
function rotForFace(i: number): { rx: number; ry: number } {
  const [nx, ny, nz] = FACE_NORMALS_NORMALIZED[i];
  const ry = Math.atan2(-nx, nz);
  const rx = Math.atan2(ny, Math.sqrt(nx * nx + nz * nz));
  return { rx, ry };
}

/* ─── Main component ─────────────────────────────────────────────────────────── */
export function Tools({ isDark = false }: ToolsProps) {
  const { lang } = useLanguage();
  const { cmsData } = useCms();
  const TOOLS = cmsData.tools.toolsList || [];
  const dustRef      = useRef<HTMLCanvasElement>(null);
  const glRef        = useRef<HTMLCanvasElement>(null);
  const wrapRef      = useRef<HTMLDivElement>(null);
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

  useDustCanvas(dustRef, isDark);

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
    const PANELS: { sprite: THREE.Sprite; grp: THREE.Group; idx: number }[] = [];

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
      const sp = makeFaceSprite(TOOLS[fi], lang);
      sp.position.set(0, 0, 0.018);
      grp.add(sp);
      PANELS.push({ sprite: sp, grp, idx: fi });
    }

    const rebuildSprites = () => {
      for (let fi = 0; fi < 12; fi++) {
        const old = PANELS[fi].sprite;
        old.material.map?.dispose();
        old.material.dispose();
        PANELS[fi].grp.remove(old);
        const sp = makeFaceSprite(TOOLS[fi], lang);
        sp.position.set(0, 0, 0.018);
        PANELS[fi].grp.add(sp);
        PANELS[fi].sprite = sp;
      }
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(rebuildSprites);
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
      elapsed += clock.getDelta();
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
        const sp = PANELS[ri].sprite;
        sp.material.opacity += (targetO - sp.material.opacity) * 0.10;
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
      shell.color.set(0x0b0822);
      shell.emissive.set(0x120940);
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
      shell.color.set(0xc4b8f8);    // soft lavender-indigo body
      shell.emissive.set(0x4338ca); // rich indigo emissive keeps depth warm
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
      <canvas
        ref={dustRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
      />


      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.4,0,0.2,1] }}
        style={{ textAlign: 'center', marginBottom: 44, position: 'relative', zIndex: 10 }}
      >
        {/* eyebrow — matching Skills.tsx style */}
        <span
          style={{
            display: 'inline-block',
            padding: '6px 16px', borderRadius: 100,
            fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.04em',
            color: eyebrowC,
            background: eyebrowBg,
            border: `1px solid ${eyebrowBd}`,
            
            marginBottom: 16,
          }}
        >
          {stackLabel}
        </span>

        {/* heading — Space Grotesk to match Skills */}
        <h2
          style={{
            
            fontWeight: 700,
            fontSize: 'clamp(2rem,4vw,3.25rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            color: headingC,
            margin: '0 0 16px',
          }}
        >
          <span style={{
            color: 'var(--color-brand)',
          }}>{toolsTitle}</span>
        </h2>

        <p style={{
          
          fontWeight: 400,
          fontSize: '1rem',
          color: bodyC,
          lineHeight: 1.75,
          maxWidth: 380,
          margin: '0 auto',
        }}>
          {toolsDesc}
        </p>

        {/* decorative bars matching Skills section */}
        
      </motion.div>

      {/* ── Canvas wrap ── */}
      <div
        ref={wrapRef}
        style={{
          position: 'relative',
          width: 'min(580px,88vw)', height: 'min(580px,88vw)',
          margin: '0 auto', overflow: 'visible', zIndex: 5,
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

        {/* Info card — desktop: right of wrap */}
        <AnimatePresence>
          {cardVisible && (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.34,1.56,0.64,1] }}
              className="hidden lg:block tools-desktop-card"
              style={{
                position: 'absolute',
                right: -8, top: '50%',
                transform: 'translateY(-50%) translateX(115%)',
                width: 224,
                background: cardBg,
                border: `1px solid ${cardBd}`,
                borderRadius: 16,
                padding: 20,
                backdropFilter: 'blur(24px)',
                boxShadow: cardShadow,
                zIndex: 100,
                
              }}
            >
              {/* icon badge */}
              <div style={{
                width: 46, height: 46, borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, fontWeight: 700, marginBottom: 12,
                letterSpacing: '-0.02em',
                
                background: `rgba(${tool.rgb.map(v=>Math.round(v*255)).join(',')},0.18)`,
                border: `1px solid ${tool.glow}66`,
                color: tool.glow,
              }}>
                {tool.abbr}
              </div>

              <div style={{
                fontSize: '0.95rem', fontWeight: 600,
                
                color: headingC, marginBottom: 2,
              }}>
                {tool.name}
              </div>
              <div style={{
                fontSize: '0.65rem', letterSpacing: '0.10em', textTransform: 'uppercase',
                color: mutedC, marginBottom: 10,
              }}>
                {(tool.cat?.[lang] || tool.cat?.en)}
              </div>
              <div style={{
                fontSize: '0.75rem', lineHeight: 1.65,
                color: bodyC, marginBottom: 12,
              }}>
                {(tool.desc?.[lang] || tool.desc?.en)}
              </div>

              {/* skill bar */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{
                    fontSize: '0.65rem', letterSpacing: '0.10em',
                    textTransform: 'uppercase', color: mutedC,
                  }}>
                    {proficiencyLabel}
                  </span>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700,
                    
                    color: 'var(--color-brand)',
                  }}>
                    {pct}%
                  </span>
                </div>
                <div style={{
                  height: 4, borderRadius: 100,
                  background: barTrack,
                  overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: [0.34, 1.10, 0.64, 1], delay: 0.1 }}
                    style={{
                      height: '100%', borderRadius: 100,
                      background: 'var(--color-brand)',
                      boxShadow: `0 0 8px rgba(99,102,241,0.6)`,
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {(tool.tags?.[lang] || tool.tags?.en || []).map(tag => (
                  <span key={tag} style={{
                    fontSize: '0.6rem', fontWeight: 500, padding: '3px 8px', borderRadius: 100,
                    background: tagBg, color: tagC,
                    border: `1px solid ${tagBd}`,
                  }}>{tag}</span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Mobile card — below canvas, taking up exact layout space */}
      <div className="block lg:hidden relative w-full max-w-[340px] mx-auto min-h-[220px] mb-6">
        <AnimatePresence>
          {cardVisible && (
            <motion.div
              key={`mob-${tool.name}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35, ease: [0.34,1.56,0.64,1] }}
              className="tools-mobile-card"
              style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%',
                background: cardBg,
                border: `1px solid ${cardBd}`,
                borderRadius: 16,
                padding: 20, backdropFilter: 'blur(24px)',
                boxShadow: cardShadow,
                zIndex: 100,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em',
                  background: `rgba(${tool.rgb.map(v=>Math.round(v*255)).join(',')},0.18)`,
                  border: `1px solid ${tool.glow}66`, color: tool.glow,
                }}>{tool.abbr}</div>
                <div>
                  <div style={{
                    fontSize: '0.9rem', fontWeight: 600,
                    color: headingC,
                  }}>
                    {tool.name}
                  </div>
                  <div style={{
                    fontSize: '0.6rem', letterSpacing: '0.10em',
                    textTransform: 'uppercase', color: mutedC, marginTop: 2,
                  }}>
                    {(tool.cat?.[lang] || tool.cat?.en)}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', lineHeight: 1.65, color: bodyC, marginBottom: 10 }}>
                {(tool.desc?.[lang] || tool.desc?.en)}
              </div>
              {/* skill bar mobile */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.10em', textTransform: 'uppercase', color: mutedC }}>{proficiencyLabel}</span>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, 
                    background: 'none',
                    color: 'var(--color-brand)'
                  }}>{pct}%</span>
                </div>
                <div style={{ height: 4, borderRadius: 100, background: barTrack, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: [0.34, 1.10, 0.64, 1], delay: 0.1 }}
                    style={{
                      height: '100%', borderRadius: 100,
                      background: 'var(--color-brand)',
                      boxShadow: '0 0 8px rgba(99,102,241,0.6)',
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {(tool.tags?.[lang] || tool.tags?.en || []).map(tag => (
                  <span key={tag} style={{
                    fontSize: '0.6rem', fontWeight: 500, padding: '3px 8px', borderRadius: 100,
                    background: tagBg, color: tagC, border: `1px solid ${tagBd}`,
                  }}>{tag}</span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, marginTop: 30,
        position: 'relative', zIndex: 10,
      }}>
        <NavArrow onClick={prev} label="Previous tool" isDark={isDark} navBd={navBd} navBg={navBg} navHovBd={navHovBd} navHovBg={navHovBg} headingC={headingC}>
          {isRTL ? <>&#8594;</> : <>&#8592;</>}
        </NavArrow>

        {/* dots */}
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {TOOLS.map((t: any, i: number) => (
            <button
              key={t.name}
              onClick={() => goTo(i)}
              aria-label={t.name}
              style={{
                width: i === activeIdx ? 18 : 6,
                height: 6, borderRadius: i === activeIdx ? 3 : '50%',
                border: 'none', cursor: 'pointer', padding: 0,
                background: i === activeIdx ? '#6366f1' : dotInact,
                boxShadow: i === activeIdx ? '0 0 10px rgba(99,102,241,0.7)' : 'none',
                transition: 'all .28s ease',
              }}
            />
          ))}
        </div>

        <NavArrow onClick={next} label="Next tool" isDark={isDark} navBd={navBd} navBg={navBg} navHovBd={navHovBd} navHovBg={navHovBg} headingC={headingC}>
          {isRTL ? <>&#8592;</> : <>&#8594;</>}
        </NavArrow>
      </div>

      <p style={{
        marginTop: 14, fontSize: '0.75rem', color: hintC,
        letterSpacing: '0.04em', textAlign: 'center',
        position: 'relative', zIndex: 10,
        
      }}>
        {clickHint}
      </p>

      <style>{`
        @keyframes tools-pulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:.5;transform:scale(.7)}
        }
      `}</style>
    </section>
  );
}

/* ─── Nav arrow button ──────────────────────────────────────────────────────── */
function NavArrow({
  onClick, label, children, isDark: _isDark,
  navBd, navBg, navHovBd, navHovBg, headingC,
}: {
  onClick: () => void; label: string; children: React.ReactNode;
  isDark: boolean; navBd: string; navBg: string; navHovBd: string; navHovBg: string; headingC: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} aria-label={label}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        border: `1px solid ${hov ? navHovBd : navBd}`,
        background: hov ? navHovBg : navBg,
        color: headingC, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, lineHeight: 1,
        transform: hov ? 'scale(1.08)' : 'scale(1)',
        transition: 'background .2s, border-color .2s, transform .15s',
      }}
    >{children}</button>
  );
}