"use server";

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { verifyAuthAction } from '@/app/actions/auth';
import { getAdminClient, getReadClient } from '@/lib/supabase-server';
import { isDev, readDevStore, writeDevStore } from '@/lib/dev-store';
import type { CmsData } from '@/types/cms';

// All site content is one JSON document: row `main` of the `cms_data` table.
const TABLE = 'cms_data';
const ROW_ID = 'main';
const DEV_STORE = 'cms-data';

/** Published content, or `data: null` when there's none yet (the site then shows its defaults). */
export async function getCmsDataAction() {
  try {
    const client = getReadClient();
    if (client) {
      const { data, error } = await client.from(TABLE).select('data').eq('id', ROW_ID).single();
      if (!error && data?.data && Object.keys(data.data).length > 0) return { data: data.data };
      if (error) console.warn('Supabase read error:', error.message);
    }
    if (isDev) return { data: readDevStore(DEV_STORE) };
    return { data: null };
  } catch (e) {
    console.error('CMS read failed:', e);
    return { error: 'Failed to retrieve CMS data' };
  }
}

/** Saves the whole content document from the admin panel. */
export async function saveCmsDataAction(data: CmsData) {
  if (!(await verifyAuthAction())) return { error: 'Unauthorized' };

  try {
    const updatedAt = new Date().toISOString();
    const body = { ...data, updatedAt };

    const client = getAdminClient();
    if (client) {
      const { error } = await client.from(TABLE).upsert({ id: ROW_ID, data: body, updated_at: updatedAt }, { onConflict: 'id' });
      if (error) {
        console.error('Supabase save error:', error.message);
        return { error: 'Failed to save CMS data' };
      }
    } else if (isDev) {
      writeDevStore(DEV_STORE, body);
    } else {
      return { error: 'Saving is not configured: set SUPABASE_SERVICE_ROLE_KEY in the Vercel environment variables.' };
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return {
      success: true,
      updatedAt,
      warning: client ? undefined : 'Saved on this computer only (no SUPABASE_SERVICE_ROLE_KEY in .env.local).',
    };
  } catch (e) {
    console.error('CMS save failed:', e);
    return { error: 'Failed to save CMS data' };
  }
}

/**
 * What each kind of admin upload accepts, and the public storage bucket it goes to.
 * Images use `cms-images` (created by hand, see the README). Documents get their own
 * bucket, created on first upload, so the image bucket's file-type limits never block a PDF.
 */
const UPLOAD_RULES = {
  image: {
    bucket: 'cms-images', autoCreate: false, maxMb: 20, mimeTypes: null,
    accepts: (type: string) => type.startsWith('image/'), typeError: 'Only image files can be uploaded.', fallbackExt: 'jpg',
  },
  document: {
    bucket: 'cms-documents', autoCreate: true, maxMb: 10, mimeTypes: ['application/pdf'],
    accepts: (type: string) => type === 'application/pdf', typeError: 'Only PDF files can be uploaded.', fallbackExt: 'pdf',
  },
} as const;

type UploadKind = keyof typeof UPLOAD_RULES;

function storedFileName(original: string, kind: UploadKind) {
  const ext = original.split('.').pop()?.toLowerCase() || UPLOAD_RULES[kind].fallbackExt;
  return `cms-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
}

type AdminClient = NonNullable<ReturnType<typeof getAdminClient>>;

/** Creates the kind's public bucket if it doesn't exist yet. Returns an error message, or null when ready. */
async function ensureBucket(client: AdminClient, kind: UploadKind): Promise<string | null> {
  const rules = UPLOAD_RULES[kind];
  if (!rules.autoCreate) return null;
  if (!(await client.storage.getBucket(rules.bucket)).error) return null;

  const { error } = await client.storage.createBucket(rules.bucket, {
    public: true,
    allowedMimeTypes: [...(rules.mimeTypes ?? [])],
    fileSizeLimit: `${rules.maxMb}MB`,
  });
  // Another upload may have created it a moment ago
  if (error && !/already exists/i.test(error.message)) {
    console.error(`Could not create the ${rules.bucket} bucket:`, error.message);
    return 'Could not prepare file storage. Please try again.';
  }
  return null;
}

type UploadTicket =
  | { bucket: string; path: string; token: string; publicUrl: string }
  | { local: true }
  | { error: string };

/**
 * Starts an admin upload (an image, or a PDF document). Returns a one-time link the browser sends the
 * file to directly, so big files never pass through this server (Next.js and Vercel both cap request bodies).
 * Locally without the service key it returns `local`, and the file goes to uploadFileLocallyAction.
 */
export async function createUploadAction(
  file: { name: string; type: string; size: number },
  kind: UploadKind = 'image',
): Promise<UploadTicket> {
  if (!(await verifyAuthAction())) return { error: 'Unauthorized' };
  const rules = UPLOAD_RULES[kind];
  if (!rules.accepts(file.type)) return { error: rules.typeError };
  if (file.size > rules.maxMb * 1024 * 1024) {
    return { error: `This file is ${(file.size / 1024 / 1024).toFixed(1)} MB; the limit is ${rules.maxMb} MB.` };
  }

  const client = getAdminClient();
  if (!client) {
    return isDev ? { local: true } : { error: 'Uploads are not configured: set SUPABASE_SERVICE_ROLE_KEY in the Vercel environment variables.' };
  }

  const bucketError = await ensureBucket(client, kind);
  if (bucketError) return { error: bucketError };

  const { bucket } = rules;
  const { data, error } = await client.storage.from(bucket).createSignedUploadUrl(storedFileName(file.name, kind));
  if (error || !data) {
    console.error('Could not start upload:', error?.message);
    return { error: 'Could not start the upload. Please try again.' };
  }
  const publicUrl = client.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
  return { bucket, path: data.path, token: data.token, publicUrl };
}

/** Local development without the service key: keeps uploads in public/uploads. */
export async function uploadFileLocallyAction(formData: FormData, kind: UploadKind = 'image') {
  if (!(await verifyAuthAction())) return { error: 'Unauthorized' };
  if (!isDev) return { error: 'Local uploads only work in development.' };

  const file = formData.get('file');
  if (!(file instanceof File)) return { error: 'No file provided' };
  if (!UPLOAD_RULES[kind].accepts(file.type)) return { error: UPLOAD_RULES[kind].typeError };

  const name = storedFileName(file.name, kind);
  const dir = path.join(process.cwd(), 'public', 'uploads');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return { url: `/uploads/${name}` };
}
