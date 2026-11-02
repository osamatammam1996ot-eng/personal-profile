import { useRef, useEffect } from 'react';
import { parseColor, readToken } from '../../../lib/theme-tokens';
import { runWhileVisible } from '../../../lib/visible-loop';

interface DustCanvasProps {
  isDark: boolean;
  className?: string;
}

export function DustCanvas({ isDark, className = '' }: DustCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    if (!cx) return;

    let W = 0, H = 0;
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
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        cx!.beginPath();
        cx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx!.fillStyle = `rgba(${dustColor},${p.a})`;
        cx!.fill();
      }
    }

    // Dust takes the brand-hover color; re-read whenever the theme changes
    const dustColor = parseColor(readToken('--brand-hover')).slice(0, 3).join(',');

    function onResize() { resize(); make(); }
    resize(); make();

    // Drifts only while the section is on screen
    const stopLoop = runWhileVisible(cv, draw);

    window.addEventListener('resize', onResize);
    return () => {
      stopLoop();
      window.removeEventListener('resize', onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);

  return <canvas ref={canvasRef} className={className} />;
}
