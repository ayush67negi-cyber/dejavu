import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getMembership, getProfile } from '@/lib/queries';
import { MembershipClient } from '@/components/app/membership-client';
import { formatDate } from '@/lib/format';
import { MEMBERSHIP_STATUS_LABEL } from '@/lib/constants';

export const metadata: Metadata = { title: 'Mitgliedschaft' };

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
        <p className="label text-ink/40">Mitgliedschaft</p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.98] text-ink">
          Dein Platz, jeden Monat.
        </h1>
        <p className="mt-3 max-w-[56ch] text-[14px] leading-relaxed text-ink/55">
          Die Mitgliedschaft umfasst vier kuratierte Sonntags-Dinner pro Monat, abhängig von
          Terminplan, Verfügbarkeit und den Mitgliedschaftsbedingungen. Speisen und Getränke zahlst
          du im Restaurant selbst.
        </p>
      </div>

      {/* current state */}
      <div className="grid gap-px bg-ink/12 sm:grid-cols-3">
        <div className="bg-ivory p-5">
          <p className="text-[9px] uppercase tracking-label text-ink/40">Status</p>
          <p
            className={`mt-2 font-serif text-[24px] leading-none ${
              membership?.status === 'active' ? 'text-olive' : 'text-ink'
            }`}
          >
            {membership ? MEMBERSHIP_STATUS_LABEL[membership.status] : 'Keine Mitgliedschaft'}
          </p>
        </div>
        <div className="bg-ivory p-5">
          <p className="text-[9px] uppercase tracking-label text-ink/40">Beginn</p>
          <p className="mt-2 font-serif text-[24px] leading-none text-ink">
            {membership?.starts_at ? formatDate(membership.starts_at) : '—'}
          </p>
        </div>
        <div className="bg-ivory p-5">
          <p className="text-[9px] uppercase tracking-label text-ink/40">Verlängert sich / endet</p>
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
        city={profile?.city ?? 'Indien'}
      />

      {/* history */}
      <section>
        <div className="mb-4 flex items-baseline justify-between border-b border-ink/12 pb-3">
          <h2 className="label text-ink/50">Verlauf der Mitgliedschaft</h2>
          <span className="text-[10px] uppercase tracking-label text-ink/30">
            {(history ?? []).length}
          </span>
        </div>
        {(history ?? []).length === 0 ? (
          <p className="text-[13px] text-ink/45">Noch keine Mitgliedschaft verzeichnet.</p>
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
                    Angelegt am {formatDate(h.created_at)}
                    {h.starts_at ? ` · ab ${formatDate(h.starts_at)}` : ''}
                    {h.ends_at ? ` bis ${formatDate(h.ends_at)}` : ''}
                  </p>
                </div>
                {h.cancelled_at && (
                  <span className="text-[10px] uppercase tracking-[0.13em] text-ink/30">
                    Gekündigt am {formatDate(h.cancelled_at)}
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
            <h2 className="label text-ink/50">Zahlungen</h2>
            <span className="text-[10px] uppercase tracking-label text-ink/30">{(payments ?? []).length}</span>
          </div>
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {(payments ?? []).map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3 text-[13px]">
                <span className="text-ink">
                  ₹{p.amount_inr.toLocaleString('de-DE')} · {p.plan_id}
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
        <p className="label text-ink/45">Bedingungen, die man zweimal lesen sollte</p>
        <div className="mt-4 grid gap-5 text-[12.5px] leading-relaxed text-ink/50 sm:grid-cols-2">
          <p>
            Die Mitgliedschaft ist ein monatliches Kontingent von vier Sonntags-Dinnern. Die Plätze
            hängen von Terminplan und Verfügbarkeit in deiner Stadt ab – ein bestimmtes Restaurant,
            Datum oder eine bestimmte Tischzusammensetzung können wir nicht garantieren.
          </p>
          <p>
            Speisen und Getränke sind nicht enthalten und werden direkt im Restaurant bezahlt. Eine
            Kündigung beendet die Verlängerung; der Zugang läuft bis zum Ende des bezahlten Zeitraums
            weiter. Alle Details in den{' '}
            <Link href="/terms" className="underline decoration-ink/25 underline-offset-2 hover:text-ink">
              AGB
            </Link>{' '}
            und der{' '}
            <Link href="/privacy" className="underline decoration-ink/25 underline-offset-2 hover:text-ink">
              Datenschutzerklärung
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
