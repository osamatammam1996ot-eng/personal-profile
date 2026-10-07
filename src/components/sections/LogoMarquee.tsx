'use client';
import { useEffect, useRef, useState } from 'react';
import { useCms } from '../../contexts/CmsContext';
import Image from 'next/image';

interface LogoMarqueeProps { isDark: boolean; }

// Each logo occupies exactly this many pixels (image + left/right padding)
const SLOT_PX = 200;
// Speed in pixels per second
const SPEED = 60;

// In light mode logos are shown in one dark tone (.logo-mono). Logos that are
// mostly a solid block (e.g. a filled square badge) would turn into a grey box,
// so those keep their original colours. Measured once per image URL.
const SOLID_COVERAGE = 0.6;
const solidCache = new Map<string, Promise<boolean>>();

function isSolidLogo(url: string): Promise<boolean> {
  if (!solidCache.has(url)) {
    solidCache.set(url, new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
          let opaque = 0;
          for (let i = 3; i < data.length; i += 4) if (data[i] > 200) opaque++;
          resolve(opaque / (data.length / 4) > SOLID_COVERAGE);
        } catch {
          resolve(false); // pixels not readable (CORS): assume a normal transparent logo
        }
      };
      img.onerror = () => resolve(false);
      img.src = url;
    }));
  }
  return solidCache.get(url)!;
}

const LogoSlot = ({ logo }: { logo: any }) => {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    let alive = true;
    isSolidLogo(logo.url).then((s) => { if (alive) setSolid(s); });
    return () => { alive = false; };
  }, [logo.url]);

  return (
    <div className="w-[200px] shrink-0 flex items-center justify-center dark:opacity-65">
      <Image
        src={logo.url}
        alt={logo.name}
        width={120}
        height={40}
        className={`object-contain max-h-10 w-[120px] h-10 ${solid ? 'logo-solid' : 'logo-mono'}`}
        unoptimized
      />
    </div>
  );
};

export function LogoMarquee({ isDark }: LogoMarqueeProps) {
  const { cmsData } = useCms();
  const wrapRef = useRef<HTMLDivElement>(null);

  const logos = (cmsData?.logoMarquee || []).filter((l: any) => l.visible);

  // Pad until we have enough logos to fill any screen (each slot = 200px, need > 2560px)
  let set = logos.length > 0 ? [...logos] : [];
  while (set.length > 0 && set.length < 15) set = [...set, ...logos];

  const setWidth = set.length * SLOT_PX; // exact pixel width of one set

  useEffect(() => {
    if (!wrapRef.current || setWidth === 0) return;

    let x = 0;
    let last: number | null = null;
    let rafId: number;

    const tick = (now: number) => {
      if (last !== null) {
        x -= SPEED * (now - last) / 1000;
        // Use modulo to safely wrap even after huge tab suspension time jumps
        x %= setWidth;
      }
      last = now;
      if (wrapRef.current) {
        wrapRef.current.style.transform = 'translateX(' + x.toFixed(2) + 'px)';
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [setWidth]);

  if (!cmsData?.sections.logoMarquee || set.length === 0) return null;

  return (
    <section dir="ltr" className="w-full overflow-hidden border-y border-marquee-border py-7 relative bg-marquee-bg">
      {/* Fade edges */}
      <div className="absolute top-0 left-0 bottom-0 w-[100px] fade-edge-l z-[2] pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-[100px] fade-edge-r z-[2] pointer-events-none" />

      {/*
        The row is (2 * setWidth) pixels wide.
        rAF moves it left by SPEED px/s.
        When x reaches -setWidth, it resets to 0.
        Set 2 is identical to Set 1, so the reset is invisible.
        This is pure JS — identical behavior in every browser.
      */}
      <div
        ref={wrapRef}
        className="flex flex-row will-change-transform"
        style={{ width: setWidth * 2 }}
      >
        {set.map((logo, i) => <LogoSlot key={'a' + i} logo={logo} />)}
        {set.map((logo, i) => <LogoSlot key={'b' + i} logo={logo} />)}
      </div>
    </section>
  );
}
