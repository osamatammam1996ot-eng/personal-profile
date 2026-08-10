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
  items: { id: string; label: string; icon: string }[];
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
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#0f0f12',
      fontFamily: 'var(--font-body)',
      overflow: 'hidden',
    }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside style={{
        width: sidebarOpen ? 240 : 0,
        minWidth: sidebarOpen ? 240 : 0,
        background: '#1a1a1e',
        borderRight: `1px solid ${'#2a2a2f'}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        flexShrink: 0,
      }}>
        {/* Sidebar header */}
        <div style={{
          padding: '20px 16px 16px',
          borderBottom: `1px solid ${'#2a2a2f'}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
          }}>
            <span style={{ fontSize: 14 }}>✦</span>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
              CMS Dashboard
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 10.5, color: '#808086', margin: '1px 0 0' }}>
              Osama Tammam Portfolio
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflow: 'auto', padding: '12px 0' }}>
          {NAV.map(group => (
            <div key={group.id} style={{ marginBottom: 4 }}>
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 16px', border: 'none',
                  background: 'none', cursor: 'pointer', borderRadius: 0,
                }}
              >
                <span style={{ color: '#808086' }}>{group.icon}</span>
                <span style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11,
                  letterSpacing: '0.07em', textTransform: 'uppercase',
                  color: '#808086', flex: 1, textAlign: 'left',
                }}>
                  {group.label}
                </span>
                <ChevronRight
                  size={12}
                  color={'#808086'}
                  style={{
                    transform: expandedGroups.has(group.id) ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>

              {/* Group items */}
              {expandedGroups.has(group.id) && (
                <div style={{ paddingLeft: 8 }}>
                  {group.items.map(item => {
                    const isActive = activeSection === item.id;
                    const vis = getSectionVisible(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          width: '100%', padding: '8px 12px',
                          background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'none',
                          border: isActive ? `1px solid ${'#6366f1'}` : '1px solid transparent',
                          borderRadius: 8, cursor: 'pointer', marginBottom: 2,
                        }}
                      >
                        <span style={{ fontSize: 13 }}>{item.icon}</span>
                        <span style={{
                          fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: isActive ? 600 : 400,
                          color: isActive ? '#a5b4fc' : '#a0a0a8',
                          flex: 1, textAlign: 'left',
                        }}>
                          {item.label}
                        </span>
                        {vis === false && (
                          <EyeOff size={10} color={'#808086'} />
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
        <div style={{
          padding: '12px 16px',
          borderTop: `1px solid ${'#2a2a2f'}`,
          flexShrink: 0,
        }}>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-9"
            onClick={() => router.push('/')}
          >
            <ArrowLeft size={14} className="text-muted-foreground" />
            <span className="font-medium text-muted-foreground">
              View Portfolio
            </span>
          </Button>

          {draft?.updatedAt && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 10.5, color: '#808086', marginTop: 8, textAlign: 'center' }}>
              Last saved {new Date(draft.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: 60,
          background: '#1a1a1e',
          borderBottom: `1px solid ${'#2a2a2f'}`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 20px',
          flexShrink: 0,
        }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#a0a0a8', display: 'flex', padding: 4, borderRadius: 6,
            }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Breadcrumb */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#808086' }}>CMS</span>
            <ChevronRight size={12} color={'#808086'} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#ffffff' }}>
              {getActiveSectionLabel(activeSection)}
            </span>
          </div>

          {/* Status + Save */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Unsaved indicator */}
            {hasChanges && saveStatus === 'idle' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#f59e0b', fontWeight: 500 }}>
                  Unsaved changes
                </span>
              </div>
            )}
            {saveStatus === 'saved' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={14} color={'#22c55e'} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#22c55e', fontWeight: 500 }}>
                  Changes saved
                </span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={14} color={'#ef4444'} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#ef4444', fontWeight: 500 }}>
                  Save failed
                </span>
              </div>
            )}

            {/* Refresh */}
            <button
              onClick={fetchData}
              disabled={loading}
              title="Reload from server"
              style={{
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${'#2a2a2f'}`,
                borderRadius: 8, padding: '7px', cursor: loading ? 'wait' : 'pointer',
                color: '#a0a0a8', display: 'flex', alignItems: 'center',
              }}
            >
              <RefreshCw size={14} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} />
            </button>

            {/* Save button */}
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saveStatus === 'saving' || loading}
              className={`gap-2 h-9 px-4 ${
                (!hasChanges || saveStatus === 'saving') 
                  ? 'bg-white/5 border border-border text-muted-foreground shadow-none'
                  : 'bg-gradient-to-br from-brand to-[#8b5cf6] text-white shadow-card hover:shadow-card/80'
              }`}
            >
              {saveStatus === 'saving' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {saveStatus === 'saving' ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '32px 36px' }}>
          {/* Fetch error banner */}
          {fetchError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)', border: `1px solid rgba(239,68,68,0.25)`,
              borderRadius: 10, padding: '12px 16px', marginBottom: 20,
              display: 'flex', gap: 10, alignItems: 'center',
            }}>
              <AlertCircle size={16} color={'#ef4444'} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#ef4444' }}>
                Could not load data from server — showing defaults. {fetchError}
              </span>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingTop: 80 }}>
              <div style={{
                width: 36, height: 36, border: `3px solid rgba(99,102,241,0.2)`,
                borderTopColor: '#6366f1', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <span style={{ fontFamily: 'var(--font-body)', color: '#a0a0a8', fontSize: 14 }}>Loading CMS data…</span>
            </div>
          )}

          {/* Editors */}
          {!loading && draft && (
            <>
              {activeSection.startsWith('home-') && (
                <HomeEditor
                  draft={draft}
                  updateDraft={updateDraft}
                  activeSection={activeSection}
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
    'home-contact': 'Contact',
    'cs-1': 'Nexus Analytics Platform',
    'cs-2': 'Orion Enterprise Suite',
    'cs-3': 'Lumina AI Product',
    'cs-4': 'HealthBridge Mobile App',
    'global-settings': 'Global Settings',
  };
  return labels[id] ?? id;
}