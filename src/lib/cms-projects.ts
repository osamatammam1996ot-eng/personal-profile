import type { CmsData, CmsProject } from '../types/cms';

// A portfolio project is two linked records with the same id: the card (`projects`) and its
// gallery (`caseStudies`). The order of `projects` is the order the cards appear on the site.

type Title = { en?: string; ar?: string } | string | undefined;

/** A project's name for the admin: its card title, else its gallery title, else "Untitled project". */
export function projectName(data: CmsData, id: number): string {
  const fromTitle = (title: Title) => (typeof title === 'string' ? title : title?.en || title?.ar || '');
  return (
    fromTitle(data.projects.find((p) => p.id === id)?.title) ||
    fromTitle(data.caseStudies.find((c) => c.id === id)?.title as Title) ||
    'Untitled project'
  );
}

/**
 * Appends a new, hidden project with an empty gallery. Hidden so a half-filled card never
 * shows up on the live site; switch it to visible once it's ready.
 */
export function addProject(data: CmsData): { data: CmsData; id: number } {
  const id = Math.max(0, ...data.projects.map((p) => p.id), ...data.caseStudies.map((c) => c.id)) + 1;
  const project: CmsProject = {
    id,
    visible: false,
    title: { en: '', ar: '' },
    image: '',
    tags: { en: [], ar: [] },
    desc: { en: '', ar: '' },
    accent: 'var(--color-brand)',
  };
  return {
    id,
    data: {
      ...data,
      projects: [...data.projects, project],
      caseStudies: [...data.caseStudies, { id, visible: true, title: { en: '', ar: '' }, media: [] }],
    },
  };
}

/** Removes a project's card and gallery. Its uploaded images stay in storage. */
export function removeProject(data: CmsData, id: number): CmsData {
  return {
    ...data,
    projects: data.projects.filter((p) => p.id !== id),
    caseStudies: data.caseStudies.filter((c) => c.id !== id),
  };
}

/** Moves the project at position `from` to position `to` (both indexes into `projects`). */
export function moveProject(data: CmsData, from: number, to: number): CmsData {
  const count = data.projects.length;
  if (from === to || from < 0 || to < 0 || from >= count || to >= count) return data;
  const projects = [...data.projects];
  const [moved] = projects.splice(from, 1);
  projects.splice(to, 0, moved);
  return { ...data, projects };
}

/** A project that has its own page (/case-study/<id>): visible, with a gallery. */
export interface PublishedProject {
  id: number;
  name: string;
  description: string;
  image: string | undefined;
}

/** The projects that should have a direct link and a sitemap entry, in site order. */
export function publishedProjects(data: CmsData): PublishedProject[] {
  return data.projects
    .filter((p) => p.visible && data.caseStudies.some((c) => c.id === p.id && c.visible !== false))
    .map((p) => ({
      id: p.id,
      name: projectName(data, p.id),
      description: p.desc?.en || '',
      image: p.image || data.caseStudies.find((c) => c.id === p.id)?.media.find((m) => m.type === 'image' && m.url)?.url,
    }));
}

/** Shows or hides a project on the site: its card and its direct link together. */
export function setProjectVisible(data: CmsData, id: number, visible: boolean): CmsData {
  return {
    ...data,
    projects: data.projects.map((p) => (p.id === id ? { ...p, visible } : p)),
    caseStudies: data.caseStudies.map((c) => (c.id === id ? { ...c, visible } : c)),
  };
}
