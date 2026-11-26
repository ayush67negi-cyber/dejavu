import Image from 'next/image';
import Link from 'next/link';
import { Wordmark } from '@/components/ui/logo';

export function AuthShell({
  children,
  eyebrow,
  title,
  aside,
  image = '/images/idea-conversation.jpg',
  imageAlt = 'A quiet conversation across a restaurant table',
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <div className="grid min-h-[100svh] grid-cols-1 lg:grid-cols-[1.08fr_1fr]">
      {/* form column */}
      <div className="relative flex flex-col bg-ivory">
        <header className="flex items-center justify-between px-5 py-6 md:px-12">
          <Wordmark />
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.16em] text-ink/45 transition-colors hover:text-ink"
          >
            Back to site
          </Link>
        </header>

        <div className="flex flex-1 items-center px-5 pb-16 md:px-12 lg:px-16">
          <div className="w-full max-w-[430px]">
            <p className="label text-ink/40">{eyebrow}</p>
            <h1 className="mt-5 font-serif text-[clamp(2.2rem,4.6vw,3.2rem)] leading-[0.95] tracking-[-0.02em] text-ink">
              {title}
            </h1>
            <div className="mt-9">{children}</div>
            {aside && <div className="mt-8">{aside}</div>}
          </div>
        </div>

        <footer className="px-5 pb-8 md:px-12">
          <p className="text-[10px] uppercase tracking-[0.14em] text-ink/30">
            18+ only · DEJAVU facilitates introductions
          </p>
        </footer>
      </div>

      {/* image column */}
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <Image src={image} alt={imageAlt} fill sizes="50vw" className="object-cover opacity-90" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="max-w-[16ch] font-serif text-[clamp(1.8rem,2.6vw,2.6rem)] leading-[1.05] text-ivory">
            Strangers at lunch.
            <br />
            <em className="not-italic text-blush">Friends by dessert.</em>
          </p>
          <div className="mt-8 flex gap-8 border-t border-ivory/15 pt-5">
            {['4–6 per table', 'Sunday seatings', 'Not a dating app'].map((t) => (
              <span key={t} className="text-[9px] uppercase tracking-label text-ivory/45">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
