import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

/**
 * Creates a Razorpay order and a local payment record in `created` state.
 * No membership is activated here. Activation happens only after signature
 * verification in /api/membership/verify.
 */
export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      {
        reason: 'not_configured',
        error: 'Razorpay is not configured for this deployment.',
      },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { planId?: string };
  const planId = body.planId;
  if (!planId) return NextResponse.json({ error: 'Missing plan.' }, { status: 400 });

  const admin = createAdminClient();
  const { data: plan } = await admin
    .from('membership_plans')
    .select('id, name, price_inr, duration_months, is_active')
    .eq('id', planId)
    .maybeSingle();

  if (!plan || !plan.is_active) {
    return NextResponse.json({ error: 'That plan is not available.' }, { status: 400 });
  }

  const amountPaise = plan.price_inr * 100;

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
    body: JSON.stringify({
      amount: amountPaise,
      currency: 'INR',
      receipt: `dejavu_${Date.now()}`,
      notes: { user_id: user.id, plan_id: plan.id },
    }),
  });

  if (!rzpRes.ok) {
    const detail = await rzpRes.text();
    console.error('[razorpay order]', rzpRes.status, detail.slice(0, 300));
    return NextResponse.json({ error: 'Could not create the payment order.' }, { status: 502 });
  }

  const order = (await rzpRes.json()) as { id: string; amount: number; currency: string };

  const { error: insertError } = await admin.from('membership_payments').insert({
    user_id: user.id,
    plan_id: plan.id,
    amount_inr: plan.price_inr,
    provider: 'razorpay',
    provider_order_id: order.id,
    status: 'created',
  });

  if (insertError) {
    console.error('[payment record]', insertError.message);
    return NextResponse.json({ error: 'Could not record the payment attempt.' }, { status: 500 });
  }

  return NextResponse.json({
    orderId: order.id,
    keyId,
    amount: order.amount,
    currency: order.currency,
  });
}
