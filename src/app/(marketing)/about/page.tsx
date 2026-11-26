import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHead } from '@/components/marketing/page-head';
import { Reveal, RevealWords } from '@/components/ui/motion';

export const metadata: Metadata = {
  title: 'About',
  description:
    'DEJAVU is a social dining platform for people who would rather meet than swipe. Small tables, real restaurants, genuine friendships.',
};

export default function AboutPage() {
  return (
    <>
      <PageHead
        eyebrow="About DEJAVU"
        title="We built the table we wanted to sit at."
        lead="DEJAVU began with a small, uncomfortable observation: it had become easier to meet a hundred people online than to have one good conversation over dinner."
        tone="sand"
      />

      <section className="bg-ivory">
        <div className="mx-auto grid max-w-[1300px] gap-12 px-5 py-16 md:grid-cols-[1.2fr_1fr] md:px-10 md:py-24">
          <div className="space-y-6 text-[15px] leading-[1.85] text-ink/70">
            <p className="font-serif text-[clamp(1.4rem,2.6vw,1.9rem)] leading-[1.4] text-ink">
              Most social products are built to keep you scrolling. DEJAVU is built to get you to
              leave the house.
            </p>
            <p>
              We think the best conversations rarely happen in your inbox. They happen across a
              table, over food, between people who didn’t know they needed to meet.
            </p>
            <p>
              So we do the part that is genuinely difficult: finding four to six people in your city
              who are likely to enjoy each other, choosing a restaurant that suits the evening, and
              holding the whole thing together so that nobody has to organise anything.
            </p>
            <p>
              DEJAVU is not a dating app. There is no swiping, no scoring of faces, no pressure to
              be impressive. It is closer to being invited to a very well-organised dinner by
              someone who knows everyone’s taste.
            </p>
            <p>
              We are a small team, we are deliberate about growth, and we would rather run fewer,
              better tables than fill a calendar.
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src="/images/idea-conversation.jpg" alt="A conversation across a table" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
            </div>
            <div className="border border-ink/15 p-6">
              <p className="label text-ink/40">What we believe</p>
              <ul className="mt-4 space-y-3">
                {[
                  'Small groups beat large events.',
                  'Overlap is a starting point, not the whole point.',
                  'A good restaurant does half the hosting.',
                  'Nobody should have to perform at dinner.',
                  'Friendship deserves infrastructure.',
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-[13px] leading-relaxed text-ink/65">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cherry" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-ivory md:py-28">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          <div className="grid gap-10 md:grid-cols-3">
            {[
              ['Not a dating app', 'No attraction-based matching. Friendship is the brief.'],
              ['Adults only', 'DEJAVU is strictly 18+. Age is verified during onboarding.'],
              ['Small by design', 'Four to six seats per table, so everyone can actually speak.'],
            ].map(([title, copy], i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="border-t border-ivory/20 pt-6">
                  <p className="label text-ivory/35">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-4 font-serif text-[24px] leading-tight text-ivory">{title}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-ivory/55">{copy}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 border-t border-ivory/15 pt-10">
            <h2 className="max-w-[20ch] font-serif text-[clamp(2rem,4.4vw,3.2rem)] leading-[0.95]">
              <RevealWords text="Maybe you haven’t met your people yet." />
            </h2>
            <Link
              href="/signup"
              className="mt-8 inline-flex bg-ivory px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-cherry hover:text-ivory"
            >
              Find your table
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
