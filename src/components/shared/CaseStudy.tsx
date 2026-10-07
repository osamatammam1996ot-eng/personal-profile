import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useCms } from '../../contexts/CmsContext';
import { useLanguage } from '../../contexts/LanguageContext';

// Prev/next arrows over the media viewer
const NAV_BUTTON = 'absolute z-[210] flex items-center justify-center rounded-full bg-scrim/50 border border-on-media/10 text-on-media backdrop-blur-md cursor-pointer hover:bg-on-media/10 transition-colors bottom-[110px] md:bottom-auto md:top-1/2 md:-translate-y-1/2 size-12 md:size-14';

interface CaseStudyProps {
  projectId: number;
  projectTitle: string;
  onClose: () => void;
}

export function CaseStudy({ projectId, onClose }: CaseStudyProps) {
  const { cmsData } = useCms();
  const { lang, isRTL } = useLanguage();
  
  const rawData = cmsData.caseStudies?.find(c => c.id === projectId);
  
  const data = rawData ? {
    ...rawData,
    title: (rawData.title && typeof rawData.title === 'object' && ('en' in rawData.title || 'ar' in rawData.title)) 
      ? (rawData.title[lang] || rawData.title.en || '') 
      : rawData.title,
  } : null;

  const media = data?.media || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentIndex, media.length]);

  const handleNext = () => {
    if (media.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % media.length);
    }
  };

  const handlePrev = () => {
    if (media.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
    }
  };

  const handleMediaLoad = (idx: number) => {
    setLoaded(prev => ({ ...prev, [idx]: true }));
  };

  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
      >
        <button
          onClick={onClose}
          className="fixed top-8 right-8 size-10 rounded-lg flex items-center justify-center border-none cursor-pointer bg-brand/10 text-brand"
        >
          ✕
        </button>
        <p className="text-text-primary">Case study media not found.</p>
      </motion.div>
    );
  }

  const currentMedia = media[currentIndex];
  
  // Helper to detect youtube vs direct mp4
  const isYouTube = currentMedia?.url?.includes('youtube.com') || currentMedia?.url?.includes('youtu.be');

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[200] flex flex-col bg-overlay"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-20 z-[210] flex items-center justify-between px-8 scrim-fade-down">
        <div className="flex items-center gap-4">
          <span className="text-xl font-semibold tracking-tight text-text-primary">
            {data.title}
          </span>
          <span className="text-base text-text-muted">
            {currentIndex + 1} / {media.length || 1}
          </span>
        </div>

        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="size-11 rounded-full flex items-center justify-center cursor-pointer text-text-primary bg-on-media/5 border border-on-media/10 hover:bg-on-media/10 transition-colors duration-200"
        >
          <X size={20} />
        </motion.button>
      </div>

      {/* Main Slider Area */}
      <div className="flex-1 relative flex items-center justify-center">

        {media.length > 1 && (
          <motion.button
            onClick={isRTL ? handleNext : handlePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`${NAV_BUTTON} left-4 md:left-[32px]`}
          >
            <ChevronLeft size={28} />
          </motion.button>
        )}

        <div className={`absolute top-[80px] left-0 right-0 md:left-[100px] md:right-[100px] flex items-center justify-center ${media.length > 1 ? 'bottom-[170px] md:bottom-[120px]' : 'bottom-[40px]'}`}>
          <AnimatePresence mode="wait">
            {currentMedia ? (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.98, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 1.02, x: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative size-full flex items-center justify-center"
              >
                {!loaded[currentIndex] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 size={32} className="animate-spin text-brand" />
                  </div>
                )}

                {currentMedia.type === 'image' && (
                  <div className="relative size-full">
                    <Image
                      src={currentMedia.url}
                      alt={`${data.title} media ${currentIndex + 1}`}
                      fill
                      sizes="100vw"
                      onLoad={() => handleMediaLoad(currentIndex)}
                      className={`object-contain rounded-2xl shadow-media transition-opacity duration-300 ${loaded[currentIndex] ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </div>
                )}

                {currentMedia.type === 'video' && (
                  <div className="size-full max-w-[1600px] max-h-[900px] rounded-2xl overflow-hidden shadow-media bg-surface">
                    {isYouTube ? (
                      <iframe
                        src={currentMedia.url.replace('watch?v=', 'embed/').split('&')[0] + '?autoplay=1&rel=0&modestbranding=1'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => handleMediaLoad(currentIndex)}
                        className={`size-full border-none transition-opacity duration-300 ${loaded[currentIndex] ? 'opacity-100' : 'opacity-0'}`}
                      />
                    ) : (
                      <video
                        src={currentMedia.url}
                        controls
                        autoPlay
                        onLoadedData={() => handleMediaLoad(currentIndex)}
                        className={`size-full outline-none transition-opacity duration-300 ${loaded[currentIndex] ? 'opacity-100' : 'opacity-0'}`}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-text-muted">No media available for this project.</div>
            )}
          </AnimatePresence>
        </div>

        {media.length > 1 && (
          <motion.button
            onClick={isRTL ? handlePrev : handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`${NAV_BUTTON} right-4 md:right-[32px]`}
          >
            <ChevronRight size={28} />
          </motion.button>
        )}
      </div>

      {/* Thumbnail Strip */}
      {media.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-[100px] z-[210] flex items-center justify-center gap-3 pb-6 scrim-fade-up">
          {media.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-[60px] h-10 rounded-md overflow-hidden p-0 cursor-pointer flex items-center justify-center bg-on-media/10 border-2 transition-all duration-200 ${
                currentIndex === idx ? 'border-brand opacity-100' : 'border-transparent opacity-50'
              }`}
            >
              {item.type === 'image' ? (
                <div className="relative size-full">
                  <Image src={item.url} alt="thumbnail" fill sizes="60px" className="object-cover" />
                </div>
              ) : (
                <div className="size-full flex items-center justify-center bg-surface-elevated">
                  <span className="text-xs font-semibold text-on-media">VIDEO</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
