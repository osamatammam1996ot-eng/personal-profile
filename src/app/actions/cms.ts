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
const IMAGE_BUCKET = 'cms-images';

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

const MAX_IMAGE_MB = 20;

function imageFileName(original: string) {
  const ext = original.split('.').pop()?.toLowerCase() || 'jpg';
  return `cms-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
}

type UploadTicket =
  | { bucket: string; path: string; token: string; publicUrl: string }
  | { local: true }
  | { error: string };

/**
 * Starts an admin image upload. Returns a one-time link the browser sends the file to directly,
 * so big images never pass through this server (Next.js and Vercel both cap request bodies).
 * Locally without the service key it returns `local`, and the file goes to uploadImageLocallyAction.
 */
export async function createImageUploadAction(file: { name: string; type: string; size: number }): Promise<UploadTicket> {
  if (!(await verifyAuthAction())) return { error: 'Unauthorized' };
  if (!file.type.startsWith('image/')) return { error: 'Only image files can be uploaded.' };
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    return { error: `This image is ${(file.size / 1024 / 1024).toFixed(1)} MB; the limit is ${MAX_IMAGE_MB} MB.` };
  }

  const client = getAdminClient();
  if (!client) {
    return isDev ? { local: true } : { error: 'Uploads are not configured: set SUPABASE_SERVICE_ROLE_KEY in the Vercel environment variables.' };
  }

  const { data, error } = await client.storage.from(IMAGE_BUCKET).createSignedUploadUrl(imageFileName(file.name));
  if (error || !data) {
    console.error('Could not start image upload:', error?.message);
    return { error: 'Could not start the upload. Please try again.' };
  }
  const publicUrl = client.storage.from(IMAGE_BUCKET).getPublicUrl(data.path).data.publicUrl;
  return { bucket: IMAGE_BUCKET, path: data.path, token: data.token, publicUrl };
}

/** Local development without the service key: keeps uploads in public/uploads. */
export async function uploadImageLocallyAction(formData: FormData) {
  if (!(await verifyAuthAction())) return { error: 'Unauthorized' };
  if (!isDev) return { error: 'Local uploads only work in development.' };

  const file = formData.get('file');
  if (!(file instanceof File)) return { error: 'No file provided' };

  const name = imageFileName(file.name);
  const dir = path.join(process.cwd(), 'public', 'uploads');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return { url: `/uploads/${name}` };
}
