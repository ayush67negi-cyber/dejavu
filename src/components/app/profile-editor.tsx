'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Camera, Check, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Category, Profile } from '@/lib/types';
import {
  AVAILABILITY_OPTIONS,
  CITY_OPTIONS,
  DIETARY_OPTIONS,
  FOOD_OPTIONS,
  INTEREST_OPTIONS,
  SOCIAL_PREFERENCES,
} from '@/lib/constants';

export function ProfileEditor({
  profile,
  categories,
  interests: initialInterests,
}: {
  profile: Profile | null;
  categories: Category[];
  interests: string[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    city: profile?.city ?? '',
    occupation: profile?.occupation ?? '',
    bio: profile?.bio ?? '',
    instagram_handle: profile?.instagram_handle ?? '',
    date_of_birth: profile?.date_of_birth ?? '',
    food_preferences: profile?.food_preferences ?? [],
    dietary_restrictions: profile?.dietary_restrictions ?? [],
    social_preferences: profile?.social_preferences ?? [],
    preferred_categories: profile?.preferred_categories ?? [],
    availability: profile?.availability ?? [],
    visibility: profile?.visibility ?? 'table',
    avatar_url: profile?.avatar_url ?? '',
  });
  const [interests, setInterests] = useState<string[]>(initialInterests);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const [newInterest, setNewInterest] = useState('');

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function toggle(key: 'food_preferences' | 'dietary_restrictions' | 'social_preferences' | 'preferred_categories' | 'availability', value: string) {
    setForm((f) => {
      const list = f[key] as string[];
      return {
        ...f,
        [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      };
    });
  }

  async function upload(file: File) {
    setUploading(true);
    setError('');
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in again.');
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (upErr) throw new Error(upErr.message);
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      set('avatar_url', data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in again.');

      const { error: pErr } = await supabase
        .from('profiles')
        .update({
          full_name: form.full_name.trim(),
          city: form.city.trim(),
          occupation: form.occupation.trim() || null,
          bio: form.bio.trim() || null,
          instagram_handle: form.instagram_handle.replace(/^@/, '').trim() || null,
          date_of_birth: form.date_of_birth || null,
          food_preferences: form.food_preferences,
          dietary_restrictions: form.dietary_restrictions,
          social_preferences: form.social_preferences,
          preferred_categories: form.preferred_categories,
          availability: form.availability,
          visibility: form.visibility,
          avatar_url: form.avatar_url || null,
        })
        .eq('id', user.id);
      if (pErr) throw new Error(pErr.message);

      await supabase.from('user_interests').delete().eq('user_id', user.id);
      if (interests.length) {
        const { error: iErr } = await supabase
          .from('user_interests')
          .insert(interests.map((interest) => ({ user_id: user.id, interest })));
        if (iErr) throw new Error(iErr.message);
      }

      setMessage('Profile saved.');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-10">
      {/* photo + basics */}
      <div className="grid gap-8 md:grid-cols-[200px_1fr]">
        <div>
          <div className="relative aspect-square w-full overflow-hidden bg-sand">
            {form.avatar_url ? (
              <Image src={form.avatar_url} alt="Your photo" fill className="object-cover" sizes="200px" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Camera className="h-6 w-6 text-ink/25" strokeWidth={1.25} />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="mt-3 flex w-full items-center justify-center gap-2 border border-ink/20 py-2.5 text-[10px] uppercase tracking-[0.14em] text-ink/70 hover:border-ink disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3" />}
            {form.avatar_url ? 'Replace' : 'Add photo'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Full name">
            <input className="field" value={form.full_name} onChange={(e) => set('full_name', e.target.value)} />
          </Field>
          <Field label="City">
            <select className="field" value={form.city} onChange={(e) => set('city', e.target.value)}>
              <option value="">Select city</option>
              {CITY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Occupation">
            <input className="field" value={form.occupation} onChange={(e) => set('occupation', e.target.value)} />
          </Field>
          <Field label="Date of birth">
            <input
              type="date"
              className="field"
              value={form.date_of_birth}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => set('date_of_birth', e.target.value)}
            />
          </Field>
          <Field label="Instagram">
            <input
              className="field"
              value={form.instagram_handle}
              onChange={(e) => set('instagram_handle', e.target.value)}
              placeholder="@handle"
            />
          </Field>
          <Field label="Availability">
            <div className="mt-2 flex flex-wrap gap-2">
              {AVAILABILITY_OPTIONS.map((a) => (
                <Chip key={a} active={form.availability.includes(a)} onClick={() => toggle('availability', a)}>
                  {a}
                </Chip>
              ))}
            </div>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Introduction">
              <textarea
                className="field min-h-[100px] resize-none"
                value={form.bio}
                maxLength={600}
                onChange={(e) => set('bio', e.target.value)}
              />
            </Field>
          </div>
        </div>
      </div>

      <Section label="Interests">
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((i) => (
            <Chip
              key={i}
              active={interests.includes(i)}
              onClick={() =>
                setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))
              }
            >
              {i}
            </Chip>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            className="field max-w-[260px]"
            placeholder="Add your own"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newInterest.trim()) {
                e.preventDefault();
                setInterests((prev) => Array.from(new Set([...prev, newInterest.trim()])));
                setNewInterest('');
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (newInterest.trim()) {
                setInterests((prev) => Array.from(new Set([...prev, newInterest.trim()])));
                setNewInterest('');
              }
            }}
            className="border border-ink/20 px-4 text-[10px] uppercase tracking-[0.14em] text-ink/60 hover:border-ink"
          >
            Add
          </button>
        </div>
      </Section>

      <div className="grid gap-10 md:grid-cols-2">
        <Section label="Food preferences">
          <div className="flex flex-wrap gap-2">
            {FOOD_OPTIONS.map((f) => (
              <Chip key={f} active={form.food_preferences.includes(f)} onClick={() => toggle('food_preferences', f)}>
                {f}
              </Chip>
            ))}
          </div>
        </Section>
        <Section label="Dietary restrictions">
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((d) => (
              <Chip key={d} active={form.dietary_restrictions.includes(d)} onClick={() => toggle('dietary_restrictions', d)}>
                {d}
              </Chip>
            ))}
          </div>
        </Section>
      </div>

      <Section label="Social preferences">
        <div className="flex flex-wrap gap-2">
          {SOCIAL_PREFERENCES.map((s) => (
            <Chip key={s} active={form.social_preferences.includes(s)} onClick={() => toggle('social_preferences', s)}>
              {s}
            </Chip>
          ))}
        </div>
      </Section>

      <Section label="Preferred tables">
        <div className="grid gap-2 sm:grid-cols-2">
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => toggle('preferred_categories', c.slug)}
              className={`flex items-center justify-between border px-4 py-3 text-left text-[13px] transition-colors ${
                form.preferred_categories.includes(c.slug)
                  ? 'border-ink bg-ink text-ivory'
                  : 'border-ink/15 hover:border-ink/40'
              }`}
            >
              {c.name}
              {form.preferred_categories.includes(c.slug) && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
            </button>
          ))}
        </div>
      </Section>

      <Section label="Who can see your profile">
        <div className="grid gap-2 sm:grid-cols-3">
          {(
            [
              ['table', 'Table only'],
              ['members', 'All members'],
              ['private', 'Private'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => set('visibility', value)}
              className={`border px-4 py-3 text-left text-[13px] transition-colors ${
                form.visibility === value ? 'border-ink bg-ink text-ivory' : 'border-ink/15 hover:border-ink/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11.5px] leading-relaxed text-ink/40">
          Your email address and private questionnaire answers are never shared with other members,
          in any setting.
        </p>
      </Section>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 border border-ink/12 bg-ivory/95 p-4 backdrop-blur">
        <div>
          {message && <p className="text-[11px] uppercase tracking-[0.14em] text-olive">{message}</p>}
          {error && <p className="text-[12px] text-cherry">{error}</p>}
          {!message && !error && (
            <p className="text-[11px] text-ink/40">Changes are reviewed by nobody — they apply immediately.</p>
          )}
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="btn bg-ink px-7 py-3.5 text-ivory hover:bg-cherry disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save profile
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label block text-ink/40">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-ink/12 pt-6">
      <p className="label text-ink/40">{label}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-1.5 text-[12px] transition-colors ${
        active ? 'border-ink bg-ink text-ivory' : 'border-ink/15 text-ink/65 hover:border-ink/40'
      }`}
    >
      {children}
    </button>
  );
}
