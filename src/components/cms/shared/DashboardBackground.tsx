"use client";

import React from 'react';

export function DashboardBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-admin-base">
      {/* Dynamic Animated Blobs */}
      <div 
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob-1"
        style={{ background: 'var(--admin-blob-1)' }}
      />
      <div 
        className="absolute top-1/3 right-1/4 w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-blob-2"
        style={{ background: 'var(--admin-blob-2)' }}
      />
      <div 
        className="absolute bottom-1/4 left-1/3 w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full mix-blend-screen filter blur-[90px] opacity-60 animate-blob-3"
        style={{ background: 'var(--admin-blob-3)' }}
      />
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#03020c_120%)]" />

      {/* Subtle Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay animate-noise"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '150px 150px'
        }}
      />
    </div>
  );
}
