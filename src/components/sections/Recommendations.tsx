import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { DecorativeShape } from '../shared/DecorativeShape';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';

interface RecommendationsProps {
  isDark: boolean;
}

export function Recommendations({ isDark }: RecommendationsProps) {
  const { isRTL, lang } = useLanguage();
  const { cmsData } = useCms();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  
  const recs = cmsData.recommendations?.filter(r => r.visible) || [];

  // Auto-advance
  useEffect(() => {
    if (recs.length <= 1 || isHovered || prefersReducedMotion) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % recs.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [recs.length, isHovered, prefersReducedMotion]);

  if (!cmsData.sections.recommendations || recs.length === 0) return null;

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % recs.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + recs.length) % recs.length);

  const activeRec = recs[activeIndex];

  return (
    <section 
      id="recommendations" 
      className="relative w-full py-32 overflow-hidden flex flex-col items-center justify-center bg-surface"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background glowing shape */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-60">
        <DecorativeShape shape="icosahedron" position="bottom-left" size={600} isDark={isDark} />
      </div>

      <div className="container relative z-10 px-4 mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-[1px] w-8 bg-brand/50"></div>
            <span className="text-brand font-mono text-[11px] uppercase tracking-[0.2em] font-bold">
              {lang === 'en' ? 'Recommendations' : 'التوصيات'}
            </span>
            <div className="h-[1px] w-8 bg-brand/50"></div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-2 font-bold text-[clamp(2rem,4vw,3.25rem)] text-text-primary tracking-tight leading-[1.15]"
          >
            {lang === 'en' ? 'What People Say' : 'ماذا يقولون'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-text-secondary text-base md:text-lg max-w-2xl"
          >
            {lang === 'en' 
              ? "A few words from the people I've built, solved, and collaborated with." 
              : "بعض الكلمات ممن عملت، وبنيت، وتعاونت معهم."}
          </motion.p>
        </div>

        {/* Card Stage */}
        <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center mt-4 perspective-[1000px]">

          {/* Active Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRec.id}
              initial={{ opacity: 0, scale: 0.9, y: 20, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20, rotateX: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-2xl bg-[#080810]/80 backdrop-blur-xl border border-brand/20 p-8 md:p-12 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] group"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand/5 to-transparent rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <Quote size={48} className="text-brand/20 absolute top-8 left-8 -z-10 rotate-180" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-medium mb-8">
                  "{activeRec.comment[lang]}"
                </p>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="w-14 h-14 rounded-full border-2 border-brand/50 overflow-hidden shadow-[0_0_15px_rgba(109,79,184,0.4)]">
                    {activeRec.avatar ? (
                      <img src={activeRec.avatar} alt={activeRec.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-brand/10 flex items-center justify-center text-brand font-bold text-xl">
                        {activeRec.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                    <span className="text-white font-bold tracking-wide">{activeRec.name}</span>
                    <span className="text-brand/80 text-sm font-medium">{activeRec.position[lang]}</span>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
                {recs.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-6 bg-brand shadow-[0_0_8px_rgba(109,79,184,0.8)]' : 'w-2 bg-white/20'}`} 
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          {recs.length > 1 && (
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 z-20 pointer-events-none">
              <button 
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all pointer-events-auto shadow-xl backdrop-blur-md"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all pointer-events-auto shadow-xl backdrop-blur-md"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
