'use client';

import React, { useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { createImageUploadAction, uploadImageLocallyAction } from '../../../app/actions/cms';
import { Image as ImageIcon, Upload, X, Loader2 } from 'lucide-react';
import { labelClasses, inputClasses } from './BilingualField';

// Server actions accept at most 1 MB, which only matters for the local no-service-key fallback
const LOCAL_LIMIT_BYTES = 1024 * 1024;

/** Sends the file to storage and returns its public URL. Throws with a readable message. */
async function uploadImage(file: File): Promise<string> {
  const ticket = await createImageUploadAction({ name: file.name, type: file.type, size: file.size });
  if ('error' in ticket) throw new Error(ticket.error);

  if ('local' in ticket) {
    if (file.size > LOCAL_LIMIT_BYTES) throw new Error('Locally (without the Supabase service key) images must be under 1 MB.');
    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadImageLocallyAction(formData);
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

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helpText?: string;
  placeholder?: string;
}

export function ImageUploader({ label, value, onChange, helpText, placeholder = "Or enter image URL manually..." }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setIsUploading(true);

    try {
      onChange(await uploadImage(file));
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error && err.message ? err.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className={labelClasses}>{label}</label>
        {helpText && <span className="text-sm text-admin-fg/50">{helpText}</span>}
      </div>

      {error && (
        <div className="text-danger text-sm px-2 py-1 bg-danger/10 rounded border border-danger/20">
          {error}
        </div>
      )}

      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-admin-fg/10 bg-admin-scrim/20 aspect-video flex items-center justify-center">
          <img src={value} alt="Preview" className="max-w-full max-h-full object-contain" />
          
          <div className="absolute inset-0 bg-admin-scrim/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full bg-admin-fg/10 hover:bg-brand text-admin-fg transition-colors cursor-pointer border-none"
              title="Replace image"
            >
              <Upload size={18} />
            </button>
            <button
              onClick={handleClear}
              className="p-2 rounded-full bg-admin-fg/10 hover:bg-danger text-admin-fg transition-colors cursor-pointer border-none"
              title="Remove image"
            >
              <X size={18} />
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-admin-scrim/50 flex items-center justify-center">
              <Loader2 className="animate-spin text-brand-text" size={24} />
            </div>
          )}
        </div>
      ) : (
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-admin-fg/10 rounded-lg p-6 flex flex-col items-center justify-center gap-3 bg-admin-fg/5 hover:bg-admin-fg/10 transition-colors cursor-pointer text-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <Loader2 className="animate-spin text-brand-text" size={32} />
          ) : (
            <ImageIcon size={32} className="text-admin-fg/20" />
          )}
          
          <div>
            <span className="text-base text-brand-text font-medium">Click to upload</span>
            <span className="text-base text-admin-fg/50"> or drag and drop</span>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Fallback manual URL input */}
      <div className="mt-1 flex gap-2 items-center">
        <input
          type="text"
          className={inputClasses}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
