import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { CmsToolItem } from '../../../types/cms';

interface ActiveToolCardProps {
  tool: CmsToolItem | null;
  cardVisible: boolean;
  lang: 'en' | 'ar';
  isRTL: boolean;
  proficiencyLabel: string;
  clickHint: string;
  tools: CmsToolItem[];
  activeIdx: number;
  goTo: (i: number) => void;
  prev: () => void;
  next: () => void;
}

export function ActiveToolCard({
  tool, cardVisible, lang, isRTL, proficiencyLabel, clickHint, tools, activeIdx,
  goTo, prev, next,
}: ActiveToolCardProps) {
  const pct = tool?.proficiency || 80;

  return (
    <div className="flex flex-col items-center flex-auto w-full min-w-[280px] max-w-[420px]">
      {/* ── Info Card ── */}
      <div className="relative z-10 flex flex-col w-full min-h-[260px] perspective-[1200px]">
        <AnimatePresence mode="wait">
          {cardVisible && tool && (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 15, rotateX: 5 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -10, rotateX: -5 }}
              transition={{ duration: 0.35, ease: [0.34, 1.10, 0.64, 1] }}
              className="flex-1 w-full flex flex-col justify-between p-7 rounded-[20px] bg-surface-card border border-brand/20 shadow-floating"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold m-0 tracking-tight text-text-primary">
                    {tool.name}
                  </h3>
                  <div className="text-xs tracking-widest mt-0.5 text-text-faint">
                    {(tool.cat?.[lang] || tool.cat?.en)}
                  </div>
                </div>
              </div>
              <div className="text-base leading-relaxed mb-2.5 text-text-muted">
                {(tool.desc?.[lang] || tool.desc?.en)}
              </div>
              {/* skill bar */}
              <div className="mb-2.5">
                <div className="flex justify-between items-center mb-[5px]">
                  <span className="text-xs tracking-widest text-text-faint">{proficiencyLabel}</span>
                  <span className="text-sm font-bold text-brand-gradient">{pct}%</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden bg-brand/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: [0.34, 1.10, 0.64, 1], delay: 0.1 }}
                    className="h-full rounded-full bg-brand-gradient shadow-glow-brand"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-[5px]">
                {(tool.tags?.[lang] || tool.tags?.en || []).map((tag: string) => (
                  <span key={tag} className="text-sm font-medium px-2 py-1 rounded-full bg-brand/10 text-brand border border-brand/20">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <div className="relative z-10 flex items-center gap-4 mt-[30px]">
        <NavArrow onClick={prev} label="Previous tool">
          {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
        </NavArrow>

        {/* dots */}
        <div className="flex items-center gap-[7px]">
          {tools.map((t, i) => (
            <button
              key={t.name}
              onClick={() => goTo(i)}
              aria-label={t.name}
              className={`h-1.5 p-0 border-none cursor-pointer transition-all duration-300 ${
                i === activeIdx
                  ? 'w-[18px] rounded-[3px] bg-brand shadow-glow-brand'
                  : 'w-1.5 rounded-full bg-border-default'
              }`}
            />
          ))}
        </div>

        <NavArrow onClick={next} label="Next tool">
          {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </NavArrow>
      </div>

      <p className="mt-3.5 text-sm text-center relative z-10 tracking-wide text-text-faint">
        {clickHint}
      </p>
    </div>
  );
}

function NavArrow({ onClick, label, children }: {
  onClick: () => void; label: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="size-[38px] shrink-0 rounded-full flex items-center justify-center text-lg leading-none cursor-pointer text-text-primary border border-brand/20 bg-brand/5 hover:border-brand hover:bg-brand/20 hover:scale-[1.08] transition-[background-color,border-color,transform] duration-200"
    >
      {children}
    </button>
  );
}
