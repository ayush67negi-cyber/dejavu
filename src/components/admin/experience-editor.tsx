'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/lib/types';
import { CITY_OPTIONS } from '@/lib/constants';

type Experience = {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  city: string;
  starts_at: string | null;
  group_size: number;
  status: string;
  instructions: string | null;
  admin_notes: string | null;
  dietary_notes: string | null;
  reveal_venue: boolean;
};

const STATUSES = ['draft', 'matching', 'confirmed', 'completed', 'cancelled'] as const;

export function ExperienceEditor({
  experience,
  categories,
  venue,
}: {
  experience: Experience;
  categories: Category[];
  venue: { venue_name: string | null; venue_address: string | null } | null;
}) {
  const router = useRouter();
  const localDate = experience.starts_at
    ? new Date(new Date(experience.starts_at).getTime() + 5.5 * 3600 * 1000).toISOString()
    : null;

  const [form, setForm] = useState({
    name: experience.name,
    description: experience.description ?? '',
    category_id: experience.category_id ?? '',
    city: experience.city,
    date: localDate?.slice(0, 10) ?? '',
    time: localDate?.slice(11, 16) ?? '19:30',
    venue_name: venue?.venue_name ?? '',
    venue_address: venue?.venue_address ?? '',
    group_size: experience.group_size,
    status: experience.status,
    instructions: experience.instructions ?? '',
    admin_notes: experience.admin_notes ?? '',
    dietary_notes: experience.dietary_notes ?? '',
    reveal_venue: experience.reveal_venue,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function save(statusOverride?: string) {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const supabase = createClient();
      const startsAt = form.date
        ? new Date(`${form.date}T${form.time || '19:30'}:00+05:30`).toISOString()
        : null;
      const endsAt = form.date ? new Date(new Date(startsAt!).getTime() + 3 * 3600 * 1000).toISOString() : null;
      const nextStatus = statusOverride ?? form.status;

      const { error: err } = await supabase
        .from('experiences')
        .update({
          name: form.name.trim(),
          description: form.description.trim() || null,
          category_id: form.category_id || null,
          city: form.city,
          starts_at: startsAt,
          ends_at: endsAt,
          group_size: form.group_size,
          status: nextStatus,
          instructions: form.instructions.trim() || null,
          admin_notes: form.admin_notes.trim() || null,
          dietary_notes: form.dietary_notes.trim() || null,
          reveal_venue: form.reveal_venue,
        })
        .eq('id', experience.id);
      if (err) throw new Error(err.message);

      const { error: vErr } = await supabase.from('experience_venues').upsert(
        {
          experience_id: experience.id,
          venue_name: form.venue_name.trim() || null,
          venue_address: form.venue_address.trim() || null,
        },
        { onConflict: 'experience_id' },
      );
      if (vErr) throw new Error(vErr.message);

      if (statusOverride) set('status', statusOverride);

      // Notify assigned members on confirmation or cancellation
      if (statusOverride === 'confirmed' || statusOverride === 'cancelled') {
        await fetch('/api/admin/experiences/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ experienceId: experience.id, event: statusOverride }),
        });
      }

      setMessage('Saved.');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="border border-ink/12 p-5">
        <p className="label text-ink/40">Details</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Name" span>
            <input className="field" value={form.name} onChange={(e) => set('name', e.target.value)} />
          </Field>
          <Field label="Category">
            <select className="field" value={form.category_id} onChange={(e) => set('category_id', e.target.value)}>
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="City">
            <select className="field" value={form.city} onChange={(e) => set('city', e.target.value)}>
              {CITY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date">
            <input type="date" className="field" value={form.date} onChange={(e) => set('date', e.target.value)} />
          </Field>
          <Field label="Start time (IST)">
            <input type="time" className="field" value={form.time} onChange={(e) => set('time', e.target.value)} />
          </Field>
          <Field label="Seats">
            <select
              className="field"
              value={form.group_size}
              onChange={(e) => set('group_size', Number(e.target.value))}
            >
              {[4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select className="field" value={form.status} onChange={(e) => set('status', e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Restaurant" span>
            <input className="field" value={form.venue_name} onChange={(e) => set('venue_name', e.target.value)} />
          </Field>
          <Field label="Address" span>
            <input className="field" value={form.venue_address} onChange={(e) => set('venue_address', e.target.value)} />
          </Field>
          <Field label="Description" span>
            <textarea
              className="field min-h-[66px] resize-none"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </Field>
          <Field label="Member instructions" span>
            <textarea
              className="field min-h-[60px] resize-none"
              value={form.instructions}
              onChange={(e) => set('instructions', e.target.value)}
            />
          </Field>
          <Field label="Dietary notes" span>
            <input className="field" value={form.dietary_notes} onChange={(e) => set('dietary_notes', e.target.value)} />
          </Field>
          <Field label="Internal notes (never shown to members)" span>
            <textarea
              className="field min-h-[60px] resize-none"
              value={form.admin_notes}
              onChange={(e) => set('admin_notes', e.target.value)}
            />
          </Field>
        </div>

        <label className="mt-4 flex items-center gap-2.5 text-[12px] text-ink/60">
          <input
            type="checkbox"
            checked={form.reveal_venue}
            onChange={(e) => set('reveal_venue', e.target.checked)}
            className="h-3.5 w-3.5 accent-[#120D0B]"
          />
          Reveal venue details to assigned members once confirmed
        </label>

        {message && <p className="mt-3 text-[11px] text-olive">{message}</p>}
        {error && <p className="mt-3 text-[12px] text-cherry">{error}</p>}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            onClick={() => save()}
            disabled={saving}
            className="btn bg-ink px-6 py-3 text-[10px] text-ivory hover:bg-cherry disabled:opacity-60"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save changes
          </button>
          {form.status !== 'confirmed' && (
            <button
              onClick={() => save('confirmed')}
              disabled={saving}
              className="btn border border-olive/50 px-5 py-3 text-[10px] text-olive hover:bg-olive hover:text-ivory disabled:opacity-50"
            >
              Confirm & notify
            </button>
          )}
          {form.status === 'confirmed' && (
            <button
              onClick={() => save('completed')}
              disabled={saving}
              className="btn border border-ink/25 px-5 py-3 text-[10px] text-ink/70 hover:border-ink disabled:opacity-50"
            >
              Mark completed
            </button>
          )}
          {form.status !== 'cancelled' && (
            <button
              onClick={() => save('cancelled')}
              disabled={saving}
              className="btn border border-cherry/40 px-5 py-3 text-[10px] text-cherry hover:bg-cherry hover:text-ivory disabled:opacity-50"
            >
              Cancel experience
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, span }: { label: string; children: React.ReactNode; span?: boolean }) {
  return (
    <label className={`block ${span ? 'sm:col-span-2' : ''}`}>
      <span className="label block text-ink/40">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
