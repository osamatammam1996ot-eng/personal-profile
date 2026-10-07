"use client";

import React from 'react';

export function DashboardBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-admin-base">
      {/* Dynamic Animated Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob-1 bg-admin-blob-1" />
      <div className="absolute top-1/3 right-1/4 w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-blob-2 bg-admin-blob-2" />
      <div className="absolute bottom-1/4 left-1/3 w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full mix-blend-screen filter blur-[90px] opacity-60 animate-blob-3 bg-admin-blob-3" />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 admin-vignette" />

      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay animate-noise admin-noise" />
    </div>
  );
}
