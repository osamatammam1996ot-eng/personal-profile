import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';

interface FooterProps {
  isDark: boolean;
}

const LINK_HREFS = ['#home', '#work', '#why-me', '#contact'];

export function Footer({ isDark }: FooterProps) {
  const { lang, fontBody, fontHeading } = useLanguage();
  const { cmsData } = useCms();

  const scrollTo = (href: string) => {
    const el = document.getElementById(href.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="w-full py-7 border-t bg-surface-raised border-border-default">
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-on-brand text-xs font-bold bg-brand-gradient"
          >
            OT
          </div>
          <p className="text-base font-normal text-footer-text">
            {cmsData.footer.copyright[lang] || (lang === 'en' ? '© 2026 Osama Tammam. All rights reserved.' : '© 2026 أسامة تمام. جميع الحقوق محفوظة.')}
          </p>
        </div>

        {/* Right */}
        <nav className="flex items-center gap-1">
          {(cmsData.footer.links[lang] || (lang === 'en' ? ['Home', 'Work', 'About', 'Contact'] : ['الرئيسية', 'الأعمال', 'عني', 'تواصل'])).map((label: any, i: number) => (
            <button
              key={LINK_HREFS[i]}
              onClick={() => scrollTo(LINK_HREFS[i])}
              className="px-3 py-1.5 rounded-lg transition-colors duration-150 text-base font-medium text-footer-link hover:text-nav-link-active"
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </footer>
  );
}