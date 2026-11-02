'use client';

import { useRef, useState } from 'react';
import { FileText, Loader2, Upload, X } from 'lucide-react';
import type { CmsData, CmsResume } from '../../../types/cms';
import { BilingualField, cardClasses, inputClasses, labelClasses } from '../shared/BilingualField';
import { uploadFile } from '../shared/upload';

interface ResumeEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
}

export function ResumeEditor({ draft, updateDraft }: ResumeEditorProps) {
  const { resume } = draft;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setResume = (patch: Partial<CmsResume>) =>
    updateDraft((prev) => ({ ...prev, resume: { ...prev.resume, ...patch } }));

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setIsUploading(true);
    try {
      const url = await uploadFile(file, 'document');
      // Keep a custom download name the editor already typed; otherwise use the file's own name
      setResume({ url, fileName: resume.fileName || file.name });
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="grid gap-3">
      <h2 className="text-admin-fg mt-0">Resume</h2>
      <p className="m-0 text-sm text-admin-fg/50">
        Shown as the floating “Download Resume” button at the bottom of the site. It stays hidden until a PDF is uploaded.
      </p>

      <div className={cardClasses}>
        <p className="m-0 mb-2.5 text-admin-fg font-bold text-base">Resume file (PDF)</p>

        {error && (
          <div className="mb-3 text-danger text-sm px-2 py-1 bg-danger/10 rounded border border-danger/20">{error}</div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {resume.url ? (
            <a
              href={resume.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 min-w-0 text-base text-brand-text font-medium hover:underline"
            >
              <FileText size={18} className="shrink-0" />
              <span className="truncate">{resume.fileName || 'Current resume'}</span>
            </a>
          ) : (
            <span className="text-base text-admin-fg/50">No resume uploaded yet.</span>
          )}

          <div className="flex gap-2 ms-auto">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-brand/20 hover:bg-brand-gradient text-admin-fg border border-brand/50 px-3 py-1.5 rounded-lg text-sm font-bold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {resume.url ? 'Replace PDF' : 'Upload PDF'}
            </button>
            {resume.url && (
              <button
                type="button"
                onClick={() => setResume({ url: '' })}
                className="flex items-center gap-2 bg-transparent hover:bg-danger/20 text-admin-fg/70 border border-admin-fg/15 px-3 py-1.5 rounded-lg text-sm font-bold cursor-pointer transition-all"
              >
                <X size={16} />
                Remove
              </button>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <div className="grid gap-2.5 mt-4">
          <div>
            <label className={labelClasses}>Download file name</label>
            <input
              className={inputClasses}
              value={resume.fileName}
              placeholder="Osama-Tammam-Resume.pdf"
              onChange={(e) => setResume({ fileName: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer self-start">
            <input
              type="checkbox"
              checked={resume.visible}
              onChange={(e) => setResume({ visible: e.target.checked })}
              className="cursor-pointer w-4 h-4 accent-brand transition-all"
            />
            <span className="text-sm text-text-muted">Show the download button on the site</span>
          </label>
        </div>
      </div>

      <BilingualField
        label="Button Text (empty = “Download Resume”)"
        en={resume.label.en}
        ar={resume.label.ar}
        onChangeEn={(en) => setResume({ label: { ...resume.label, en } })}
        onChangeAr={(ar) => setResume({ label: { ...resume.label, ar } })}
      />
    </div>
  );
}
