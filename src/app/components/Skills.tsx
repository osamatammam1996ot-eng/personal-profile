import { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCms } from '../contexts/CmsContext';

interface SkillsProps {
  isDark: boolean;
}

const DISCIPLINE_VISUAL = [
  { number: '01', color: '#6366f1', colorB: '#8b5cf6' },
  { number: '02', color: '#8b5cf6', colorB: '#a78bfa' },
  { number: '03', color: '#06b6d4', colorB: '#6366f1' },
];

const TOOLS = [
  { name: 'Figma' }, { name: 'Framer' }, { name: 'Notion' }, { name: 'ChatGPT' },
  { name: 'Midjourney' }, { name: 'Jira' }, { name: 'Miro' }, { name: 'Mobbin' },
  { name: 'Lottie' }, { name: 'Webflow' },
];

function DisciplineCard({ visual, text, isDark, index }: {
  visual: typeof DISCIPLINE_VISUAL[0];
  text: { title: string; tagline: string; tags: string[] };
  isDark: boolean;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const { fontHeading, fontBody, isRTL } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col overflow-hidden rounded-2xl"
      style={{
        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
        border: `1px solid ${isDark
          ? hovered ? `${visual.color}50` : 'rgba(255,255,255,0.07)'
          : hovered ? `${visual.color}40` : 'rgba(0,0,0,0.07)'}`,
        boxShadow: hovered
          ? isDark
            ? `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${visual.color}30`
            : `0 16px 48px rgba(0,0,0,0.1), 0 0 0 1px ${visual.color}25`
          : 'none',
        transition: 'border 0.3s ease, box-shadow 0.3s ease',
        cursor: 'default',
      }}
    >
      {/* Colored top accent bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, ${visual.color}, ${visual.colorB})`, transformOrigin: 'left' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: index * 0.12 + 0.3, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Background watermark number */}
      <div
        className="absolute top-4 right-5 select-none pointer-events-none"
        style={{
          fontFamily: fontHeading,
          fontWeight: 800,
          fontSize: '5.5rem',
          lineHeight: 1,
          color: visual.color,
          opacity: isDark ? 0.07 : 0.06,
          letterSpacing: '-0.04em',
        }}
      >
        {visual.number}
      </div>

      <div className="relative z-10 p-7 flex flex-col gap-5 h-full">
        <span style={{
          fontFamily: fontBody,
          fontWeight: 500,
          fontSize: '0.72rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: visual.color,
          opacity: 0.9,
        }}>
          {visual.number}
        </span>

        <h3 style={{
          fontFamily: fontHeading,
          fontWeight: 700,
          fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
          color: isDark ? '#f0f0ff' : '#0f0f1e',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          whiteSpace: 'pre-line',
        }}>
          {text.title}
        </h3>

        <p style={{
          fontFamily: fontBody,
          fontWeight: 400,
          fontSize: '0.88rem',
          lineHeight: 1.65,
          color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)',
          borderInlineStart: `2px solid ${visual.color}60`,
          paddingInlineStart: '12px',
        }}>
          {text.tagline}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {text.tags.map((tag, ti) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 + ti * 0.04 + 0.4 }}
              style={{
                fontFamily: fontBody,
                fontWeight: 500,
                fontSize: '0.75rem',
                color: isDark ? 'rgba(200,200,230,0.75)' : 'rgba(30,30,60,0.65)',
                background: isDark
                  ? `rgba(${visual.color === '#6366f1' ? '99,102,241' : visual.color === '#8b5cf6' ? '139,92,246' : '6,182,212'},0.1)`
                  : `rgba(${visual.color === '#6366f1' ? '99,102,241' : visual.color === '#8b5cf6' ? '139,92,246' : '6,182,212'},0.07)`,
                border: `1px solid ${isDark
                  ? `rgba(${visual.color === '#6366f1' ? '99,102,241' : visual.color === '#8b5cf6' ? '139,92,246' : '6,182,212'},0.2)`
                  : `rgba(${visual.color === '#6366f1' ? '99,102,241' : visual.color === '#8b5cf6' ? '139,92,246' : '6,182,212'},0.15)`}`,
                borderRadius: '8px',
                padding: '4px 10px',
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Skills({ isDark }: SkillsProps) {
  const { lang, fontHeading, fontBody, isRTL } = useLanguage();
  const { cmsData } = useCms();
  const dark = isDark;

  const sectionLabel = lang === 'en' ? 'Craft' : 'الحرفة';
  const heading1 = cmsData.skills.heading1[lang] || (lang === 'en' ? 'Seven years.' : 'سبع سنوات');
  const heading2 = cmsData.skills.heading2[lang] || (lang === 'en' ? 'Three disciplines.' : 'ثلاث تخصصات');
  const desc = cmsData.skills.desc[lang] || (lang === 'en' ? 'My skills and expertise' : 'مهاراتي وخبرتي');
  const disciplines = Array.from({ length: 3 }, (_, i) => ({
    title: cmsData.skills.disciplines[i]?.title?.[lang] || '',
    tagline: cmsData.skills.disciplines[i]?.tagline?.[lang] || '',
    tags: cmsData.skills.disciplines[i]?.tags?.[lang] || [],
  }));

  return (
    <section
      id="skills"
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={{ background: dark ? '#080810' : '#f5f5fa' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: dark
            ? 'radial-gradient(ellipse at 70% 40%, rgba(139,92,246,0.09) 0%, transparent 55%)'
            : 'radial-gradient(ellipse at 70% 40%, rgba(139,92,246,0.06) 0%, transparent 55%)',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Section header */}
        <div className="mb-16 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px flex-1 max-w-[32px]" style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }} />
            <span style={{
              fontFamily: fontBody,
              fontWeight: 500,
              fontSize: '0.78rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: dark ? '#a5b4fc' : '#6366f1',
            }}>
              {sectionLabel}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.06, ease: [0.4, 0, 0.2, 1] }}
            style={{
              fontFamily: fontHeading,
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: dark ? '#f0f0ff' : '#0f0f1e',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            {heading1}<br />
            <span style={{
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {heading2}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.14, ease: [0.4, 0, 0.2, 1] }}
            className="mt-4"
            style={{
              fontFamily: fontBody,
              fontWeight: 400,
              fontSize: '0.97rem',
              lineHeight: 1.78,
              color: dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)',
            }}
          >
            {desc}
          </motion.p>
        </div>

        {/* Discipline cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {DISCIPLINE_VISUAL.map((v, i) => {
            const disciplineText = disciplines[i];
            const text = disciplineText || { title: '', tagline: '', tags: [] };
            return (
              <DisciplineCard
                key={v.number}
                visual={v}
                text={text}
                isDark={dark}
                index={i}
              />
            );
          })}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="mb-10"
          style={{
            height: '1px',
            background: dark
              ? 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3) 30%, rgba(139,92,246,0.3) 70%, transparent)'
              : 'linear-gradient(90deg, transparent, rgba(99,102,241,0.2) 30%, rgba(139,92,246,0.2) 70%, transparent)',
            transformOrigin: 'left',
          }}
        />
      </div>
    </section>
  );
}