import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { CmsToolItem } from '../../../types/cms';

interface ActiveToolCardProps {
  tool: CmsToolItem | null;
  cardVisible: boolean;
  lang: 'en' | 'ar';
  isRTL: boolean;
  isDark: boolean;
  proficiencyLabel: string;
  clickHint: string;
  tools: CmsToolItem[];
  activeIdx: number;
  goTo: (i: number) => void;
  prev: () => void;
  next: () => void;
  surfaceBg: string;
  cardBd: string;
  headingC: string;
  bodyC: string;
  mutedC: string;
  barTrack: string;
  tagBg: string;
  tagBd: string;
  tagC: string;
  navBd: string;
  navBg: string;
  navHovBd: string;
  navHovBg: string;
  dotInact: string;
  hintC: string;
}

export function ActiveToolCard({
  tool, cardVisible, lang, isRTL, isDark, proficiencyLabel, clickHint, tools, activeIdx,
  goTo, prev, next,
  surfaceBg, cardBd, headingC, bodyC, mutedC, barTrack, tagBg, tagBd, tagC,
  navBd, navBg, navHovBd, navHovBg, dotInact, hintC
}: ActiveToolCardProps) {
  const safeTool = tool || ({} as any);
  const pct = safeTool.proficiency || 80;

  return (
    <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 280, maxWidth: 420, width: '100%' }}>
      {/* ── Info Card ── */}
      <div style={{ minHeight: 260, position: 'relative', width: '100%', perspective: 1200, zIndex: 10, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          {cardVisible && tool && (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 15, rotateX: 5 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -10, rotateX: -5 }}
              transition={{ duration: 0.35, ease: [0.34, 1.10, 0.64, 1] }}
              style={{
                width: '100%', flex: '1',
                background: surfaceBg, borderRadius: 20, padding: 28,
                border: `1px solid ${cardBd}`,
                boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.6)' : '0 16px 40px rgba(100,110,140,0.15)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 600, color: headingC, letterSpacing: '-0.02em' }}>
                    {tool.name}
                  </h3>
                  <div style={{ fontSize: '0.6rem', letterSpacing: '0.10em', color: mutedC, marginTop: 2 }}>
                    {(tool.cat?.[lang] || tool.cat?.en)}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', lineHeight: 1.65, color: bodyC, marginBottom: 10 }}>
                {(tool.desc?.[lang] || tool.desc?.en)}
              </div>
              {/* skill bar */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.10em', color: mutedC }}>{proficiencyLabel}</span>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, 
                    background: 'var(--brand-gradient)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>{pct}%</span>
                </div>
                <div style={{ height: 4, borderRadius: 100, background: barTrack, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: [0.34, 1.10, 0.64, 1], delay: 0.1 }}
                    style={{
                      height: '100%', borderRadius: 100,
                      background: 'var(--brand-gradient)',
                      boxShadow: '0 0 8px rgba(99,102,241,0.6)',
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {(tool.tags?.[lang] || tool.tags?.en || []).map((tag: string) => (
                  <span key={tag} style={{
                    fontSize: '0.6rem', fontWeight: 500, padding: '3px 8px', borderRadius: 100,
                    background: tagBg, color: tagC, border: `1px solid ${tagBd}`,
                  }}>{tag}</span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 30, position: 'relative', zIndex: 10 }}>
        <NavArrow onClick={prev} label="Previous tool" isDark={isDark} navBd={navBd} navBg={navBg} navHovBd={navHovBd} navHovBg={navHovBg} headingC={headingC}>
          {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
        </NavArrow>

        {/* dots */}
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {tools.map((t: any, i: number) => (
            <button
              key={t.name}
              onClick={() => goTo(i)}
              aria-label={t.name}
              style={{
                width: i === activeIdx ? 18 : 6,
                height: 6, borderRadius: i === activeIdx ? 3 : '50%',
                border: 'none', cursor: 'pointer', padding: 0,
                background: i === activeIdx ? '#6366f1' : dotInact,
                boxShadow: i === activeIdx ? '0 0 10px rgba(99,102,241,0.7)' : 'none',
                transition: 'all .28s ease',
              }}
            />
          ))}
        </div>

        <NavArrow onClick={next} label="Next tool" isDark={isDark} navBd={navBd} navBg={navBg} navHovBd={navHovBd} navHovBg={navHovBg} headingC={headingC}>
          {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </NavArrow>
      </div>

      <p style={{
        marginTop: 14, fontSize: '0.75rem', color: hintC,
        letterSpacing: '0.04em', textAlign: 'center', position: 'relative', zIndex: 10,
      }}>
        {clickHint}
      </p>

      <style>{`
        @keyframes tools-pulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:.5;transform:scale(.7)}
        }
      `}</style>
    </div>
  );
}

function NavArrow({
  onClick, label, children, isDark: _isDark,
  navBd, navBg, navHovBd, navHovBg, headingC,
}: {
  onClick: () => void; label: string; children: React.ReactNode;
  isDark: boolean; navBd: string; navBg: string; navHovBd: string; navHovBg: string; headingC: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} aria-label={label}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        border: `1px solid ${hov ? navHovBd : navBd}`,
        background: hov ? navHovBg : navBg,
        color: headingC, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, lineHeight: 1,
        transform: hov ? 'scale(1.08)' : 'scale(1)',
        transition: 'background .2s, border-color .2s, transform .15s',
      }}
    >
      {children}
    </button>
  );
}
