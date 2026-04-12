import { useRef, useEffect, useCallback } from 'react';

const HEX_SIZE = 24;
const SQRT3 = Math.sqrt(3);

function hexToPixel(q: number, r: number) {
  return {
    x: HEX_SIZE * (1.5 * q),
    y: HEX_SIZE * (SQRT3 / 2 * q + SQRT3 * r),
  };
}

function pixelToAxial(px: number, py: number) {
  const q = (2 / 3 * px) / HEX_SIZE;
  const r = (-1 / 3 * px + SQRT3 / 3 * py) / HEX_SIZE;
  return roundAxial(q, r);
}

function roundAxial(q: number, r: number) {
  let rq = Math.round(q);
  let rr = Math.round(r);
  const rs = Math.round(-q - r);
  const dq = Math.abs(rq - q);
  const dr = Math.abs(rr - r);
  const ds = Math.abs(rs - (-q - r));
  if (dq > dr && dq > ds) rq = -rr - rs;
  else if (dr > ds) rr = -rq - rs;
  return { q: rq, r: rr };
}

function axialDist(dq: number, dr: number) {
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
}

function drawHex(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

interface HexState {
  intensity: number;
  target: number;
}

interface HexGridProps {
  isDark: boolean;
}

export function HexGrid({ isDark }: HexGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const intensityMap = useRef<Map<string, HexState>>(new Map());
  const hoveredHex = useRef<{ q: number; r: number } | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const cssSize = useRef({ w: 0, h: 0 });
  const isDarkRef = useRef(isDark);

  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  const setHoverTargets = useCallback((q: number | null, r: number | null) => {
    // Decay all existing
    intensityMap.current.forEach((state) => { state.target = 0; });

    if (q === null || r === null) return;

    const set = (dq: number, dr: number, target: number) => {
      const key = `${q + dq},${r + dr}`;
      const existing = intensityMap.current.get(key);
      if (existing) {
        if (existing.target < target) existing.target = target;
      } else {
        intensityMap.current.set(key, { intensity: 0, target });
      }
    };

    set(0, 0, 1);

    const ring1: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]];
    ring1.forEach(([dq, dr]) => set(dq, dr, 0.4));

    for (let dq = -2; dq <= 2; dq++) {
      for (let dr = -2; dr <= 2; dr++) {
        if (axialDist(dq, dr) === 2) set(dq, dr, 0.15);
      }
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { w, h } = cssSize.current;
    if (!w || !h) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const dark = isDarkRef.current;
    const defaultStroke = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';
    const accentColor1 = dark ? [99, 102, 241] : [79, 70, 229];
    const accentColor2 = dark ? [139, 92, 246] : [124, 58, 237];

    const qMin = Math.floor(-w / 2 / (HEX_SIZE * 1.5)) - 2;
    const qMax = Math.ceil(w / 2 / (HEX_SIZE * 1.5)) + 2;

    for (let q = qMin; q <= qMax; q++) {
      const rMin = Math.floor((-h / 2 - HEX_SIZE * SQRT3) / (HEX_SIZE * SQRT3)) - 2;
      const rMax = Math.ceil((h / 2 + HEX_SIZE * SQRT3) / (HEX_SIZE * SQRT3)) + 2;

      for (let r = rMin; r <= rMax; r++) {
        const { x, y } = hexToPixel(q, r);
        const cx = w / 2 + x;
        const cy = h / 2 + y;
        if (cx < -HEX_SIZE * 2 || cx > w + HEX_SIZE * 2 || cy < -HEX_SIZE * 2 || cy > h + HEX_SIZE * 2) continue;

        const key = `${q},${r}`;
        const state = intensityMap.current.get(key);
        const intensity = state ? state.intensity : 0;

        ctx.save();
        drawHex(ctx, cx, cy, HEX_SIZE - 0.5);

        if (intensity > 0) {
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, HEX_SIZE * 1.2);
          grad.addColorStop(0, `rgba(${accentColor1.join(',')},${intensity})`);
          grad.addColorStop(1, `rgba(${accentColor2.join(',')},${intensity * 0.6})`);
          ctx.fillStyle = grad;
          ctx.fill();

          if (intensity > 0.3) {
            ctx.shadowBlur = 18 * intensity;
            ctx.shadowColor = `rgba(${accentColor1.join(',')},${intensity * 0.9})`;
          }
          ctx.strokeStyle = `rgba(${accentColor2.join(',')},${intensity * 0.9})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.strokeStyle = defaultStroke;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }
    }
  }, []);

  const animate = useCallback((timestamp: number) => {
    const dt = Math.min(timestamp - lastTimeRef.current, 50);
    lastTimeRef.current = timestamp;

    const FADE_IN = dt / 200;
    const FADE_OUT = dt / 350;

    const toDelete: string[] = [];
    intensityMap.current.forEach((state, key) => {
      if (state.intensity < state.target) {
        state.intensity = Math.min(state.target, state.intensity + FADE_IN);
      } else if (state.intensity > state.target) {
        state.intensity = Math.max(state.target, state.intensity - FADE_OUT);
        if (state.intensity <= 0.001) toDelete.push(key);
      }
    });
    toDelete.forEach((k) => intensityMap.current.delete(k));

    draw();
    animFrameRef.current = requestAnimationFrame(animate);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = wrapper.clientWidth;
      const h = wrapper.clientHeight;
      cssSize.current = { w, h };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(animate);

    // Window-level mouse tracking so hex works even when hovering content layers
    const handleWindowMouseMove = (e: MouseEvent) => {
      const c = canvasRef.current;
      if (!c) return;
      const rect = c.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        if (hoveredHex.current !== null) { hoveredHex.current = null; setHoverTargets(null, null); }
        return;
      }
      const px = e.clientX - rect.left - cssSize.current.w / 2;
      const py = e.clientY - rect.top - cssSize.current.h / 2;
      const { q, r } = pixelToAxial(px, py);
      const prev = hoveredHex.current;
      if (!prev || prev.q !== q || prev.r !== r) {
        hoveredHex.current = { q, r };
        setHoverTargets(q, r);
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('mousemove', handleWindowMouseMove);
    };
  }, [animate, setHoverTargets]);

  return (
    <div ref={wrapperRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}