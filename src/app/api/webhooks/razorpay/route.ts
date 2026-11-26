import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * Razorpay server-to-server webhook. Authoritative for payment outcomes and
 * refunds — a client-side callback alone is never trusted.
 */
export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'Webhook nicht konfiguriert.' }, { status: 503 });

  const raw = await request.text();
  const signature = request.headers.get('x-razorpay-signature');
  if (!signature) return NextResponse.json({ error: 'Signatur fehlt.' }, { status: 401 });

  const expected = createHmac('sha256', secret).update(raw).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: 'Ungültige Signatur.' }, { status: 401 });
  }

  const event = JSON.parse(raw) as {
    event: string;
    payload?: { payment?: { entity?: { id?: string; order_id?: string; status?: string } } };
  };

  const payment = event.payload?.payment?.entity;
  const admin = createAdminClient();

  if (payment?.order_id && (event.event === 'payment.failed' || event.event === 'payment.captured')) {
    const status = event.event === 'payment.captured' ? 'paid' : 'failed';
    await admin
      .from('membership_payments')
      .update({
        status,
        provider_payment_id: payment.id ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('provider_order_id', payment.order_id)
      .neq('status', 'paid');
  }

  if (event.event === 'refund.processed' && payment?.order_id) {
    await admin
      .from('membership_payments')
      .update({ status: 'refunded', updated_at: new Date().toISOString() })
      .eq('provider_order_id', payment.order_id);
  }

  return NextResponse.json({ received: true });
}
