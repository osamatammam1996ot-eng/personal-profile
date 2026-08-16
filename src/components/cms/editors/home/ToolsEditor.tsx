import type { CmsData } from '../../../../types/cms';
import { BilingualField, cardClasses, labelClasses, inputClasses, splitComma } from '../../../../components/cms/shared/BilingualField';

interface ToolsEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
}

export function ToolsEditor({ draft, updateDraft }: ToolsEditorProps) {
  return (
    <div className="grid gap-3">
      <h2 className="text-white mt-0">Tools Section</h2>
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
      
      <h3 className="text-white mt-4 text-sm">Tools List</h3>
      <p className="text-[#a0a0a8] text-xs m-0 mb-2">Edit text content for the 12 tools (colors and order are fixed to maintain 3D harmony).</p>
      
      {draft.tools.toolsList.map((tool, index) => (
        <div key={index} className={cardClasses}>
          <p className="m-0 mb-2.5 text-white font-bold text-[13px]">{tool.name || `Tool ${index + 1}`}</p>
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
              <div>
                <label className={labelClasses}>English tags (comma-separated)</label>
                <input
                  className={inputClasses}
                  value={tool.tags?.en?.join(', ') || ''}
                  onChange={(e) => updateDraft((prev) => {
                    const t = [...prev.tools.toolsList];
                    t[index] = { ...t[index], tags: { ...t[index].tags, en: splitComma(e.target.value) } };
                    return { ...prev, tools: { ...prev.tools, toolsList: t } };
                  })}
                />
              </div>
              <div>
                <label className={labelClasses}>Arabic tags (comma-separated)</label>
                <input
                  className={inputClasses}
                  dir="rtl"
                  value={tool.tags?.ar?.join(', ') || ''}
                  onChange={(e) => updateDraft((prev) => {
                    const t = [...prev.tools.toolsList];
                    t[index] = { ...t[index], tags: { ...t[index].tags, ar: splitComma(e.target.value) } };
                    return { ...prev, tools: { ...prev.tools, toolsList: t } };
                  })}
                />
              </div>
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
