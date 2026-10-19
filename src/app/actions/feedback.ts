'use server';

import { createHash, randomUUID } from 'crypto';
import { headers } from 'next/headers';
import { verifyAuthAction } from '@/app/actions/auth';
import { getAdminClient } from '@/lib/supabase-server';
import { isDev, readDevStore, writeDevStore } from '@/lib/dev-store';

// Visitor feedback from "Add yours". Submissions stay private (see
// supabase/migrations/02_feedback_submissions.sql) until Osama copies an approved one
// into the Recommendations content by hand.

export interface FeedbackSubmission {
  id: string;
  name: string;
  comment: string;
  created_at: string;
}

const TABLE = 'feedback_submissions';
const NAME_MIN = 2, NAME_MAX = 80;
const COMMENT_MIN = 10, COMMENT_MAX = 1000;
const PER_IP_PER_HOUR = 3;
const INBOX_CAP = 300;

// Dev-only local inbox, so the form works on localhost without the service role key
type StoredSubmission = FeedbackSubmission & { ip_hash: string };
const DEV_STORE = 'feedback-inbox';
const readLocal = async () => readDevStore<StoredSubmission[]>(DEV_STORE) ?? [];
const writeLocal = async (rows: StoredSubmission[]) => writeDevStore(DEV_STORE, rows);

async function visitorHash() {
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
  const salt = process.env.ADMIN_SECRET || 'feedback';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}

type SubmitResult = { success: true } | { error: 'invalid' | 'rate_limited' | 'unavailable' };

export async function submitFeedbackAction(input: { name: string; comment: string; website?: string }): Promise<SubmitResult> {
  // Honeypot: real people never see the "website" field, bots fill it. Pretend it worked.
  if (input.website) return { success: true };

  const name = String(input.name ?? '').trim().replace(/\s+/g, ' ');
  const comment = String(input.comment ?? '').trim();
  if (name.length < NAME_MIN || name.length > NAME_MAX || comment.length < COMMENT_MIN || comment.length > COMMENT_MAX) {
    return { error: 'invalid' };
  }

  const ip_hash = await visitorHash();
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const client = getAdminClient();

  try {
    if (client) {
      const { count: recent } = await client.from(TABLE).select('id', { count: 'exact', head: true })
        .eq('ip_hash', ip_hash).gte('created_at', hourAgo);
      if ((recent ?? 0) >= PER_IP_PER_HOUR) return { error: 'rate_limited' };

      const { count: total } = await client.from(TABLE).select('id', { count: 'exact', head: true });
      if ((total ?? 0) >= INBOX_CAP) return { error: 'unavailable' };

      const { error } = await client.from(TABLE).insert({ name, comment, ip_hash });
      if (error) {
        console.error('Feedback insert failed:', error.message);
        return { error: 'unavailable' };
      }
      return { success: true };
    }

    if (isDev) {
      const rows = await readLocal();
      if (rows.filter((r) => r.ip_hash === ip_hash && r.created_at >= hourAgo).length >= PER_IP_PER_HOUR) {
        return { error: 'rate_limited' };
      }
      rows.unshift({ id: randomUUID(), name, comment, ip_hash, created_at: new Date().toISOString() });
      await writeLocal(rows.slice(0, INBOX_CAP));
      return { success: true };
    }
  } catch (e) {
    console.error('Feedback submit error:', e);
  }
  return { error: 'unavailable' };
}

export async function listFeedbackAction(): Promise<{ items: FeedbackSubmission[] } | { error: string }> {
  if (!(await verifyAuthAction())) return { error: 'Unauthorized' };

  const client = getAdminClient();
  if (client) {
    const { data, error } = await client.from(TABLE)
      .select('id, name, comment, created_at')
      .order('created_at', { ascending: false });
    if (error) return { error: error.message };
    return { items: data ?? [] };
  }
  if (isDev) {
    const rows = await readLocal();
    return { items: rows.map(({ id, name, comment, created_at }) => ({ id, name, comment, created_at })) };
  }
  return { error: 'Feedback storage is not configured (SUPABASE_SERVICE_ROLE_KEY).' };
}

export async function dismissFeedbackAction(id: string): Promise<{ success: true } | { error: string }> {
  if (!(await verifyAuthAction())) return { error: 'Unauthorized' };
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { error: 'Invalid id' };

  const client = getAdminClient();
  if (client) {
    const { error } = await client.from(TABLE).delete().eq('id', id);
    return error ? { error: error.message } : { success: true };
  }
  if (isDev) {
    await writeLocal((await readLocal()).filter((r) => r.id !== id));
    return { success: true };
  }
  return { error: 'Feedback storage is not configured (SUPABASE_SERVICE_ROLE_KEY).' };
}
