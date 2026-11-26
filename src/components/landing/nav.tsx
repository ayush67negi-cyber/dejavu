'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Wordmark } from '@/components/ui/logo';

const LINKS = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/tables', label: 'Tables' },
  { href: '/membership', label: 'Membership' },
  { href: '/about', label: 'About' },
];

export function SiteNav({ signedIn = false }: { signedIn?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-edit ${
          scrolled ? 'border-b border-ink/10 bg-ivory/90 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-[74px] max-w-[1600px] items-center justify-between px-5 md:px-10">
          <div className="flex items-center gap-3">
            <Wordmark />
            <span className="hidden text-[9px] uppercase tracking-label text-ink/40 lg:block">
              Social dining
            </span>
          </div>

          <nav className="hidden items-center gap-9 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="link-underline text-[11px] uppercase tracking-[0.16em] text-ink/70 transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            {signedIn ? (
              <Link href="/app" className="btn bg-ink px-6 py-3 text-ivory hover:bg-cherry">
                Your table
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="link-underline hidden text-[11px] uppercase tracking-[0.16em] text-ink/70 hover:text-ink sm:block"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="hidden bg-ink px-6 py-3 text-[10px] uppercase tracking-[0.18em] text-ivory transition-colors duration-500 ease-edit hover:bg-cherry sm:inline-flex"
                >
                  Join DEJAVU
                </Link>
              </>
            )}
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] bg-ink text-ivory lg:hidden"
          >
            <div className="flex h-[74px] items-center justify-between px-5">
              <Wordmark tone="ivory" href={null} />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="mt-6 flex flex-col px-5">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-ivory/12"
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-5"
                  >
                    <span className="font-serif text-[34px] leading-none">{l.label}</span>
                    <span className="text-[10px] uppercase tracking-label text-ivory/35">
                      0{i + 1}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-10 flex flex-col gap-3 px-5">
              <Link
                href={signedIn ? '/app' : '/signup'}
                onClick={() => setOpen(false)}
                className="flex items-center justify-center bg-cherry py-4 text-[11px] uppercase tracking-[0.2em] text-ivory"
              >
                {signedIn ? 'Your table' : 'Join DEJAVU'}
              </Link>
              {!signedIn && (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center border border-ivory/25 py-4 text-[11px] uppercase tracking-[0.2em] text-ivory"
                >
                  Login
                </Link>
              )}
            </div>
            <p className="absolute bottom-8 left-5 right-5 text-[10px] uppercase tracking-label text-ivory/30">
              Strangers at lunch. Friends by dessert.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
