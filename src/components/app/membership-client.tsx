'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2, Info } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Plan = {
  id: string;
  name: string;
  duration_months: number;
  price_inr: number;
  description: string | null;
};

type CheckoutIssue = 'not_configured' | 'not_authenticated' | 'error' | null;

export function MembershipClient({
  plans,
  currentPlanId,
  hasPending,
  membershipId,
  canCancel,
  paymentsConfigured,
  city,
}: {
  plans: Plan[];
  currentPlanId: string | null;
  hasPending: boolean;
  membershipId: string | null;
  canCancel: boolean;
  paymentsConfigured: boolean;
  city: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(currentPlanId);
  const [loading, setLoading] = useState(false);
  const [issue, setIssue] = useState<CheckoutIssue>(null);
  const [message, setMessage] = useState('');
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function checkout() {
    const plan = plans.find((p) => p.id === selected);
    if (!plan) {
      setMessage('Choose a membership period first.');
      return;
    }
    setLoading(true);
    setIssue(null);
    setMessage('');

    if (!paymentsConfigured) {
      setIssue('not_configured');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setIssue('not_authenticated');
        return;
      }

      const res = await fetch('/api/membership/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ planId: plan.id }),
      });

      const json = (await res.json()) as {
        orderId?: string;
        keyId?: string;
        amount?: number;
        error?: string;
        reason?: string;
      };

      if (!res.ok) {
        if (json.reason === 'not_configured') {
          setIssue('not_configured');
        } else {
          setIssue('error');
          setMessage(json.error ?? 'Checkout could not be started.');
        }
        return;
      }

      await loadRazorpay();
      const rzp = new (window as unknown as { Razorpay: new (o: unknown) => { open: () => void } }).Razorpay({
        key: json.keyId,
        amount: json.amount,
        currency: 'INR',
        name: 'DEJAVU',
        description: `${plan.name} membership`,
        order_id: json.orderId,
        prefill: {},
        theme: { color: '#3D0A18' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verify = await fetch('/api/membership/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify(response),
          });
          if (verify.ok) {
            router.push('/app/membership?notice=Payment%20confirmed.%20Welcome%20to%20the%20table.');
            router.refresh();
          } else {
            setIssue('error');
            setMessage(
              'Payment was received but verification failed. Nothing has been activated — please contact us and we will resolve it.',
            );
          }
        },
      });
      rzp.open();
    } catch {
      setIssue('error');
      setMessage('Something went wrong starting checkout. No payment was taken.');
    } finally {
      setLoading(false);
    }
  }

  async function cancel() {
    if (!membershipId) return;
    setCancelling(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('memberships')
        .update({ cancelled_at: new Date().toISOString() })
        .eq('id', membershipId);
      // Cancellation flags intent; the status change is applied by the server so a
      // member cannot reactivate or extend their own paid period.
      if (error) {
        setMessage('We could not record the cancellation. Please contact us.');
        return;
      }
      const res = await fetch('/api/membership/cancel', { method: 'POST' });
      if (!res.ok) {
        setMessage('Cancellation recorded locally — our team will confirm by email.');
      }
      setCancelOpen(false);
      router.refresh();
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((p) => {
          const active = selected === p.id;
          const isCurrent = currentPlanId === p.id;
          const recommended = p.id === 'quarterly';
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p.id)}
              className={`relative flex flex-col border p-6 text-left transition-all duration-400 ${
                active ? 'border-ink bg-ink text-ivory' : 'border-ink/15 hover:border-ink/45'
              }`}
            >
              {recommended && (
                <span
                  className={`absolute right-0 top-0 px-3 py-1 text-[8px] uppercase tracking-label ${
                    active ? 'bg-blush text-ink' : 'bg-cherry text-ivory'
                  }`}
                >
                  Recommended
                </span>
              )}
              <p className={`label ${active ? 'text-ivory/45' : 'text-ink/40'}`}>{p.name}</p>
              <p className="mt-4 font-serif text-[34px] leading-none">
                <span className="align-top text-[0.45em]">₹</span>
                {p.price_inr.toLocaleString('en-IN')}
              </p>
              <p className={`mt-1 text-[11px] ${active ? 'text-ivory/45' : 'text-ink/35'}`}>
                ≈ ₹{Math.round(p.price_inr / p.duration_months).toLocaleString('en-IN')} / month
              </p>
              <p className={`mt-4 text-[12.5px] leading-relaxed ${active ? 'text-ivory/65' : 'text-ink/50'}`}>
                {p.description}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-current/15 pt-4">
                <span className={`text-[9px] uppercase tracking-label ${active ? 'text-ivory/45' : 'text-ink/35'}`}>
                  {isCurrent ? 'Your current plan' : 'Select'}
                </span>
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                    active ? 'border-blush bg-cherry' : 'border-ink/25'
                  }`}
                >
                  {active && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 border border-ink/12 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink/30" strokeWidth={1.5} />
          <div>
            <p className="text-[13px] text-ink">
              {hasPending
                ? 'You have a membership awaiting verified payment.'
                : currentPlanId
                  ? 'Your membership is active.'
                  : 'No membership period selected yet.'}
            </p>
            <p className="mt-1 max-w-[56ch] text-[11.5px] leading-relaxed text-ink/45">
              Checkout is processed by Razorpay. Membership activates only after a verified payment
              — we never mark an account paid manually.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {canCancel && (
            <button
              onClick={() => setCancelOpen(true)}
              className="btn border border-ink/25 px-5 py-3 text-[10px] text-ink/70 hover:border-ink hover:text-ink"
            >
              Cancel renewal
            </button>
          )}
          <button
            onClick={checkout}
            disabled={loading || !selected}
            className="btn bg-ink px-6 py-3.5 text-ivory hover:bg-cherry disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {currentPlanId ? 'Change plan' : 'Continue to checkout'}
          </button>
        </div>
      </div>

      {issue === 'not_configured' && (
        <div className="border-l-2 border-ember bg-ember/[0.06] p-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-ember">Payments not yet enabled</p>
          <p className="mt-2 max-w-[70ch] text-[13px] leading-relaxed text-ink/65">
            The Razorpay gateway has not been configured for this deployment, so no payment can be
            taken and no membership has been activated. To enable memberships, set{' '}
            <code className="bg-ink/5 px-1 py-0.5 text-[12px]">RAZORPAY_KEY_ID</code>,{' '}
            <code className="bg-ink/5 px-1 py-0.5 text-[12px]">RAZORPAY_KEY_SECRET</code> and{' '}
            <code className="bg-ink/5 px-1 py-0.5 text-[12px]">RAZORPAY_WEBHOOK_SECRET</code> in the
            Vercel project, then redeploy. In the meantime, membership periods are activated only by
            our team after an off-platform arrangement.
          </p>
        </div>
      )}

      {issue === 'error' && message && (
        <p className="border-l-2 border-cherry bg-cherry/5 p-4 text-[13px] leading-relaxed text-cherry">
          {message}
        </p>
      )}
      {issue === 'not_authenticated' && (
        <p className="border-l-2 border-cherry bg-cherry/5 p-4 text-[13px] text-cherry">
          Your session expired. Please sign in again.
        </p>
      )}

      {cancelOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 p-5">
          <div className="w-full max-w-[460px] bg-ivory p-7">
            <p className="label text-cherry">Cancel renewal</p>
            <h2 className="mt-3 font-serif text-[26px] leading-tight text-ink">
              Stop the next charge?
            </h2>
            <p className="mt-3 text-[13px] leading-relaxed text-ink/60">
              Your access continues until the end of the current paid period. Tables already
              confirmed are honoured. You can rejoin any time.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setCancelOpen(false)}
                className="text-[10px] uppercase tracking-[0.14em] text-ink/45 hover:text-ink"
              >
                Keep membership
              </button>
              <button
                onClick={cancel}
                disabled={cancelling}
                className="btn bg-cherry px-5 py-3 text-ivory hover:bg-claret disabled:opacity-60"
              >
                {cancelling && <Loader2 className="h-4 w-4 animate-spin" />} Confirm cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-[11px] text-ink/35">
        Serving members in {city}. Prices in Indian Rupees, inclusive of applicable taxes.
      </p>
    </div>
  );
}

function loadRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Razorpay checkout failed to load'));
    document.body.appendChild(script);
  });
}
