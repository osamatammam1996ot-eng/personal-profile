import extraHosts from '../config/image-hosts.json';

// The site's image resizer (/_next/image) only accepts images from these hosts: our own
// Supabase storage plus src/config/image-hosts.json. next.config.mjs builds the same list.
// Without the limit anyone could use the site as a free image proxy on our bill.

function supabaseHost(): string | null {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').hostname;
  } catch {
    return null;
  }
}

const ALLOWED = new Set<string>([...extraHosts, ...(supabaseHost() ? [supabaseHost()!] : [])]);

/**
 * Whether next/image may resize this image. Local files always can; a remote image from a
 * host outside the list is shown as-is instead (pass `unoptimized={!canOptimize(src)}`),
 * so an image URL pasted into the admin from any site still works.
 */
export function canOptimize(src: string): boolean {
  if (!/^https?:\/\//i.test(src)) return true;
  try {
    const url = new URL(src);
    return url.protocol === 'https:' && ALLOWED.has(url.hostname);
  } catch {
    return false;
  }
}
