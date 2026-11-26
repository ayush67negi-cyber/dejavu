'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/lib/types';

type Pair = { user_a: string; name_a: string; user_b: string; name_b: string; score: number };
type Member = { id: string; full_name: string | null; occupation: string | null };

export function MatchingTool({
  city,
  pairs,
  members,
  categories,
}: {
  city: string;
  pairs: Pair[];
  members: Member[];
  categories: Category[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:30');
  const [venue, setVenue] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const memberMap = useMemo(() => new Map(members.map((m) => [m.id, m])), [members]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 6 ? prev : [...prev, id],
    );
  }

  async function createTable() {
    if (selected.length < 4) {
      setError('A DEJAVU table needs at least four people.');
      return;
    }
    setCreating(true);
    setError('');
    setResult('');
    try {
      const catId = categoryId || categories[0]?.id;
      if (!catId) throw new Error('Create a table category first.');

      const supabase = createClient();
      const startsAt = date ? new Date(`${date}T${time}:00+05:30`).toISOString() : null;
      const endsAt = startsAt ? new Date(new Date(startsAt).getTime() + 3 * 3600 * 1000).toISOString() : null;

      const { data: exp, error: expErr } = await supabase
        .from('experiences')
        .insert({
          name: name.trim() || `${city} Table · ${new Date(date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}`,
          city,
          category_id: catId,
          starts_at: startsAt,
          ends_at: endsAt,
          group_size: selected.length,
          status: 'matching',
          reveal_venue: false,
        })
        .select('id')
        .single();
      if (expErr) throw new Error(expErr.message);

      if (venue.trim()) {
        await supabase
          .from('experience_venues')
          .insert({ experience_id: exp.id, venue_name: venue.trim() });
      }

      const { error: pErr } = await supabase.from('experience_participants').insert(
        selected.map((user_id) => ({ experience_id: exp.id, user_id, status: 'invited' })),
      );
      if (pErr) throw new Error(pErr.message);

      await supabase.from('notifications').insert(
        selected.map((user_id) => ({
          user_id,
          type: 'match',
          title: 'You have been matched to a table',
          body: `A ${city} table has been composed with you in it. Venue details follow once confirmed.`,
          link: '/app/experiences',
        })),
      );

      setResult('Table created and participants notified.');
      setSelected([]);
      router.push(`/admin/experiences/${exp.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create the table.');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <div className="flex items-baseline justify-between border-b border-ink/12 pb-3">
          <h2 className="label text-ink/50">Highest-scoring pairs in {city}</h2>
        </div>
        {pairs.length === 0 ? (
          <div className="border border-dashed border-ink/20 p-8 text-center">
            <Users className="mx-auto h-5 w-5 text-ink/25" strokeWidth={1.25} />
            <p className="mt-3 font-serif text-[20px] text-ink">Not enough compatible members yet.</p>
            <p className="mx-auto mt-2 max-w-[40ch] text-[12.5px] leading-relaxed text-ink/45">
              Scores appear once at least two onboarded members share this city and a minimum
              compatibility threshold. You can still compose a table manually on the right.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-ink/10 border-b border-ink/10">
            {pairs.slice(0, 40).map((p) => {
              const aSelected = selected.includes(p.user_a);
              const bSelected = selected.includes(p.user_b);
              return (
                <li key={`${p.user_a}-${p.user_b}`} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] text-ink">
                      {p.name_a} <span className="text-ink/30">with</span> {p.name_b}
                    </p>
                    <p className="text-[10.5px] text-ink/40">
                      {memberMap.get(p.user_a)?.occupation ?? '—'} · {memberMap.get(p.user_b)?.occupation ?? '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-[20px] leading-none text-cherry">{p.score}</span>
                    <div className="flex gap-1">
                      <Toggle active={aSelected} onClick={() => toggle(p.user_a)} label={p.name_a.charAt(0)} />
                      <Toggle active={bSelected} onClick={() => toggle(p.user_b)} label={p.name_b.charAt(0)} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border border-ink/12 p-5">
        <div className="flex items-baseline justify-between">
          <p className="label text-ink/40">Compose a table</p>
          <span className="text-[10px] uppercase tracking-label text-ink/35">{selected.length} / 6</span>
        </div>

        <div className="mt-4 space-y-3">
          <Field label="Members selected">
            {selected.length === 0 ? (
              <p className="text-[12px] text-ink/40">Pick members from the pairs list, or add below.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {selected.map((id) => (
                  <button
                    key={id}
                    onClick={() => toggle(id)}
                    className="border border-ink/20 px-2.5 py-1 text-[11px] text-ink/70 hover:border-cherry hover:text-cherry"
                  >
                    {memberMap.get(id)?.full_name ?? 'Member'} ×
                  </button>
                ))}
              </div>
            )}
          </Field>

          <details className="border-t border-ink/10 pt-3">
            <summary className="cursor-pointer text-[10px] uppercase tracking-[0.12em] text-ink/45">
              Add from all {city} members
            </summary>
            <div className="mt-2 max-h-[180px] overflow-y-auto no-scrollbar">
              {members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => toggle(m.id)}
                  className={`flex w-full items-center justify-between py-1.5 text-left text-[12px] ${
                    selected.includes(m.id) ? 'text-cherry' : 'text-ink/65 hover:text-ink'
                  }`}
                >
                  {m.full_name ?? 'Unnamed'}
                  <span className="text-[9px] uppercase tracking-[0.1em] text-ink/30">
                    {selected.includes(m.id) ? 'selected' : 'add'}
                  </span>
                </button>
              ))}
            </div>
          </details>

          <Field label="Table name">
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="The Sunday Table" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Time (IST)">
              <input type="time" className="field" value={time} onChange={(e) => setTime(e.target.value)} />
            </Field>
          </div>
          <Field label="Table category">
            <select className="field" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Restaurant">
            <input className="field" value={venue} onChange={(e) => setVenue(e.target.value)} />
          </Field>

          {error && <p className="text-[12px] text-cherry">{error}</p>}
          {result && <p className="text-[11px] text-olive">{result}</p>}

          <button
            onClick={createTable}
            disabled={creating || selected.length < 4}
            className="btn w-full bg-ink py-3.5 text-ivory hover:bg-cherry disabled:opacity-50"
          >
            {creating && <Loader2 className="h-4 w-4 animate-spin" />}
            Create table & notify
          </button>
          <p className="text-[10.5px] leading-relaxed text-ink/35">
            Matches are not confirmed for members until you confirm the experience. Venue details
            stay hidden until then.
          </p>
        </div>
      </div>
    </div>
  );
}

function Toggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={`Select ${label}`}
      className={`flex h-6 w-6 items-center justify-center border text-[10px] transition-colors ${
        active ? 'border-cherry bg-cherry text-ivory' : 'border-ink/20 text-ink/50 hover:border-ink'
      }`}
    >
      {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label text-ink/40">{label}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
