import { describe, expect, it } from 'vitest';
import { DEFAULT_CMS_DATA, type CmsData } from '../types/cms';
import { addProject, moveProject, projectName, publishedProjects, removeProject, setProjectVisible } from './cms-projects';

const data = (): CmsData => JSON.parse(JSON.stringify(DEFAULT_CMS_DATA));
const ids = (d: CmsData) => d.projects.map((p) => p.id);

describe('addProject', () => {
  it('appends a hidden card and an empty gallery with the next free id', () => {
    const { data: next, id } = addProject(data());
    expect(id).toBe(5);
    expect(ids(next)).toEqual([1, 2, 3, 4, 5]);
    expect(next.projects.at(-1)?.visible).toBe(false);
    expect(next.caseStudies.find((c) => c.id === 5)?.media).toEqual([]);
  });

  it('never reuses an id that only a gallery still holds', () => {
    const d = data();
    d.caseStudies.push({ id: 9, visible: true, title: { en: '', ar: '' }, media: [] });
    expect(addProject(d).id).toBe(10);
  });

  it('starts at 1 when there are no projects', () => {
    expect(addProject({ ...data(), projects: [], caseStudies: [] }).id).toBe(1);
  });
});

describe('removeProject', () => {
  it('removes the card and its gallery, nothing else', () => {
    const next = removeProject(data(), 2);
    expect(ids(next)).toEqual([1, 3, 4]);
    expect(next.caseStudies.map((c) => c.id)).toEqual([1, 3, 4]);
  });
});

describe('moveProject', () => {
  it('moves a project down and up', () => {
    expect(ids(moveProject(data(), 0, 2))).toEqual([2, 3, 1, 4]);
    expect(ids(moveProject(data(), 3, 0))).toEqual([4, 1, 2, 3]);
  });

  it('ignores moves past either end', () => {
    const d = data();
    expect(moveProject(d, 0, -1)).toBe(d);
    expect(moveProject(d, 3, 4)).toBe(d);
  });
});

describe('setProjectVisible', () => {
  it('hides the card and the direct link together', () => {
    const next = setProjectVisible(data(), 3, false);
    expect(next.projects.find((p) => p.id === 3)?.visible).toBe(false);
    expect(next.caseStudies.find((c) => c.id === 3)?.visible).toBe(false);
    expect(next.projects.find((p) => p.id === 1)?.visible).toBe(true);
  });
});

describe('publishedProjects', () => {
  it('lists visible projects with a gallery, in site order', () => {
    let d = moveProject(data(), 3, 0);
    d = setProjectVisible(d, 2, false);
    d = addProject(d).data; // new projects start hidden
    expect(publishedProjects(d).map((p) => p.id)).toEqual([4, 1, 3]);
  });

  it('falls back to the first gallery image when the card has no cover', () => {
    const d = data();
    d.projects[0].image = '';
    d.caseStudies[0].media = [{ id: 'a', type: 'image', url: 'https://example.com/a.png' }];
    expect(publishedProjects(d)[0].image).toBe('https://example.com/a.png');
  });
});

describe('projectName', () => {
  it('falls back from the card title to the gallery title to a placeholder', () => {
    const d = addProject(data()).data;
    expect(projectName(d, 1)).toBe(d.projects[0].title.en);
    expect(projectName(d, 5)).toBe('Untitled project');
    d.caseStudies.find((c) => c.id === 5)!.title.en = 'Gallery only';
    expect(projectName(d, 5)).toBe('Gallery only');
  });
});
