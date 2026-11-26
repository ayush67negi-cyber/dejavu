import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategories } from '@/lib/queries';
import { categoryImage } from '@/lib/types';
import { Reveal, RevealWords } from '@/components/ui/motion';

export const revalidate = 120;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: 'Table not found' };
  return {
    title: `${category.name} table`,
    description: category.description ?? category.tagline ?? undefined,
  };
}

export default async function TablePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const others = categories.filter((c) => c.slug !== slug);

  return (
    <>
      <section className="relative min-h-[72svh] overflow-hidden bg-ink grain">
        <Image
          src={categoryImage(category.slug, category.image_url)}
          alt={`${category.name} table`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/25" />
        <div className="relative z-10 mx-auto flex min-h-[72svh] max-w-[1300px] flex-col justify-end px-5 py-14 md:px-10 md:py-20">
          <Reveal>
            <Link
              href="/tables"
              className="text-[10px] uppercase tracking-[0.16em] text-ivory/50 hover:text-ivory"
            >
              ← All tables
            </Link>
          </Reveal>
          <h1 className="mt-6 max-w-[16ch] font-serif text-[clamp(3rem,9vw,7rem)] leading-[0.86] tracking-[-0.04em] text-ivory">
            <RevealWords text={category.name} />
          </h1>
          <p className="mt-5 max-w-[40ch] font-serif text-[clamp(1.2rem,2.2vw,1.7rem)] leading-snug text-blush">
            {category.tagline}
          </p>
        </div>
        <span
          className="absolute left-0 top-0 h-1.5 w-full"
          style={{ backgroundColor: category.accent ?? '#C4172F' }}
        />
      </section>

      <section className="bg-ivory">
        <div className="mx-auto grid max-w-[1300px] gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr] md:px-10 md:py-24">
          <div>
            <Reveal>
              <span className="label text-ink/35">The room</span>
            </Reveal>
            <p className="mt-6 font-serif text-[clamp(1.5rem,2.8vw,2.2rem)] leading-[1.35] text-ink">
              {category.description}
            </p>
            <div className="mt-10 grid gap-px bg-ink/12 sm:grid-cols-3">
              {[
                ['4–6', 'people'],
                ['Sunday', 'usual seating'],
                ['Same city', 'always'],
              ].map(([big, small]) => (
                <div key={small} className="bg-ivory p-5">
                  <p className="font-serif text-[24px] leading-none text-ink">{big}</p>
                  <p className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-ink/40">{small}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-ink/15 p-6">
            <p className="label text-ink/40">How to get a seat</p>
            <ol className="mt-5 space-y-4">
              {[
                'Join DEJAVU and complete the short profile.',
                'Choose this table in your preferred tables.',
                'We compose the group and confirm the venue.',
                'Arrive, order what you like, and let the evening happen.',
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="mt-0.5 font-serif text-[15px] text-cherry">0{i + 1}</span>
                  <span className="text-[13px] leading-relaxed text-ink/65">{step}</span>
                </li>
              ))}
            </ol>
            <Link
              href="/signup"
              className="mt-7 flex w-full items-center justify-center bg-ink py-4 text-[10px] uppercase tracking-[0.2em] text-ivory transition-colors duration-500 hover:bg-cherry"
            >
              Find your table
            </Link>
            <p className="mt-4 text-[11px] leading-relaxed text-ink/40">
              Membership required. Food and drinks are paid by you at the restaurant.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/12 bg-cream">
        <div className="mx-auto max-w-[1300px] px-5 py-14 md:px-10 md:py-20">
          <div className="flex items-baseline justify-between border-b border-ink/15 pb-4">
            <h2 className="label text-ink/45">Other tables</h2>
            <Link href="/tables" className="text-[10px] uppercase tracking-[0.14em] text-ink/40 hover:text-cherry">
              View all
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.slice(0, 4).map((c) => (
              <Link key={c.slug} href={`/tables/${c.slug}`} className="group">
                <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                  <Image
                    src={categoryImage(c.slug, c.image_url)}
                    alt={c.name}
                    fill
                    sizes="25vw"
                    className="object-cover transition-transform duration-1000 ease-edit group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 font-serif text-[20px] leading-none text-ink">{c.name}</p>
                <p className="mt-1 text-[11.5px] text-ink/45">{c.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
