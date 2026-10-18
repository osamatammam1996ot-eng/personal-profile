import { useCallback, useEffect, useState } from 'react';
import { Inbox, RefreshCw, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { cardClasses } from '../shared/BilingualField';
import { listFeedbackAction, dismissFeedbackAction, type FeedbackSubmission } from '../../../app/actions/feedback';

/**
 * Feedback visitors sent from "Add yours". Nothing here is public. To publish one,
 * add it by hand under Recommendations, then dismiss it here.
 */
export function FeedbackInboxEditor() {
  const [items, setItems] = useState<FeedbackSubmission[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await listFeedbackAction();
    if ('error' in res) { setError(res.error); setItems([]); }
    else setItems(res.items);
  }, []);

  useEffect(() => { load(); }, [load]);

  const dismiss = async (item: FeedbackSubmission) => {
    if (!confirm(`Dismiss feedback from ${item.name}? This deletes it permanently.`)) return;
    setBusyId(item.id);
    const res = await dismissFeedbackAction(item.id);
    setBusyId(null);
    if ('error' in res) setError(res.error);
    else setItems((prev) => prev?.filter((i) => i.id !== item.id) ?? prev);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-admin-fg text-2xl font-bold tracking-tight">New Feedback</h2>
          <p className="text-admin-fg/50 text-base mt-1">
            Sent by visitors from &ldquo;Add yours&rdquo;. Nothing here is public. To publish one, add it under
            Recommendations, then dismiss it here.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={load}
          className="gap-2 shrink-0 border-admin-border-subtle bg-transparent text-admin-fg/70 hover:text-admin-fg hover:bg-admin-fg/5"
        >
          <RefreshCw size={14} /> Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 rounded-2xl p-4 text-base text-danger font-medium">{error}</div>
      )}

      {items === null && <p className="text-admin-fg/50">Loading…</p>}

      {items && items.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-admin-border-subtle rounded-2xl bg-admin-fg/5">
          <div className="w-12 h-12 rounded-full bg-admin-fg/5 flex items-center justify-center mb-4 text-admin-fg/30">
            <Inbox size={24} />
          </div>
          <p className="text-admin-fg/60 font-medium">No new feedback</p>
        </div>
      )}

      <div className="space-y-4">
        {items?.map((item) => (
          <div key={item.id} className={`${cardClasses} flex flex-col gap-4`}>
            <div className="flex items-start justify-between gap-4 border-b border-admin-border-subtle pb-4">
              <div>
                <h3 className="text-admin-fg font-semibold">{item.name}</h3>
                <p className="text-admin-fg/40 text-sm mt-0.5">
                  {new Date(item.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={busyId === item.id}
                onClick={() => dismiss(item)}
                className="h-8 gap-2 shrink-0 border-admin-border-subtle bg-transparent text-danger hover:text-danger/80 hover:border-danger/30 hover:bg-danger/10 transition-colors"
              >
                <X size={14} /> Dismiss
              </Button>
            </div>
            <p className="text-admin-fg/80 text-base leading-relaxed whitespace-pre-line m-0" dir="auto">{item.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
