import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CTAButton } from '../ui/cta-button';
import { IconButton } from '../ui/icon-button';
import { submitFeedbackAction } from '../../app/actions/feedback';

const NAME_MIN = 2, COMMENT_MIN = 10, COMMENT_MAX = 1000;

type Status = 'idle' | 'sending' | 'sent' | 'invalid' | 'rate_limited' | 'unavailable';

const fieldClasses =
  'w-full rounded-xl bg-surface border border-text-primary/15 px-4 py-3 text-base text-text-primary placeholder:text-text-faint ' +
  'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30';

export function FeedbackDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { isRTL, t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<Status>('idle');
  // Portal target only exists in the browser; render nothing until mounted so hydration matches
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const canSend = name.trim().length >= NAME_MIN && comment.trim().length >= COMMENT_MIN && status !== 'sending';

  // Focus the first field, lock page scroll, Esc closes, Tab stays inside the dialog
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const focusTimer = setTimeout(() => nameRef.current?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && status !== 'sending') onClose();
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const items = dialogRef.current.querySelectorAll<HTMLElement>('input:not([tabindex="-1"]), textarea, button:not([disabled])');
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(focusTimer);
      document.documentElement.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, status]);

  // A fresh, empty form every time it opens after a successful send
  useEffect(() => {
    if (open && status === 'sent') {
      setName(''); setComment(''); setWebsite(''); setStatus('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    setStatus('sending');
    const res = await submitFeedbackAction({ name, comment, website }).catch(() => ({ error: 'unavailable' as const }));
    setStatus('success' in res ? 'sent' : res.error);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="feedback-dialog"
          dir={isRTL ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-scrim/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget && status !== 'sending') onClose(); }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            className="relative w-full max-w-[520px] rounded-3xl bg-surface-card border border-text-primary/10 shadow-raised p-6 sm:p-8"
            initial={reduceMotion ? false : { y: 24, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <IconButton onClick={onClose} aria-label={t.feedback.close} className="absolute top-4 end-4">
              <X size={18} />
            </IconButton>

            {status === 'sent' ? (
              <div className="flex flex-col items-start gap-4 pt-2" aria-live="polite">
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand/15 text-brand-text">
                  <Check size={22} />
                </span>
                <h2 id="feedback-title" className="m-0 font-heading font-bold text-2xl text-text-primary">
                  {t.feedback.thanks(name.trim().split(' ')[0])}
                </h2>
                <p className="m-0 text-base leading-relaxed text-text-secondary">{t.feedback.sent}</p>
                <CTAButton onClick={onClose} className="mt-2">{t.feedback.close}</CTAButton>
              </div>
            ) : (
              <form onSubmit={send} noValidate className="flex flex-col gap-5">
                <div className="pe-8">
                  <h2 id="feedback-title" className="m-0 font-heading font-bold text-2xl text-text-primary">{t.feedback.title}</h2>
                  <p className="m-0 mt-2 text-base leading-relaxed text-text-muted">{t.feedback.sub}</p>
                </div>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-text-secondary">{t.feedback.name}</span>
                  <input
                    ref={nameRef}
                    type="text"
                    autoComplete="name"
                    maxLength={80}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.feedback.namePh}
                    className={fieldClasses}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="flex items-baseline justify-between text-sm font-semibold text-text-secondary">
                    {t.feedback.comment}
                    <span className="text-xs font-normal text-text-faint tabular-nums">{comment.length}/{COMMENT_MAX}</span>
                  </span>
                  <textarea
                    rows={5}
                    maxLength={COMMENT_MAX}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t.feedback.commentPh}
                    className={`${fieldClasses} resize-none leading-relaxed`}
                  />
                </label>

                {/* Honeypot: hidden from people, filled by bots */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="absolute -left-[9999px] size-px opacity-0"
                />

                {(status === 'invalid' || status === 'rate_limited' || status === 'unavailable') && (
                  <p role="alert" className="m-0 text-sm text-danger">{t.feedback[status]}</p>
                )}

                <div className="flex items-center justify-end gap-3 pt-1">
                  <CTAButton type="button" variant="secondary" onClick={onClose} disabled={status === 'sending'}>
                    {t.feedback.cancel}
                  </CTAButton>
                  <CTAButton type="submit" disabled={!canSend} className="disabled:opacity-50 disabled:cursor-not-allowed">
                    {status === 'sending' ? t.feedback.sending : t.feedback.send}
                  </CTAButton>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
