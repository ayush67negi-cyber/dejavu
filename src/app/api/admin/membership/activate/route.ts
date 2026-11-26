import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = (await request.json().catch(() => ({}))) as { userId?: string; planId?: string };
  if (!body.userId || !body.planId) {
    return NextResponse.json({ error: 'Mitglied oder Tarif fehlt.' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: plan } = await admin
    .from('membership_plans')
    .select('duration_months, name')
    .eq('id', body.planId)
    .maybeSingle();
  if (!plan) return NextResponse.json({ error: 'Unbekannter Tarif.' }, { status: 400 });

  const startsAt = new Date();
  const endsAt = new Date(startsAt);
  endsAt.setMonth(endsAt.getMonth() + plan.duration_months);

  const { error } = await admin.from('memberships').insert({
    user_id: body.userId,
    plan_id: body.planId,
    status: 'active',
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
    activated_by_admin: true,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await admin.from('notifications').insert({
    user_id: body.userId,
    type: 'membership',
    title: 'Mitgliedschaft aktiviert',
    body: `Deine Mitgliedschaft „${plan.name}“ ist aktiv bis ${endsAt.toLocaleDateString('de-DE')}.`,
    link: '/app/membership',
  });

  return NextResponse.json({ ok: true });
}
