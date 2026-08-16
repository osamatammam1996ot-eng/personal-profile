import { useRef, useEffect } from 'react';
import { useInView } from 'motion/react';

interface DustCanvasProps {
  isDark: boolean;
  className?: string;
}

export function DustCanvas({ isDark, className = '' }: DustCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(canvasRef, { margin: "200px" });

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
    
    // Only draw and request next frame if in view
    function draw() {
      if (!isInView) {
        // Just queue the next frame without doing math or drawing,
        // or actually, we can just stop requesting animation frame
        // and let the useEffect dependency re-trigger it.
        return;
      }
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
    resize(); make(); 
    
    if (isInView) {
      draw();
    }
    
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, isDark, isInView]);

  return <canvas ref={canvasRef} className={className} />;
}
