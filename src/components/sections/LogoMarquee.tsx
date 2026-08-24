'use client';
import { useRef, useEffect } from 'react';
import { useCms } from '../../contexts/CmsContext';
import Image from 'next/image';

interface LogoMarqueeProps { isDark: boolean; }

const SPEED = 0.6; // px per ms

export function LogoMarquee({ isDark }: LogoMarqueeProps) {
  const { cmsData } = useCms();
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef  = useRef<HTMLDivElement>(null);
  const posRef   = useRef(0);

  useEffect(() => {
    let rafId: number;
    let last: number | null = null;

    const tick = (now: number) => {
      if (last !== null) {
        posRef.current -= SPEED * (now - last);
        const trackW = trackRef.current?.offsetWidth ?? 0;
        if (trackW > 0 && posRef.current <= -trackW) {
          posRef.current += trackW; // jump back exactly one track width — invisible since track2 = track1
        }
        if (wrapRef.current) {
          wrapRef.current.style.transform = 'translateX(' + posRef.current + 'px)';
        }
      }
      last = now;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!cmsData?.sections.logoMarquee) return null;
  const logos = cmsData.logoMarquee?.filter((l: any) => l.visible) || [];
  if (logos.length === 0) return null;

  // Pad so one track fills the widest viewport
  let track = [...logos];
  while (track.length < 12) track = [...track, ...logos];

  const renderLogo = (logo: any, key: string) => {
    const el = (
      <div className="flex items-center justify-center grayscale-[50%] opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100 flex-shrink-0 relative h-8 md:h-10 w-32">
        <Image src={logo.url} alt={logo.name} fill className="object-contain" sizes="128px" />
      </div>
    );
    return (
      <div key={key} className="flex-shrink-0 mx-8 md:mx-12">
        {logo.href ? (
          <a href={logo.href} target="_blank" rel="noopener noreferrer" className="block focus:outline-none focus:ring-2 focus:ring-brand rounded-lg">{el}</a>
        ) : el}
      </div>
    );
  };

  return (
    <section className="w-full overflow-hidden border-y border-white/5 py-8 md:py-12 bg-transparent relative z-10 flex items-center">
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 z-20 pointer-events-none" style={{ background: isDark ? 'linear-gradient(to right,rgba(8,8,16,1),rgba(8,8,16,0))' : 'linear-gradient(to right,rgba(245,245,250,1),rgba(245,245,250,0))' }} />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 z-20 pointer-events-none" style={{ background: isDark ? 'linear-gradient(to left,rgba(8,8,16,1),rgba(8,8,16,0))' : 'linear-gradient(to left,rgba(245,245,250,1),rgba(245,245,250,0))' }} />
      {/* wrapRef is animated; trackRef measures exactly one track so we know when to reset */}
      <div ref={wrapRef} className="flex items-center" style={{ willChange: 'transform' }}>
        <div ref={trackRef} className="flex items-center">
          {track.map((logo, idx) => renderLogo(logo, 't1-' + logo.id + '-' + idx))}
        </div>
        <div className="flex items-center">
          {track.map((logo, idx) => renderLogo(logo, 't2-' + logo.id + '-' + idx))}
        </div>
      </div>
    </section>
  );
}
