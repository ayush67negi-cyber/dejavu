'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Camera, Check, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Category, Profile } from '@/lib/types';
import {
  AVAILABILITY_OPTIONS,
  AVOID_TOPICS,
  CITY_OPTIONS,
  DIETARY_OPTIONS,
  FOOD_OPTIONS,
  INTEREST_OPTIONS,
  QUESTIONNAIRE,
  SOCIAL_PREFERENCES,
} from '@/lib/constants';
import { isAdult } from '@/lib/validation';

type Draft = {
  full_name: string;
  date_of_birth: string;
  city: string;
  occupation: string;
  bio: string;
  instagram_handle: string;
  interests: string[];
  hobbies: string;
  favourite_topics: string;
  avoid_topics: string[];
  food_preferences: string[];
  dietary_restrictions: string[];
  preferred_categories: string[];
  social_preferences: string[];
  availability: string[];
  visibility: 'table' | 'members' | 'private';
  avatar_url: string;
  adult_confirmed: boolean;
  answers: Record<string, number>;
};

const STEPS = [
  { key: 'identity', title: 'Who you are', label: 'Identity' },
  { key: 'photo', title: 'A face for the table', label: 'Photo' },
  { key: 'city', title: 'Where you live', label: 'City' },
  { key: 'interests', title: 'What you’re into', label: 'Interests' },
  { key: 'table', title: 'Which tables tempt you', label: 'Tables' },
  { key: 'food', title: 'At the table', label: 'Food' },
  { key: 'personality', title: 'How you talk', label: 'Personality' },
  { key: 'review', title: 'One last look', label: 'Review' },
] as const;

function draftFromProfile(p: Profile | null): Draft {
  return {
    full_name: p?.full_name ?? '',
    date_of_birth: p?.date_of_birth ?? '',
    city: p?.city ?? '',
    occupation: p?.occupation ?? '',
    bio: p?.bio ?? '',
    instagram_handle: p?.instagram_handle ?? '',
    interests: [],
    hobbies: '',
    favourite_topics: '',
    avoid_topics: [],
    food_preferences: p?.food_preferences ?? [],
    dietary_restrictions: p?.dietary_restrictions ?? [],
    preferred_categories: p?.preferred_categories ?? [],
    social_preferences: p?.social_preferences ?? [],
    availability: p?.availability ?? [],
    visibility: p?.visibility ?? 'table',
    avatar_url: p?.avatar_url ?? '',
    adult_confirmed: p?.adult_confirmed ?? false,
    answers: {},
  };
}

export function OnboardingFlow({
  profile,
  categories,
  email,
  initiallyComplete,
}: {
  profile: Profile | null;
  categories: Category[];
  email: string;
  initiallyComplete: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = useState(Math.min(profile?.onboarding_step ?? 0, STEPS.length - 1));
  const [draft, setDraft] = useState<Draft>(() => draftFromProfile(profile));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [restored, setRestored] = useState(false);
  const [complete, setComplete] = useState(initiallyComplete);
  const fileRef = useRef<HTMLInputElement>(null);
  const hydrated = useRef(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const toggle = (key: 'interests' | 'food_preferences' | 'dietary_restrictions' | 'preferred_categories' | 'social_preferences' | 'availability' | 'avoid_topics', value: string) =>
    setDraft((d) => {
      const has = d[key].includes(value);
      return { ...d, [key]: has ? d[key].filter((v) => v !== value) : [...d[key], value] };
    });

  // Restore the rest of a partially finished questionnaire / interests
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const [{ data: interests }, { data: q }] = await Promise.all([
          supabase.from('user_interests').select('interest').eq('user_id', user.id),
          supabase.from('questionnaire_responses').select('answers').eq('user_id', user.id).maybeSingle(),
        ]);
        if (interests?.length) {
          setDraft((d) => ({ ...d, interests: interests.map((i) => i.interest) }));
        }
        if (q?.answers && Object.keys(q.answers).length) {
          setDraft((d) => ({ ...d, answers: q.answers as Record<string, number> }));
        }
        setRestored(true);
      } catch {
        // non-blocking — drafts still function
      }
    })();
  }, []);

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  function validate(current: number): string {
    if (current === 0) {
      if (draft.full_name.trim().length < 2) return 'We need a name to introduce you by.';
      if (!draft.date_of_birth) return 'Please add your date of birth — DEJAVU is 18+ only.';
      if (!isAdult(draft.date_of_birth)) return 'DEJAVU is for adults only (18+).';
      if (!draft.adult_confirmed) return 'Please confirm you are 18 or older.';
    }
    if (current === 2 && draft.city.trim().length < 2) return 'Which city will you be dining in?';
    if (current === 3 && draft.interests.length < 3) return 'Choose at least three interests.';
    if (current === 4 && draft.preferred_categories.length < 1) return 'Choose at least one table.';
    if (current === 6) {
      const answered = QUESTIONNAIRE.every((q) => typeof draft.answers[q.id] === 'number');
      if (!answered) return 'Answer all four questions — there are no wrong answers.';
    }
    return '';
  }

  async function persist(nextStep: number, markComplete = false) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Your session has expired. Please sign in again.');

    const payload: Record<string, unknown> = {
      id: user.id,
      full_name: draft.full_name.trim(),
      date_of_birth: draft.date_of_birth || null,
      city: draft.city.trim(),
      occupation: draft.occupation.trim() || null,
      bio: draft.bio.trim() || null,
      instagram_handle: draft.instagram_handle.replace(/^@/, '').trim() || null,
      food_preferences: draft.food_preferences,
      dietary_restrictions: draft.dietary_restrictions,
      social_preferences: draft.social_preferences,
      preferred_categories: draft.preferred_categories,
      availability: draft.availability,
      visibility: draft.visibility,
      avatar_url: draft.avatar_url || null,
      adult_confirmed: draft.adult_confirmed,
      onboarding_step: nextStep,
      onboarding_completed: markComplete,
    };

    const { error: pErr } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
    if (pErr) throw new Error(pErr.message);

    // interests — replace the set
    const { error: dErr } = await supabase.from('user_interests').delete().eq('user_id', user.id);
    if (dErr) throw new Error(dErr.message);
    if (draft.interests.length) {
      const rows = draft.interests.map((interest) => ({ user_id: user.id, interest }));
      const { error: iErr } = await supabase.from('user_interests').insert(rows);
      if (iErr) throw new Error(iErr.message);
    }

    const hasAnswers = Object.keys(draft.answers).length > 0;
    if (hasAnswers) {
      const { error: qErr } = await supabase.from('questionnaire_responses').upsert(
        {
          user_id: user.id,
          answers: { ...draft.answers, hobbies: draft.hobbies, topics: draft.favourite_topics, avoid_topics: draft.avoid_topics },
          energy: draft.answers.energy ?? null,
          talkativity: draft.answers.talkativity ?? null,
          curiosity: draft.answers.curiosity ?? null,
          newness: draft.answers.newness ?? null,
        },
        { onConflict: 'user_id' },
      );
      if (qErr) throw new Error(qErr.message);
    }
  }

  async function next() {
    const msg = validate(step);
    if (msg) {
      setError(msg);
      return;
    }
    setError('');
    setSaving(true);
    try {
      const isLast = step === STEPS.length - 1;
      await persist(isLast ? STEPS.length : step + 1, isLast);
      if (isLast) {
        setComplete(true);
        router.push('/app?notice=Your%20profile%20is%20complete.');
        router.refresh();
      } else {
        setStep((s) => s + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong saving your progress.');
    } finally {
      setSaving(false);
    }
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
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, cacheControl: '3600' });
      if (upErr) throw new Error(upErr.message);
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      set('avatar_url', data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed. Try a smaller image.');
    } finally {
      setUploading(false);
    }
  }

  if (complete && !saving) {
    return (
      <div className="mx-auto max-w-[720px] px-5 py-24 text-center md:px-8">
        <p className="label text-ink/40">Onboarding complete</p>
        <h1 className="mt-6 font-serif text-[clamp(2.4rem,6vw,4rem)] leading-[0.95] text-ink">
          Your seat is being considered.
        </h1>
        <p className="mx-auto mt-6 max-w-[46ch] text-[15px] leading-relaxed text-ink/60">
          We’ll compose your first table by hand and let you know as soon as it’s confirmed. In the
          meantime, your dashboard is open.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href="/app" className="btn bg-ink px-7 py-4 text-ivory hover:bg-cherry">
            Go to dashboard
          </a>
          <a href="/app/profile" className="btn border border-ink/25 px-7 py-4 text-ink hover:border-ink">
            Edit profile
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-10 md:px-8 md:py-14">
      {/* progress */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1">
          <div className="h-px w-full bg-ink/12">
            <motion.div
              className="h-px bg-cherry"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-label text-ink/45">
              {STEPS[step].label}
            </p>
            <p className="text-[10px] uppercase tracking-label text-ink/30">
              {step + 1} / {STEPS.length}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-16">
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={STEPS[step].key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="font-serif text-[clamp(2rem,4.5vw,3rem)] leading-[0.98] text-ink">
                {STEPS[step].title}
              </h1>

              <div className="mt-8 space-y-7">
                {step === 0 && (
                  <>
                    <Field label="Full name">
                      <input
                        className="field"
                        value={draft.full_name}
                        onChange={(e) => set('full_name', e.target.value)}
                        placeholder="As you’d like to be introduced"
                      />
                    </Field>
                    <Field label="Email">
                      <input className="field opacity-60" value={email} disabled />
                    </Field>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field label="Date of birth">
                        <input
                          type="date"
                          className="field"
                          value={draft.date_of_birth}
                          max={new Date().toISOString().slice(0, 10)}
                          onChange={(e) => set('date_of_birth', e.target.value)}
                        />
                      </Field>
                      <Field label="Occupation">
                        <input
                          className="field"
                          value={draft.occupation}
                          onChange={(e) => set('occupation', e.target.value)}
                          placeholder="What you do, plainly"
                        />
                      </Field>
                    </div>
                    <label className="flex cursor-pointer items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        checked={draft.adult_confirmed}
                        onChange={(e) => set('adult_confirmed', e.target.checked)}
                        className="mt-1 h-4 w-4 accent-[#120D0B]"
                      />
                      <span className="text-[13px] leading-relaxed text-ink/60">
                        I confirm I am 18 or older and agree to the community guidelines.
                      </span>
                    </label>
                  </>
                )}

                {step === 1 && (
                  <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-sand">
                      {draft.avatar_url ? (
                        <Image src={draft.avatar_url} alt="Your photo" fill className="object-cover" sizes="112px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Camera className="h-6 w-6 text-ink/30" strokeWidth={1.25} />
                        </div>
                      )}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="btn border border-ink/25 px-6 py-3.5 text-ink hover:border-ink disabled:opacity-50"
                      >
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {draft.avatar_url ? 'Replace photo' : 'Upload a photo'}
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
                      <p className="mt-3 max-w-[38ch] text-[12px] leading-relaxed text-ink/45">
                        A real photograph of you, not a group shot. Members only see it once a table
                        is confirmed. You can skip and add it later.
                      </p>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <>
                    <Field label="City">
                      <select
                        className="field"
                        value={draft.city}
                        onChange={(e) => set('city', e.target.value)}
                      >
                        <option value="">Select your city</option>
                        {CITY_OPTIONS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="A short introduction">
                      <textarea
                        className="field min-h-[110px] resize-none"
                        value={draft.bio}
                        maxLength={600}
                        onChange={(e) => set('bio', e.target.value)}
                        placeholder="Three sentences. What you do, what you care about, what makes you good company."
                      />
                    </Field>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field label="Instagram (optional)">
                        <input
                          className="field"
                          value={draft.instagram_handle}
                          onChange={(e) => set('instagram_handle', e.target.value)}
                          placeholder="@handle"
                        />
                      </Field>
                      <Field label="When can you usually come?">
                        <div className="mt-3 flex flex-wrap gap-2">
                          {AVAILABILITY_OPTIONS.map((a) => (
                            <Chip
                              key={a}
                              active={draft.availability.includes(a)}
                              onClick={() => toggle('availability', a)}
                            >
                              {a}
                            </Chip>
                          ))}
                        </div>
                      </Field>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <p className="max-w-[52ch] text-[14px] leading-relaxed text-ink/55">
                      Pick what you’d happily talk about for an hour. Choose at least three — we use
                      these to find the overlaps.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {INTEREST_OPTIONS.map((i) => (
                        <Chip key={i} active={draft.interests.includes(i)} onClick={() => toggle('interests', i)}>
                          {i}
                        </Chip>
                      ))}
                    </div>
                    <div className="grid gap-6 pt-2 sm:grid-cols-2">
                      <Field label="Hobbies">
                        <input
                          className="field"
                          value={draft.hobbies}
                          onChange={(e) => set('hobbies', e.target.value)}
                          placeholder="Baking, bouldering, crumbly pottery"
                        />
                      </Field>
                      <Field label="Favourite topics">
                        <input
                          className="field"
                          value={draft.favourite_topics}
                          onChange={(e) => set('favourite_topics', e.target.value)}
                          placeholder="Cities, second acts, dessert"
                        />
                      </Field>
                    </div>
                    <Field label="Topics you’d rather avoid">
                      <div className="mt-3 flex flex-wrap gap-2">
                        {AVOID_TOPICS.map((t) => (
                          <Chip key={t} active={draft.avoid_topics.includes(t)} onClick={() => toggle('avoid_topics', t)}>
                            {t}
                          </Chip>
                        ))}
                      </div>
                    </Field>
                  </>
                )}

                {step === 4 && (
                  <>
                    <p className="max-w-[52ch] text-[14px] leading-relaxed text-ink/55">
                      Which rooms sound like an evening you’d look forward to?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {categories.map((c) => {
                        const active = draft.preferred_categories.includes(c.slug);
                        return (
                          <button
                            key={c.slug}
                            type="button"
                            onClick={() => toggle('preferred_categories', c.slug)}
                            className={`group flex items-center justify-between gap-3 border p-4 text-left transition-all duration-300 ${
                              active ? 'border-ink bg-ink text-ivory' : 'border-ink/15 hover:border-ink/45'
                            }`}
                          >
                            <span>
                              <span className="block font-serif text-[19px] leading-none">{c.name}</span>
                              <span className={`mt-1.5 block text-[11.5px] ${active ? 'text-ivory/55' : 'text-ink/45'}`}>
                                {c.tagline}
                              </span>
                            </span>
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                active ? 'border-blush bg-cherry' : 'border-ink/20'
                              }`}
                            >
                              {active && <Check className="h-3 w-3" strokeWidth={3} />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {step === 5 && (
                  <>
                    <Field label="Food preferences">
                      <div className="mt-3 flex flex-wrap gap-2">
                        {FOOD_OPTIONS.map((f) => (
                          <Chip key={f} active={draft.food_preferences.includes(f)} onClick={() => toggle('food_preferences', f)}>
                            {f}
                          </Chip>
                        ))}
                      </div>
                    </Field>
                    <Field label="Dietary restrictions or allergies">
                      <div className="mt-3 flex flex-wrap gap-2">
                        {DIETARY_OPTIONS.map((d) => (
                          <Chip
                            key={d}
                            active={draft.dietary_restrictions.includes(d)}
                            onClick={() => toggle('dietary_restrictions', d)}
                          >
                            {d}
                          </Chip>
                        ))}
                      </div>
                    </Field>
                    <p className="text-[12px] leading-relaxed text-ink/45">
                      We share relevant dietary information with the restaurant and your table. It is
                      treated as private data.
                    </p>
                  </>
                )}

                {step === 6 && (
                  <>
                    <p className="max-w-[52ch] text-[14px] leading-relaxed text-ink/55">
                      Four questions about how you are at a table. Honest answers make better tables
                      than flattering ones.
                    </p>
                    <div className="space-y-8">
                      {QUESTIONNAIRE.map((q, qi) => (
                        <div key={q.id}>
                          <p className="text-[10px] uppercase tracking-label text-ink/35">
                            Question {qi + 1}
                          </p>
                          <p className="mt-2 font-serif text-[21px] leading-tight text-ink">
                            {q.question}
                          </p>
                          <div className="mt-3 flex flex-col gap-2">
                            {q.options.map((o) => {
                              const active = draft.answers[q.id] === o.value;
                              return (
                                <button
                                  key={o.label}
                                  type="button"
                                  onClick={() =>
                                    setDraft((d) => ({ ...d, answers: { ...d.answers, [q.id]: o.value } }))
                                  }
                                  className={`border px-4 py-3 text-left text-[13.5px] transition-all duration-300 ${
                                    active
                                      ? 'border-ink bg-ink text-ivory'
                                      : 'border-ink/15 text-ink/70 hover:border-ink/40'
                                  }`}
                                >
                                  {o.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Field label="At a table, I am…">
                      <div className="mt-3 flex flex-wrap gap-2">
                        {SOCIAL_PREFERENCES.map((s) => (
                          <Chip key={s} active={draft.social_preferences.includes(s)} onClick={() => toggle('social_preferences', s)}>
                            {s}
                          </Chip>
                        ))}
                      </div>
                    </Field>
                  </>
                )}

                {step === 7 && (
                  <div className="space-y-6">
                    <div className="grid gap-px bg-ink/12 sm:grid-cols-2">
                      <Summary label="Name" value={draft.full_name || '—'} />
                      <Summary label="City" value={draft.city || '—'} />
                      <Summary label="Occupation" value={draft.occupation || '—'} />
                      <Summary label="Availability" value={draft.availability.join(', ') || '—'} />
                      <Summary label="Interests" value={draft.interests.join(', ') || '—'} />
                      <Summary
                        label="Tables"
                        value={
                          draft.preferred_categories
                            .map((s) => categories.find((c) => c.slug === s)?.name ?? s)
                            .join(', ') || '—'
                        }
                      />
                      <Summary label="Dietary" value={draft.dietary_restrictions.join(', ') || 'None declared'} />
                      <Summary label="Food" value={draft.food_preferences.join(', ') || '—'} />
                    </div>
                    <Field label="Profile visibility">
                      <div className="mt-3 space-y-2">
                        {(
                          [
                            ['table', 'Table only', 'Shared with people assigned to the same table.'],
                            ['members', 'Members', 'Visible to signed-in members.'],
                            ['private', 'Private', 'Only DEJAVU hosts see your details.'],
                          ] as const
                        ).map(([value, label, copy]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => set('visibility', value)}
                            className={`flex w-full items-start justify-between gap-4 border p-4 text-left transition-colors ${
                              draft.visibility === value ? 'border-ink' : 'border-ink/15 hover:border-ink/40'
                            }`}
                          >
                            <span>
                              <span className="block text-[13.5px] text-ink">{label}</span>
                              <span className="mt-1 block text-[12px] text-ink/45">{copy}</span>
                            </span>
                            <span
                              className={`mt-1 h-3.5 w-3.5 shrink-0 rounded-full border ${
                                draft.visibility === value ? 'border-4 border-cherry' : 'border-ink/25'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </Field>
                  </div>
                )}
              </div>

              {error && (
                <p className="mt-7 flex items-start gap-2 border-l-2 border-cherry bg-cherry/5 py-3 pl-3 text-[13px] text-cherry">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {error}
                </p>
              )}

              <div className="mt-10 flex items-center justify-between border-t border-ink/12 pt-7">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setStep((s) => Math.max(0, s - 1));
                  }}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-ink/45 transition-colors hover:text-ink disabled:opacity-30"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Back
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={saving}
                  className="btn bg-ink px-7 py-4 text-ivory transition-colors duration-500 hover:bg-cherry disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />}
                  {step === STEPS.length - 1 ? 'Finish and enter' : 'Continue'}
                  {step !== STEPS.length - 1 && <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />}
                </button>
              </div>
              <p className="mt-4 text-[11px] text-ink/35">
                Your progress saves each time you continue. You can leave and come back.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* aside — editorial rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-10 border-t border-ink/15 pt-6">
            <p className="label text-ink/35">Why we ask</p>
            <p className="mt-4 font-serif text-[19px] leading-[1.3] text-ink/80">
              “The best table is not the most similar one. It’s the one where everyone has something
              the others don’t.”
            </p>
            <div className="mt-8 space-y-4">
              {STEPS.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => {
                    if (i <= step) {
                      setError('');
                      setStep(i);
                    }
                  }}
                  className={`flex w-full items-center gap-3 text-left transition-colors ${
                    i <= step ? 'text-ink' : 'text-ink/25'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[9px] ${
                      i < step ? 'border-olive bg-olive text-ivory' : i === step ? 'border-cherry text-cherry' : 'border-ink/20'
                    }`}
                  >
                    {i < step ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.13em]">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
      {restored && <span className="sr-only">Saved progress restored</span>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="label block text-ink/40">{label}</span>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3.5 py-2 text-[12.5px] transition-all duration-300 ${
        active ? 'border-ink bg-ink text-ivory' : 'border-ink/15 text-ink/65 hover:border-ink/40'
      }`}
    >
      {children}
    </button>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ivory p-4">
      <p className="text-[9px] uppercase tracking-label text-ink/35">{label}</p>
      <p className="mt-1.5 text-[13.5px] leading-snug text-ink/80">{value}</p>
    </div>
  );
}
