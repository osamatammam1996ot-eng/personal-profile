'use client';
import { useCms } from '../../contexts/CmsContext';
import Image from 'next/image';

interface LogoMarqueeProps { isDark: boolean; }

export function LogoMarquee({ isDark }: LogoMarqueeProps) {
  const { cmsData } = useCms();

  if (!cmsData?.sections.logoMarquee) return null;
  const logos = (cmsData.logoMarquee || []).filter((l: any) => l.visible);
  if (logos.length === 0) return null;

  // Each strip must be wider than any viewport (max ~2560px).
  // At ~200px per logo, 20 logos = ~4000px — always enough.
  let items = [...logos];
  while (items.length < 20) items = [...items, ...logos];

  const fadeL = isDark
    ? 'linear-gradient(to right, rgba(8,8,16,1), rgba(8,8,16,0))'
    : 'linear-gradient(to right, rgba(245,245,250,1), rgba(245,245,250,0))';
  const fadeR = isDark
    ? 'linear-gradient(to left, rgba(8,8,16,1), rgba(8,8,16,0))'
    : 'linear-gradient(to left, rgba(245,245,250,1), rgba(245,245,250,0))';

  /*
    HOW THIS WORKS:
    - Two identical logo strips sit side by side (display: inline-block inside white-space: nowrap).
    - Each strip runs the SAME animation: translateX(0) -> translateX(-100%) over 35s, linear, infinite.
    - Strip 1 starts at natural position X=0, strip 2 starts at X=stripWidth.
    - As both scroll left at the same speed, strip 2 enters the viewport from the right exactly
      as strip 1 exits to the left.
    - When both reset (instantaneously at the loop boundary), strip 1 is back at 0 and strip 2
      is back at stripWidth — identical to the starting state. Zero visible gap, infinite loop.
  */
  const Strip = ({ prefix }: { prefix: string }) => (
    <div style={{ display: 'inline-flex', alignItems: 'center', animation: 'logoScroll 35s linear infinite' }}>
      {items.map((logo, i) => (
        <div
          key={prefix + i}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 40px', opacity: 0.6, flexShrink: 0 }}
        >
          <Image
            src={logo.url}
            alt={logo.name}
            width={120}
            height={40}
            style={{ objectFit: 'contain', width: 'auto', maxHeight: 40 }}
            unoptimized
          />
        </div>
      ))}
    </div>
  );

  return (
    <section style={{
      width: '100%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '28px 0',
      position: 'relative',
    }}>
      {/* Fade edges */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 120, background: fadeL, zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 120, background: fadeR, zIndex: 2, pointerEvents: 'none' }} />

      <Strip prefix="a" />
      <Strip prefix="b" />

      <style>{`
        @keyframes logoScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
      `}</style>
    </section>
  );
}
