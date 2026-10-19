import fs from 'fs';
import path from 'path';

/**
 * Local JSON files under node_modules/.cache, so the admin and the feedback form work on
 * localhost without the Supabase service role key. Never used in production.
 */
export const isDev = process.env.NODE_ENV === 'development';

const fileFor = (name: string) => path.join(process.cwd(), 'node_modules', '.cache', `${name}.json`);

export function readDevStore<T>(name: string): T | null {
  const file = fileFor(name);
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf-8')) as T) : null;
}

export function writeDevStore(name: string, value: unknown) {
  const file = fileFor(name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}
