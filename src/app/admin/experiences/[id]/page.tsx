import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCategories } from '@/lib/queries';
import { ExperienceEditor } from '@/components/admin/experience-editor';
import { ParticipantManager } from '@/components/admin/participant-manager';
import { formatDateTime } from '@/lib/format';
import { EXPERIENCE_STATUS_LABEL } from '@/lib/constants';

export default async function ManageExperience({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const categories = await getCategories();

  const [{ data: experience }, { data: participants }, { data: requests }, { data: venue }] = await Promise.all([
    supabase.from('experiences').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('experience_participants')
      .select('user_id, status, profiles(full_name, city, occupation, avatar_url)')
      .eq('experience_id', id),
    supabase
      .from('experience_requests')
      .select('id, user_id, status, message, created_at, profiles(full_name, city)')
      .eq('experience_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('experience_venues')
      .select('venue_name, venue_address')
      .eq('experience_id', id)
      .maybeSingle(),
  ]);

  if (!experience) notFound();

  const { data: members } = await supabase
    .from('profiles')
    .select('id, full_name, city, status')
    .eq('status', 'active')
    .eq('city', experience.city)
    .order('full_name')
    .limit(200);

  type ParticipantRow = {
    user_id: string;
    status: string;
    profiles: { full_name: string | null; city: string | null; occupation: string | null; avatar_url: string | null } | null;
  };
  type RequestRow = {
    id: string;
    user_id: string;
    status: string;
    message: string | null;
    created_at: string;
    profiles: { full_name: string | null; city: string | null } | null;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/12 pb-6">
        <div>
          <Link href="/admin/experiences" className="text-[10px] uppercase tracking-[0.14em] text-ink/40 hover:text-cherry">
            ← Alle Erlebnisse
          </Link>
          <h1 className="mt-3 font-serif text-[clamp(1.7rem,3.2vw,2.4rem)] leading-none text-ink">
            {experience.name}
          </h1>
          <p className="mt-2 text-[12.5px] text-ink/45">
            {experience.city} · {experience.starts_at ? formatDateTime(experience.starts_at) : 'Termin folgt'} ·{' '}
            {(participants ?? []).length}/{experience.group_size} besetzt
          </p>
        </div>
        <span
          className={`border px-3 py-1.5 text-[9px] uppercase tracking-label ${
            experience.status === 'confirmed'
              ? 'border-olive/40 text-olive'
              : experience.status === 'cancelled'
                ? 'border-cherry/40 text-cherry'
                : 'border-ember/40 text-ember'
          }`}
        >
          {EXPERIENCE_STATUS_LABEL[experience.status] ?? experience.status}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <ExperienceEditor
          experience={experience}
          categories={categories}
          venue={(venue as { venue_name: string | null; venue_address: string | null } | null) ?? null}
        />
        <ParticipantManager
          experienceId={id}
          groupSize={experience.group_size}
          participants={(participants ?? []) as unknown as ParticipantRow[]}
          requests={(requests ?? []) as unknown as RequestRow[]}
          members={members ?? []}
        />
      </div>
    </div>
  );
}
