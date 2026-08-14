import React from 'react';

interface BilingualFieldProps {
  label: string;
  en: string;
  ar: string;
  multiline?: boolean;
  onChangeEn: (value: string) => void;
  onChangeAr: (value: string) => void;
}

export const cardClasses = "bg-surface-glass border border-border-default/30 rounded-2xl p-5 shadow-card backdrop-blur-md transition-all hover:border-border-default/60";
export const inputClasses = "w-full rounded-xl border border-border-default/40 bg-black/10 text-text-primary px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand/50 placeholder:text-text-muted hover:bg-black/20";
export const labelClasses = "text-[13px] font-semibold text-text-secondary mb-2 block uppercase tracking-wider";

export function splitComma(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
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
      <h3 className="m-0 mb-4 text-text-primary font-bold text-sm tracking-wide">{label}</h3>
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
