import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '@/lib/queries';
import { categoryImage } from '@/lib/types';
import { Reveal, RevealWords } from '@/components/ui/motion';
import { PageHead } from '@/components/marketing/page-head';

export const metadata: Metadata = {
  title: 'Tables',
  description:
    'Eight DEJAVU tables, each with its own temperament: Mixed, Creators, Founders, Book Club, Foodies, New Here, After Hours and Her Table.',
};

export const revalidate = 120;

export default async function TablesPage() {
  const categories = await getCategories();

  return (
    <>
      <PageHead
        eyebrow="The tables"
        title="Eight rooms. One table each."
        lead="Each DEJAVU table has a temperament. Read them as you would a restaurant’s menu — choose the evenings that sound like you, and we’ll do the introductions."
      />

      <section className="bg-ivory">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          {categories.map((c, i) => {
            const reverse = i % 2 === 1;
            return (
              <article
                key={c.slug}
                className={`grid items-center gap-8 border-b border-ink/12 py-12 md:grid-cols-2 md:gap-16 md:py-16 ${
                  reverse ? 'md:[&>*:first-child]:order-2' : ''
                }`}
              >
                <Reveal>
                  <Link href={`/tables/${c.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                      <Image
                        src={categoryImage(c.slug, c.image_url)}
                        alt={`${c.name} table`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-[1200ms] ease-edit group-hover:scale-[1.04]"
                      />
                      <span
                        className="absolute left-0 top-0 h-1.5 w-16 transition-all duration-700 ease-edit group-hover:w-full"
                        style={{ backgroundColor: c.accent ?? '#C4172F' }}
                      />
                    </div>
                  </Link>
                </Reveal>

                <div>
                  <Reveal delay={0.1}>
                    <p className="label text-ink/35">
                      {String(i + 1).padStart(2, '0')} — {c.tagline}
                    </p>
                  </Reveal>
                  <h2 className="mt-5 font-serif text-[clamp(2rem,4.4vw,3.4rem)] leading-[0.95] text-ink">
                    <RevealWords text={c.name} />
                  </h2>
                  <Reveal delay={0.18}>
                    <p className="mt-5 max-w-[46ch] text-[14.5px] leading-[1.75] text-ink/60">
                      {c.description}
                    </p>
                    <Link
                      href={`/tables/${c.slug}`}
                      className="mt-7 inline-flex items-center gap-2 border-b border-ink/30 pb-1 text-[10px] uppercase tracking-[0.18em] text-ink hover:border-cherry hover:text-cherry"
                    >
                      See this table
                    </Link>
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-burgundy py-20 text-ivory">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <h2 className="max-w-[22ch] font-serif text-[clamp(2rem,4.6vw,3.4rem)] leading-[0.95]">
              Tables are composed, not booked.
            </h2>
            <div className="max-w-[38ch]">
              <p className="text-[14px] leading-relaxed text-ivory/65">
                You choose the rooms. We choose the people — always in groups of four to six, always
                in the same city. If a table is not right for you, there is another next week.
              </p>
              <Link
                href="/signup"
                className="mt-6 inline-flex bg-ivory px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-cherry hover:text-ivory"
              >
                Join DEJAVU
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
