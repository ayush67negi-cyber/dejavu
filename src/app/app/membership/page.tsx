import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getMembership, getProfile } from '@/lib/queries';
import { MembershipClient } from '@/components/app/membership-client';
import { formatDate } from '@/lib/format';
import { MEMBERSHIP_STATUS_LABEL } from '@/lib/constants';

export const metadata: Metadata = { title: 'Membership' };

export default async function MembershipPage() {
  const supabase = await createClient();
  const [membership, profile] = await Promise.all([getMembership(), getProfile()]);

  const [{ data: plans }, { data: history }, { data: payments }] = await Promise.all([
    supabase.from('membership_plans').select('*').eq('is_active', true).order('sort_order'),
    supabase
      .from('memberships')
      .select('id, plan_id, status, starts_at, ends_at, created_at, cancelled_at')
      .order('created_at', { ascending: false })
      .limit(12),
    supabase
      .from('membership_payments')
      .select('id, plan_id, amount_inr, status, created_at, provider_payment_id')
      .order('created_at', { ascending: false })
      .limit(12),
  ]);

  const paymentsConfigured = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

  return (
    <div className="space-y-10">
      <div className="border-b border-ink/12 pb-8">
        <p className="label text-ink/35">Membership</p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.98] text-ink">
          Your seat, monthly.
        </h1>
        <p className="mt-3 max-w-[56ch] text-[14px] leading-relaxed text-ink/55">
          Membership includes four curated Sunday dining experiences per month, subject to
          scheduling, availability and the membership terms. Food and beverages are paid by you at
          the restaurant.
        </p>
      </div>

      {/* current state */}
      <div className="grid gap-px bg-ink/12 sm:grid-cols-3">
        <div className="bg-ivory p-5">
          <p className="text-[9px] uppercase tracking-label text-ink/35">Status</p>
          <p
            className={`mt-2 font-serif text-[24px] leading-none ${
              membership?.status === 'active' ? 'text-olive' : 'text-ink'
            }`}
          >
            {membership ? MEMBERSHIP_STATUS_LABEL[membership.status] : 'No membership'}
          </p>
        </div>
        <div className="bg-ivory p-5">
          <p className="text-[9px] uppercase tracking-label text-ink/35">Start</p>
          <p className="mt-2 font-serif text-[24px] leading-none text-ink">
            {membership?.starts_at ? formatDate(membership.starts_at) : '—'}
          </p>
        </div>
        <div className="bg-ivory p-5">
          <p className="text-[9px] uppercase tracking-label text-ink/35">Renews / expires</p>
          <p className="mt-2 font-serif text-[24px] leading-none text-ink">
            {membership?.ends_at ? formatDate(membership.ends_at) : '—'}
          </p>
        </div>
      </div>

      <MembershipClient
        plans={plans ?? []}
        currentPlanId={membership?.status === 'active' ? membership.plan_id : null}
        hasPending={membership?.status === 'pending'}
        membershipId={membership?.id ?? null}
        canCancel={membership?.status === 'active'}
        paymentsConfigured={paymentsConfigured}
        city={profile?.city ?? 'India'}
      />

      {/* history */}
      <section>
        <div className="mb-4 flex items-baseline justify-between border-b border-ink/12 pb-3">
          <h2 className="label text-ink/50">Membership history</h2>
          <span className="text-[10px] uppercase tracking-label text-ink/30">
            {(history ?? []).length}
          </span>
        </div>
        {(history ?? []).length === 0 ? (
          <p className="text-[13px] text-ink/40">No membership recorded yet.</p>
        ) : (
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {(history ?? []).map((h) => (
              <li key={h.id} className="flex flex-wrap items-center justify-between gap-2 py-3.5">
                <div>
                  <p className="text-[13.5px] text-ink">
                    {h.plan_id.charAt(0).toUpperCase() + h.plan_id.slice(1)} ·{' '}
                    <span className={h.status === 'active' ? 'text-olive' : 'text-ink/45'}>
                      {MEMBERSHIP_STATUS_LABEL[h.status as keyof typeof MEMBERSHIP_STATUS_LABEL]}
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-ink/40">
                    Created {formatDate(h.created_at)}
                    {h.starts_at ? ` · from ${formatDate(h.starts_at)}` : ''}
                    {h.ends_at ? ` to ${formatDate(h.ends_at)}` : ''}
                  </p>
                </div>
                {h.cancelled_at && (
                  <span className="text-[10px] uppercase tracking-[0.13em] text-ink/30">
                    Cancelled {formatDate(h.cancelled_at)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {(payments ?? []).length > 0 && (
        <section>
          <div className="mb-4 flex items-baseline justify-between border-b border-ink/12 pb-3">
            <h2 className="label text-ink/50">Payments</h2>
            <span className="text-[10px] uppercase tracking-label text-ink/30">{(payments ?? []).length}</span>
          </div>
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {(payments ?? []).map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3 text-[13px]">
                <span className="text-ink">
                  ₹{p.amount_inr.toLocaleString('en-IN')} · {p.plan_id}
                </span>
                <span className="text-[11px] uppercase tracking-[0.12em] text-ink/45">
                  {p.status} · {formatDate(p.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="border-t border-ink/12 pt-6">
        <p className="label text-ink/40">Terms worth reading twice</p>
        <div className="mt-4 grid gap-5 text-[12.5px] leading-relaxed text-ink/50 sm:grid-cols-2">
          <p>
            Membership is a monthly allocation of four Sunday dining experiences. Seats depend on
            scheduling and availability in your city — we do not guarantee a specific restaurant,
            date or table composition.
          </p>
          <p>
            Food and beverages are not included and are paid directly to the restaurant. Cancelling
            ends renewal; access continues until the end of your paid period. Full details in the{' '}
            <Link href="/terms" className="underline decoration-ink/25 underline-offset-2 hover:text-ink">
              terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline decoration-ink/25 underline-offset-2 hover:text-ink">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
