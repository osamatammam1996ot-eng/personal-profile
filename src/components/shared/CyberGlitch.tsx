'use client';

import { useEffect, useState } from 'react';

export function CyberGlitch() {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchPosition, setGlitchPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Don't trigger if we clicked an interactive element
      const target = e.target as HTMLElement;
      
      const isInteractive = target.closest(
        'a, button, input, textarea, select, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])'
      );

      if (isInteractive) {
        return;
      }

      // Allow both left and right clicks
      if (e.button !== 0 && e.button !== 2) return;
      
      if (e.button === 2) {
        e.preventDefault(); // Prevent context menu on non-interactive areas if right click
      }

      setGlitchPosition({ x: e.clientX, y: e.clientY });
      setIsGlitching(true);

      // Add glitch class to body
      document.body.classList.add('cyber-glitch-active');

      setTimeout(() => {
        setIsGlitching(false);
        document.body.classList.remove('cyber-glitch-active');
      }, 400); // 400ms glitch duration
    };

    const handleContextMenu = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isInteractive = target.closest(
          'a, button, input, textarea, select, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])'
        );
        if (!isInteractive) {
            e.preventDefault();
        }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('contextmenu', handleContextMenu);
    return () => {
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  if (!isGlitching) return null;

  return (
    <>
      {/* SVG Filter for RGB Split */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <filter id="cyber-glitch-filter">
          <feOffset dx="8" dy="-2" in="SourceGraphic" result="red-shift"/>
          <feOffset dx="-8" dy="2" in="SourceGraphic" result="blue-shift"/>
          <feOffset dx="0" dy="0" in="SourceGraphic" result="green-shift"/>
          
          <feComponentTransfer in="red-shift" result="red">
            <feFuncR type="identity"/>
            <feFuncG type="discrete" tableValues="0"/>
            <feFuncB type="discrete" tableValues="0"/>
          </feComponentTransfer>
          
          <feComponentTransfer in="blue-shift" result="blue">
            <feFuncR type="discrete" tableValues="0"/>
            <feFuncG type="discrete" tableValues="0"/>
            <feFuncB type="identity"/>
          </feComponentTransfer>
          
          <feComponentTransfer in="green-shift" result="green">
            <feFuncR type="discrete" tableValues="0"/>
            <feFuncG type="identity"/>
            <feFuncB type="discrete" tableValues="0"/>
          </feComponentTransfer>
          
          <feBlend mode="screen" in="red" in2="blue" result="blend1"/>
          <feBlend mode="screen" in="blend1" in2="green" result="blend2"/>
        </filter>
      </svg>

      {/* Screen Overlay (Scanlines + CRT Flicker) */}
      <div className="fixed inset-0 pointer-events-none z-[9999] glitch-scanlines" />
      
      {/* Localized Glow at click point */}
      <div
        className="fixed pointer-events-none z-[9999] size-[300px] glitch-burst"
        style={{ left: glitchPosition.x, top: glitchPosition.y }}
      />
    </>
  );
}
