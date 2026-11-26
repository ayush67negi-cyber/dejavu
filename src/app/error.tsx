'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Wordmark } from '@/components/ui/logo';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in Vercel runtime logs; no member data is included.
    console.error('[dejavu] route error', error.digest ?? error.message);
  }, [error]);

  return (
    <main className="grain flex min-h-[100svh] flex-col bg-ivory">
      <header className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-8 md:px-10">
        <Wordmark />
        <Link href="/contact" className="label text-[11px] text-ink/60 hover:text-cherry">
          Kontakt
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 items-center px-6 pb-24 md:px-10">
        <div className="max-w-xl">
          <p className="label text-[11px] text-cherry">Etwas ist schiefgelaufen</p>
          <h1 className="mt-6 font-serif text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.9] tracking-[-0.03em] text-ink">
            Der Abend
            <br />
            <em className="text-burgundy">macht kurz Pause.</em>
          </h1>
          <p className="mt-6 text-[15px] leading-relaxed text-ink/65">
            Ein unerwarteter Fehler hat diese Seite unterbrochen. Nichts, was du eingegeben hast, ist
            aus deinem Konto verschwunden. Versuch es erneut – und wenn es bleibt, sag uns Bescheid.
          </p>
          {error.digest && (
            <p className="mt-4 font-sans text-[11px] uppercase tracking-[0.16em] text-ink/35">
              Referenz {error.digest}
            </p>
          )}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="btn bg-ink px-7 py-4 text-ivory transition-colors duration-500 hover:bg-cherry"
            >
              Erneut versuchen
            </button>
            <Link
              href="/app"
              className="btn border border-ink/25 px-7 py-4 text-ink transition-colors duration-500 hover:bg-ink hover:text-ivory"
            >
              Zurück zu deinem Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
