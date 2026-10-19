import { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSkillsContent } from '../../content/skills';
import { useSkillsScene } from './skills/useSkillsScene';

interface SkillsProps {
  isDark: boolean;
}

export function Skills({ isDark }: SkillsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isRTL } = useLanguage();
  const { activeChapter, goToChapter } = useSkillsScene({ canvasRef, containerRef, isDark, isRTL });

  const content = useSkillsContent();
  const [disc1, disc2, disc3] = content.disciplines;

  return (
    <section
      ref={containerRef}
      id="skills"
      className="relative w-full h-[300vh] bg-surface-raised transition-colors duration-300"
    >
      {/* svh on phones so the bottom-anchored text never hides under the browser toolbar */}
      <div className="sticky top-0 w-full h-svh md:h-screen overflow-hidden flex items-center justify-center pointer-events-none" dir={isRTL ? 'rtl' : 'ltr'}>

        {/* WebGL Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

        {/* Phones: scrim under the chapter text in case it reaches the shape on short screens */}
        <div aria-hidden className="md:hidden absolute inset-x-0 bottom-0 h-3/5 z-[5] bg-linear-to-t from-surface-raised from-55% to-transparent" />

        {/* Navigation Dots */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:left-auto lg:end-6 z-20 flex flex-row lg:flex-col gap-6 lg:gap-4 pointer-events-auto lg:translate-x-0`}>
          {[0, 1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => goToChapter(num)}
              className={`text-xs lg:text-sm font-bold transition-colors duration-300 tracking-widest ${activeChapter === num ? 'text-brand-text' : 'text-text-faint hover:text-text-secondary'}`}
              
            >
              {num === 0 ? content.introLabel : `0${num}`}
            </button>
          ))}
        </div>

        <div className="relative z-10 w-full max-w-[1200px] h-full mx-auto px-6 md:px-10">

          {/* Intro State */}
          <div id="ui-intro" className={`absolute bottom-20 md:bottom-auto md:top-1/3 ${isRTL ? 'right-6 md:right-10 pl-12 md:pl-0' : 'left-6 md:left-10 pr-12 md:pr-0'} max-w-lg`}>

            <h1 className="font-bold text-4xl md:text-6xl text-text-primary mb-4 md:mb-6 leading-tight" >
              {content.heading1}<br />{content.heading2}
            </h1>
            <p className="text-text-secondary text-lg md:text-xl leading-relaxed" >
              “{content.desc}”
            </p>
            <div className="mt-6 md:mt-12 flex items-center gap-3 text-text-muted text-sm md:text-base">
              <span className="w-10 h-px bg-text-muted/30"></span>
              {content.scrollHint}
            </div>
          </div>

          {/* State 1: Research */}
          <div id="ui-01" className={`absolute bottom-20 md:bottom-auto md:top-1/4 ${isRTL ? 'right-6 md:right-10 pl-12 md:pl-0' : 'left-6 md:left-10 pr-12 md:pr-0'} max-w-sm opacity-0 invisible pointer-events-auto`}>
            <h2 className="text-text-secondary text-4xl md:text-5xl font-bold mb-1 md:mb-2" >01</h2>
            <h3 className="text-text-primary text-xl md:text-2xl mb-3 md:mb-4 whitespace-nowrap" >{disc1.title}</h3>
            <p className="text-text-secondary text-base md:text-lg mb-4 md:mb-8" >
              “{disc1.tagline}”
            </p>
            <ul className={`grid grid-cols-2 gap-x-4 gap-y-2 md:flex md:flex-col md:gap-3 ${isRTL ? 'border-r pr-4 md:pr-5' : 'border-l pl-4 md:pl-5'} border-brand/10 dark:border-border-default `}>
              {disc1.tags.map((cap) => (
                <li key={cap} className="text-text-secondary text-sm md:text-base tracking-wide hover:text-brand-text transition-colors cursor-default" >
                  {cap}
                </li>
              ))}
            </ul>
          </div>

          {/* State 2: Design */}
          <div id="ui-02" className={`absolute bottom-20 md:bottom-auto md:top-1/4 ${isRTL ? 'left-6 md:left-10 pr-12 md:pr-0' : 'right-6 md:right-10 pl-12 md:pl-0'} max-w-sm opacity-0 invisible pointer-events-auto`}>
            <h2 className="text-text-secondary text-4xl md:text-5xl font-bold mb-1 md:mb-2" >02</h2>
            <h3 className="text-text-primary text-xl md:text-2xl mb-3 md:mb-4 whitespace-nowrap" >{disc2.title}</h3>
            <p className="text-text-secondary text-base md:text-lg mb-4 md:mb-8" >
              “{disc2.tagline}”
            </p>
            <ul className={`grid grid-cols-2 gap-x-4 gap-y-2 md:flex md:flex-col md:gap-3 ${isRTL ? 'border-r md:border-r-0 md:border-l pr-4 md:pr-0 md:pl-5' : 'border-l md:border-l-0 md:border-r pl-4 md:pl-0 md:pr-5'} border-brand/10 dark:border-border-default `}>
              {disc2.tags.map((cap) => (
                <li key={cap} className="text-text-secondary text-sm md:text-base tracking-wide hover:text-brand-text transition-colors cursor-default" >
                  {cap}
                </li>
              ))}
            </ul>
          </div>

          {/* State 3: Prototyping */}
          <div id="ui-03" className={`absolute bottom-20 ${isRTL ? 'right-6 md:right-10 pl-12 md:pl-0' : 'left-6 md:left-10 pr-12 md:pr-0'} max-w-3xl opacity-0 invisible pointer-events-auto`}>
            <div className="md:w-1/2">
              <h2 className="text-text-secondary text-4xl md:text-5xl font-bold mb-1 md:mb-2" >03</h2>
              <h3 className="text-text-primary text-xl md:text-2xl mb-3 md:mb-4 whitespace-nowrap" >{disc3.title}</h3>
              <p className="text-text-secondary text-base md:text-lg mb-4 md:mb-8" >
                “{disc3.tagline}”
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-2 md:gap-4 border-t border-brand/10 dark:border-border-default pt-4 md:pt-6 ">
              {disc3.tags.map((cap) => (
                <li key={cap} className="text-text-secondary text-sm md:text-base tracking-wide hover:text-brand-text transition-colors cursor-default" >
                  {cap}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}