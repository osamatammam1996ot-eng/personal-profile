import { createClient } from '@supabase/supabase-js';
import { createUploadAction, uploadFileLocallyAction } from '../../../app/actions/cms';

/** What the admin uploads: rules for each live in createUploadAction. */
export type UploadKind = 'image' | 'document';

// Server actions accept at most 1 MB, which only matters for the local no-service-key fallback
const LOCAL_LIMIT_BYTES = 1024 * 1024;

/** Sends the file to storage and returns its public URL. Throws with a readable message. */
export async function uploadFile(file: File, kind: UploadKind = 'image'): Promise<string> {
  const ticket = await createUploadAction({ name: file.name, type: file.type, size: file.size }, kind);
  if ('error' in ticket) throw new Error(ticket.error);

  if ('local' in ticket) {
    if (file.size > LOCAL_LIMIT_BYTES) throw new Error('Locally (without the Supabase service key) uploads must be under 1 MB.');
    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadFileLocallyAction(formData, kind);
    if ('error' in result) throw new Error(result.error);
    return result.url;
  }

  // Straight from the browser to Supabase with the one-time token, so size isn't capped by our server
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { error } = await supabase.storage.from(ticket.bucket)
    .uploadToSignedUrl(ticket.path, ticket.token, file, { contentType: file.type });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return ticket.publicUrl;
}
