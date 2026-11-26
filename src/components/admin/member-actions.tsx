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
          title: 'Konto gesperrt',
          body: 'Dein DEJAVU-Konto wurde bis zum Abschluss einer Sicherheitsprüfung gesperrt. Melde dich bei uns für Details.',
        });
      }
      setNotice(status === 'suspended' ? 'Mitglied gesperrt.' : 'Mitglied wieder freigegeben.');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Aktion fehlgeschlagen.');
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
      if (!res.ok) throw new Error(json.error ?? 'Aktivierung nicht möglich.');
      setNotice('Mitgliedschaft aktiviert und Mitglied benachrichtigt.');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Aktion fehlgeschlagen.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="label text-ink/40">Kontostatus</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => setStatus('active')}
            disabled={loading !== null || currentStatus === 'active'}
            className="btn border border-ink/20 px-4 py-2.5 text-[10px] text-ink hover:border-ink disabled:opacity-40"
          >
            {loading === 'active' && <Loader2 className="h-3 w-3 animate-spin" />} Freigeben
          </button>
          <button
            onClick={() => setStatus('suspended')}
            disabled={loading !== null || currentStatus === 'suspended'}
            className="btn border border-cherry/40 px-4 py-2.5 text-[10px] text-cherry hover:bg-cherry hover:text-ivory disabled:opacity-40"
          >
            {loading === 'suspended' && <Loader2 className="h-3 w-3 animate-spin" />} Sperren
          </button>
        </div>
      </div>

      <div>
        <p className="label text-ink/40">Mitgliedschaft manuell aktivieren</p>
        <p className="mt-1 text-[11px] leading-relaxed text-ink/40">
          Nur für Zahlungen, die außerhalb des Gateways beglichen wurden. Die Aktivierung wird als
          Admin-Aktion protokolliert.
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
