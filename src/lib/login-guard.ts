import { getAdminClient } from './supabase-server';

// Slows down password guessing on the admin login: after too many wrong passwords the
// login refuses to check any more for a while. Failures are kept in the `login_attempts`
// table (supabase/migrations/03_login_attempts.sql); until that table exists, or without
// the service key, they are counted in memory, which still stops a fast burst.

const TABLE = 'login_attempts';
const WINDOW_MS = 15 * 60 * 1000;
/** Wrong passwords allowed from one address per window. */
export const MAX_PER_VISITOR = 5;
/** Wrong passwords allowed from everyone together per window (an attack spread over many addresses). */
export const MAX_OVERALL = 60;

const memory: { hash: string; at: number }[] = [];

/** Pure rule, shared by both stores: is this visitor locked out given the recent failures? */
export function isLockedOut(recentFromVisitor: number, recentOverall: number): boolean {
  return recentFromVisitor >= MAX_PER_VISITOR || recentOverall >= MAX_OVERALL;
}

function memoryCounts(hash: string, since: number) {
  while (memory.length && memory[0].at < since) memory.shift();
  return { visitor: memory.filter((a) => a.hash === hash).length, overall: memory.length };
}

/** True when this visitor must wait before trying another password. */
export async function loginLocked(hash: string): Promise<boolean> {
  const since = Date.now() - WINDOW_MS;
  const client = getAdminClient();
  if (client) {
    const sinceIso = new Date(since).toISOString();
    const [visitor, overall] = await Promise.all([
      client.from(TABLE).select('id', { count: 'exact', head: true }).eq('ip_hash', hash).gte('created_at', sinceIso),
      client.from(TABLE).select('id', { count: 'exact', head: true }).gte('created_at', sinceIso),
    ]);
    if (!visitor.error && !overall.error) return isLockedOut(visitor.count ?? 0, overall.count ?? 0);
  }
  const counts = memoryCounts(hash, since);
  return isLockedOut(counts.visitor, counts.overall);
}

/** Remembers one wrong password. */
export async function recordFailedLogin(hash: string): Promise<void> {
  memory.push({ hash, at: Date.now() });
  const client = getAdminClient();
  if (!client) return;
  const { error } = await client.from(TABLE).insert({ ip_hash: hash });
  if (error) return; // table not created yet: the in-memory count above still applies
  // Keep the table small: drop anything older than a day
  await client.from(TABLE).delete().lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
}
