"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { verifyAuthAction } from '@/app/actions/auth';

// ── Supabase clients ────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Read-only Supabase client (uses anon key, respects RLS).
 * Used for fetching CMS data on the public-facing site.
 */
function getReadClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

/**
 * Admin Supabase client (uses service role key, bypasses RLS).
 * Used for saving CMS data from the admin panel.
 */
function getAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}


// ── GET CMS Data ────────────────────────────────────────────────────────────────
export async function getCmsDataAction() {
  try {
    // Tier 1: Supabase (primary — always available on Vercel + localhost)
    const readClient = getReadClient();
    if (readClient) {
      const { data, error } = await readClient
        .from('cms_data')
        .select('data, updated_at')
        .eq('id', 'main')
        .single();

      if (!error && data?.data && Object.keys(data.data).length > 0) {
        return { data: data.data, source: 'supabase' };
      }
      // If the table exists but has empty data, fall through
      if (error) {
        console.warn('Supabase read error (falling through):', error.message);
      }
    }

    // Tier 2: Vercel KV (optional — if env vars are configured)
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const { kv } = await import('@vercel/kv');
        const raw = await kv.get('cms_data');
        if (raw) return { data: raw, source: 'vercel-kv' };
      } catch (kvErr) {
        console.warn('Vercel KV read error:', kvErr);
      }
    }

    // Tier 3: Vercel Blob (optional — if env vars are configured)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { list: blobList } = await import('@vercel/blob');
        const { blobs } = await blobList({ prefix: 'cms-data.json' });
        if (blobs.length > 0) {
          const res = await fetch(blobs[0].url, { cache: 'no-store' });
          if (res.ok) {
            const blobData = await res.json();
            return { data: blobData, source: 'vercel-blob' };
          }
        }
      } catch (blobErr) {
        console.warn('Vercel Blob read error:', blobErr);
      }
    }

    // Tier 4: Local filesystem (dev only — ephemeral on Vercel)
    try {
      const fs = await import('fs');
      const path = await import('path');
      const LOCAL_STORAGE_PATH = path.join(process.cwd(), 'node_modules', '.cache', 'cms-data.json');
      if (fs.existsSync(LOCAL_STORAGE_PATH)) {
        const content = fs.readFileSync(LOCAL_STORAGE_PATH, 'utf-8');
        return { data: JSON.parse(content), source: 'local-file' };
      }
    } catch (fsErr) {
      console.warn('Local FS read error:', fsErr);
    }

    return { data: null };
  } catch (e: any) {
    console.error('CMS GET action error:', e);
    return { error: 'Failed to retrieve CMS data' };
  }
}

// ── SAVE CMS Data ───────────────────────────────────────────────────────────────
export async function saveCmsDataAction(data: any) {
  if (!(await verifyAuthAction())) {
    return { error: 'Unauthorized' };
  }

  try {
    const updatedAt = new Date().toISOString();
    const body = { ...data, updatedAt };
    let savedToCloud = false;

    // Tier 1: Supabase (primary)
    const adminClient = getAdminClient();
    if (adminClient) {
      const { error } = await adminClient
        .from('cms_data')
        .upsert(
          { id: 'main', data: body, updated_at: updatedAt },
          { onConflict: 'id' }
        );

      if (error) {
        console.error('Supabase save error:', error.message);
        // Don't throw — try other tiers
      } else {
        savedToCloud = true;
      }
    }

    // Tier 2: Vercel KV (optional)
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const { kv } = await import('@vercel/kv');
        await kv.set('cms_data', body);
        savedToCloud = true;
      } catch (kvErr) {
        console.warn('Vercel KV save error:', kvErr);
      }
    }

    // Tier 3: Vercel Blob (optional)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        await put('cms-data.json', JSON.stringify(body), {
          access: 'public',
          addRandomSuffix: false,
        });
        savedToCloud = true;
      } catch (blobErr) {
        console.warn('Vercel Blob save error:', blobErr);
      }
    }

    // Tier 4: Local filesystem (dev convenience)
    try {
      const fs = await import('fs');
      const path = await import('path');
      const LOCAL_STORAGE_PATH = path.join(process.cwd(), 'node_modules', '.cache', 'cms-data.json');
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
      warning: savedToCloud
        ? undefined
        : 'Saved locally only. For cloud persistence, ensure SUPABASE_SERVICE_ROLE_KEY is set in your Vercel environment variables.',
    };
  } catch (e: any) {
    console.error('CMS PUT action error:', e);
    return { error: 'Failed to save CMS data' };
  }
}

// ── Image Upload ────────────────────────────────────────────────────────────────
export async function uploadImageAction(formData: FormData) {
  if (!(await verifyAuthAction())) {
    return { error: 'Unauthorized' };
  }

  try {
    const file = formData.get('file') as File | null;
    if (!file) {
      return { error: 'No file provided' };
    }

    // Try Supabase Storage first
    const adminClient = getAdminClient();
    if (adminClient) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const safeName = `cms-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

      const { data, error } = await adminClient.storage
        .from('cms-images')
        .upload(safeName, file, { contentType: file.type, upsert: false });

      if (!error && data) {
        const { data: urlData } = adminClient.storage
          .from('cms-images')
          .getPublicUrl(data.path);
        return { url: urlData.publicUrl, filename: safeName };
      }
      console.warn('Supabase storage upload failed, trying Vercel Blob:', error?.message);
    }

    // Fall back to Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob');
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const safeName = `cms-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
      const blob = await put(safeName, file, { access: 'public' });
      return { url: blob.url, filename: safeName };
    }

    // Tier 3: Local Filesystem Fallback
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const safeName = `cms-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, safeName);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(filePath, buffer);
      
      return { url: `/uploads/${safeName}`, filename: safeName };
    } catch (fsErr) {
      console.error('Local FS upload error:', fsErr);
    }

    return { error: 'No storage backend available. Configure Supabase Storage or Vercel Blob.' };
  } catch (e) {
    console.error('Image upload action error:', e);
    return { error: 'Image upload failed' };
  }
}

// ── Image Delete ────────────────────────────────────────────────────────────────
export async function deleteImageAction(filename: string) {
  if (!(await verifyAuthAction())) {
    return { error: 'Unauthorized' };
  }

  try {
    if (filename.includes('/') || filename.includes('..')) {
      return { error: 'Invalid filename' };
    }

    // Try Supabase Storage first
    const adminClient = getAdminClient();
    if (adminClient) {
      const { error } = await adminClient.storage
        .from('cms-images')
        .remove([filename]);
      if (!error) return { success: true };
      console.warn('Supabase storage delete failed:', error?.message);
    }

    // Fall back to Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { del } = await import('@vercel/blob');
        await del(filename);
      } catch (err) {
        console.warn('Vercel Blob delete failed:', err);
      }
    }

    // Tier 3: Local Filesystem Fallback
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fsErr) {
      console.warn('Local FS delete failed:', fsErr);
    }

    return { success: true };
  } catch (e) {
    console.error('Image delete action error:', e);
    return { error: 'Image delete failed' };
  }
}
