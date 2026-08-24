'use client';
import { useCms } from '../../contexts/CmsContext';
import Image from 'next/image';

interface LogoMarqueeProps { isDark: boolean; }

export function LogoMarquee({ isDark }: LogoMarqueeProps) {
  const { cmsData } = useCms();

  if (!cmsData?.sections.logoMarquee) return null;
  const logos = (cmsData.logoMarquee || []).filter((l: any) => l.visible);
  if (logos.length === 0) return null;

  // We need one "set" that is wider than any viewport (max ~2560px).
  // Each logo slot is 120px image + 80px margin = ~200px.
  // 15 logos = ~3000px which covers even 4K screens.
  let set = [...logos];
  while (set.length < 15) set = [...set, ...logos];

  const fadeL = isDark
    ? 'linear-gradient(to right, rgba(8,8,16,1), rgba(8,8,16,0))'
    : 'linear-gradient(to right, rgba(245,245,250,1), rgba(245,245,250,0))';
  const fadeR = isDark
    ? 'linear-gradient(to left, rgba(8,8,16,1), rgba(8,8,16,0))'
    : 'linear-gradient(to left, rgba(245,245,250,1), rgba(245,245,250,0))';

  /*
   * THE PATTERN (used by every marquee library):
   * - One div with class="marquee-track" (display:flex, width:max-content)
   * - Inside: SET 1 logos, then SET 2 logos (identical copy)
   * - CSS: translateX(0) -> translateX(-50%) linear infinite
   * - -50% of the element's OWN width = exactly one set's width
   * - At the reset point (50% -> 0%), content is visually identical => zero jump
   */
  return (
    <section style={{
      width: '100%',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '28px 0',
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 120, background: fadeL, zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 120, background: fadeR, zIndex: 2, pointerEvents: 'none' }} />

      <div className="marquee-track">
        {/* Set 1 */}
        {set.map((logo, i) => (
          <div key={'a' + i} style={{ flexShrink: 0, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src={logo.url} alt={logo.name} width={120} height={40} style={{ objectFit: 'contain', opacity: 0.6, width: 'auto', maxHeight: 40 }} unoptimized />
          </div>
        ))}
        {/* Set 2 — identical, makes the -50% loop seamless */}
        {set.map((logo, i) => (
          <div key={'b' + i} style={{ flexShrink: 0, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src={logo.url} alt={logo.name} width={120} height={40} style={{ objectFit: 'contain', opacity: 0.6, width: 'auto', maxHeight: 40 }} unoptimized />
          </div>
        ))}
      </div>
    </section>
  );
}
