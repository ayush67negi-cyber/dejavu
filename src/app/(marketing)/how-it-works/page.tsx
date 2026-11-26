import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHead } from '@/components/marketing/page-head';
import { Reveal, RevealWords } from '@/components/ui/motion';

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'Four steps from signing up to sitting at a DEJAVU table: sign up, get matched, meet your table, let it happen.',
};

const STEPS = [
  {
    n: '01',
    title: 'Sign up',
    copy: 'Tell us a little about yourself.',
    body: 'A short, honest questionnaire — your city, what you enjoy talking about, how you are at a table, and what you would rather avoid. Ten minutes, once. Everything you write is private by default and is never shown publicly.',
  },
  {
    n: '02',
    title: 'Get matched',
    copy: 'We find people you might actually enjoy meeting.',
    body: 'Tables are composed by hand, guided by shared interests, compatible personalities, dietary needs and the categories you chose. We look for range as well as overlap: the best tables are not made of near-identical people.',
  },
  {
    n: '03',
    title: 'Meet your table',
    copy: 'Six people. A restaurant. No awkward planning.',
    body: 'You receive a confirmed restaurant, a time, and a short note on what to expect. You order what you like and pay for your own meal. No group chats to manage, no venue to negotiate.',
  },
  {
    n: '04',
    title: 'Let it happen',
    copy: 'By dessert, the introductions might feel unnecessary.',
    body: 'A facilitator opens the conversation and then steps back. No icebreakers, no name-tag theatre. Afterwards, you can tell us how it went — and we use that to compose a better table next time.',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHead
        eyebrow="How it works"
        title="Four steps. Then the table does the rest."
        lead="DEJAVU is not a feed and it is not a swipe. It is a small, deliberate operation: we compose tables of four to six people and you turn up."
        tone="ink"
      />

      <section className="bg-ivory">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="grid gap-6 border-b border-ink/12 py-12 md:grid-cols-[140px_1fr_1.2fr] md:gap-12 md:py-16"
            >
              <Reveal>
                <span className="font-serif text-[clamp(2.4rem,5vw,4rem)] leading-none text-ink/15">
                  {s.n}
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="font-serif text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[0.95] text-ink">
                  {s.title}
                </h2>
                <p className="mt-3 text-[13px] uppercase tracking-[0.14em] text-cherry">{s.copy}</p>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="text-[14.5px] leading-[1.8] text-ink/60">{s.body}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand py-16 md:py-24">
        <div className="mx-auto grid max-w-[1300px] items-center gap-12 px-5 md:grid-cols-2 md:px-10">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src="/images/cat-founders.jpg" alt="A table in conversation" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
          <div>
            <Reveal>
              <span className="label text-ink/40">What you can expect</span>
            </Reveal>
            <h2 className="mt-5 font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.95] text-ink">
              <RevealWords text="A table, not a transaction." />
            </h2>
            <ul className="mt-8 space-y-4">
              {[
                'Groups of four to six, always in person, always in your city.',
                'One restaurant per experience, chosen for the room as much as the menu.',
                'A facilitator to open the evening, then a light touch.',
                'Your dietary requirements shared with the venue in advance.',
                'No dating pressure. No scoring. No swiping.',
              ].map((t) => (
                <li key={t} className="flex gap-3 text-[14px] leading-relaxed text-ink/65">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cherry" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-8 border-l-2 border-cherry pl-5 text-[13px] leading-relaxed text-ink/55">
              DEJAVU facilitates the gathering. Members pay for their own food and drinks at the
              restaurant unless an experience explicitly states otherwise.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex bg-ink px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-ivory transition-colors duration-500 hover:bg-cherry"
            >
              Find your table
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
