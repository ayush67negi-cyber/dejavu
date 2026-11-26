'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  CalendarRange,
  Layers,
  Sparkles,
  Flag,
  Menu,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { Wordmark } from '@/components/ui/logo';
import { LogoutButton } from '@/components/ui/logout-button';

const NAV = [
  { href: '/admin', label: 'Übersicht', icon: LayoutDashboard },
  { href: '/admin/members', label: 'Mitglieder', icon: Users },
  { href: '/admin/experiences', label: 'Erlebnisse', icon: CalendarRange },
  { href: '/admin/matching', label: 'Matching', icon: Sparkles },
  { href: '/admin/categories', label: 'Kategorien', icon: Layers },
  { href: '/admin/reports', label: 'Meldungen', icon: Flag },
];

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-0.5">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 text-[13px] transition-colors ${
              active ? 'bg-ivory text-ink' : 'text-ivory/55 hover:bg-ivory/10 hover:text-ivory'
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.5} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-[100svh] bg-ivory">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-ivory/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[62px] max-w-[1600px] items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setOpen(true)} className="md:hidden" aria-label="Admin-Menü öffnen">
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <Wordmark href="/admin" />
            <span className="hidden border border-cherry/40 px-2 py-1 text-[8px] uppercase tracking-label text-cherry md:block">
              Admin-Studio
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/app"
              className="hidden items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-ink/40 hover:text-ink sm:flex"
            >
              Mitgliederansicht <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
            <LogoutButton className="text-[10px] uppercase tracking-[0.14em] text-ink/40 hover:text-cherry" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-8 px-5 py-8 md:px-8">
        <aside className="hidden w-[210px] shrink-0 md:block">
          <div className="sticky top-[84px]">
            <div className="bg-ink p-3">
              {nav}
            </div>
            <p className="mt-4 px-1 text-[10px] leading-relaxed text-ink/35">{email}</p>
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/50 md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="h-full w-[270px] bg-ink p-5"
            >
              <div className="mb-8 flex items-center justify-between">
                <Wordmark tone="ivory" href="/admin" />
                <button onClick={() => setOpen(false)} aria-label="Schließen">
                  <X className="h-5 w-5 text-ivory/60" strokeWidth={1.5} />
                </button>
              </div>
              {nav}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
