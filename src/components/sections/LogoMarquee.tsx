'use client';
import { useEffect, useRef } from 'react';
import { useCms } from '../../contexts/CmsContext';
import Image from 'next/image';

interface LogoMarqueeProps { isDark: boolean; }

// Each logo occupies exactly this many pixels (image + left/right padding)
const SLOT_PX = 200;
// Speed in pixels per second
const SPEED = 60;

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
        // Reset when we've scrolled exactly one set — invisible because set2 === set1
        if (x <= -setWidth) x += setWidth;
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

  const LogoSlot = ({ logo, uid }: { logo: any; uid: string }) => (
    <div
      key={uid}
      className="w-[200px] shrink-0 flex items-center justify-center opacity-65"
    >
      <Image
        src={logo.url}
        alt={logo.name}
        width={120}
        height={40}
        className="object-contain max-h-10 w-[120px] h-10"
        unoptimized
      />
    </div>
  );

  return (
    <section className="w-full overflow-hidden border-y border-white/6 py-7 relative bg-marquee-bg">
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
        {set.map((logo, i) => <LogoSlot key={'a' + i} logo={logo} uid={'a' + i} />)}
        {set.map((logo, i) => <LogoSlot key={'b' + i} logo={logo} uid={'b' + i} />)}
      </div>
    </section>
  );
}
