import React, { useState, useEffect } from 'react';

interface BilingualFieldProps {
  label: string;
  en: string;
  ar: string;
  multiline?: boolean;
  onChangeEn: (value: string) => void;
  onChangeAr: (value: string) => void;
}

export const cardClasses = "bg-admin-glass-card hover:bg-admin-glass-card-hover border border-admin-border-subtle hover:border-admin-border-strong rounded-2xl p-6 shadow-2xl backdrop-blur-3xl transition-all duration-300 relative overflow-hidden group";
export const inputClasses = "w-full rounded-[14px] border border-admin-border-subtle bg-black/20 text-white px-5 py-3.5 text-base transition-all duration-300 focus:outline-none focus:bg-black/40 focus:border-white/30 focus:shadow-[0_0_20px_rgba(255,255,255,0.05)] placeholder:text-white/30 hover:border-white/20";
export const labelClasses = "text-xs font-bold text-white/50 mb-2 block uppercase tracking-[0.15em] ml-1";

export function splitComma(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function TagInput({ 
  label, 
  value, 
  onChange, 
  dir = "ltr" 
}: { 
  label: string; 
  value: string[]; 
  onChange: (val: string[]) => void; 
  dir?: "ltr" | "rtl";
}) {
  const [localValue, setLocalValue] = useState(value?.join(', ') || '');

  useEffect(() => {
    const ext = value?.join(', ') || '';
    if (splitComma(localValue).join(',') !== splitComma(ext).join(',')) {
      setLocalValue(ext);
    }
  }, [value]);

  return (
    <div>
      <label className={labelClasses}>{label}</label>
      <input
        className={inputClasses}
        dir={dir}
        value={localValue}
        onChange={(e) => {
          setLocalValue(e.target.value);
          onChange(splitComma(e.target.value));
        }}
      />
    </div>
  );
}

export function BilingualField({
  label,
  en,
  ar,
  multiline,
  onChangeEn,
  onChangeAr,
}: BilingualFieldProps) {
  const Control = multiline ? 'textarea' : 'input';
  const extra = multiline ? { rows: 3 } : {};

  return (
    <div className={cardClasses}>
      <h3 className="m-0 mb-5 text-white font-bold text-lg tracking-wide flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-gradient shadow-[0_0_10px_var(--cursor-glow)]" />{label}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>English</label>
          <Control
            {...extra}
            className={inputClasses}
            value={en}
            onChange={(e: any) => onChangeEn(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClasses}>Arabic</label>
          <Control
            {...extra}
            className={inputClasses}
            dir="rtl"
            value={ar}
            onChange={(e: any) => onChangeAr(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
