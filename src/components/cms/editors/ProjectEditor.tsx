import { Trash2 } from 'lucide-react';
import type { CmsData, CmsProject } from '../../../types/cms';
import { BilingualField, cardClasses, labelClasses, inputClasses, TagInput } from '../shared/BilingualField';
import { ImageUploader } from '../shared/ImageUploader';
import { CaseStudiesEditor } from './CaseStudiesEditor';
import { projectName, setProjectVisible } from '../../../lib/cms-projects';

interface ProjectEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
  projectId: number;
  onDelete: () => void;
}

/** One portfolio project: its card on the home page and the gallery that opens from it. */
export function ProjectEditor({ draft, updateDraft, projectId, onDelete }: ProjectEditorProps) {
  const project = draft.projects.find((p) => p.id === projectId);
  if (!project) return <p className="text-text-muted">This project no longer exists.</p>;

  const updateProject = (updater: (current: CmsProject) => CmsProject) =>
    updateDraft((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === projectId ? updater(p) : p)),
    }));

  const confirmDelete = () => {
    if (window.confirm(`Delete "${projectName(draft, projectId)}"? Its card and gallery are removed when you save.`)) {
      onDelete();
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-admin-fg m-0">{projectName(draft, projectId)}</h2>
        <div className="flex items-center gap-3">
          <label className="text-text-secondary text-sm flex items-center gap-2 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={project.visible}
              onChange={(e) => updateDraft((prev) => setProjectVisible(prev, projectId, e.target.checked))}
            />
            Visible on the site
          </label>
          <button
            type="button"
            onClick={confirmDelete}
            className="flex items-center gap-2 bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 px-3 py-1.5 rounded-lg text-sm font-semibold cursor-pointer transition-all"
          >
            <Trash2 size={14} /> Delete project
          </button>
        </div>
      </div>

      <div className={cardClasses}>
        <p className="m-0 mb-4 text-text-primary font-bold text-base tracking-wide">Card</p>
        <div className="grid gap-2.5">
          <BilingualField
            label="Title"
            en={project.title?.en || ''}
            ar={project.title?.ar || ''}
            onChangeEn={(value) => updateProject((current) => ({ ...current, title: { ...current.title, en: value } }))}
            onChangeAr={(value) => updateProject((current) => ({ ...current, title: { ...current.title, ar: value } }))}
          />
          <BilingualField
            label="Description"
            multiline
            en={project.desc?.en || ''}
            ar={project.desc?.ar || ''}
            onChangeEn={(value) => updateProject((current) => ({ ...current, desc: { ...current.desc, en: value } }))}
            onChangeAr={(value) => updateProject((current) => ({ ...current, desc: { ...current.desc, ar: value } }))}
          />
          <div className="grid grid-cols-2 gap-2.5">
            <TagInput
              label="English tags (comma-separated)"
              value={project.tags?.en || []}
              onChange={(val) => updateProject((current) => ({ ...current, tags: { ...current.tags, en: val } }))}
            />
            <TagInput
              label="Arabic tags (comma-separated)"
              dir="rtl"
              value={project.tags?.ar || []}
              onChange={(val) => updateProject((current) => ({ ...current, tags: { ...current.tags, ar: val } }))}
            />
          </div>
          <ImageUploader
            label="Cover image"
            value={project.image}
            onChange={(url) => updateProject((current) => ({ ...current, image: url }))}
            helpText="Recommended: 3:2 ratio (e.g., 1800x1200px)"
          />
          <div className="max-w-[260px]">
            <label className={labelClasses}>Accent color (card hover)</label>
            <input
              className={inputClasses}
              value={project.accent}
              onChange={(e) => updateProject((current) => ({ ...current, accent: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <CaseStudiesEditor draft={draft} updateDraft={updateDraft} projectId={projectId} />
    </div>
  );
}
