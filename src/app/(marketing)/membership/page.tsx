import type { Metadata } from 'next';
import Link from 'next/link';
import { Membership } from '@/components/landing/membership';
import { PageHead } from '@/components/marketing/page-head';
import { Reveal } from '@/components/ui/motion';

export const metadata: Metadata = {
  title: 'Membership',
  description:
    'DEJAVU membership: four curated Sunday dining experiences per month. One month ₹1,999, three months ₹4,999, six months ₹8,999.',
};

const FAQS = [
  {
    q: 'What exactly does membership include?',
    a: 'Four curated Sunday dining experiences per month, subject to scheduling, availability and the membership terms. Each experience is a table of four to six people at a restaurant in your city.',
  },
  {
    q: 'Is food included?',
    a: 'No. Restaurant food and beverages are paid for separately by members, directly at the venue. We never claim to settle restaurant bills.',
  },
  {
    q: 'Which cities do you operate in?',
    a: 'We are building in Delhi, Mumbai and Bengaluru first, with more cities added as the member base grows. Your city is recorded during onboarding so we can open tables where demand exists.',
  },
  {
    q: 'What happens if I cannot attend a table?',
    a: 'Tell us as early as possible through the dashboard. Seats are limited and composed by hand, so late cancellations affect real people. Repeated no-shows are reviewed by our team.',
  },
  {
    q: 'How do I cancel?',
    a: 'Cancel renewal from the membership page at any time. Your access continues to the end of the paid period and no further charge is made. Tables already confirmed are honoured.',
  },
  {
    q: 'Is DEJAVU a dating app?',
    a: 'No. DEJAVU is a social dining membership built around friendship and conversation. There is no matching on attraction, no swiping and no scoring of members.',
  },
];

export default function MembershipPage() {
  return (
    <>
      <PageHead
        eyebrow="Membership"
        title="A seat at the table, four Sundays a month."
        lead="One membership. One monthly rhythm. Choose how long you would like to stay — you can change or cancel at any time."
        tone="burgundy"
      />
      <Membership />

      <section className="border-t border-ink/12 bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
            <div>
              <span className="label text-ink/35">Before you join</span>
              <h2 className="mt-5 max-w-[18ch] font-serif text-[clamp(1.9rem,3.6vw,2.8rem)] leading-[0.95] text-ink">
                The terms, in plain language.
              </h2>
              <p className="mt-5 max-w-[42ch] text-[14px] leading-relaxed text-ink/55">
                We would rather you understood exactly what you are buying. If anything below is
                unclear, write to us before paying.
              </p>
              <Link
                href="/terms"
                className="mt-6 inline-block border-b border-ink/30 pb-1 text-[10px] uppercase tracking-[0.16em] text-ink hover:border-cherry hover:text-cherry"
              >
                Full terms of service
              </Link>
            </div>
            <div className="divide-y divide-ink/12 border-y border-ink/12">
              {FAQS.map((f) => (
                <Reveal key={f.q}>
                  <details className="group py-5">
                    <summary className="flex cursor-pointer items-start justify-between gap-4 text-[15px] leading-snug text-ink">
                      {f.q}
                      <span className="mt-0.5 shrink-0 text-[18px] leading-none text-ink/30 transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-[64ch] text-[13.5px] leading-relaxed text-ink/55">
                      {f.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
