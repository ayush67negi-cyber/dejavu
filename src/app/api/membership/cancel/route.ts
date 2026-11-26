import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

/**
 * Records cancellation intent. The membership stays `active` until the paid
 * period ends (a scheduled job or an admin action transitions it to `expired`),
 * so members never lose paid access early and can never extend it themselves.
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 });

  const admin = createAdminClient();
  const { data: membership } = await admin
    .from('memberships')
    .select('id, ends_at, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ error: 'Keine aktive Mitgliedschaft.' }, { status: 404 });
  }

  const { error } = await admin
    .from('memberships')
    .update({ cancelled_at: new Date().toISOString() })
    .eq('id', membership.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await admin.from('notifications').insert({
    user_id: user.id,
    type: 'membership',
    title: 'Verlängerung gekündigt',
    body: 'Es erfolgen keine weiteren Abbuchungen. Dein Zugang läuft bis zum Ende des aktuellen bezahlten Zeitraums weiter.',
    link: '/app/membership',
  });

  return NextResponse.json({ ok: true });
}
