'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DecorativeShape } from '../shared/DecorativeShape';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';
import { ArrowUpRight, Copy, Calendar, ArrowRight } from 'lucide-react';

interface ContactProps {
  isDark: boolean;
}

const SOCIALS = [
  {
    name: 'WhatsApp',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    color: '#25D366',
  },
  {
    name: 'Dribbble',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.628-5.373-12-12-12zm8.685 12.072c-.083-.021-2.038-.512-4.22-.19-.481-1.282-1.025-2.528-1.619-3.711 2.37-1.085 3.32-2.58 3.42-2.744a8.887 8.887 0 012.419 6.645zm-1.87-8.117c-.126.185-1.189 1.636-3.485 2.658-.87-1.603-1.848-3.132-2.91-4.577 2.646-.576 5.093.187 5.321.261-.295.589-.661 1.144-1.074 1.658h.148zm-8.87-1.12c1.026 1.463 1.97 3.013 2.816 4.63-2.923.83-5.918.775-6.28.766 1.055-2.457 2.923-4.428 5.464-5.396zm-6.19 7.15c.343.01 3.253.056 6.314-.739.561 1.134 1.076 2.316 1.542 3.535-3.322 1.026-5.46 3.109-5.645 3.303a8.847 8.847 0 01-2.21-6.099zm3.626 7.424c.218-.222 2.193-2.181 5.405-3.167 1.258 3.518 1.83 6.602 1.942 7.228-2.977.108-5.74-1.393-7.347-4.061zm9.467 3.738c-.131-.703-.736-3.874-2.023-7.382 2.05-.341 3.963.09 4.108.125a8.846 8.846 0 01-2.085 7.257z" />
      </svg>
    ),
    color: '#EA4C89',
  },
  {
    name: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: '#0A66C2',
  },
  {
    name: 'Behance',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.336.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1.0-1.16 1.35-.49.36-1.06.62-1.7.78-.64.16-1.3.24-1.99.24H0V4.51h6.938v-.007zm-.34 5.32c.584 0 1.054-.14 1.41-.43.354-.28.53-.72.53-1.31 0-.32-.06-.59-.18-.8-.12-.21-.27-.38-.47-.5-.2-.13-.43-.21-.68-.26-.27-.05-.53-.08-.82-.08H3.5v3.38h3.1zm.19 5.63c.32 0 .62-.03.9-.1.28-.07.53-.18.74-.33.21-.16.38-.36.5-.62.12-.26.18-.57.18-.94 0-.74-.21-1.28-.63-1.6-.42-.33-.99-.5-1.69-.5H3.5v4.09h3.29zm10.06.27c.41.4.98.6 1.71.6.53 0 .99-.13 1.37-.4.38-.27.61-.55.7-.87h2.52c-.4 1.25-1.02 2.14-1.86 2.67-.83.53-1.84.8-3.02.8-.82 0-1.56-.13-2.21-.4-.65-.27-1.2-.66-1.65-1.15-.45-.5-.8-1.09-1.04-1.79-.24-.69-.36-1.44-.36-2.26 0-.8.12-1.53.37-2.21.25-.68.6-1.27 1.06-1.77.46-.5 1.01-.89 1.66-1.17.64-.28 1.36-.42 2.15-.42.88 0 1.64.16 2.3.5.65.33 1.18.78 1.6 1.35.41.57.71 1.22.88 1.96.18.74.25 1.52.21 2.35h-7.46c.04.87.28 1.5.69 1.91zm2.97-5.11c-.33-.36-.82-.54-1.47-.54-.43 0-.79.07-1.07.22-.28.15-.5.33-.67.55-.17.22-.29.45-.35.69-.07.24-.11.46-.12.66h4.26c-.1-.71-.31-1.22-.58-1.58zM15.54 6.15h5.09v1.35H15.54V6.15z" />
      </svg>
    ),
    color: '#1769ff',
  },
];

export function Contact({ isDark }: ContactProps) {
  const { lang, isRTL } = useLanguage();
  const { cmsData } = useCms();
  const [copied, setCopied] = useState(false);

  const email = cmsData?.contact?.email || 'osvartsarmen72604@gmail.com';
  const availability = cmsData?.contact?.availability?.[lang] || (lang === 'en' ? 'Available for new projects' : 'متاح لمشاريع جديدة');
  
  // Overriding headline and body to perfectly match the image context if it's English
  const headline = lang === 'en' 
    ? <>Got a problem<br/>worth solving?<br/>Let's talk about it.</>
    : (cmsData?.contact?.headline1?.[lang] || 'هل لديك مشكلة تستحق الحل؟ دعنا نتحدث.');
    
  const bodyText = lang === 'en' 
    ? 'I help product and engineering teams turn complex problems into intuitive digital experiences. Whether you have a clear roadmap or just an idea, I\'d love to hear about it and explore how we can build something impactful together.'
    : (cmsData?.contact?.body?.[lang] || 'أنا أساعد فرق المنتج والهندسة على تحويل المشاكل المعقدة إلى تجارب رقمية بديهية.');

  const emailLabel = lang === 'en' ? 'EMAIL ME' : 'البريد الإلكتروني';
  
  const bottomNote = lang === 'en'
    ? <>I typically respond within 24 hours.<br/>Looking forward to connecting!</>
    : (cmsData?.contact?.note?.[lang] || 'أرد عادة خلال 24 ساعة. أتطلع للتواصل معك!');

  const meetingAction = lang === 'en'
    ? 'Prefer a quick call? Let\'s find a time that works for you.'
    : 'تفضل مكالمة سريعة؟ دعنا نجد وقتًا يناسبك.';
    
  const meetingLink = lang === 'en' ? 'Schedule a meeting' : 'حدد موعداً';

  const socialLinks = {
    WhatsApp: cmsData?.contact?.socials?.whatsapp || 'https://wa.me/1234567890',
    Dribbble: 'https://dribbble.com', // fallback as dribbble wasn't in cms by default
    LinkedIn: cmsData?.contact?.socials?.linkedin || 'https://linkedin.com',
    Behance: cmsData?.contact?.socials?.behance || 'https://behance.net',
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email', err);
    }
  };

  return (
    <section id="contact" className="w-full py-24 md:py-36 bg-background relative overflow-hidden">
      <div className={`max-w-[1200px] mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-start ${isRTL ? 'rtl' : 'ltr'}`}>
        
        {/* Left Column */}
        <div className="flex flex-col pt-4">
          
          {/* Availability Pill */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
            </span>
            <span className="text-sm font-medium text-text-muted">
              {availability}
            </span>
          </motion.div>
          
          {/* Headline */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[2.5rem] md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-[1.15] tracking-tight mb-8"
          >
            {headline}
          </motion.h2>

          {/* Body Text */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base font-normal text-text-secondary leading-relaxed max-w-md mb-12"
          >
            {bodyText}
          </motion.p>

          {/* Meeting Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-4 p-5 rounded-xl border border-border-default bg-surface/50 max-w-md"
          >
            <Calendar className="w-5 h-5 text-brand shrink-0 mt-0.5" />
            <p className="text-sm font-normal text-text-secondary leading-relaxed">
              {meetingAction}{' '}
              <a href="#" className="text-brand font-medium hover:text-brand-hover hover:underline inline-flex items-center gap-1 transition-colors">
                {meetingLink} <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </p>
          </motion.div>
        </div>

        {/* Right Column: Glass Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative w-full"
        >
          <div className="relative z-10 p-8 md:p-12 rounded-3xl border border-border-default bg-surface-elevated/80 backdrop-blur-xl shadow-card flex flex-col">
            
            <span className="text-xs font-bold text-brand uppercase tracking-wider mb-6 block">
              {emailLabel}
            </span>
            
            {/* Email Action */}
            <div className="flex flex-wrap sm:flex-nowrap items-end justify-between border-b border-brand pb-3 mb-10 gap-4">
              <a 
                href={`mailto:${email}`} 
                className="text-2xl sm:text-3xl lg:text-[1.75rem] font-medium text-foreground hover:text-brand transition-colors break-all"
              >
                {email}
              </a>
              <div className="flex items-center gap-4 text-text-muted shrink-0 pb-1">
                <a href={`mailto:${email}`} aria-label="Open email client">
                  <ArrowUpRight className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
                </a>
                <button onClick={handleCopy} aria-label="Copy email address" className="hover:text-foreground transition-colors relative">
                  <Copy className="w-5 h-5" />
                  {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-foreground text-background px-2 py-1 rounded">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Socials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {SOCIALS.map((social) => {
                const url = socialLinks[social.name as keyof typeof socialLinks] || '#';
                return (
                  <a 
                    key={social.name} 
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 rounded-2xl border border-border-default bg-background hover:border-border-strong transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div style={{ color: social.color }}>
                        {social.icon}
                      </div>
                      <span className="text-sm font-medium text-text-primary group-hover:text-foreground transition-colors">
                        {social.name}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-foreground transition-colors" />
                  </a>
                );
              })}
            </div>

            {/* Bottom Note */}
            <p className="text-sm font-normal text-text-muted leading-relaxed">
              {bottomNote}
            </p>
          </div>

          {/* 3D Decorative Shape overlapping the bottom right */}
          <div className="absolute -bottom-16 -right-16 z-0 opacity-80 pointer-events-none hidden md:block">
            <DecorativeShape shape="icosahedron" position="bottom-right" size={280} isDark={isDark} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}