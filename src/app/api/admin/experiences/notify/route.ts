import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = (await request.json().catch(() => ({}))) as {
    experienceId?: string;
    event?: 'confirmed' | 'cancelled';
  };
  if (!body.experienceId || !body.event) {
    return NextResponse.json({ error: 'Erlebnis oder Ereignis fehlt.' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: experience } = await admin
    .from('experiences')
    .select('id, name, city, starts_at, reveal_venue')
    .eq('id', body.experienceId)
    .maybeSingle();
  if (!experience) return NextResponse.json({ error: 'Erlebnis nicht gefunden.' }, { status: 404 });

  const { data: venue } = await admin
    .from('experience_venues')
    .select('venue_name')
    .eq('experience_id', body.experienceId)
    .maybeSingle();

  const { data: participants } = await admin
    .from('experience_participants')
    .select('user_id')
    .eq('experience_id', body.experienceId);

  if (!participants?.length) return NextResponse.json({ ok: true, notified: 0 });

  const when = experience.starts_at
    ? new Date(experience.starts_at).toLocaleString('de-DE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
      })
    : 'Termin folgt';

  const rows = participants.map((p) => ({
    user_id: p.user_id,
    type: 'experience',
    title:
      body.event === 'confirmed'
        ? `Dein Tisch ist bestätigt – ${experience.name}`
        : `Tisch abgesagt – ${experience.name}`,
    body:
      body.event === 'confirmed'
        ? `${when}${experience.reveal_venue && venue?.venue_name ? ` im ${venue.venue_name}` : ''}. Alle Details findest du unter „Meine Erlebnisse“.`
        : 'Dieser Tisch wurde abgesagt. Wir setzen dich in Kürze an einen anderen Tisch – du musst nichts tun.',
    link: '/app/experiences',
  }));

  const { error } = await admin.from('notifications').insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, notified: rows.length });
}
