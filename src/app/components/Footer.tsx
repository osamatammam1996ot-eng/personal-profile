import { useLanguage } from '../contexts/LanguageContext';
import { useCms } from '../contexts/CmsContext';

interface FooterProps {
  isDark: boolean;
}

const LINK_HREFS = ['#home', '#work', '#why-me', '#contact'];

export function Footer({ isDark }: FooterProps) {
  const { lang, fontBody, fontHeading } = useLanguage();
  const { cmsData } = useCms();
  const dark = isDark;

  const scrollTo = (href: string) => {
    const el = document.getElementById(href.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      className="w-full py-7 border-t"
      style={{
        background: dark ? '#080810' : '#f5f5fa',
        borderColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', fontSize: '0.68rem', fontFamily: fontHeading, fontWeight: 700 }}
          >
            OT
          </div>
          <p style={{ fontFamily: fontBody, fontWeight: 400, fontSize: '0.85rem', color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
            {cmsData.footer.copyright[lang] || (lang === 'en' ? '© 2026 Osama Tammam. All rights reserved.' : '© 2026 أسامة تمام. جميع الحقوق محفوظة.')}
          </p>
        </div>

        {/* Right */}
        <nav className="flex items-center gap-1">
          {(cmsData.footer.links[lang] || (lang === 'en' ? ['Home', 'Work', 'About', 'Contact'] : ['الرئيسية', 'الأعمال', 'عني', 'تواصل'])).map((label, i) => (
            <button
              key={LINK_HREFS[i]}
              onClick={() => scrollTo(LINK_HREFS[i])}
              className="px-3 py-1.5 rounded-lg transition-colors duration-150"
              style={{ fontFamily: fontBody, fontWeight: 500, fontSize: '0.85rem', color: dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)' }}
              onMouseEnter={e => (e.currentTarget.style.color = dark ? '#a5b4fc' : '#6366f1')}
              onMouseLeave={e => (e.currentTarget.style.color = dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)')}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </footer>
  );
}