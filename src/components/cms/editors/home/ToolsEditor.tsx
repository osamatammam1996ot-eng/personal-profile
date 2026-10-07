import { useEffect, useState } from 'react';
import type { CmsData } from '../../../../types/cms';
import { parseColor, resolveColor } from '../../../../lib/theme-tokens';
import { BilingualField, cardClasses, labelClasses, inputClasses, splitComma, TagInput } from '../../../../components/cms/shared/BilingualField';

interface ToolsEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
}

export function ToolsEditor({ draft, updateDraft }: ToolsEditorProps) {
  return (
    <div className="grid gap-3">
      <h2 className="text-admin-fg mt-0">Tools Section</h2>
      <BilingualField
        label="Title"
        en={draft.tools.title.en}
        ar={draft.tools.title.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, tools: { ...prev.tools, title: { ...prev.tools.title, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, tools: { ...prev.tools, title: { ...prev.tools.title, ar: value } } }))}
      />
      <BilingualField
        label="Description"
        multiline
        en={draft.tools.desc.en}
        ar={draft.tools.desc.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, tools: { ...prev.tools, desc: { ...prev.tools.desc, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, tools: { ...prev.tools, desc: { ...prev.tools.desc, ar: value } } }))}
      />
      <BilingualField
        label="Click Hint"
        en={draft.tools.clickHint.en}
        ar={draft.tools.clickHint.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, tools: { ...prev.tools, clickHint: { ...prev.tools.clickHint, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, tools: { ...prev.tools, clickHint: { ...prev.tools.clickHint, ar: value } } }))}
      />
      <BilingualField
        label="Proficiency Label"
        en={draft.tools.proficiency.en}
        ar={draft.tools.proficiency.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, tools: { ...prev.tools, proficiency: { ...prev.tools.proficiency, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, tools: { ...prev.tools, proficiency: { ...prev.tools.proficiency, ar: value } } }))}
      />
      
      <h3 className="text-admin-fg mt-4 text-base">Tools List</h3>
      <p className="text-admin-fg/60 text-sm m-0 mb-2">Edit the 12 tools. The order is fixed to fit the 3D shape; each tool's label color can be changed below.</p>
      
      {draft.tools.toolsList.map((tool, index) => (
        <div key={index} className={cardClasses}>
          <p className="m-0 mb-2.5 text-admin-fg font-bold text-base">{tool.name || `Tool ${index + 1}`}</p>
          <div className="grid gap-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={labelClasses}>Name (EN)</label>
                <input
                  className={inputClasses}
                  value={tool.name}
                  onChange={(e) => updateDraft((prev) => {
                    const t = [...prev.tools.toolsList];
                    t[index] = { ...t[index], name: e.target.value };
                    return { ...prev, tools: { ...prev.tools, toolsList: t } };
                  })}
                />
              </div>
              <div>
                <label className={labelClasses}>Abbreviation</label>
                <input
                  className={inputClasses}
                  value={tool.abbr}
                  onChange={(e) => updateDraft((prev) => {
                    const t = [...prev.tools.toolsList];
                    t[index] = { ...t[index], abbr: e.target.value };
                    return { ...prev, tools: { ...prev.tools, toolsList: t } };
                  })}
                />
              </div>
            </div>
            <ColorField
              label="Label color"
              value={tool.glow}
              onChange={(value) => updateDraft((prev) => {
                const t = [...prev.tools.toolsList];
                t[index] = { ...t[index], glow: value };
                return { ...prev, tools: { ...prev.tools, toolsList: t } };
              })}
            />
            <BilingualField
              label="Category"
              en={tool.cat.en}
              ar={tool.cat.ar}
              onChangeEn={(value) => updateDraft((prev) => {
                const t = [...prev.tools.toolsList];
                t[index] = { ...t[index], cat: { ...t[index].cat, en: value } };
                return { ...prev, tools: { ...prev.tools, toolsList: t } };
              })}
              onChangeAr={(value) => updateDraft((prev) => {
                const t = [...prev.tools.toolsList];
                t[index] = { ...t[index], cat: { ...t[index].cat, ar: value } };
                return { ...prev, tools: { ...prev.tools, toolsList: t } };
              })}
            />
            <BilingualField
              label="Description"
              multiline
              en={tool.desc.en}
              ar={tool.desc.ar}
              onChangeEn={(value) => updateDraft((prev) => {
                const t = [...prev.tools.toolsList];
                t[index] = { ...t[index], desc: { ...t[index].desc, en: value } };
                return { ...prev, tools: { ...prev.tools, toolsList: t } };
              })}
              onChangeAr={(value) => updateDraft((prev) => {
                const t = [...prev.tools.toolsList];
                t[index] = { ...t[index], desc: { ...t[index].desc, ar: value } };
                return { ...prev, tools: { ...prev.tools, toolsList: t } };
              })}
            />
            <div className="grid grid-cols-2 gap-2.5">
              <TagInput
                label="English tags (comma-separated)"
                value={tool.tags?.en || []}
                onChange={(val) => updateDraft((prev) => {
                  const t = [...prev.tools.toolsList];
                  t[index] = { ...t[index], tags: { ...t[index].tags, en: val } };
                  return { ...prev, tools: { ...prev.tools, toolsList: t } };
                })}
              />
              <TagInput
                label="Arabic tags (comma-separated)"
                dir="rtl"
                value={tool.tags?.ar || []}
                onChange={(val) => updateDraft((prev) => {
                  const t = [...prev.tools.toolsList];
                  t[index] = { ...t[index], tags: { ...t[index].tags, ar: val } };
                  return { ...prev, tools: { ...prev.tools, toolsList: t } };
                })}
              />
            </div>
            <div>
              <label className={labelClasses}>Proficiency (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className={inputClasses}
                value={tool.proficiency}
                onChange={(e) => updateDraft((prev) => {
                  const t = [...prev.tools.toolsList];
                  t[index] = { ...t[index], proficiency: parseInt(e.target.value) || 0 };
                  return { ...prev, tools: { ...prev.tools, toolsList: t } };
                })}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Color picker + text field. Accepts any CSS color or a token like var(--color-brand). */
function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  // The picker needs a #rrggbb value; resolve token references in the browser.
  const [pickerValue, setPickerValue] = useState<string>();
  useEffect(() => {
    const [r, g, b] = parseColor(resolveColor(value));
    setPickerValue('#' + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join(''));
  }, [value]);

  return (
    <div>
      <label className={labelClasses}>{label}</label>
      <div className="flex items-center gap-3">
        {pickerValue && (
          <input
            type="color"
            aria-label={label}
            className="h-[50px] w-16 shrink-0 cursor-pointer rounded-[14px] border border-admin-border-subtle bg-admin-scrim/20 p-1.5"
            value={pickerValue}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        <input className={inputClasses} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
      <p className="text-admin-fg/50 text-sm mt-1.5 mb-0 ml-1">
        Used for the tool's initials and ring on the 3D shape. Very light or very dark colors are adjusted automatically so the label stays readable.
      </p>
    </div>
  );
}