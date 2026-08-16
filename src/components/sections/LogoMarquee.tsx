import { useCms } from '../../contexts/CmsContext';
import Image from 'next/image';

interface LogoMarqueeProps {
  isDark: boolean;
}

export function LogoMarquee({ isDark }: LogoMarqueeProps) {
  const { cmsData } = useCms();

  if (!cmsData?.sections.logoMarquee) return null;

  const logos = cmsData.logoMarquee?.filter((l: any) => l.visible) || [];
  if (logos.length === 0) return null;

  // Duplicate the logos multiple times to ensure the screen is filled
  // and the seamless loop (-50% translation) works flawlessly on ultra-wide screens.
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <section className="w-full overflow-hidden border-y border-white/5 py-8 md:py-12 bg-transparent relative z-10 flex items-center">
      {/* Optional gradient masks on edges for fade-out effect */}
      <div 
        className="absolute inset-y-0 left-0 w-16 md:w-32 z-20 pointer-events-none"
        style={{
          background: isDark 
            ? 'linear-gradient(to right, rgba(8,8,16,1) 0%, rgba(8,8,16,0) 100%)' 
            : 'linear-gradient(to right, rgba(245,245,250,1) 0%, rgba(245,245,250,0) 100%)'
        }}
      />
      <div 
        className="absolute inset-y-0 right-0 w-16 md:w-32 z-20 pointer-events-none"
        style={{
          background: isDark 
            ? 'linear-gradient(to left, rgba(8,8,16,1) 0%, rgba(8,8,16,0) 100%)' 
            : 'linear-gradient(to left, rgba(245,245,250,1) 0%, rgba(245,245,250,0) 100%)'
        }}
      />

      <div className="flex w-max animate-logo-marquee items-center gap-16 md:gap-24 px-8 md:px-12">
        {duplicatedLogos.map((logo, idx) => {
          const LogoElement = (
            <div className="flex items-center justify-center grayscale-[50%] opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100 flex-shrink-0 relative h-8 md:h-10 w-32">
              <Image 
                src={logo.url} 
                alt={logo.name} 
                fill
                className="object-contain"
                sizes="128px"
              />
            </div>
          );

          return (
            <div key={`${logo.id}-${idx}`}>
              {logo.href ? (
                <a href={logo.href} target="_blank" rel="noopener noreferrer" className="block focus:outline-none focus:ring-2 focus:ring-brand rounded-lg">
                  {LogoElement}
                </a>
              ) : (
                LogoElement
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
