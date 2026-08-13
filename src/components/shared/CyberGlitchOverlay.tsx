"use client";

import React, { useEffect, useState, useRef } from "react";

export function CyberGlitchOverlay() {
  const [glitchActive, setGlitchActive] = useState(false);
  const [glitchOrigin, setGlitchOrigin] = useState<string>("center");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Determine the origin zone (3x3 grid) based on click coordinates
    const getOriginClass = (clientX: number, clientY: number) => {
      const { innerWidth, innerHeight } = window;
      const xPercent = clientX / innerWidth;
      const yPercent = clientY / innerHeight;

      let yZone = "center";
      if (yPercent < 0.33) yZone = "top";
      else if (yPercent > 0.66) yZone = "bottom";

      let xZone = "center";
      if (xPercent < 0.33) xZone = "left";
      else if (xPercent > 0.66) xZone = "right";

      if (yZone === "center" && xZone === "center") return "center";
      return `${yZone}-${xZone}`;
    };

    const handleContextMenu = (e: MouseEvent) => {
      // Allow Shift + right-click as an accessibility escape hatch
      if (e.shiftKey) return;

      // Allow if text is selected
      if (window.getSelection()?.toString()) return;

      const target = e.target as HTMLElement;
      
      // Strict exclusion of interactive elements
      const interactiveSelector = `
        a, button, input, textarea, select, label, 
        [role="button"], [role="link"], [role="tab"], 
        [contenteditable], iframe, img, video, audio, dialog, 
        [data-no-glitch], [role="menu"], [role="menuitem"]
      `;
      
      if (target.closest(interactiveSelector)) return;

      // Safe to trigger the glitch, prevent default context menu
      e.preventDefault();
      
      const origin = getOriginClass(e.clientX, e.clientY);
      setGlitchOrigin(origin);
      setGlitchActive(true);

      // Add glitch class to the document body so we can skew/filter the whole layout wrapper
      document.body.classList.add("is-glitching");

      // Cleanup
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setGlitchActive(false);
        document.body.classList.remove("is-glitching");
      }, 450); // Glitch duration fallback (matching CSS duration)
    };

    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.body.classList.remove("is-glitching");
    };
  }, []);

  if (!glitchActive) return null;

  return (
    <div 
      className="glitch-overlay" 
      aria-hidden="true" 
      data-no-glitch="true"
    >
      <div className="glitch-scanlines" />
      <div className={`glitch-flash glitch-origin-${glitchOrigin}`} />
    </div>
  );
}
