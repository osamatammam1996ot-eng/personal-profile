"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";

export function CustomCursor() {
  const [portfolioHoverVisible, setPortfolioHoverVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea, select, [role="button"], [role="tab"]')) {
        setIsHoveringLink(true);
      } else {
        setIsHoveringLink(false);
      }
    };

    const handlePortfolioHover = (e: Event) => {
      const customEvent = e as CustomEvent;
      setPortfolioHoverVisible(customEvent.detail);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("portfolioHover", handlePortfolioHover);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("portfolioHover", handlePortfolioHover);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <AnimatePresence>
        {portfolioHoverVisible && (
          <motion.div
            key="custom-cursor-portfolio"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed z-[9999] pointer-events-none flex items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-hover opacity-90 backdrop-blur-sm shadow-[0_8px_30px_var(--color-brand)]"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: "-50%",
              translateY: "-50%",
              width: 80,
              height: 80,
            }}
          >
            <span className="text-white text-center tracking-wider leading-snug font-semibold text-[0.62rem]">
              View<br />Project
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none drop-shadow-cursor"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          opacity: portfolioHoverVisible ? 0 : 1,
        }}
        transition={{ opacity: { duration: 0.15 } }}
      >
        <svg
          width={isHoveringLink ? 48 : 30}
          height={isHoveringLink ? 48 : 30}
          viewBox="0 0 100 100"
          className="transition-all duration-300"
        >
          <polygon
            points="50,5 88.97,27.5 88.97,72.5 50,95 11.03,72.5 11.03,27.5"
            className={`stroke-cursor-glow stroke-[8px] transition-all duration-300 ${isHoveringLink ? 'fill-cursor-glow/50' : 'fill-cursor-glow/10'}`}
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </>
  );
}
