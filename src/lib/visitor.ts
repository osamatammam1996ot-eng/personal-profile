import { createHash } from 'crypto';
import { headers } from 'next/headers';

/**
 * A salted hash of the visitor's IP address, for rate limits. The raw IP is never stored.
 * On Vercel the platform sets these headers itself, so a visitor can't fake them.
 */
export async function visitorHash(): Promise<string> {
  const h = await headers();
  const ip = h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const salt = process.env.ADMIN_SECRET || 'visitor';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}
