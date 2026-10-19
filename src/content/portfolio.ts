import { useCms } from '../contexts/CmsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { localized, localizedList } from './localize';

export interface Project {
  id: number;
  title: string;
  tags: string[];
  image: string;
  accent: string;
  desc: string;
}

// Shown only until real projects are added in the CMS; their photos also stand in for
// any CMS project saved without an image.
const PLACEHOLDER_PROJECTS = [
  {
    id: 1,
    title: 'Nexus Analytics Platform',
    tags: ['SaaS', 'AI', 'Data Viz', 'B2B'],
    image: 'https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYWFTJTIwZGFzaGJvYXJkJTIwVUklMjBkZXNpZ24lMjBkYXJrJTIwYXBwfGVufDF8fHx8MTc3NDEwMzQxOHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 2,
    title: 'Orion Enterprise Suite',
    tags: ['Enterprise', 'Design System', 'SaaS', 'Scale'],
    image: 'https://images.unsplash.com/photo-1763568258367-1c52beb60be7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnRlcnByaXNlJTIwc29mdHdhcmUlMjBpbnRlcmZhY2UlMjBwcm9kdWN0aXZpdHl8ZW58MXx8fHwxNzc0MTAzNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 3,
    title: 'Lumina AI Product',
    tags: ['AI Product', 'Startup', 'Product Strategy'],
    image: 'https://images.unsplash.com/photo-1591381287254-b3349c60bf9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMG1hY2hpbmUlMjBsZWFybmluZyUyMHByb2R1Y3QlMjBpbnRlcmZhY2UlMjBmdXR1cmlzdGljfGVufDF8fHx8MTc3NDEwMzQxOXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 4,
    title: 'HealthBridge Mobile App',
    tags: ['Mobile', 'Healthcare', 'Accessibility', 'UX Research'],
    image: 'https://images.unsplash.com/photo-1767449441925-737379bc2c4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBVWCUyMGRlc2lnbiUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzc0MTAzNDIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

const BRAND_ACCENT = 'var(--color-brand)';

/** Visible CMS projects in the current language, or placeholders while there are none. */
export function useProjects(): Project[] {
  const { cmsData } = useCms();
  const { lang, t } = useLanguage();

  const projects = cmsData.projects
    .filter((p) => p.visible)
    .map((p, i) => ({
      id: p.id,
      title: localized(p.title, lang, p.title?.en),
      tags: localizedList(p.tags, lang, p.tags?.en),
      image: p.image || PLACEHOLDER_PROJECTS[i % PLACEHOLDER_PROJECTS.length].image,
      accent: p.accent || BRAND_ACCENT,
      desc: localized(p.desc, lang, p.desc?.en),
    }));

  if (projects.length) return projects;
  return PLACEHOLDER_PROJECTS.map((p, i) => ({ ...p, accent: BRAND_ACCENT, desc: t.portfolio.fallbackDesc(i + 1) }));
}
