import type { CmsData } from '../../types/cms';
import { useState } from 'react';
import { Button } from '../ui/button';

interface HomeEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
  activeSection: string;
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  padding: 16,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(0,0,0,0.2)',
  color: '#fff',
  padding: '10px 12px',
  fontSize: 13,
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: '#c7c7d0',
  marginBottom: 6,
  display: 'block',
};

function splitComma(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function BilingualField({
  label,
  en,
  ar,
  multiline,
  onChangeEn,
  onChangeAr,
}: {
  label: string;
  en: string;
  ar: string;
  multiline?: boolean;
  onChangeEn: (value: string) => void;
  onChangeAr: (value: string) => void;
}) {
  const Control = multiline ? 'textarea' : 'input';
  const extra = multiline ? { rows: 3 } : {};

  return (
    <div style={cardStyle}>
      <p style={{ margin: '0 0 10px', color: '#fff', fontWeight: 700, fontSize: 13 }}>{label}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={labelStyle}>English</label>
          <Control
            {...extra}
            style={inputStyle}
            value={en}
            onChange={(e) => onChangeEn(e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Arabic</label>
          <Control
            {...extra}
            style={inputStyle}
            dir="rtl"
            value={ar}
            onChange={(e) => onChangeAr(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
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
          en: prev.hero.roles.en.filter((_, i) => i !== index),
          ar: prev.hero.roles.ar.filter((_, i) => i !== index),
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
        <h2 style={{ color: '#fff', marginTop: 0 }}>Section Visibility & Order</h2>
        <p style={{ color: '#a0a0a8', marginTop: 0 }}>Toggle any section on/off, and drag them to reorder your homepage.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
          {currentOrder.map((key, index) => {
            const sectionKey = key as keyof CmsData['sections'];
            const isDragging = index === draggedIdx;
            return (
              <div 
                key={key} 
                draggable
                onDragStart={(e) => handleDragStart(index, e)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                style={{ 
                  ...cardStyle, 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '12px 16px',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  opacity: isDragging ? 0.3 : 1,
                  transform: isDragging ? 'scale(0.98)' : 'scale(1)',
                  transition: 'opacity 0.2s, transform 0.2s',
                  border: isDragging ? '1px dashed #6366f1' : cardStyle.border,
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
      <div style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ color: '#fff', marginTop: 0 }}>Hero Content</h2>
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

        <div style={cardStyle}>
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

          <div style={{ display: 'grid', gap: 10 }}>
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
                  <label style={labelStyle}>English role {index + 1}</label>
                  <input
                    style={inputStyle}
                    value={draft.hero.roles.en[index] ?? ''}
                    onChange={(e) => updateHeroRole(index, 'en', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Arabic role {index + 1}</label>
                  <input
                    style={inputStyle}
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
      <div style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ color: '#fff', marginTop: 0 }}>Why Hire Me</h2>
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
            <div key={index} style={cardStyle}>
              <p style={{ margin: '0 0 10px', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                Card {index + 1}
              </p>
              <div style={{ display: 'grid', gap: 10 }}>
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
      <div style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ color: '#fff', marginTop: 0 }}>Portfolio Projects</h2>
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
            <div key={index} style={cardStyle}>
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

              <div style={{ display: 'grid', gap: 10 }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={labelStyle}>English tags (comma-separated)</label>
                    <input
                      style={inputStyle}
                      value={project.tags.en.join(', ')}
                      onChange={(e) => updateProject(index, (current) => ({ ...current, tags: { ...current.tags, en: splitComma(e.target.value) } }))}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Arabic tags (comma-separated)</label>
                    <input
                      style={inputStyle}
                      dir="rtl"
                      value={project.tags.ar.join(', ')}
                      onChange={(e) => updateProject(index, (current) => ({ ...current, tags: { ...current.tags, ar: splitComma(e.target.value) } }))}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 10 }}>
                  <div>
                    <label style={labelStyle}>Image URL</label>
                    <input
                      style={inputStyle}
                      value={project.image}
                      onChange={(e) => updateProject(index, (current) => ({ ...current, image: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Accent color</label>
                    <input
                      style={inputStyle}
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

  if (activeSection === 'home-contact') {
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ color: '#fff', marginTop: 0 }}>Contact Section</h2>

        <div style={cardStyle}>
          <label style={labelStyle}>Email</label>
          <input
            style={inputStyle}
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

        <div style={cardStyle}>
          <p style={{ margin: '0 0 10px', color: '#fff', fontWeight: 700, fontSize: 13 }}>Social Links</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>WhatsApp</label>
              <input
                style={inputStyle}
                value={draft.contact.socials.whatsapp}
                onChange={(e) => updateDraft((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, socials: { ...prev.contact.socials, whatsapp: e.target.value } },
                }))}
              />
            </div>
            <div>
              <label style={labelStyle}>LinkedIn</label>
              <input
                style={inputStyle}
                value={draft.contact.socials.linkedin}
                onChange={(e) => updateDraft((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, socials: { ...prev.contact.socials, linkedin: e.target.value } },
                }))}
              />
            </div>
            <div>
              <label style={labelStyle}>Behance</label>
              <input
                style={inputStyle}
                value={draft.contact.socials.behance}
                onChange={(e) => updateDraft((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, socials: { ...prev.contact.socials, behance: e.target.value } },
                }))}
              />
            </div>
            <div>
              <label style={labelStyle}>Facebook</label>
              <input
                style={inputStyle}
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
