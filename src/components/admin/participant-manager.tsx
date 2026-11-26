'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, UserPlus, X, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PARTICIPANT_STATUS_LABEL, REQUEST_STATUS_LABEL } from '@/lib/constants';

type Participant = {
  user_id: string;
  status: string;
  profiles: { full_name: string | null; city: string | null; occupation: string | null; avatar_url: string | null } | null;
};

type Request = {
  id: string;
  user_id: string;
  status: string;
  message: string | null;
  created_at: string;
  profiles: { full_name: string | null; city: string | null } | null;
};

type Member = { id: string; full_name: string | null; city: string | null };

export function ParticipantManager({
  experienceId,
  groupSize,
  participants,
  requests,
  members,
}: {
  experienceId: string;
  groupSize: number;
  participants: Participant[];
  requests: Request[];
  members: Member[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const assignedIds = new Set(participants.map((p) => p.user_id));
  const seatsLeft = groupSize - participants.length;
  const filtered = members
    .filter((m) => !assignedIds.has(m.id))
    .filter((m) => (search ? (m.full_name ?? '').toLowerCase().includes(search.toLowerCase()) : true))
    .slice(0, 8);

  async function add(userId: string) {
    if (seatsLeft <= 0) {
      setError('Dieser Tisch ist voll. Erhöhe zuerst die Platzzahl.');
      return;
    }
    setBusy(`add-${userId}`);
    setError('');
    try {
      const supabase = createClient();
      const { error: err } = await supabase
        .from('experience_participants')
        .insert({ experience_id: experienceId, user_id: userId, status: 'invited' });
      if (err) throw new Error(err.message);
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'experience',
        title: 'Du hast einen Platz an einem DEJAVU-Tisch',
        body: 'Ein Platz wurde dir angeboten. Details erscheinen unter „Meine Erlebnisse“, sobald der Tisch bestätigt ist.',
        link: '/app/experiences',
      });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Teilnehmer konnte nicht hinzugefügt werden.');
    } finally {
      setBusy(null);
    }
  }

  async function remove(userId: string) {
    setBusy(`rm-${userId}`);
    setError('');
    try {
      const supabase = createClient();
      const { error: err } = await supabase
        .from('experience_participants')
        .delete()
        .eq('experience_id', experienceId)
        .eq('user_id', userId);
      if (err) throw new Error(err.message);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Teilnehmer konnte nicht entfernt werden.');
    } finally {
      setBusy(null);
    }
  }

  async function confirmParticipant(userId: string) {
    setBusy(`cf-${userId}`);
    try {
      const supabase = createClient();
      await supabase
        .from('experience_participants')
        .update({ status: 'confirmed' })
        .eq('experience_id', experienceId)
        .eq('user_id', userId);
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function resolveRequest(request: Request, approve: boolean) {
    setBusy(`req-${request.id}`);
    setError('');
    try {
      const supabase = createClient();
      if (approve && seatsLeft > 0) {
        const { error: addErr } = await supabase
          .from('experience_participants')
          .upsert({ experience_id: experienceId, user_id: request.user_id, status: 'confirmed' });
        if (addErr) throw new Error(addErr.message);
      }
      await supabase
        .from('experience_requests')
        .update({ status: approve ? 'approved' : 'declined' })
        .eq('id', request.id);

      await supabase.from('notifications').insert({
        user_id: request.user_id,
        type: 'experience',
        title: approve ? 'Dein Platz ist bestätigt' : 'Zu deiner Platzanfrage',
        body: approve
          ? 'Du sitzt an diesem Tisch. Ort und Uhrzeit findest du unter „Meine Erlebnisse“.'
          : 'Für diesen Tisch hat es diesmal nicht gereicht – wir stellen jede Woche neue zusammen.',
        link: '/app/experiences',
      });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Anfrage konnte nicht bearbeitet werden.');
    } finally {
      setBusy(null);
    }
  }

  const pendingRequests = requests.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-5">
      <div className="border border-ink/12 p-5">
        <div className="flex items-baseline justify-between">
          <p className="label text-ink/45">Sitzende Mitglieder</p>
          <span className="text-[10px] uppercase tracking-label text-ink/35">
            {participants.length} / {groupSize}
          </span>
        </div>

        {participants.length === 0 ? (
          <p className="mt-4 text-[12.5px] text-ink/40">Noch niemand zugeteilt.</p>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {participants.map((p) => (
              <li key={p.user_id} className="flex items-center justify-between gap-3 border-b border-ink/8 pb-2.5 last:border-0">
                <div>
                  <p className="text-[13px] text-ink">{p.profiles?.full_name ?? 'Mitglied'}</p>
                  <p className="text-[10.5px] text-ink/40">
                    {p.profiles?.occupation ?? '—'} · {p.profiles?.city ?? '—'} · {PARTICIPANT_STATUS_LABEL[p.status] ?? p.status}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {p.status !== 'confirmed' && (
                    <button
                      onClick={() => confirmParticipant(p.user_id)}
                      disabled={busy !== null}
                      title="Als bestätigt markieren"
                      className="p-1.5 text-olive/70 hover:text-olive disabled:opacity-40"
                    >
                      {busy === `cf-${p.user_id}` ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" strokeWidth={2} />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => remove(p.user_id)}
                    disabled={busy !== null}
                    title="Entfernen"
                    className="p-1.5 text-cherry/60 hover:text-cherry disabled:opacity-40"
                  >
                    {busy === `rm-${p.user_id}` ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <X className="h-3.5 w-3.5" strokeWidth={2} />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {error && <p className="mt-3 text-[12px] text-cherry">{error}</p>}
      </div>

      <div className="border border-ink/12 p-5">
        <div className="flex items-center justify-between">
          <p className="label text-ink/45">Anfragen</p>
          <span className="text-[10px] uppercase tracking-label text-ink/35">{pendingRequests.length} offen</span>
        </div>
        {requests.length === 0 ? (
          <p className="mt-4 text-[12.5px] text-ink/40">Keine Platzanfragen für diesen Tisch.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {requests.map((r) => (
              <li key={r.id} className="border-b border-ink/8 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12.5px] text-ink">{r.profiles?.full_name ?? 'Mitglied'}</p>
                  <span className={`text-[9px] uppercase tracking-label ${r.status === 'pending' ? 'text-ember' : 'text-ink/35'}`}>
                    {REQUEST_STATUS_LABEL[r.status] ?? r.status}
                  </span>
                </div>
                {r.message && <p className="mt-1 text-[11.5px] text-ink/50">{r.message}</p>}
                {r.status === 'pending' && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => resolveRequest(r, true)}
                      disabled={busy !== null || seatsLeft <= 0}
                      className="border border-olive/40 px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-olive hover:bg-olive hover:text-ivory disabled:opacity-40"
                    >
                      {busy === `req-${r.id}` ? '…' : 'Annehmen'}
                    </button>
                    <button
                      onClick={() => resolveRequest(r, false)}
                      disabled={busy !== null}
                      className="border border-ink/15 px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-ink/50 hover:border-ink disabled:opacity-40"
                    >
                      Ablehnen
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border border-ink/12 p-5">
        <p className="label text-ink/45">Mitglied hinzufügen</p>
        <input
          className="field mt-3"
          placeholder="Mitglieder in dieser Stadt suchen"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="mt-3 space-y-1">
          {filtered.length === 0 ? (
            <li className="text-[12px] text-ink/35">Keine nicht zugeteilten Mitglieder gefunden.</li>
          ) : (
            filtered.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-2 py-1.5">
                <span className="text-[12.5px] text-ink/70">{m.full_name ?? 'Ohne Namen'}</span>
                <button
                  onClick={() => add(m.id)}
                  disabled={busy !== null || seatsLeft <= 0}
                  className="flex items-center gap-1.5 border border-ink/15 px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] text-ink/60 hover:border-ink hover:text-ink disabled:opacity-40"
                >
                  {busy === `add-${m.id}` ? <Loader2 className="h-3 w-3 animate-spin" /> : <UserPlus className="h-3 w-3" strokeWidth={1.5} />}
                  Platz geben
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
