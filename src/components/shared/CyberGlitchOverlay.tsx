"use client";

import React, { useEffect, useState, useRef } from "react";

const INTERACTIVE_SELECTOR = `
  a, button, input, textarea, select, label, 
  iframe, img, picture, video, audio, canvas, dialog, summary,
  [role="button"], [role="link"], [role="tab"], 
  [role="menu"], [role="menuitem"], [contenteditable="true"], 
  [data-no-glitch]
`;

export function CyberGlitchOverlay() {
  const [active, setActive] = useState(false);
  const [origin, setOrigin] = useState("center");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const raf1Ref = useRef<number | null>(null);
  const raf2Ref = useRef<number | null>(null);

  useEffect(() => {
    const getOrigin = (clientX: number, clientY: number) => {
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
      
      // Prevent crash if target is not an Element (e.g. text node edge case)
      if (!(target instanceof Element)) return;

      // Strict exclusion of interactive elements
      if (target.closest(INTERACTIVE_SELECTOR)) return;
      
      // Exclude overlay itself
      if (target.closest('.glitch-overlay')) return;
      
      // Respect mouse devices (not touch holding)
      // e.pointerType exists on PointerEvent but not standard MouseEvent, we can assume standard contextmenu is fine if it bubbles here,
      // but to be safe, if we get touch contextmenu we don't necessarily prevent it unless it's standard right click
      // We will assume `contextmenu` is fine.

      if (e.defaultPrevented) return;

      // Safe to trigger the glitch, prevent default context menu
      e.preventDefault();

      // Clear timers and animation frames for rapid clicking
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (raf1Ref.current) cancelAnimationFrame(raf1Ref.current);
      if (raf2Ref.current) cancelAnimationFrame(raf2Ref.current);

      document.documentElement.classList.remove("is-glitching");

      const newOrigin = getOrigin(e.clientX, e.clientY);
      setOrigin(newOrigin);
      setActive(true);

      // Force reflow and restart animation safely
      raf1Ref.current = requestAnimationFrame(() => {
        raf2Ref.current = requestAnimationFrame(() => {
          document.documentElement.classList.add("is-glitching");
        });
      });

      timeoutRef.current = setTimeout(() => {
        document.documentElement.classList.remove("is-glitching");
        setActive(false);
      }, 450); // Glitch duration fallback
    };

    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (raf1Ref.current) cancelAnimationFrame(raf1Ref.current);
      if (raf2Ref.current) cancelAnimationFrame(raf2Ref.current);
      document.documentElement.classList.remove("is-glitching");
    };
  }, []);

  return (
    <div
      className="glitch-overlay"
      data-active={active ? "true" : "false"}
      data-origin={origin}
      data-no-glitch
      aria-hidden="true"
    >
      <div className="glitch-overlay__chromatic" />
      <div className="glitch-overlay__slice glitch-overlay__slice--one" />
      <div className="glitch-overlay__slice glitch-overlay__slice--two" />
      <div className="glitch-overlay__slice glitch-overlay__slice--three" />
      <div className="glitch-overlay__scanlines" />
      <div className="glitch-overlay__flash" />
    </div>
  );
}
