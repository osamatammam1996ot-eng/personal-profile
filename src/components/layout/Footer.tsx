import { useFooterContent } from '../../content/footer';
import { scrollToSection } from '../../lib/scroll';

export function Footer() {
  const { copyright, links } = useFooterContent();

  return (
    <footer className="w-full py-7 bg-surface-raised">
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-on-brand text-xs font-bold bg-brand-gradient"
          >
            OT
          </div>
          <p className="text-base font-normal text-footer-text">
            {copyright}
          </p>
        </div>

        {/* Right */}
        <nav className="flex items-center gap-1">
          {links.map(({ label, target }) => (
            <button
              key={target}
              onClick={() => scrollToSection(target)}
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