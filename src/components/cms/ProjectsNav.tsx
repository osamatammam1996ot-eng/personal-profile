import { useState } from 'react';
import { Briefcase, ChevronDown, ChevronRight, ChevronUp, EyeOff, GripVertical, Plus } from 'lucide-react';
import type { CmsData } from '../../types/cms';
import { projectName } from '../../lib/cms-projects';

export const projectSectionId = (id: number) => `project-${id}`;

/** The project id behind a sidebar section id ("project-3" -> 3), or null for other sections. */
export function projectIdFromSection(sectionId: string): number | null {
  const match = sectionId.match(/^project-(\d+)$/);
  return match ? Number(match[1]) : null;
}

interface ProjectsNavProps {
  draft: CmsData | null;
  activeSection: string;
  expanded: boolean;
  onToggle: () => void;
  onSelect: (sectionId: string) => void;
  onAdd: () => void;
  onMove: (from: number, to: number) => void;
}

/** Sidebar group listing the portfolio projects in site order: drag or use the arrows to reorder. */
export function ProjectsNav({ draft, activeSection, expanded, onToggle, onSelect, onAdd, onMove }: ProjectsNavProps) {
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const projects = draft?.projects ?? [];

  const endDrag = () => {
    setDragFrom(null);
    setDragOver(null);
  };

  const arrowClasses = 'p-0.5 bg-transparent border-none rounded text-admin-fg/40 hover:text-admin-fg cursor-pointer disabled:opacity-20 disabled:cursor-default';

  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-[calc(100%-32px)] mx-4 mt-4 mb-2 px-4 py-2 rounded-xl border border-transparent bg-transparent text-admin-fg/50 cursor-pointer text-left text-xs font-bold uppercase tracking-[0.15em] hover:text-admin-fg hover:bg-admin-fg/5 hover:border-admin-fg/10 transition-all duration-300"
      >
        <div className="flex items-center gap-2">
          <Briefcase size={15} />
          <span>Projects</span>
        </div>
        <ChevronRight size={12} className={`transition-transform duration-200 ${expanded ? 'rotate-90' : 'rotate-0'}`} />
      </button>

      {expanded && (
        <div className="pl-2">
          {projects.map((project, index) => {
            const sectionId = projectSectionId(project.id);
            const isActive = activeSection === sectionId;
            const isDropTarget = dragOver === index && dragFrom !== null && dragFrom !== index;
            return (
              <div
                key={project.id}
                draggable
                onDragStart={(e) => {
                  setDragFrom(index);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragOver !== index) setDragOver(index);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragFrom !== null) onMove(dragFrom, index);
                  endDrag();
                }}
                onDragEnd={endDrag}
                className={`group flex items-center gap-1 w-[calc(100%-32px)] mx-4 my-1 ps-2 pe-1 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? 'bg-admin-fg/10 border-admin-fg/20'
                    : 'border-transparent hover:bg-admin-fg/5 hover:border-admin-fg/10'
                } ${isDropTarget ? 'border-brand/60 bg-brand/10' : ''} ${dragFrom === index ? 'opacity-40' : ''}`}
              >
                <GripVertical size={14} className="shrink-0 text-admin-fg/25 cursor-grab group-hover:text-admin-fg/50" aria-hidden="true" />
                <button
                  onClick={() => onSelect(sectionId)}
                  title={draft ? projectName(draft, project.id) : undefined}
                  className={`flex-1 min-w-0 flex items-center gap-2 py-2.5 bg-transparent border-none cursor-pointer text-left text-base ${
                    isActive ? 'text-admin-fg font-semibold' : 'text-admin-fg/60 hover:text-admin-fg font-medium'
                  }`}
                >
                  <span className="truncate">{draft ? projectName(draft, project.id) : ''}</span>
                  {!project.visible && <EyeOff size={12} className="shrink-0 text-admin-fg/40" aria-label="Hidden" />}
                </button>
                <div className="flex flex-col opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <button
                    onClick={() => onMove(index, index - 1)}
                    disabled={index === 0}
                    className={arrowClasses}
                    title="Move up"
                    aria-label={`Move ${draft ? projectName(draft, project.id) : 'project'} up`}
                  >
                    <ChevronUp size={13} />
                  </button>
                  <button
                    onClick={() => onMove(index, index + 1)}
                    disabled={index === projects.length - 1}
                    className={arrowClasses}
                    title="Move down"
                    aria-label={`Move ${draft ? projectName(draft, project.id) : 'project'} down`}
                  >
                    <ChevronDown size={13} />
                  </button>
                </div>
              </div>
            );
          })}

          <button
            onClick={onAdd}
            disabled={!draft}
            className="flex items-center gap-2 w-[calc(100%-32px)] mx-4 my-1 px-4 py-2.5 rounded-xl border border-dashed border-admin-fg/15 bg-transparent text-admin-fg/50 hover:text-admin-fg hover:border-admin-fg/30 hover:bg-admin-fg/5 cursor-pointer text-left text-sm font-semibold transition-all disabled:opacity-40"
          >
            <Plus size={14} /> Add project
          </button>
        </div>
      )}
    </div>
  );
}
