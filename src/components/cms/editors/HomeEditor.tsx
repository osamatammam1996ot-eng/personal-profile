import type { CmsData } from '../../../types/cms';
import { useState } from 'react';
import { Button } from '../../ui/button';
import { BilingualField, splitComma, cardClasses, inputClasses, labelClasses } from '../../../components/cms/shared/BilingualField';

interface HomeEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
  activeSection: string;
}

export function HomeEditor({ draft, updateDraft, activeSection }: HomeEditorProps) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const updateProject = (index: number, updater: (project: CmsData['projects'][number]) => CmsData['projects'][number]) => {
    updateDraft((prev) => {
      const projects = [...prev.projects];
      const base = projects[index] ?? {
        id: index + 1,
        visible: true,
        title: { en: '', ar: '' },
        image: '',
        tags: { en: [], ar: [] },
        desc: { en: '', ar: '' },
        accent: '#6366f1',
      };
      projects[index] = updater(base);
      return { ...prev, projects };
    });
  };

  const updateWhyCard = (index: number, updater: (card: CmsData['whyHireMe']['cards'][number]) => CmsData['whyHireMe']['cards'][number]) => {
    updateDraft((prev) => {
      const cards = [...prev.whyHireMe.cards];
      const base = cards[index] ?? {
        title: { en: '', ar: '' },
        desc: { en: '', ar: '' },
      };
      cards[index] = updater(base);
      return {
        ...prev,
        whyHireMe: {
          ...prev.whyHireMe,
          cards,
        },
      };
    });
  };

  const updateHeroRole = (index: number, lang: 'en' | 'ar', value: string) => {
    updateDraft((prev) => {
      const rolesEn = [...prev.hero.roles.en];
      const rolesAr = [...prev.hero.roles.ar];
      const target = lang === 'en' ? rolesEn : rolesAr;

      while (target.length <= index) {
        target.push('');
      }

      target[index] = value;

      return {
        ...prev,
        hero: {
          ...prev.hero,
          roles: {
            en: rolesEn,
            ar: rolesAr,
          },
        },
      };
    });
  };

  const addHeroRole = () => {
    updateDraft((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        roles: {
          en: [...prev.hero.roles.en, ''],
          ar: [...prev.hero.roles.ar, ''],
        },
      },
    }));
  };

  const removeHeroRole = (index: number) => {
    updateDraft((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        roles: {
          en: prev.hero.roles.en.filter((_: any, i: number) => i !== index),
          ar: prev.hero.roles.ar.filter((_: any, i: number) => i !== index),
        },
      },
    }));
  };

  if (activeSection === 'home-visibility') {
    const defaultOrder = ['hero', 'whyHireMe', 'skills', 'portfolio', 'tools', 'contact', 'footer'];
    const currentOrder = draft.sectionOrder || defaultOrder;

    const labelMap: Record<string, string> = {
      hero: 'Hero',
      whyHireMe: 'Why Hire Me',
      skills: 'Skills',
      portfolio: 'Portfolio',
      tools: 'Tools',
      contact: 'Contact',
      footer: 'Footer'
    };

    const handleDragStart = (index: number, e: React.DragEvent) => {
      setDraggedIdx(index);
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', ''); 
      }
    };

    const handleDragEnter = (index: number) => {
      if (draggedIdx === null || draggedIdx === index) return;
      
      updateDraft(prev => {
        const newOrder = [...(prev.sectionOrder || defaultOrder)];
        const item = newOrder.splice(draggedIdx, 1)[0];
        newOrder.splice(index, 0, item);
        return { ...prev, sectionOrder: newOrder };
      });
      setDraggedIdx(index);
    };

    const handleDragEnd = () => {
      setDraggedIdx(null);
    };

    return (
      <div>
        <h2 className="text-white mt-0">Section Visibility & Order</h2>
        <p style={{ color: '#a0a0a8', marginTop: 0 }}>Toggle any section on/off, and drag them to reorder your homepage.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
          {currentOrder.map((key, index) => {
            const sectionKey = key as keyof CmsData['sections'];
            const isDragging = index === draggedIdx;
            return (
              <div 
                key={key} 
                className={cardClasses}
                draggable
                onDragStart={(e) => handleDragStart(index, e)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '12px 16px',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  opacity: isDragging ? 0.3 : 1,
                  transform: isDragging ? 'scale(0.98)' : 'scale(1)',
                  transition: 'opacity 0.2s, transform 0.2s',
                  border: isDragging ? '1px dashed #6366f1' : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                  <div style={{ cursor: isDragging ? 'grabbing' : 'grab', color: '#6366f1', display: 'flex' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.sections[sectionKey] ?? true}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        sections: { ...prev.sections, [sectionKey]: e.target.checked },
                      }))
                    }
                    style={{ cursor: 'pointer', width: 16, height: 16, accentColor: '#6366f1' }}
                  />
                  <span style={{ color: '#fff', userSelect: 'none', fontWeight: 500 }}>{labelMap[key] || key}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (activeSection === 'home-hero') {
    return (
      <div className="grid gap-3">
        <h2 className="text-white mt-0">Hero Content</h2>
        <BilingualField
          label="Label"
          en={draft.hero.label.en}
          ar={draft.hero.label.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, label: { ...prev.hero.label, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, label: { ...prev.hero.label, ar: value } } }))}
        />
        <BilingualField
          label="Headline 1"
          en={draft.hero.headline1.en}
          ar={draft.hero.headline1.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, headline1: { ...prev.hero.headline1, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, headline1: { ...prev.hero.headline1, ar: value } } }))}
        />
        <BilingualField
          label="Headline 2"
          en={draft.hero.headline2.en}
          ar={draft.hero.headline2.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, headline2: { ...prev.hero.headline2, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, headline2: { ...prev.hero.headline2, ar: value } } }))}
        />
        <BilingualField
          label="Description"
          multiline
          en={draft.hero.desc.en}
          ar={draft.hero.desc.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, desc: { ...prev.hero.desc, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, desc: { ...prev.hero.desc, ar: value } } }))}
        />
        <BilingualField
          label="Primary CTA"
          en={draft.hero.cta1.en}
          ar={draft.hero.cta1.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, cta1: { ...prev.hero.cta1, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, cta1: { ...prev.hero.cta1, ar: value } } }))}
        />
        <BilingualField
          label="Secondary CTA"
          en={draft.hero.cta2.en}
          ar={draft.hero.cta2.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, cta2: { ...prev.hero.cta2, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, cta2: { ...prev.hero.cta2, ar: value } } }))}
        />

        <div className={cardClasses}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 13 }}>Roles</p>
            <button
              type="button"
              onClick={addHeroRole}
              style={{
                borderRadius: 8,
                border: '1px solid rgba(99,102,241,0.5)',
                background: 'rgba(99,102,241,0.16)',
                color: '#c7d2fe',
                padding: '6px 10px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              + Add role
            </button>
          </div>

          <div className="grid gap-2.5">
            {Array.from({ length: Math.max(draft.hero.roles.en.length, draft.hero.roles.ar.length, 1) }).map((_, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto',
                  gap: 10,
                  alignItems: 'end',
                }}
              >
                <div>
                  <label className={labelClasses}>English role {index + 1}</label>
                  <input
                    className={inputClasses}
                    value={draft.hero.roles.en[index] ?? ''}
                    onChange={(e) => updateHeroRole(index, 'en', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Arabic role {index + 1}</label>
                  <input
                    className={inputClasses}
                    dir="rtl"
                    value={draft.hero.roles.ar[index] ?? ''}
                    onChange={(e) => updateHeroRole(index, 'ar', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeHeroRole(index)}
                  disabled={Math.max(draft.hero.roles.en.length, draft.hero.roles.ar.length, 1) <= 1}
                  style={{
                    borderRadius: 8,
                    border: '1px solid rgba(239,68,68,0.45)',
                    background: 'rgba(239,68,68,0.14)',
                    color: '#fecaca',
                    padding: '10px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: Math.max(draft.hero.roles.en.length, draft.hero.roles.ar.length, 1) <= 1 ? 'not-allowed' : 'pointer',
                    opacity: Math.max(draft.hero.roles.en.length, draft.hero.roles.ar.length, 1) <= 1 ? 0.55 : 1,
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'home-whyhireme') {
    return (
      <div className="grid gap-3">
        <h2 className="text-white mt-0">Why Hire Me</h2>
        <BilingualField
          label="Word 1"
          en={draft.whyHireMe.word1.en}
          ar={draft.whyHireMe.word1.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, whyHireMe: { ...prev.whyHireMe, word1: { ...prev.whyHireMe.word1, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, whyHireMe: { ...prev.whyHireMe, word1: { ...prev.whyHireMe.word1, ar: value } } }))}
        />
        <BilingualField
          label="Word 2"
          en={draft.whyHireMe.word2.en}
          ar={draft.whyHireMe.word2.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, whyHireMe: { ...prev.whyHireMe, word2: { ...prev.whyHireMe.word2, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, whyHireMe: { ...prev.whyHireMe, word2: { ...prev.whyHireMe.word2, ar: value } } }))}
        />
        <BilingualField
          label="Word 3"
          en={draft.whyHireMe.word3.en}
          ar={draft.whyHireMe.word3.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, whyHireMe: { ...prev.whyHireMe, word3: { ...prev.whyHireMe.word3, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, whyHireMe: { ...prev.whyHireMe, word3: { ...prev.whyHireMe.word3, ar: value } } }))}
        />

        {[0, 1, 2, 3].map((index) => {
          const card = draft.whyHireMe.cards[index] ?? {
            title: { en: '', ar: '' },
            desc: { en: '', ar: '' },
          };
          return (
            <div key={index} className={cardClasses}>
              <p className="m-0 mb-2.5 text-white font-bold text-[13px]">
                Card {index + 1}
              </p>
              <div className="grid gap-2.5">
                <BilingualField
                  label="Title"
                  en={card.title.en}
                  ar={card.title.ar}
                  onChangeEn={(value) => updateWhyCard(index, (current) => ({ ...current, title: { ...current.title, en: value } }))}
                  onChangeAr={(value) => updateWhyCard(index, (current) => ({ ...current, title: { ...current.title, ar: value } }))}
                />
                <BilingualField
                  label="Description"
                  multiline
                  en={card.desc.en}
                  ar={card.desc.ar}
                  onChangeEn={(value) => updateWhyCard(index, (current) => ({ ...current, desc: { ...current.desc, en: value } }))}
                  onChangeAr={(value) => updateWhyCard(index, (current) => ({ ...current, desc: { ...current.desc, ar: value } }))}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (activeSection === 'home-portfolio') {
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 13 }}>Project {index + 1}</p>
                <label style={{ color: '#d3d3dc', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
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
                  en={project.title.en}
                  ar={project.title.ar}
                  onChangeEn={(value) => updateProject(index, (current) => ({ ...current, title: { ...current.title, en: value } }))}
                  onChangeAr={(value) => updateProject(index, (current) => ({ ...current, title: { ...current.title, ar: value } }))}
                />
                <BilingualField
                  label="Description"
                  multiline
                  en={project.desc.en}
                  ar={project.desc.ar}
                  onChangeEn={(value) => updateProject(index, (current) => ({ ...current, desc: { ...current.desc, en: value } }))}
                  onChangeAr={(value) => updateProject(index, (current) => ({ ...current, desc: { ...current.desc, ar: value } }))}
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 10 }}>
                  <div>
                    <label className={labelClasses}>Image URL</label>
                    <input
                      className={inputClasses}
                      value={project.image}
                      onChange={(e) => updateProject(index, (current) => ({ ...current, image: e.target.value }))}
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

  if (activeSection === 'home-skills') {
    return (
      <div className="grid gap-3">
        <h2 className="text-white mt-0">Skills Section</h2>
        <BilingualField
          label="Heading 1"
          en={draft.skills.heading1.en}
          ar={draft.skills.heading1.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, heading1: { ...prev.skills.heading1, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, heading1: { ...prev.skills.heading1, ar: value } } }))}
        />
        <BilingualField
          label="Heading 2"
          en={draft.skills.heading2.en}
          ar={draft.skills.heading2.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, heading2: { ...prev.skills.heading2, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, heading2: { ...prev.skills.heading2, ar: value } } }))}
        />
        <BilingualField
          label="Description"
          multiline
          en={draft.skills.desc.en}
          ar={draft.skills.desc.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, desc: { ...prev.skills.desc, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, desc: { ...prev.skills.desc, ar: value } } }))}
        />

        {[0, 1, 2].map((index) => {
          const disc = draft.skills.disciplines[index] ?? {
            title: { en: '', ar: '' },
            tagline: { en: '', ar: '' },
            tags: { en: [], ar: [] },
          };
          return (
            <div key={index} className={cardClasses}>
              <p className="m-0 mb-2.5 text-white font-bold text-[13px]">Discipline {index + 1}</p>
              <div className="grid gap-2.5">
                <BilingualField
                  label="Title"
                  en={disc.title.en}
                  ar={disc.title.ar}
                  onChangeEn={(value) => updateDraft((prev) => {
                    const d = [...prev.skills.disciplines];
                    d[index] = { ...d[index], title: { ...d[index].title, en: value } };
                    return { ...prev, skills: { ...prev.skills, disciplines: d } };
                  })}
                  onChangeAr={(value) => updateDraft((prev) => {
                    const d = [...prev.skills.disciplines];
                    d[index] = { ...d[index], title: { ...d[index].title, ar: value } };
                    return { ...prev, skills: { ...prev.skills, disciplines: d } };
                  })}
                />
                <BilingualField
                  label="Tagline"
                  multiline
                  en={disc.tagline.en}
                  ar={disc.tagline.ar}
                  onChangeEn={(value) => updateDraft((prev) => {
                    const d = [...prev.skills.disciplines];
                    d[index] = { ...d[index], tagline: { ...d[index].tagline, en: value } };
                    return { ...prev, skills: { ...prev.skills, disciplines: d } };
                  })}
                  onChangeAr={(value) => updateDraft((prev) => {
                    const d = [...prev.skills.disciplines];
                    d[index] = { ...d[index], tagline: { ...d[index].tagline, ar: value } };
                    return { ...prev, skills: { ...prev.skills, disciplines: d } };
                  })}
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className={labelClasses}>English tags (comma-separated)</label>
                    <input
                      className={inputClasses}
                      value={disc.tags?.en?.join(', ') || ''}
                      onChange={(e) => updateDraft((prev) => {
                        const d = [...prev.skills.disciplines];
                        d[index] = { ...d[index], tags: { ...d[index].tags, en: splitComma(e.target.value) } };
                        return { ...prev, skills: { ...prev.skills, disciplines: d } };
                      })}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Arabic tags (comma-separated)</label>
                    <input
                      className={inputClasses}
                      dir="rtl"
                      value={disc.tags?.ar?.join(', ') || ''}
                      onChange={(e) => updateDraft((prev) => {
                        const d = [...prev.skills.disciplines];
                        d[index] = { ...d[index], tags: { ...d[index].tags, ar: splitComma(e.target.value) } };
                        return { ...prev, skills: { ...prev.skills, disciplines: d } };
                      })}
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

  if (activeSection === 'home-tools') {
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

  if (activeSection === 'home-contact') {
    return (
      <div className="grid gap-3">
        <h2 className="text-white mt-0">Contact Section</h2>

        <div className={cardClasses}>
          <label className={labelClasses}>Email</label>
          <input
            className={inputClasses}
            value={draft.contact.email}
            onChange={(e) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))}
          />
        </div>

        <BilingualField
          label="Availability"
          en={draft.contact.availability.en}
          ar={draft.contact.availability.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, availability: { ...prev.contact.availability, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, availability: { ...prev.contact.availability, ar: value } } }))}
        />
        <BilingualField
          label="Headline 1"
          en={draft.contact.headline1.en}
          ar={draft.contact.headline1.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, headline1: { ...prev.contact.headline1, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, headline1: { ...prev.contact.headline1, ar: value } } }))}
        />
        <BilingualField
          label="Headline 2"
          en={draft.contact.headline2.en}
          ar={draft.contact.headline2.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, headline2: { ...prev.contact.headline2, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, headline2: { ...prev.contact.headline2, ar: value } } }))}
        />
        <BilingualField
          label="Headline 3"
          en={draft.contact.headline3.en}
          ar={draft.contact.headline3.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, headline3: { ...prev.contact.headline3, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, headline3: { ...prev.contact.headline3, ar: value } } }))}
        />
        <BilingualField
          label="Body"
          multiline
          en={draft.contact.body.en}
          ar={draft.contact.body.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, body: { ...prev.contact.body, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, body: { ...prev.contact.body, ar: value } } }))}
        />
        <BilingualField
          label="Note"
          multiline
          en={draft.contact.note.en}
          ar={draft.contact.note.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, note: { ...prev.contact.note, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, note: { ...prev.contact.note, ar: value } } }))}
        />
        <BilingualField
          label="Email Label"
          en={draft.contact.emailLabel.en}
          ar={draft.contact.emailLabel.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, emailLabel: { ...prev.contact.emailLabel, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, emailLabel: { ...prev.contact.emailLabel, ar: value } } }))}
        />
        <BilingualField
          label="Sign-off 1"
          multiline
          en={draft.contact.signoff1.en}
          ar={draft.contact.signoff1.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, signoff1: { ...prev.contact.signoff1, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, signoff1: { ...prev.contact.signoff1, ar: value } } }))}
        />
        <BilingualField
          label="Sign-off 2"
          multiline
          en={draft.contact.signoff2.en}
          ar={draft.contact.signoff2.ar}
          onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, signoff2: { ...prev.contact.signoff2, en: value } } }))}
          onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, signoff2: { ...prev.contact.signoff2, ar: value } } }))}
        />

        <div className={cardClasses}>
          <p className="m-0 mb-2.5 text-white font-bold text-[13px]">Social Links</p>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className={labelClasses}>WhatsApp</label>
              <input
                className={inputClasses}
                value={draft.contact.socials.whatsapp}
                onChange={(e) => updateDraft((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, socials: { ...prev.contact.socials, whatsapp: e.target.value } },
                }))}
              />
            </div>
            <div>
              <label className={labelClasses}>LinkedIn</label>
              <input
                className={inputClasses}
                value={draft.contact.socials.linkedin}
                onChange={(e) => updateDraft((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, socials: { ...prev.contact.socials, linkedin: e.target.value } },
                }))}
              />
            </div>
            <div>
              <label className={labelClasses}>Behance</label>
              <input
                className={inputClasses}
                value={draft.contact.socials.behance}
                onChange={(e) => updateDraft((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, socials: { ...prev.contact.socials, behance: e.target.value } },
                }))}
              />
            </div>
            <div>
              <label className={labelClasses}>Facebook</label>
              <input
                className={inputClasses}
                value={draft.contact.socials.facebook}
                onChange={(e) => updateDraft((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, socials: { ...prev.contact.socials, facebook: e.target.value } },
                }))}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <p style={{ color: '#a0a0a8' }}>Section editor not available.</p>;
}
