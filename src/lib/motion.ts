/**
 * Scroll reveal for section headers: fades up once as it enters the viewport.
 * Spread onto any motion element and stagger with the delay: <motion.p {...revealUp(0.1)}>
 */
export const revealUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});
