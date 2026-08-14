"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save, CheckCircle, AlertCircle, Loader2, LayoutDashboard, FileText,
  Settings, ChevronRight, Eye, EyeOff, ArrowLeft, Menu, X, RefreshCw,
} from 'lucide-react';
import type { CmsData } from '../../types/cms';
import { DEFAULT_CMS_DATA } from '../../types/cms';
import { HomeEditor } from '../../components/cms/editors/HomeEditor';
import { CaseStudiesEditor } from '../../components/cms/editors/CaseStudiesEditor';
import { GlobalSettingsEditor } from '../../components/cms/editors/GlobalSettingsEditor';
import { RecommendationsEditor } from '../../components/cms/editors/RecommendationsEditor';
import { Button } from '../../components/ui/button';

// Deep-merge helper: ensures every key from `base` exists in the result,
// filling in missing fields from DEFAULT_CMS_DATA.
function mergeDeep<T>(base: T, override: any): T {
  if (override === undefined || override === null) {
    return JSON.parse(JSON.stringify(base));
  }
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? JSON.parse(JSON.stringify(override)) : JSON.parse(JSON.stringify(base))) as T;
  }
  if (typeof base === 'object' && base !== null) {
    const result: Record<string, any> = {};
    const baseObj = base as Record<string, any>;
    const overrideObj = typeof override === 'object' && override !== null ? override : {};
    for (const key of Object.keys(baseObj)) {
      result[key] = mergeDeep(baseObj[key], overrideObj[key]);
    }
    return result as T;
  }
  return (override as T) ?? base;
}

function normalizeCmsData(input: unknown): CmsData {
  return mergeDeep(DEFAULT_CMS_DATA, input);
}

// ─── Nav items structure ──────────────────────────────────────────────────────
type NavSection = {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: 'group';
  items: { id: string; label: string; icon: React.ReactNode }[];
};

const NAV: NavSection[] = [
  {
    id: 'home',
    label: 'Home Page',
    icon: <LayoutDashboard size={15} />,
    type: 'group',
    items: [
      { id: 'home-visibility', label: 'Section Visibility', icon: '👁️' },
      { id: 'home-hero', label: 'Hero', icon: '🏠' },
      { id: 'home-whyhireme', label: 'Why Hire Me', icon: '⭐' },
      { id: 'home-skills', label: 'Skills (Craft Engine)', icon: '🔮' },
      { id: 'home-tools', label: 'Tools', icon: '🛠️' },
      { id: 'home-portfolio', label: 'Portfolio Projects', icon: '💼' },
      { id: 'home-recommendations', label: 'Recommendations', icon: '💬' },
      { id: 'home-contact', label: 'Contact', icon: '✉️' },
    ],
  },
  {
    id: 'casestudies',
    label: 'Case Studies',
    icon: <FileText size={15} />,
    type: 'group',
    items: [
      { id: 'cs-1', label: 'Nexus Analytics', icon: '🔵' },
      { id: 'cs-2', label: 'Orion Enterprise', icon: '🟣' },
      { id: 'cs-3', label: 'Lumina AI', icon: '🩵' },
      { id: 'cs-4', label: 'HealthBridge', icon: '🔮' },
    ],
  },
  {
    id: 'global',
    label: 'Global Settings',
    icon: <Settings size={15} />,
    type: 'group',
    items: [
      { id: 'global-settings', label: 'SEO & Owner', icon: '⚙️' },
    ],
  },
];

// ─── Status type ──────────────────────────────────────────────────────────────
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('home-visibility');
  const [draft, setDraft] = useState<CmsData | null>(null);
  const [original, setOriginal] = useState<CmsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['home', 'casestudies', 'global']));
  // Fetch CMS data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    const STORAGE_KEY = 'cms:portfolio:v2:local';
    try {
      const { getCmsDataAction } = await import('@/app/actions/cms');
      const response = await getCmsDataAction();
      
      if (response.error) throw new Error(response.error);
      
      const data: CmsData = normalizeCmsData(response.data ?? DEFAULT_CMS_DATA);
      setDraft(JSON.parse(JSON.stringify(data)));
      setOriginal(JSON.parse(JSON.stringify(data)));
      // Save to local storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('CMS fetch error:', e);
      // Try local storage first
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = normalizeCmsData(JSON.parse(saved));
          setDraft(JSON.parse(JSON.stringify(data)));
          setOriginal(JSON.parse(JSON.stringify(data)));
          setFetchError('Using local storage (backend unavailable)');
        } else {
          throw new Error('No local data');
        }
      } catch {
        // Fall back to defaults
        const def = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA));
        setDraft(def);
        setOriginal(def);
        setFetchError('Using defaults (backend unavailable)');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Detect changes
  const hasChanges = JSON.stringify(draft) !== JSON.stringify(original);

  // Save to backend
  const handleSave = async () => {
    if (!draft || !hasChanges) return;
    setSaveStatus('saving');
    const STORAGE_KEY = 'cms:portfolio:v2:local';
    
    try {
      const { saveCmsDataAction } = await import('@/app/actions/cms');
      const response = await saveCmsDataAction(draft);

      if (response.error) {
        throw new Error(response.error);
      }

      const saved = { ...draft, updatedAt: response.updatedAt };
      setOriginal(JSON.parse(JSON.stringify(saved)));
      setDraft(JSON.parse(JSON.stringify(saved)));
      // Also save to local storage as backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3500);
    } catch (e) {
      console.error('CMS save error:', e);
      // Fall back to local storage
      try {
        const saved = { ...draft, updatedAt: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        setOriginal(JSON.parse(JSON.stringify(saved)));
        setDraft(JSON.parse(JSON.stringify(saved)));
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3500);
      } catch (storageErr) {
        console.error('Local storage save error:', storageErr);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 4000);
      }
    }
  };

  // Update draft helper
  const updateDraft = useCallback((updater: (prev: CmsData) => CmsData) => {
    setDraft(prev => prev ? updater(prev) : prev);
  }, []);

  // Keyboard shortcut for saving
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [draft, hasChanges]); // depend on draft and hasChanges so handleSave gets latest state


  // Toggle group
  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Determine section visibility for nav badge
  const getSectionVisible = (id: string): boolean | null => {
    if (!draft) return null;
    if (id === 'home-hero') return draft.sections.hero;
    if (id === 'home-whyhireme') return draft.sections.whyHireMe;
    if (id === 'home-portfolio') return draft.sections.portfolio;
    if (id === 'home-recommendations') return draft.sections.recommendations;
    if (id === 'home-contact') return draft.sections.contact;
    if (id === 'cs-1') return draft.caseStudies.find(c => c.id === 1)?.visible ?? true;
    if (id === 'cs-2') return draft.caseStudies.find(c => c.id === 2)?.visible ?? true;
    if (id === 'cs-3') return draft.caseStudies.find(c => c.id === 3)?.visible ?? true;
    if (id === 'cs-4') return draft.caseStudies.find(c => c.id === 4)?.visible ?? true;
    return null;
  };

  // Get active cs id
  const getActiveCsId = (): number => {
    const match = activeSection.match(/^cs-(\d+)$/);
    return match ? parseInt(match[1]) : 1;
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden font-body relative z-0 p-4 lg:p-6 gap-4 lg:gap-6">
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside 
        className={`flex flex-col bg-admin-glass-nav backdrop-blur-2xl border border-admin-border-subtle rounded-3xl shadow-2xl transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shrink-0 ${sidebarOpen ? "w-[260px] min-w-[260px] opacity-100 translate-x-0" : "w-0 min-w-0 opacity-0 -translate-x-10"}`}
      >
        {/* Sidebar header */}
        <div className="p-6 border-b border-admin-border-subtle flex items-center gap-4 bg-admin-highlight/20 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand to-brand-hover flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(109,79,184,0.4)]">
            <span className="text-[14px] text-white">✦</span>
          </div>
          <div>
            <p className="font-bold text-[13px] text-white m-0 tracking-tight">
              CMS Dashboard
            </p>
            <p className="text-[10.5px] text-white/50 m-0 mt-0.5">
              Osama Tammam Portfolio
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-auto py-4 custom-scrollbar">
          {NAV.map(group => (
            <div key={group.id} className="mb-2">
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex items-center justify-between w-[calc(100%-32px)] mx-4 mt-4 mb-2 px-4 py-2 rounded-xl border border-transparent bg-transparent text-white/50 cursor-pointer text-left text-[11px] font-bold uppercase tracking-[0.15em] hover:text-white hover:bg-white/5 hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <span>{group.icon}</span>
                  <span>{group.label}</span>
                </div>
                <ChevronRight
                  size={12}
                  className={`transition-transform duration-200 ${expandedGroups.has(group.id) ? 'rotate-90' : 'rotate-0'}`}
                />
              </button>

              {/* Group items */}
              {expandedGroups.has(group.id) && (
                <div className="pl-2">
                  {group.items.map(item => {
                    const isActive = activeSection === item.id;
                    const vis = getSectionVisible(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`group flex items-center gap-3 w-[calc(100%-32px)] mx-4 my-1 px-4 py-2.5 rounded-xl border cursor-pointer transition-all duration-300 text-left text-[13px] ${isActive ? "bg-white/10 text-white font-semibold border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]" : "bg-transparent text-white/60 hover:text-white hover:bg-white/5 hover:border-white/10 border-transparent font-medium"}`}
                      >
                        <span className={`transition-colors duration-300 ${isActive ? 'text-brand' : 'text-white/40 group-hover:text-white/70'}`}>{item.icon}</span>
                        <span className="flex-1">
                          {item.label}
                        </span>
                        {vis === false && (
                          <EyeOff size={12} className="text-white/40" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-6 border-t border-admin-border-subtle bg-admin-highlight/10 mt-auto shrink-0">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-10 rounded-xl border-admin-border-subtle hover:border-admin-border-strong hover:bg-white/5 bg-transparent text-white/70 transition-all duration-300"
            onClick={() => router.push('/')}
          >
            <ArrowLeft size={14} />
            <span className="font-medium">
              View Portfolio
            </span>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-10 mt-3 rounded-xl border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/30 bg-transparent transition-all duration-300"
            onClick={async () => {
              const { logoutAction } = await import('@/app/actions/auth');
              await logoutAction();
            }}
          >
            <span className="font-medium">Logout</span>
          </Button>

          {draft?.updatedAt && (
            <p className="text-[10.5px] text-white/40 mt-4 text-center">
              Last saved {new Date(draft.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-admin-glass-content backdrop-blur-3xl border border-admin-border-subtle rounded-3xl shadow-2xl transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
        {/* Top bar */}
        <header className="h-[76px] border-b border-admin-border-subtle bg-admin-highlight/5 flex items-center justify-between px-8 z-10 shrink-0 relative">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="bg-white/5 border border-white/10 text-white/70 cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 hover:text-white hover:border-white/20 transition-all shadow-sm backdrop-blur-md"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Breadcrumb */}
          <div className="flex-1 flex items-center gap-3 px-6">
            <span className="text-[13px] text-white/50 tracking-wide">CMS</span>
            <ChevronRight size={14} className="text-white/30" />
            <span className="text-[14px] font-bold text-white tracking-wide">
              {getActiveSectionLabel(activeSection)}
            </span>
          </div>

          {/* Status + Save */}
          <div className="flex items-center gap-4">
            {/* Unsaved indicator */}
            {hasChanges && saveStatus === 'idle' && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                <span className="text-[12px] text-amber-500 font-medium tracking-wide">
                  Unsaved changes
                </span>
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] rounded-full" />
                <span className="text-[12px] text-green-500 font-medium tracking-wide">
                  Changes saved
                </span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)] rounded-full" />
                <span className="text-[12px] text-red-500 font-medium tracking-wide">
                  Save failed
                </span>
              </div>
            )}

            {/* Refresh */}
            <button
              onClick={fetchData}
              disabled={loading}
              title="Reload from server"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait ml-2"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>

            {/* Save button */}
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saveStatus === 'saving' || loading}
              className={`gap-2.5 h-10 px-6 rounded-xl text-[14px] font-semibold flex items-center transition-all duration-300 backdrop-blur-md ml-2 ${
                (!hasChanges || saveStatus === 'saving') 
                  ? 'bg-white/5 border border-white/10 text-white/40 shadow-none'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-white/40'
              }`}
            >
              {saveStatus === 'saving' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saveStatus === 'saving' ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 md:p-10 lg:p-14 custom-scrollbar">
          <div className="max-w-[1100px] mx-auto flex flex-col gap-8">
            {/* Fetch error banner */}
            {fetchError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-3 items-center backdrop-blur-sm">
                <AlertCircle size={18} className="text-red-400" />
                <span className="text-[13px] text-red-400 font-medium">
                  Could not load data from server — showing defaults. {fetchError}
                </span>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="flex flex-col items-center justify-center gap-4 pt-32">
                <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin shadow-[0_0_15px_var(--cursor-glow)]" />
                <span className="text-white/50 text-[14px] font-medium tracking-wide">Loading CMS Data…</span>
              </div>
            )}

            {/* Editors */}
            {!loading && draft && (
              <>
                {activeSection.startsWith('home-') && activeSection !== 'home-recommendations' && (
                  <HomeEditor
                    draft={draft}
                    updateDraft={updateDraft}
                    activeSection={activeSection}
                  />
                )}
                {activeSection === 'home-recommendations' && (
                  <RecommendationsEditor
                    draft={draft}
                    updateDraft={updateDraft}
                  />
                )}
                {activeSection.startsWith('cs-') && (
                  <CaseStudiesEditor
                    draft={draft}
                    updateDraft={updateDraft}
                    activeCsId={getActiveCsId()}
                  />
                )}
                {activeSection === 'global-settings' && (
                  <GlobalSettingsEditor
                    draft={draft}
                    updateDraft={updateDraft}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: ${'#0f0f12'}; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}

function getActiveSectionLabel(id: string): string {
  const labels: Record<string, string> = {
    'home-visibility': 'Section Visibility',
    'home-hero': 'Hero',
    'home-whyhireme': 'Why Hire Me',
    'home-skills': 'Skills (Craft Engine)',
    'home-tools': 'Tools',
    'home-portfolio': 'Portfolio Projects',
    'home-recommendations': 'Recommendations',
    'home-contact': 'Contact',
    'cs-1': 'Nexus Analytics Platform',
    'cs-2': 'Orion Enterprise Suite',
    'cs-3': 'Lumina AI Product',
    'cs-4': 'HealthBridge Mobile App',
    'global-settings': 'Global Settings',
  };
  return labels[id] ?? id;
}