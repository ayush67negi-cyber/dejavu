import Link from 'next/link';
import { Wordmark } from '@/components/ui/logo';
import { CTA } from '@/components/ui/cta-button';

export default function NotFound() {
  return (
    <main className="grain relative flex min-h-svh flex-col overflow-hidden bg-ivory">
      <div className="pointer-events-none absolute -right-28 top-[-14rem] h-[34rem] w-[34rem] rounded-full bg-burgundy/95" />
      <div className="pointer-events-none absolute -left-24 bottom-[-10rem] h-72 w-72 rounded-full bg-blush/60 blur-[2px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-8 md:px-10">
        <Wordmark />
        <Link
          href="/"
          className="label text-[11px] text-ink/60 transition-colors duration-300 hover:text-cherry"
        >
          Back to DEJAVU
        </Link>
      </header>

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] flex-1 items-center gap-12 px-6 pb-24 md:grid-cols-[1.15fr_0.85fr] md:px-10">
        <div>
          <p className="label text-[11px] text-cherry">404 — Wrong room</p>
          <h1 className="mt-6 font-serif text-[clamp(2.9rem,7.5vw,6rem)] leading-[0.88] tracking-[-0.03em] text-ink">
            This table
            <br />
            <em className="text-burgundy">doesn’t exist.</em>
          </h1>
          <p className="mt-7 max-w-md text-[15px] leading-relaxed text-ink/65">
            The page you were looking for has been seated elsewhere. The good tables are still
            here, and they are four to six seats each.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <CTA href="/tables">Discover the tables</CTA>
            <CTA href="/how-it-works" variant="ghost" arrow={false}>
              How it works
            </CTA>
          </div>
        </div>

        <div className="relative hidden aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-beige md:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(232,180,184,0.55),transparent_58%),radial-gradient(circle_at_75%_78%,rgba(61,10,24,0.85),transparent_62%)]" />
          <span className="absolute bottom-8 left-8 right-8 font-serif text-2xl italic leading-tight text-ivory/90">
            Strangers at lunch.
            <br />
            Friends by dessert.
          </span>
        </div>
      </div>

      <footer className="relative z-10 border-t border-ink/10">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-4 px-6 py-6 md:px-10">
          <span className="label text-[10px] text-ink/40">© {new Date().getFullYear()} DEJAVU</span>
          <div className="flex gap-6">
            <Link href="/safety" className="label text-[10px] text-ink/40 hover:text-cherry">
              Safety
            </Link>
            <Link href="/privacy" className="label text-[10px] text-ink/40 hover:text-cherry">
              Privacy
            </Link>
            <Link href="/terms" className="label text-[10px] text-ink/40 hover:text-cherry">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
