/**
 * Phones (and small touch tablets): touch-first screens up to 1024px wide.
 * Used to lower rendering cost where the GPU is weakest. Keep in sync with the
 * `phone` media query in src/styles/index.css.
 */
export const PHONE_MEDIA_QUERY = '(pointer: coarse) and (max-width: 1024px)';

export function isPhone(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(PHONE_MEDIA_QUERY).matches;
}
