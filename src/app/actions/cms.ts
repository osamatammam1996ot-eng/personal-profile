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

/** Uploads an image for the admin panel and returns its public URL. */
export async function uploadImageAction(formData: FormData) {
  if (!(await verifyAuthAction())) return { error: 'Unauthorized' };

  try {
    const file = formData.get('file');
    if (!(file instanceof File)) return { error: 'No file provided' };

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const safeName = `cms-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

    const client = getAdminClient();
    if (client) {
      const { data, error } = await client.storage.from(IMAGE_BUCKET).upload(safeName, file, { contentType: file.type, upsert: false });
      if (error || !data) {
        console.error('Image upload failed:', error?.message);
        return { error: 'Image upload failed' };
      }
      return { url: client.storage.from(IMAGE_BUCKET).getPublicUrl(data.path).data.publicUrl, filename: safeName };
    }

    if (isDev) {
      // Local development without the service key: keep uploads in public/uploads
      const dir = path.join(process.cwd(), 'public', 'uploads');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, safeName), Buffer.from(await file.arrayBuffer()));
      return { url: `/uploads/${safeName}`, filename: safeName };
    }

    return { error: 'Uploads are not configured: set SUPABASE_SERVICE_ROLE_KEY in the Vercel environment variables.' };
  } catch (e) {
    console.error('Image upload failed:', e);
    return { error: 'Image upload failed' };
  }
}
