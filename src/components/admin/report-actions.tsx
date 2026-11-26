'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function ReportActions({
  reportId,
  reportedUserId,
}: {
  reportId: string;
  reportedUserId: string | null;
}) {
  const router = useRouter();
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function resolve(status: 'reviewing' | 'resolved' | 'dismissed', suspend = false) {
    if (status === 'resolved' && note.trim().length < 5) {
      setError('Add a short decision note before resolving.');
      return;
    }
    setBusy(status);
    setError('');
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error: err } = await supabase
        .from('reports')
        .update({
          status,
          resolution_note: note.trim() || null,
          resolved_by: status === 'resolved' || status === 'dismissed' ? user?.id ?? null : null,
          resolved_at: status === 'resolved' || status === 'dismissed' ? new Date().toISOString() : null,
        })
        .eq('id', reportId);
      if (err) throw new Error(err.message);

      if (suspend && reportedUserId) {
        await supabase.from('profiles').update({ status: 'suspended' }).eq('id', reportedUserId);
        await supabase.from('notifications').insert({
          user_id: reportedUserId,
          type: 'account',
          title: 'Account suspended',
          body: 'Following a safety review your account has been suspended. Contact us to discuss.',
        });
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not record the decision.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-2.5">
      <input
        className="field text-[12px]"
        placeholder="Decision note (visible to the team only)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => resolve('reviewing')}
          disabled={busy !== null}
          className="border border-ink/15 px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-ink/55 hover:border-ink disabled:opacity-40"
        >
          {busy === 'reviewing' ? '…' : 'Mark reviewing'}
        </button>
        <button
          onClick={() => resolve('resolved')}
          disabled={busy !== null}
          className="border border-olive/40 px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-olive hover:bg-olive hover:text-ivory disabled:opacity-40"
        >
          {busy === 'resolved' ? '…' : 'Resolve'}
        </button>
        <button
          onClick={() => resolve('dismissed')}
          disabled={busy !== null}
          className="border border-ink/15 px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-ink/55 hover:border-ink disabled:opacity-40"
        >
          {busy === 'dismissed' ? '…' : 'Dismiss'}
        </button>
        {reportedUserId && (
          <button
            onClick={() => resolve('resolved', true)}
            disabled={busy !== null}
            className="flex items-center gap-1.5 border border-cherry/40 px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-cherry hover:bg-cherry hover:text-ivory disabled:opacity-40"
          >
            {busy === 'resolved' ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            Resolve & suspend
          </button>
        )}
      </div>
      {error && <p className="text-[11px] text-cherry">{error}</p>}
    </div>
  );
}
