import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';
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
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 3D Tilt State
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const isHovered3D = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const hoverSpring = useSpring(isHovered3D, springConfig);

  const shouldAnimate = !prefersReducedMotion;
  
  const rotateX = useTransform(springY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);
  const scale = useTransform(hoverSpring, [0, 1], [1, 1.01]);
  const tiltY = useTransform(hoverSpring, [0, 1], [0, -4]);

  const zTitle = useTransform(hoverSpring, [0, 1], [0, 16]);
  const zActions = useTransform(hoverSpring, [0, 1], [0, 12]);
  const zText = useTransform(hoverSpring, [0, 1], [0, 4]);

  const glowX = useSpring(rawX, { damping: 30, stiffness: 200 });
  const glowY = useSpring(rawY, { damping: 30, stiffness: 200 });
  const glowOpacity = useTransform(hoverSpring, [0, 1], [0, isDark ? 0.15 : 0.05]);
  const glowBackground = useMotionTemplate`radial-gradient(circle at ${glowX}px ${glowY}px, var(--brand), transparent 60%)`;

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!shouldAnimate || !cardRef.current) return;
    if (typeof window !== 'undefined' && window.matchMedia("(hover: none)").matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const posY = e.clientY - rect.top;
    
    const normX = (x / rect.width) - 0.5;
    const normY = (posY / rect.height) - 0.5;
    
    mouseX.set(normX);
    mouseY.set(normY);
    rawX.set(x);
    rawY.set(posY);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    if (!shouldAnimate) return;
    isHovered3D.set(1);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (!shouldAnimate) return;
    isHovered3D.set(0);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleFocus = () => {
    if (!shouldAnimate) return;
    isHovered3D.set(1);
  };

  const handleBlur = () => {
    if (!shouldAnimate) return;
    isHovered3D.set(0);
  };
  
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
    >
      {/* Background glowing shape */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-60">
        <DecorativeShape shape="icosahedron" position="bottom-left" size={600} isDark={isDark} />
      </div>

      <div className="container relative z-10 px-4 mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">

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
        <motion.div 
          className="relative w-full max-w-4xl mx-auto flex items-center justify-center mt-4"
          style={{ perspective: 1000 }}
        >
          <motion.div
            ref={cardRef}
            onPointerMove={handlePointerMove}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={-1}
            style={shouldAnimate ? {
              rotateX,
              rotateY,
              scale,
              y: tiltY,
              transformStyle: 'preserve-3d',
            } : undefined}
            className="relative z-10 w-full max-w-2xl min-h-[380px] md:min-h-[420px] flex flex-col max-md:bg-surface-elevated/95 md:bg-surface-elevated/80 max-md:backdrop-blur-none md:backdrop-blur-xl border border-border-default rounded-3xl shadow-card transition-colors duration-300 hover:border-border-strong hover:bg-surface-elevated focus-within:border-border-strong focus-within:bg-surface-elevated overflow-hidden outline-none group"
          >
            {/* Glow layer */}
            {shouldAnimate && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                  background: glowBackground,
                  opacity: glowOpacity,
                }}
              />
            )}
            
            <Quote size={48} className="text-brand/20 absolute top-8 left-8 z-0 rotate-180" />

            {/* Active Card Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRec.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative z-10 p-8 md:p-12 w-full h-full flex flex-col flex-1"
                style={shouldAnimate ? { z: zText } : undefined}
              >
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <p className="text-lg md:text-xl text-text-primary leading-relaxed font-medium mb-8">
                    "{activeRec.comment[lang]}"
                  </p>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="w-14 h-14 rounded-full border-2 border-brand/50 overflow-hidden shadow-lg">
                      {activeRec.avatar ? (
                        <img src={activeRec.avatar} alt={activeRec.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-brand/10 flex items-center justify-center text-brand font-bold text-xl">
                          {activeRec.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span className="text-text-primary font-bold tracking-wide">{activeRec.name}</span>
                      <span className="text-brand text-sm font-medium">{activeRec.position[lang]}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              {recs.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-6 bg-brand shadow-[0_0_8px_rgba(109,79,184,0.8)]' : 'w-2 bg-text-muted/30'}`} 
                />
              ))}
            </div>
          </motion.div>

        {/* Navigation Controls */}
        {recs.length > 1 && (
          <div className="absolute top-1/2 -translate-y-1/2 w-full max-w-4xl mx-auto flex justify-between px-4 z-20 pointer-events-none left-0 right-0">
            <button 
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-surface-elevated border border-border-default flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-elevated/80 hover:border-brand/50 transition-all pointer-events-auto shadow-sm max-md:backdrop-blur-none md:backdrop-blur-md"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-surface-elevated border border-border-default flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-elevated/80 hover:border-brand/50 transition-all pointer-events-auto shadow-sm max-md:backdrop-blur-none md:backdrop-blur-md"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
        </motion.div>
      </div>
    </section>
  );
}
