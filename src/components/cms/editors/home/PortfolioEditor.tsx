import type { CmsData } from '../../../../types/cms';
import { BilingualField, cardClasses, labelClasses, inputClasses, splitComma } from '../../../../components/cms/shared/BilingualField';
import { ImageUploader } from '../../../../components/cms/shared/ImageUploader';

interface PortfolioEditorProps {
  draft: CmsData;
  updateProject: (index: number, updater: (project: CmsData['projects'][number]) => CmsData['projects'][number]) => void;
}

export function PortfolioEditor({ draft, updateProject }: PortfolioEditorProps) {
  const items = [0, 1, 2, 3];
  
  return (
    <div className="grid gap-3">
      <h2 className="text-white mt-0">Portfolio Projects</h2>
      {items.map((index) => {
        const project = draft.projects[index] ?? {
          id: index + 1,
          visible: true,
          title: { en: '', ar: '' },
          image: '',
          tags: { en: [], ar: [] },
          desc: { en: '', ar: '' },
          accent: '#6366f1',
        };

        return (
          <div key={index} className={cardClasses}>
            <div className="flex justify-between items-center mb-3">
              <p className="m-0 text-text-primary font-bold text-[13px] tracking-wide">Project {index + 1}</p>
              <label className="text-text-secondary text-xs flex items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  checked={project.visible}
                  onChange={(e) => updateProject(index, (current) => ({ ...current, visible: e.target.checked }))}
                />
                Visible
              </label>
            </div>

            <div className="grid gap-2.5">
              <BilingualField
                label="Title"
                en={project.title?.en || ''}
                ar={project.title?.ar || ''}
                onChangeEn={(value) => updateProject(index, (current) => ({ ...current, title: { ...(current.title || {}), en: value } }))}
                onChangeAr={(value) => updateProject(index, (current) => ({ ...current, title: { ...(current.title || {}), ar: value } }))}
              />
              <BilingualField
                label="Description"
                multiline
                en={project.desc?.en || ''}
                ar={project.desc?.ar || ''}
                onChangeEn={(value) => updateProject(index, (current) => ({ ...current, desc: { ...(current.desc || {}), en: value } }))}
                onChangeAr={(value) => updateProject(index, (current) => ({ ...current, desc: { ...(current.desc || {}), ar: value } }))}
              />
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className={labelClasses}>English tags (comma-separated)</label>
                  <input
                    className={inputClasses}
                    value={project.tags?.en?.join(', ') || ''}
                    onChange={(e) => updateProject(index, (current) => ({ ...current, tags: { ...current.tags, en: splitComma(e.target.value) } }))}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Arabic tags (comma-separated)</label>
                  <input
                    className={inputClasses}
                    dir="rtl"
                    value={project.tags?.ar?.join(', ') || ''}
                    onChange={(e) => updateProject(index, (current) => ({ ...current, tags: { ...current.tags, ar: splitComma(e.target.value) } }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-[1fr_140px] gap-3">
                <div className="col-span-2">
                  <ImageUploader
                    label="Image"
                    value={project.image}
                    onChange={(url) => updateProject(index, (current) => ({ ...current, image: url }))}
                    helpText="Recommended: 16:10 ratio (e.g., 1600x1000px)"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Accent color</label>
                  <input
                    className={inputClasses}
                    value={project.accent}
                    onChange={(e) => updateProject(index, (current) => ({ ...current, accent: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
