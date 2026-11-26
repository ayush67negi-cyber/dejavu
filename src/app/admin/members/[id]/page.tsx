import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/format';
import { MemberActions } from '@/components/admin/member-actions';
import { MEMBERSHIP_STATUS_LABEL } from '@/lib/constants';

export default async function MemberReview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
  if (!profile) notFound();

  const [{ data: interests }, { data: q }, { data: memberships }, { data: participation }, { data: reports }] =
    await Promise.all([
      supabase.from('user_interests').select('interest').eq('user_id', id),
      supabase.from('questionnaire_responses').select('*').eq('user_id', id).maybeSingle(),
      supabase.from('memberships').select('*').eq('user_id', id).order('created_at', { ascending: false }),
      supabase
        .from('experience_participants')
        .select('status, experiences(id, name, starts_at, status)')
        .eq('user_id', id),
      supabase.from('reports').select('id, category, details, status, created_at').eq('reported_user_id', id),
    ]);

  const answers = (q?.answers ?? {}) as Record<string, unknown>;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 border-b border-ink/12 pb-6">
        <div>
          <Link href="/admin/members" className="text-[10px] uppercase tracking-[0.14em] text-ink/40 hover:text-cherry">
            ← All members
          </Link>
          <h1 className="mt-3 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] leading-none text-ink">
            {profile.full_name || 'Unnamed member'}
          </h1>
          <p className="mt-2 text-[12.5px] text-ink/45">
            {profile.city ?? 'No city'} · {profile.occupation ?? 'No occupation'} · joined{' '}
            {formatDate(profile.created_at)}
          </p>
        </div>
        <span
          className={`border px-3 py-1.5 text-[9px] uppercase tracking-label ${
            profile.status === 'active' ? 'border-olive/40 text-olive' : 'border-cherry/40 text-cherry'
          }`}
        >
          {profile.status}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-7">
          <Panel title="Introduction">
            <p className="text-[13.5px] leading-relaxed text-ink/70">
              {profile.bio || 'No introduction written yet.'}
            </p>
          </Panel>

          <Panel title="Onboarding detail">
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Row label="Date of birth" value={profile.date_of_birth ?? '—'} />
              <Row label="Adult confirmed" value={profile.adult_confirmed ? 'Yes' : 'No'} />
              <Row label="Onboarding" value={profile.onboarding_completed ? 'Complete' : 'Incomplete'} />
              <Row label="Visibility" value={profile.visibility} />
              <Row label="Instagram" value={profile.instagram_handle ? `@${profile.instagram_handle}` : '—'} />
              <Row label="Availability" value={profile.availability?.join(', ') || '—'} />
            </dl>
          </Panel>

          <Panel title="Interests">
            <div className="flex flex-wrap gap-1.5">
              {(interests ?? []).length === 0 ? (
                <span className="text-[12.5px] text-ink/40">None recorded.</span>
              ) : (
                (interests ?? []).map((i) => (
                  <span key={i.interest} className="border border-ink/15 px-2.5 py-1 text-[11.5px] text-ink/65">
                    {i.interest}
                  </span>
                ))
              )}
            </div>
          </Panel>

          <Panel title="Food & social">
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Row label="Food" value={profile.food_preferences?.join(', ') || '—'} />
              <Row label="Dietary" value={profile.dietary_restrictions?.join(', ') || '—'} />
              <Row label="Social" value={profile.social_preferences?.join(', ') || '—'} />
              <Row label="Preferred tables" value={profile.preferred_categories?.join(', ') || '—'} />
            </dl>
          </Panel>

          <Panel title="Questionnaire (private)">
            {q ? (
              <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                <Row label="Energy" value={String(q.energy ?? '—')} />
                <Row label="Talkativity" value={String(q.talkativity ?? '—')} />
                <Row label="Curiosity" value={String(q.curiosity ?? '—')} />
                <Row label="Openness to new people" value={String(q.newness ?? '—')} />
                <Row label="Hobbies" value={String(answers.hobbies ?? '—')} />
                <Row label="Favourite topics" value={String(answers.topics ?? '—')} />
                <Row label="Avoids" value={Array.isArray(answers.avoid_topics) ? answers.avoid_topics.join(', ') || '—' : '—'} />
              </dl>
            ) : (
              <p className="text-[12.5px] text-ink/40">Not completed.</p>
            )}
          </Panel>
        </div>

        <div className="space-y-7">
          <Panel title="Membership">
            {(memberships ?? []).length === 0 ? (
              <p className="text-[12.5px] text-ink/40">No membership on record.</p>
            ) : (
              <ul className="space-y-3">
                {(memberships ?? []).map((m) => (
                  <li key={m.id} className="border-b border-ink/10 pb-3 last:border-0 last:pb-0">
                    <p className="text-[13px] text-ink">
                      {m.plan_id} ·{' '}
                      <span className={m.status === 'active' ? 'text-olive' : 'text-ink/45'}>
                        {MEMBERSHIP_STATUS_LABEL[m.status as keyof typeof MEMBERSHIP_STATUS_LABEL]}
                      </span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-ink/40">
                      {m.starts_at ? formatDate(m.starts_at) : 'Not started'}
                      {m.ends_at ? ` → ${formatDate(m.ends_at)}` : ''}
                      {m.activated_by_admin ? ' · activated by admin' : ''}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4">
              <MemberActions userId={id} currentStatus={profile.status} />
            </div>
          </Panel>

          <Panel title="Tables attended">
            {(participation ?? []).length === 0 ? (
              <p className="text-[12.5px] text-ink/40">Not yet assigned to a table.</p>
            ) : (
              <ul className="space-y-2.5">
                {(participation ?? []).map((p, i) => {
                  const exp = p.experiences as unknown as { id: string; name: string; starts_at: string | null } | null;
                  if (!exp) return null;
                  return (
                    <li key={`${exp.id}-${i}`} className="flex items-center justify-between gap-3">
                      <Link href={`/admin/experiences/${exp.id}`} className="text-[12.5px] text-ink hover:text-cherry">
                        {exp.name}
                      </Link>
                      <span className="text-[10px] uppercase tracking-[0.12em] text-ink/35">{p.status}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel title="Reports against this member">
            {(reports ?? []).length === 0 ? (
              <p className="text-[12.5px] text-ink/40">No reports.</p>
            ) : (
              <ul className="space-y-3">
                {(reports ?? []).map((r) => (
                  <li key={r.id} className="border-b border-ink/10 pb-2.5 last:border-0 last:pb-0">
                    <p className="text-[12px] text-ink">
                      {r.category} · <span className="text-cherry">{r.status}</span>
                    </p>
                    <p className="mt-1 line-clamp-2 text-[11.5px] text-ink/50">{r.details}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-ink/12 p-5">
      <p className="label text-ink/40">{title}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[9px] uppercase tracking-label text-ink/35">{label}</dt>
      <dd className="mt-1 text-[12.5px] leading-snug text-ink/70">{value}</dd>
    </div>
  );
}
