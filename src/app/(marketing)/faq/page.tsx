import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead } from '@/components/marketing/page-head';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about DEJAVU: tables, matching, membership, safety and cities.',
};

const GROUPS = [
  {
    title: 'The basics',
    items: [
      {
        q: 'Is DEJAVU a dating app?',
        a: 'No. DEJAVU is a social dining membership built around friendship and conversation. Tables are not composed on attraction, nobody is scored, and there is nothing to swipe.',
      },
      {
        q: 'What actually happens at a table?',
        a: 'You arrive at a restaurant at a set time and are greeted by a table of four to six people and a DEJAVU facilitator. They open the evening, then step back. You order what you like, pay for your own meal, and talk. Most people stay past dessert.',
      },
      {
        q: 'How big are the tables?',
        a: 'Between four and six people. Small enough that everyone can speak, large enough that there is range in the conversation.',
      },
    ],
  },
  {
    title: 'Matching',
    items: [
      {
        q: 'How are tables composed?',
        a: 'By hand, using our compatibility scoring as a guide. We weigh city, shared interests, the categories you chose, availability, dietary fit and questionnaire traits. A human always makes the final call, because a good table is not a spreadsheet.',
      },
      {
        q: 'Will I be with the same people every time?',
        a: 'No. Each table is composed separately. You may meet someone again, but the point is breadth — different rooms, different perspectives.',
      },
      {
        q: 'Can I choose who I sit with?',
        a: 'You choose categories and preferences, not individuals. If you would rather not sit with someone, block them from your profile and we will keep you apart.',
      },
      {
        q: 'What if I do not like my match?',
        a: 'Tell us. Every completed experience has a feedback prompt. Repeated poor fits mean we adjust how we compose your tables.',
      },
    ],
  },
  {
    title: 'Membership and money',
    items: [
      {
        q: 'What does membership cost?',
        a: 'One month ₹1,999, three months ₹4,999, six months ₹8,999. Check current availability on the membership page.',
      },
      {
        q: 'Is the meal included?',
        a: 'No. Restaurant food and beverages are paid for separately by you, at the venue. DEJAVU membership covers the curation, the table and the hosting.',
      },
      {
        q: 'How do I cancel?',
        a: 'From the membership page in your dashboard. Renewal stops immediately; access continues to the end of the paid period.',
      },
    ],
  },
  {
    title: 'Safety and privacy',
    items: [
      {
        q: 'Who can see my profile?',
        a: 'Only people seated at your table, and only the fields you have allowed. Your email, questionnaire answers and reports are never shared with other members.',
      },
      {
        q: 'How do I report someone?',
        a: 'Use the report option on any confirmed experience in your dashboard. Reports are private and reviewed by our team.',
      },
      {
        q: 'Is DEJAVU 18+?',
        a: 'Yes, strictly. Age is verified during onboarding and enforced by the platform.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <PageHead
        eyebrow="FAQ"
        title="Questions people actually ask."
        lead="If yours is not here, write to us — a person will answer."
      />

      <section className="bg-ivory">
        <div className="mx-auto max-w-[1300px] px-5 py-16 md:px-10 md:py-24">
          <div className="grid gap-14 lg:grid-cols-[260px_1fr]">
            <nav className="hidden lg:block">
              <div className="sticky top-[100px] space-y-2">
                {GROUPS.map((g) => (
                  <p key={g.title} className="text-[11px] uppercase tracking-[0.13em] text-ink/40">
                    {g.title}
                  </p>
                ))}
              </div>
            </nav>

            <div className="space-y-14">
              {GROUPS.map((group) => (
                <div key={group.title}>
                  <h2 className="border-b border-ink/15 pb-3 font-serif text-[24px] leading-none text-ink">
                    {group.title}
                  </h2>
                  <div className="divide-y divide-ink/10">
                    {group.items.map((item) => (
                      <details key={item.q} className="group py-5">
                        <summary className="flex cursor-pointer items-start justify-between gap-6 text-[15px] leading-snug text-ink">
                          {item.q}
                          <span className="mt-0.5 shrink-0 text-[18px] leading-none text-ink/25 transition-transform group-open:rotate-45">
                            +
                          </span>
                        </summary>
                        <p className="mt-3 max-w-[64ch] text-[13.5px] leading-relaxed text-ink/55">
                          {item.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border border-ink/15 p-7">
                <p className="font-serif text-[22px] leading-tight text-ink">
                  Still wondering about something?
                </p>
                <p className="mt-2 max-w-[46ch] text-[13px] leading-relaxed text-ink/55">
                  Write to us. We would rather answer a question than have you join unsure.
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-block bg-ink px-6 py-3.5 text-[10px] uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-cherry"
                >
                  Contact DEJAVU
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
