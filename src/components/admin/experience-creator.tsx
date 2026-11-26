'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/lib/types';
import { CITY_OPTIONS, cityLabel } from '@/lib/constants';

export function ExperienceCreator({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    category_id: categories[0]?.id ?? '',
    city: 'Delhi',
    date: '',
    time: '19:30',
    venue_name: '',
    venue_address: '',
    group_size: 6,
    status: 'draft' as 'draft' | 'matching',
    instructions: '',
    dietary_notes: '',
    admin_notes: '',
    reveal_venue: false,
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function create() {
    if (!form.name.trim()) {
      setError('Gib dem Erlebnis einen Namen.');
      return;
    }
    if (!form.category_id) {
      setError('Wähle eine Tischkategorie.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const startsAt = form.date
        ? new Date(`${form.date}T${form.time || '19:30'}:00+05:30`).toISOString()
        : null;
      const endsAt = form.date
        ? new Date(`${form.date}T${form.time || '19:30'}:00+05:30`)
        : null;
      if (endsAt) endsAt.setHours(endsAt.getHours() + 3);

      const { data, error: err } = await supabase
        .from('experiences')
        .insert({
          name: form.name.trim(),
          description: form.description.trim() || null,
          category_id: form.category_id,
          city: form.city,
          starts_at: startsAt,
          ends_at: endsAt ? endsAt.toISOString() : null,
          group_size: form.group_size,
          status: form.status,
          instructions: form.instructions.trim() || null,
          dietary_notes: form.dietary_notes.trim() || null,
          admin_notes: form.admin_notes.trim() || null,
          reveal_venue: form.reveal_venue,
        })
        .select('id')
        .single();
      if (err) throw new Error(err.message);

      if (form.venue_name.trim() || form.venue_address.trim()) {
        const { error: vErr } = await supabase.from('experience_venues').insert({
          experience_id: data.id,
          venue_name: form.venue_name.trim() || null,
          venue_address: form.venue_address.trim() || null,
        });
        if (vErr) throw new Error(vErr.message);
      }

      router.push(`/admin/experiences/${data.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erlebnis konnte nicht angelegt werden.');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between border border-ink/15 p-4 text-left transition-colors hover:border-ink/40"
      >
        <span className="text-[13px] text-ink">Neues Erlebnis anlegen</span>
        <ChevronDown className="h-4 w-4 text-ink/40" strokeWidth={1.5} />
      </button>
    );
  }

  return (
    <div className="border border-ink/15 p-5">
      <div className="flex items-center justify-between">
        <p className="label text-ink/45">Neues Erlebnis</p>
        <button onClick={() => setOpen(false)} className="text-[10px] uppercase tracking-[0.12em] text-ink/40 hover:text-ink">
          Schließen
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input className="field" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Der Sonntagstisch, Lodhi Colony" />
        </Field>
        <Field label="Kategorie">
          <select className="field" value={form.category_id} onChange={(e) => set('category_id', e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Stadt">
          <select className="field" value={form.city} onChange={(e) => set('city', e.target.value)}>
            {CITY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {cityLabel(c)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Plätze">
          <select
            className="field"
            value={form.group_size}
            onChange={(e) => set('group_size', Number(e.target.value))}
          >
            {[4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} Personen
              </option>
            ))}
          </select>
        </Field>
        <Field label="Datum">
          <input type="date" className="field" value={form.date} onChange={(e) => set('date', e.target.value)} />
        </Field>
        <Field label="Beginn (IST)">
          <input type="time" className="field" value={form.time} onChange={(e) => set('time', e.target.value)} />
        </Field>
        <Field label="Restaurant">
          <input className="field" value={form.venue_name} onChange={(e) => set('venue_name', e.target.value)} />
        </Field>
        <Field label="Adresse">
          <input className="field" value={form.venue_address} onChange={(e) => set('venue_address', e.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Beschreibung (für Mitglieder sichtbar)">
            <textarea
              className="field min-h-[70px] resize-none"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Hinweise (werden bei Bestätigung geteilt)">
            <textarea
              className="field min-h-[60px] resize-none"
              value={form.instructions}
              onChange={(e) => set('instructions', e.target.value)}
              placeholder="Frag nach dem DEJAVU-Tisch hinten im Raum. Sei bis 19:25 da."
            />
          </Field>
        </div>
        <Field label="Ernährungshinweise">
          <input className="field" value={form.dietary_notes} onChange={(e) => set('dietary_notes', e.target.value)} />
        </Field>
        <Field label="Startstatus">
          <select
            className="field"
            value={form.status}
            onChange={(e) => set('status', e.target.value as 'draft' | 'matching')}
          >
            <option value="draft">Entwurf — nicht sichtbar</option>
            <option value="matching">In Abstimmung — für Mitglieder sichtbar</option>
          </select>
        </Field>
      </div>

      <label className="mt-4 flex items-center gap-2.5 text-[12px] text-ink/60">
        <input
          type="checkbox"
          checked={form.reveal_venue}
          onChange={(e) => set('reveal_venue', e.target.checked)}
          className="h-3.5 w-3.5 accent-[#120D0B]"
        />
        Restaurant sofort nach Bestätigung des Erlebnisses nennen
      </label>

      {error && <p className="mt-3 text-[12px] text-cherry">{error}</p>}

      <button
        onClick={create}
        disabled={loading}
        className="btn mt-5 bg-ink px-6 py-3.5 text-ivory hover:bg-cherry disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />} Erlebnis anlegen
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label block text-ink/40">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
