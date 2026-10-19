import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { CmsToolItem } from '../../../types/cms';
import { IconButton } from '../../ui/icon-button';
import { Tag } from '../../ui/tag';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ActiveToolCardProps {
  tool: CmsToolItem | null;
  cardVisible: boolean;
  lang: 'en' | 'ar';
  clickHint: string;
  tools: CmsToolItem[];
  activeIdx: number;
  goTo: (i: number) => void;
  prev: () => void;
  next: () => void;
}

export function ActiveToolCard({
  tool, cardVisible, lang, clickHint, tools, activeIdx,
  goTo, prev, next,
}: ActiveToolCardProps) {
  const { t } = useLanguage();
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
              <div className="flex flex-wrap gap-[5px]">
                {(tool.tags?.[lang] || tool.tags?.en || []).map((tag: string) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <div className="relative z-10 flex items-center gap-4 mt-[30px]">
        <IconButton tone="brand" size="md" onClick={prev} aria-label={t.tools.prevTool}>
          <ArrowLeft size={16} className="rtl:-scale-x-100" />
        </IconButton>

        {/* dots */}
        <div className="flex items-center gap-[7px]">
          {tools.map((item, i) => (
            <button
              key={item.name}
              onClick={() => goTo(i)}
              aria-label={item.name}
              className={`h-1.5 p-0 border-none cursor-pointer transition-all duration-300 ${
                i === activeIdx
                  ? 'w-[18px] rounded-[3px] bg-brand shadow-glow-brand'
                  : 'w-1.5 rounded-full bg-border-default'
              }`}
            />
          ))}
        </div>

        <IconButton tone="brand" size="md" onClick={next} aria-label={t.tools.nextTool}>
          <ArrowRight size={16} className="rtl:-scale-x-100" />
        </IconButton>
      </div>

      <p className="mt-3.5 text-sm text-center relative z-10 tracking-wide text-text-faint">
        {clickHint}
      </p>
    </div>
  );
}

