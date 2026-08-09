import React from 'react';

interface BilingualFieldProps {
  label: string;
  en: string;
  ar: string;
  multiline?: boolean;
  onChangeEn: (value: string) => void;
  onChangeAr: (value: string) => void;
}

export const cardClasses = "bg-white/[0.03] border border-white/[0.08] rounded-xl p-4";
export const inputClasses = "w-full rounded-lg border border-white/[0.18] bg-black/20 text-white px-3 py-2.5 text-[13px]";
export const labelClasses = "text-xs font-semibold text-[#c7c7d0] mb-1.5 block";

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
      <p className="m-0 mb-2.5 text-white font-bold text-[13px]">{label}</p>
      <div className="grid grid-cols-2 gap-2.5">
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
