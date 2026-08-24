'use client';
import { useRef } from 'react';
import { useAnimationFrame } from 'motion/react';
import { useCms } from '../../contexts/CmsContext';
import Image from 'next/image';

interface LogoMarqueeProps { isDark: boolean; }

const SPEED = 80; // px per second

export function LogoMarquee({ isDark }: LogoMarqueeProps) {
  const { cmsData } = useCms();
  const wrapRef = useRef<HTMLDivElement>(null);
  const xRef    = useRef(0);

  useAnimationFrame((_time, delta) => {
    const el = wrapRef.current;
    if (!el) return;

    xRef.current -= (delta / 1000) * SPEED;

    // scrollWidth is the total rendered width of both tracks combined.
    // Dividing by 2 gives exactly one track's width.
    // When we've scrolled that far, jumping back by one track is invisible
    // because track-2 content == track-1 content.
    const half = el.scrollWidth / 2;
    if (half > 0 && xRef.current < -half) {
      xRef.current += half;
    }

    el.style.transform = 'translateX(' + xRef.current + 'px)';
  });

  if (!cmsData?.sections.logoMarquee) return null;
  const logos = (cmsData.logoMarquee || []).filter((l: any) => l.visible);
  if (logos.length === 0) return null;

  // Repeat logos until we have at least 10 per track (fills any screen)
  let track = [...logos];
  while (track.length < 10) track = [...track, ...logos];

  const LogoItem = ({ logo, uid }: { logo: any; uid: string }) => (
    <div
      key={uid}
      style={{ flexShrink: 0, paddingLeft: 48, paddingRight: 48, position: 'relative', width: 128 + 96, height: 40 }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', opacity: 0.6 }}>
        <Image
          src={logo.url}
          alt={logo.name}
          fill
          style={{ objectFit: 'contain' }}
          sizes="128px"
        />
      </div>
    </div>
  );

  const fadeL = isDark
    ? 'linear-gradient(to right, rgba(8,8,16,1), rgba(8,8,16,0))'
    : 'linear-gradient(to right, rgba(245,245,250,1), rgba(245,245,250,0))';
  const fadeR = isDark
    ? 'linear-gradient(to left, rgba(8,8,16,1), rgba(8,8,16,0))'
    : 'linear-gradient(to left, rgba(245,245,250,1), rgba(245,245,250,0))';

  return (
    <section style={{ width: '100%', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '32px 0', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 128, background: fadeL, zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 128, background: fadeR, zIndex: 2, pointerEvents: 'none' }} />

      {/* wrapRef: animated row. scrollWidth / 2 = one track. */}
      <div
        ref={wrapRef}
        style={{ display: 'flex', alignItems: 'center', willChange: 'transform' }}
      >
        {track.map((logo, i) => <LogoItem key={'a' + i} logo={logo} uid={'a' + i} />)}
        {track.map((logo, i) => <LogoItem key={'b' + i} logo={logo} uid={'b' + i} />)}
      </div>
    </section>
  );
}
