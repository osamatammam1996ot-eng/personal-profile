import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useCms } from '../../contexts/CmsContext';
import { useLanguage } from '../../contexts/LanguageContext';

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
        style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <button onClick={onClose} style={{ position: 'fixed', top: 32, right: 32, width: 40, height: 40, borderRadius: 8, background: 'rgba(99,102,241,0.1)', color: 'var(--brand)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        <p style={{ color: 'var(--text-primary)' }}>Case study media not found.</p>
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
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 80, zIndex: 210,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="text-xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {data.title}
          </span>
          <span className="text-base" style={{ color: 'var(--text-muted)' }}>
            {currentIndex + 1} / {media.length || 1}
          </span>
        </div>
        
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff', transition: 'background 0.2s'
          }}
        >
          <X size={20} />
        </motion.button>
      </div>

      {/* Main Slider Area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {media.length > 1 && (
          <motion.button
            onClick={isRTL ? handleNext : handlePrev}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            className="absolute z-[210] flex items-center justify-center rounded-full bg-black/50 border border-white/10 text-white backdrop-blur-md cursor-pointer bottom-[110px] left-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-[32px] w-[48px] h-[48px] md:w-[56px] md:h-[56px]"
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
                style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
              >
                {!loaded[currentIndex] && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader2 size={32} color="var(--brand)" className="animate-spin" />
                  </div>
                )}
                
                {currentMedia.type === 'image' && (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image
                      src={currentMedia.url}
                      alt={`${data.title} media ${currentIndex + 1}`}
                      fill
                      sizes="100vw"
                      onLoad={() => handleMediaLoad(currentIndex)}
                      style={{
                        objectFit: 'contain',
                        borderRadius: 16, boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
                        opacity: loaded[currentIndex] ? 1 : 0, transition: 'opacity 0.3s ease'
                      }}
                    />
                  </div>
                )}

                {currentMedia.type === 'video' && (
                  <div style={{ width: '100%', height: '100%', maxWidth: 1600, maxHeight: 900, borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)', background: '#000' }}>
                    {isYouTube ? (
                      <iframe
                        src={currentMedia.url.replace('watch?v=', 'embed/').split('&')[0] + '?autoplay=1&rel=0&modestbranding=1'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => handleMediaLoad(currentIndex)}
                        style={{ width: '100%', height: '100%', border: 'none', opacity: loaded[currentIndex] ? 1 : 0, transition: 'opacity 0.3s ease' }}
                      />
                    ) : (
                      <video
                        src={currentMedia.url}
                        controls
                        autoPlay
                        onLoadedData={() => handleMediaLoad(currentIndex)}
                        style={{ width: '100%', height: '100%', outline: 'none', opacity: loaded[currentIndex] ? 1 : 0, transition: 'opacity 0.3s ease' }}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>No media available for this project.</div>
            )}
          </AnimatePresence>
        </div>

        {media.length > 1 && (
          <motion.button
            onClick={isRTL ? handlePrev : handleNext}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            className="absolute z-[210] flex items-center justify-center rounded-full bg-black/50 border border-white/10 text-white backdrop-blur-md cursor-pointer bottom-[110px] right-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:right-[32px] w-[48px] h-[48px] md:w-[56px] md:h-[56px]"
          >
            <ChevronRight size={28} />
          </motion.button>
        )}
      </div>

      {/* Thumbnail Strip */}
      {media.length > 1 && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, zIndex: 210,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, paddingBottom: 24
        }}>
          {media.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: 60, height: 40, borderRadius: 6, overflow: 'hidden', padding: 0,
                border: currentIndex === idx ? '2px solid var(--brand)' : '2px solid transparent',
                background: 'rgba(255,255,255,0.1)', cursor: 'pointer',
                opacity: currentIndex === idx ? 1 : 0.5, transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {item.type === 'image' ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image src={item.url} alt="thumbnail" fill sizes="60px" style={{ objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222' }}>
                  <span className="text-xs font-semibold text-white">VIDEO</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
