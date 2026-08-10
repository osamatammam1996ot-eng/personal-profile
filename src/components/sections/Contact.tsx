import { motion } from 'motion/react';
import { DecorativeShape } from '../shared/DecorativeShape';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';

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
    href: 'https://wa.me/1234567890',
    color: '#25D366',
    border: 'rgba(37,211,102,0.25)',
    glow: 'rgba(37,211,102,0.35)',
  },
  {
    name: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    href: 'https://linkedin.com',
    color: '#0A66C2',
    border: 'rgba(10,102,194,0.25)',
    glow: 'rgba(10,102,194,0.35)',
  },
  {
    name: 'Behance',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.336.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1.0-1.16 1.35-.49.36-1.06.62-1.7.78-.64.16-1.3.24-1.99.24H0V4.51h6.938v-.007zm-.34 5.32c.584 0 1.054-.14 1.41-.43.354-.28.53-.72.53-1.31 0-.32-.06-.59-.18-.8-.12-.21-.27-.38-.47-.5-.2-.13-.43-.21-.68-.26-.27-.05-.53-.08-.82-.08H3.5v3.38h3.1zm.19 5.63c.32 0 .62-.03.9-.1.28-.07.53-.18.74-.33.21-.16.38-.36.5-.62.12-.26.18-.57.18-.94 0-.74-.21-1.28-.63-1.6-.42-.33-.99-.5-1.69-.5H3.5v4.09h3.29zm10.06.27c.41.4.98.6 1.71.6.53 0 .99-.13 1.37-.4.38-.27.61-.55.7-.87h2.52c-.4 1.25-1.02 2.14-1.86 2.67-.83.53-1.84.8-3.02.8-.82 0-1.56-.13-2.21-.4-.65-.27-1.2-.66-1.65-1.15-.45-.5-.8-1.09-1.04-1.79-.24-.69-.36-1.44-.36-2.26 0-.8.12-1.53.37-2.21.25-.68.6-1.27 1.06-1.77.46-.5 1.01-.89 1.66-1.17.64-.28 1.36-.42 2.15-.42.88 0 1.64.16 2.3.5.65.33 1.18.78 1.6 1.35.41.57.71 1.22.88 1.96.18.74.25 1.52.21 2.35h-7.46c.04.87.28 1.5.69 1.91zm2.97-5.11c-.33-.36-.82-.54-1.47-.54-.43 0-.79.07-1.07.22-.28.15-.5.33-.67.55-.17.22-.29.45-.35.69-.07.24-.11.46-.12.66h4.26c-.1-.71-.31-1.22-.58-1.58zM15.54 6.15h5.09v1.35H15.54V6.15z" />
      </svg>
    ),
    href: 'https://behance.net',
    color: '#1769ff',
    border: 'rgba(23,105,255,0.25)',
    glow: 'rgba(23,105,255,0.35)',
  },
  {
    name: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    href: 'https://facebook.com',
    color: '#1877F2',
    border: 'rgba(24,119,242,0.25)',
    glow: 'rgba(24,119,242,0.35)',
  },
];

export function Contact({ isDark }: ContactProps) {
  const { lang, fontHeading, fontBody, isRTL } = useLanguage();
  const { cmsData } = useCms();
  const dark = isDark;

  const email = cmsData.contact.email || 'osama.tammam@email.com';
  const availability = cmsData.contact.availability[lang] || (lang === 'en' ? 'Available for projects' : 'متاح للمشاريع');
  const headline1 = cmsData.contact.headline1[lang] || (lang === 'en' ? "Let's work together" : 'دعنا نعمل معًا');
  const headline2 = cmsData.contact.headline2[lang] || (lang === 'en' ? 'or stay connected ·' : 'أو ابق على تواصل ·');
  const headline3 = cmsData.contact.headline3[lang] || (lang === 'en' ? 'follow.' : 'تابع.');
  const body = cmsData.contact.body[lang] || (lang === 'en' ? 'Have an interesting opportunity?' : 'هل لديك فرصة مثيرة للاهتمام؟');
  const note = cmsData.contact.note[lang] || (lang === 'en' ? 'I typically respond within 24 hours.' : 'أرد عادة خلال 24 ساعة.');
  const emailLabel = cmsData.contact.emailLabel[lang] || (lang === 'en' ? 'Send an email' : 'أرسل بريدًا إلكترونيًا');
  const signoff1 = cmsData.contact.signoff1[lang] || (lang === 'en' ? 'Best,\nOsama.' : 'بأفضل الأحوال،\nأسامة.');
  const signoff2 = cmsData.contact.signoff2[lang] || (lang === 'en' ? 'No meetings. No middlemen. Just me.' : 'لا اجتماعات. لا وسطاء. أنا فقط.');
  const whatsapp = cmsData.contact.socials.whatsapp || 'https://wa.me/1234567890';
  const linkedin = cmsData.contact.socials.linkedin || 'https://linkedin.com';
  const behance = cmsData.contact.socials.behance || 'https://behance.net';
  const facebook = cmsData.contact.socials.facebook || 'https://facebook.com';

  const SOCIALS_DYNAMIC = [
    {
      name: 'WhatsApp',
      icon: SOCIALS.find(s => s.name === 'WhatsApp')!.icon,
      href: whatsapp,
      color: '#25D366', border: 'rgba(37,211,102,0.25)', glow: 'rgba(37,211,102,0.35)',
    },
    {
      name: 'LinkedIn',
      icon: SOCIALS.find(s => s.name === 'LinkedIn')!.icon,
      href: linkedin,
      color: '#0A66C2', border: 'rgba(10,102,194,0.25)', glow: 'rgba(10,102,194,0.35)',
    },
    {
      name: 'Behance',
      icon: SOCIALS.find(s => s.name === 'Behance')!.icon,
      href: behance,
      color: '#1769ff', border: 'rgba(23,105,255,0.25)', glow: 'rgba(23,105,255,0.35)',
    },
    {
      name: 'Facebook',
      icon: SOCIALS.find(s => s.name === 'Facebook')!.icon,
      href: facebook,
      color: '#1877F2', border: 'rgba(24,119,242,0.25)', glow: 'rgba(24,119,242,0.35)',
    },
  ];

  return (
    <section
      id="contact"
      className="relative w-full py-24 md:py-36"
      style={{ background: dark ? '#080810' : '#f5f5fa' }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 600, height: 600,
            background: dark
              ? 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
            left: '-5%', top: '50%',
            transform: 'translateY(-50%)',
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 400, height: 400,
            background: dark
              ? 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
            right: '5%', bottom: '10%',
          }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Decorative 3D shape — top-left */}
      <DecorativeShape
        shape="torusKnot"
        position="top-left"
        size={370}
        cropAmount={32}
        rotationOffset={[0.5, -0.3, 0.4]}
        isDark={dark}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 w-full">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-12 md:gap-0 items-start">

          {/* ── Left: Personal message ── */}
          <div className="md:pe-16">
            {/* Availability pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center gap-2 mb-8"
            >
              <span
                className="relative flex h-2.5 w-2.5"
              >
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: '#22c55e' }}
                />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#22c55e' }} />
              </span>
              <span style={{
                
                fontWeight: 500,
                fontSize: '0.82rem',
                color: dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
                letterSpacing: '0.03em',
              }}>
                {availability}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.4, 0, 0.2, 1] }}
              style={{
                
                fontWeight: 700,
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                color: dark ? '#f0f0ff' : '#0f0f1e',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              {headline1}{' '}
              <span style={{
                background: 'var(--brand-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {headline2}
              </span>
              <br />
              {headline3}
            </motion.h2>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
              className="mt-6"
              style={{
                
                fontWeight: 400,
                fontSize: '1rem',
                lineHeight: 1.8,
                color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                maxWidth: '420px',
              }}
            >
              {body}
            </motion.p>

            {/* Honest micro note */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="mt-8 flex items-start gap-3"
              style={{
                padding: '14px 18px',
                borderRadius: 14,
                background: dark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.06)',
                border: `1px solid ${dark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)'}`,
                maxWidth: '420px',
              }}
            >
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>✦</span>
              <p style={{
                
                fontWeight: 400,
                fontSize: '0.85rem',
                lineHeight: 1.65,
                color: dark ? 'rgba(165,180,252,0.75)' : '#6366f1',
              }}>
                {note}
              </p>
            </motion.div>
          </div>

          {/* ── Vertical divider (desktop only) ── */}
          <motion.div
            className="hidden md:block w-px self-stretch"
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{
              background: dark
                ? 'linear-gradient(to bottom, transparent, rgba(99,102,241,0.3) 30%, rgba(139,92,246,0.3) 70%, transparent)'
                : 'linear-gradient(to bottom, transparent, rgba(99,102,241,0.2) 30%, rgba(139,92,246,0.2) 70%, transparent)',
              transformOrigin: 'top',
            }}
          />

          {/* ── Right: Contact options ── */}
          <div className="flex flex-col gap-5 md:ps-16">

            {/* Email card */}
            <motion.a
              href={`mailto:${email}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="group block rounded-2xl p-6 no-underline"
              style={{
                background: dark
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 100%)',
                border: `1px solid ${dark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.2)'}`,
                textDecoration: 'none',
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: dark
                  ? '0 12px 40px rgba(99,102,241,0.25)'
                  : '0 12px 32px rgba(99,102,241,0.15)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span style={{
                  
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: dark ? 'rgba(165,180,252,0.6)' : 'rgba(99,102,241,0.7)',
                }}>
                  {emailLabel}
                </span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke={dark ? 'rgba(165,180,252,0.5)' : 'rgba(99,102,241,0.5)'}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{
                    transition: 'transform 0.2s ease',
                    transform: isRTL ? 'scaleX(-1)' : 'none',
                  }}
                  className={isRTL
                    ? 'group-hover:-translate-x-1 group-hover:-translate-y-1'
                    : 'group-hover:translate-x-1 group-hover:-translate-y-1'
                  }
                >
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
              <p style={{
                
                fontWeight: 600,
                fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
                color: dark ? '#e0e0ff' : '#0f0f1e',
                wordBreak: 'break-all',
                // Email address always LTR regardless of page dir
                direction: 'ltr',
                textAlign: isRTL ? 'right' : 'left',
              }}>
                {email}
              </p>
            </motion.a>

            {/* Social chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="grid grid-cols-2 gap-3"
            >
              {SOCIALS_DYNAMIC.map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl no-underline"
                  style={{
                    background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    color: social.color,
                    textDecoration: 'none',
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.07, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{
                    scale: 1.04,
                    border: `1px solid ${social.border}`,
                    boxShadow: `0 4px 20px ${social.glow}`,
                  }}
                  whileTap={{ scale: 0.96 }}
                >
                  {social.icon}
                  <span style={{
                    
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: dark ? '#c4c4d4' : '#0f0f1e',
                  }}>
                    {social.name}
                  </span>
                </motion.a>
              ))}
            </motion.div>

            {/* Sign-off */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.45 }}
              style={{
                
                fontWeight: 400,
                fontSize: '0.8rem',
                color: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)',
                lineHeight: 1.6,
                marginTop: 4,
                // Align to start edge (right in RTL, left in LTR)
                textAlign: isRTL ? 'right' : 'left',
              }}
            >
              {signoff1}<br />{signoff2}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}