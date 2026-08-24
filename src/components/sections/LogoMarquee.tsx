'use client';
import { useCms } from '../../contexts/CmsContext';
import Image from 'next/image';

interface LogoMarqueeProps { isDark: boolean; }

export function LogoMarquee({ isDark }: LogoMarqueeProps) {
  const { cmsData } = useCms();

  if (!cmsData?.sections.logoMarquee) return null;
  const logos = (cmsData.logoMarquee || []).filter((l: any) => l.visible);
  if (logos.length === 0) return null;

  // Ensure at least 10 per track so the track is wider than any screen
  let track = [...logos];
  while (track.length < 10) track = [...track, ...logos];

  const Logo = ({ logo, keyStr }: { logo: any; keyStr: string }) => (
    <div
      key={keyStr}
      style={{ flexShrink: 0, margin: '0 48px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {logo.href ? (
        <a href={logo.href} target="_blank" rel="noopener noreferrer">
          <div style={{ position: 'relative', width: 128, height: 40, opacity: 0.6, filter: 'grayscale(50%)' }}>
            <Image src={logo.url} alt={logo.name} fill style={{ objectFit: 'contain' }} sizes="128px" />
          </div>
        </a>
      ) : (
        <div style={{ position: 'relative', width: 128, height: 40, opacity: 0.6, filter: 'grayscale(50%)' }}>
          <Image src={logo.url} alt={logo.name} fill style={{ objectFit: 'contain' }} sizes="128px" />
        </div>
      )}
    </div>
  );

  const fadeLeft = isDark
    ? 'linear-gradient(to right, rgba(8,8,16,1) 0%, rgba(8,8,16,0) 100%)'
    : 'linear-gradient(to right, rgba(245,245,250,1) 0%, rgba(245,245,250,0) 100%)';
  const fadeRight = isDark
    ? 'linear-gradient(to left, rgba(8,8,16,1) 0%, rgba(8,8,16,0) 100%)'
    : 'linear-gradient(to left, rgba(245,245,250,1) 0%, rgba(245,245,250,0) 100%)';

  return (
    <section style={{ width: '100%', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '32px 0', position: 'relative' }}>
      {/* fade edges */}
      <div style={{ position: 'absolute', inset: '0 auto 0 0', width: 128, background: fadeLeft, zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: '0 0 0 auto', width: 128, background: fadeRight, zIndex: 2, pointerEvents: 'none' }} />

      {/*
        THE MARQUEE:
        - display:flex + width:max-content ensures the row is exactly as wide as ALL logos combined
        - Two identical tracks side by side
        - CSS animation goes from translateX(0) to translateX(-50%)
        - At -50% we have translated exactly one track width, so the visual is identical to 0%
        - The browser's infinite loop reset is completely invisible
      */}
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          alignItems: 'center',
          animation: 'logoMarqueeScroll 35s linear infinite',
        }}
      >
        {/* Track 1 */}
        {track.map((logo, idx) => <Logo key={'a-' + idx} logo={logo} keyStr={'a-' + idx} />)}
        {/* Track 2 — exact copy so -50% loops back identically */}
        {track.map((logo, idx) => <Logo key={'b-' + idx} logo={logo} keyStr={'b-' + idx} />)}
      </div>

      <style>{`
        @keyframes logoMarqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
