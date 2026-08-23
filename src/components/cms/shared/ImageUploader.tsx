'use client';

import React, { useState, useRef } from 'react';
import { uploadImageAction, deleteImageAction } from '../../../app/actions/cms';
import { Image as ImageIcon, Upload, X, Loader2 } from 'lucide-react';
import { labelClasses, inputClasses } from './BilingualField';

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
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadImageAction(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        onChange(result.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed unexpectedly.');
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
        {helpText && <span className="text-sm text-white/50">{helpText}</span>}
      </div>

      {error && (
        <div className="text-red-400 text-sm px-2 py-1 bg-red-400/10 rounded border border-red-400/20">
          {error}
        </div>
      )}

      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-black/20 aspect-video flex items-center justify-center">
          <img src={value} alt="Preview" className="max-w-full max-h-full object-contain" />
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full bg-white/10 hover:bg-brand text-white transition-colors cursor-pointer border-none"
              title="Replace image"
            >
              <Upload size={18} />
            </button>
            <button
              onClick={handleClear}
              className="p-2 rounded-full bg-white/10 hover:bg-red-500 text-white transition-colors cursor-pointer border-none"
              title="Remove image"
            >
              <X size={18} />
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="animate-spin text-brand" size={24} />
            </div>
          )}
        </div>
      ) : (
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <Loader2 className="animate-spin text-brand" size={32} />
          ) : (
            <ImageIcon size={32} className="text-white/20" />
          )}
          
          <div>
            <span className="text-base text-brand font-medium">Click to upload</span>
            <span className="text-base text-white/50"> or drag and drop</span>
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
