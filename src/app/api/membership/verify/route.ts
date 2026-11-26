import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

/**
 * Verifies the Razorpay signature server-side, then activates the membership.
 * This is the ONLY path that can mark a payment as paid.
 */
export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ error: 'Razorpay ist nicht konfiguriert.' }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Unvollständige Zahlungsantwort.' }, { status: 400 });
  }

  const expected = createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const a = Buffer.from(expected);
  const b = Buffer.from(razorpay_signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: 'Signaturprüfung fehlgeschlagen.' }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: payment } = await admin
    .from('membership_payments')
    .select('id, plan_id, user_id, status')
    .eq('provider_order_id', razorpay_order_id)
    .maybeSingle();

  if (!payment || payment.user_id !== user.id) {
    return NextResponse.json({ error: 'Kein passender Zahlungsdatensatz.' }, { status: 404 });
  }

  if (payment.status === 'paid') {
    return NextResponse.json({ ok: true, idempotent: true });
  }

  const { data: plan } = await admin
    .from('membership_plans')
    .select('duration_months')
    .eq('id', payment.plan_id)
    .single();

  const months = plan?.duration_months ?? 1;
  const startsAt = new Date();
  const endsAt = new Date(startsAt);
  endsAt.setMonth(endsAt.getMonth() + months);

  const { data: membership, error: mErr } = await admin
    .from('memberships')
    .insert({
      user_id: user.id,
      plan_id: payment.plan_id,
      status: 'active',
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      payment_reference: razorpay_payment_id,
    })
    .select('id')
    .single();

  if (mErr) {
    console.error('[membership activate]', mErr.message);
    return NextResponse.json({ error: 'Zahlung bestätigt, Mitgliedschaft konnte aber nicht angelegt werden.' }, { status: 500 });
  }

  await admin
    .from('membership_payments')
    .update({
      status: 'paid',
      membership_id: membership.id,
      provider_payment_id: razorpay_payment_id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', payment.id);

  await admin.from('notifications').insert({
    user_id: user.id,
    type: 'membership',
    title: 'Mitgliedschaft aktiviert',
    body: `Deine DEJAVU-Mitgliedschaft ist aktiv bis ${endsAt.toLocaleDateString('de-DE')}. Vier Tische pro Monat, von Hand zusammengestellt.`,
    link: '/app/membership',
  });

  return NextResponse.json({ ok: true, membershipId: membership.id });
}
