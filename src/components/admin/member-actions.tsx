'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function MemberActions({
  userId,
  currentStatus,
}: {
  userId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function setStatus(status: 'active' | 'suspended') {
    setLoading(status);
    setError('');
    setNotice('');
    try {
      const supabase = createClient();
      const { error: err } = await supabase.from('profiles').update({ status }).eq('id', userId);
      if (err) throw new Error(err.message);

      if (status === 'suspended') {
        await supabase.from('notifications').insert({
          user_id: userId,
          type: 'account',
          title: 'Account suspended',
          body: 'Your DEJAVU account has been suspended pending a safety review. Please contact us for details.',
        });
      }
      setNotice(status === 'suspended' ? 'Member suspended.' : 'Member reinstated.');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed.');
    } finally {
      setLoading(null);
    }
  }

  async function activateMembership(planId: string) {
    setLoading(planId);
    setError('');
    setNotice('');
    try {
      const res = await fetch('/api/admin/membership/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, planId }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Could not activate.');
      setNotice('Membership activated and member notified.');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="label text-ink/40">Account status</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => setStatus('active')}
            disabled={loading !== null || currentStatus === 'active'}
            className="btn border border-ink/20 px-4 py-2.5 text-[10px] text-ink hover:border-ink disabled:opacity-40"
          >
            {loading === 'active' && <Loader2 className="h-3 w-3 animate-spin" />} Reinstate
          </button>
          <button
            onClick={() => setStatus('suspended')}
            disabled={loading !== null || currentStatus === 'suspended'}
            className="btn border border-cherry/40 px-4 py-2.5 text-[10px] text-cherry hover:bg-cherry hover:text-ivory disabled:opacity-40"
          >
            {loading === 'suspended' && <Loader2 className="h-3 w-3 animate-spin" />} Suspend
          </button>
        </div>
      </div>

      <div>
        <p className="label text-ink/40">Activate membership manually</p>
        <p className="mt-1 text-[11px] leading-relaxed text-ink/40">
          Only for payments settled outside the gateway. Records the activation as an admin action.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {['monthly', 'quarterly', 'biannual'].map((p) => (
            <button
              key={p}
              onClick={() => activateMembership(p)}
              disabled={loading !== null}
              className="border border-ink/15 px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-ink/60 hover:border-ink hover:text-ink disabled:opacity-40"
            >
              {loading === p ? <Loader2 className="h-3 w-3 animate-spin" /> : p}
            </button>
          ))}
        </div>
      </div>

      {notice && <p className="text-[11px] text-olive">{notice}</p>}
      {error && <p className="text-[11px] text-cherry">{error}</p>}
    </div>
  );
}
