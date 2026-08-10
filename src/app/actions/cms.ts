"use server";

import { kv } from '@vercel/kv';
import { put, del, list } from '@vercel/blob';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-only';
const LOCAL_STORAGE_PATH = path.join(process.cwd(), 'node_modules', '.cache', 'cms-data.json');

// Helper to check authentication
async function isAuthenticated() {
  const token = (await cookies()).get('admin_token')?.value;
  if (!token) return false;
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function getCmsDataAction() {
  try {
    // Tier 1: Try Vercel KV if configured
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const raw = await kv.get('cms_data');
      if (raw) return { data: raw, source: 'vercel-kv' };
    }

    // Tier 2: Try Vercel Blob if configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { blobs } = await list({ prefix: 'cms-data.json' });
        if (blobs.length > 0) {
          const res = await fetch(blobs[0].url, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            return { data, source: 'vercel-blob' };
          }
        }
      } catch (blobErr) {
        console.warn('Vercel Blob read error:', blobErr);
      }
    }

    // Tier 3: Local file fallback
    if (fs.existsSync(LOCAL_STORAGE_PATH)) {
      const content = fs.readFileSync(LOCAL_STORAGE_PATH, 'utf-8');
      return { data: JSON.parse(content), source: 'local-file' };
    }

    return { data: null };
  } catch (e: any) {
    console.error('CMS GET action error:', e);
    return { error: 'Failed to retrieve CMS data' };
  }
}

export async function saveCmsDataAction(data: any) {
  if (!(await isAuthenticated())) {
    return { error: 'Unauthorized' };
  }

  try {
    const updatedAt = new Date().toISOString();
    const body = { ...data, updatedAt };
    let savedToCloud = false;

    // Tier 1: Save to Vercel KV if available
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        await kv.set('cms_data', body);
        savedToCloud = true;
      } catch (kvErr) {
        console.warn('Vercel KV save error:', kvErr);
      }
    }

    // Tier 2: Save to Vercel Blob if available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        await put('cms-data.json', JSON.stringify(body), {
          access: 'public',
          addRandomSuffix: false,
        });
        savedToCloud = true;
      } catch (blobErr) {
        console.warn('Vercel Blob save error:', blobErr);
      }
    }

    // Tier 3: Local file save
    try {
      const dir = path.dirname(LOCAL_STORAGE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(LOCAL_STORAGE_PATH, JSON.stringify(body, null, 2));
    } catch (fsErr) {
      console.warn('Local FS save error:', fsErr);
    }

    revalidatePath('/');
    revalidatePath('/admin');

    return { 
      success: true, 
      updatedAt, 
      savedToCloud,
      warning: savedToCloud ? undefined : 'Saved locally. For global cloud persistence across all visitors on Vercel, connect Vercel KV or Vercel Blob in your project settings.'
    };
  } catch (e: any) {
    console.error('CMS PUT action error:', e);
    return { error: 'Failed to save CMS data' };
  }
}

export async function uploadImageAction(formData: FormData) {
  if (!(await isAuthenticated())) {
    return { error: 'Unauthorized' };
  }

  try {
    const file = formData.get('file') as File | null;
    if (!file) {
      return { error: 'No file provided' };
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const safeName = `cms-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    
    const blob = await put(safeName, file, { access: 'public' });

    return { url: blob.url, filename: safeName };
  } catch (e) {
    console.error('Image upload action error:', e);
    return { error: 'Image upload failed' };
  }
}

export async function deleteImageAction(filename: string) {
  if (!(await isAuthenticated())) {
    return { error: 'Unauthorized' };
  }

  try {
    if (filename.includes('/') || filename.includes('..')) {
      return { error: 'Invalid filename' };
    }
    
    try {
      await del(filename); 
    } catch (err) {
      console.warn('Vercel Blob delete failed:', err);
    }
    
    return { success: true };
  } catch (e) {
    console.error('Image delete action error:', e);
    return { error: 'Image delete failed' };
  }
}
