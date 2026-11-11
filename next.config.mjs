import { readFileSync } from 'fs';

// Hosts the image resizer may fetch from: our Supabase storage plus src/config/image-hosts.json
// (src/lib/image-hosts.ts builds the same list). Never use a wildcard here: it turns
// /_next/image into an open proxy that anyone can run up our bill with.
const extraImageHosts = JSON.parse(readFileSync(new URL('./src/config/image-hosts.json', import.meta.url), 'utf-8'));
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const imageHosts = [...extraImageHosts, ...(supabaseUrl ? [new URL(supabaseUrl).hostname] : [])];

const securityHeaders = [
  // Don't let other sites put this one (and its admin login) inside a frame
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  // Browsers must not guess file types
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // The site uses none of these device features
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: imageHosts.map((hostname) => ({ protocol: 'https', hostname })),
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
