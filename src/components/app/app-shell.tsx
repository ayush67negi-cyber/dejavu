'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Compass,
  CalendarDays,
  User,
  CreditCard,
  Bell,
  ShieldCheck,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { Wordmark } from '@/components/ui/logo';
import { LogoutButton } from '@/components/ui/logout-button';
import type { Profile } from '@/lib/types';

const NAV = [
  { href: '/app', label: 'Übersicht', icon: Home },
  { href: '/app/experiences', label: 'Meine Erlebnisse', icon: CalendarDays },
  { href: '/app/discover', label: 'Entdecken', icon: Compass },
  { href: '/app/notifications', label: 'Mitteilungen', icon: Bell },
  { href: '/app/profile', label: 'Profil', icon: User },
  { href: '/app/membership', label: 'Mitgliedschaft', icon: CreditCard },
];

export function AppShell({
  children,
  profile,
  isAdmin,
  membershipStatus,
  email,
}: {
  children: React.ReactNode;
  profile: Profile | null;
  isAdmin: boolean;
  membershipStatus: string | null;
  email: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-0.5">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`group flex items-center gap-3 px-3 py-2.5 text-[13px] transition-colors duration-300 ${
              active ? 'bg-ink text-ivory' : 'text-ink/60 hover:bg-ink/[0.04] hover:text-ink'
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.5} />
            {item.label}
          </Link>
        );
      })}
      {isAdmin && (
        <Link
          href="/admin"
          onClick={() => setOpen(false)}
          className="mt-2 flex items-center gap-3 border-t border-ink/10 px-3 py-2.5 pt-4 text-[13px] text-cherry transition-colors hover:text-claret"
        >
          <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
          Admin-Bereich
        </Link>
      )}
    </nav>
  );

  return (
    <div className="min-h-[100svh] bg-ivory">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-ivory/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[66px] max-w-[1500px] items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              aria-label="Menü öffnen"
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <Wordmark href="/app" />
          </div>

          <div className="flex items-center gap-5">
            <span
              className={`hidden items-center gap-2 sm:flex ${
                membershipStatus === 'active' ? 'text-olive' : 'text-ink/35'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  membershipStatus === 'active' ? 'bg-olive' : 'bg-ink/25'
                }`}
              />
              <span className="text-[9px] uppercase tracking-label">
                {membershipStatus === 'active' ? 'Mitglied' : 'Nicht aktiv'}
              </span>
            </span>
            <Link
              href="/"
              className="hidden text-[10px] uppercase tracking-[0.14em] text-ink/40 hover:text-ink md:block"
            >
              Öffentliche Website
            </Link>
            <LogoutButton className="text-[10px] uppercase tracking-[0.14em] text-ink/40 hover:text-cherry" />
            <Link href="/app/profile" className="relative h-8 w-8 overflow-hidden rounded-full bg-sand">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="" fill className="object-cover" sizes="32px" />
              ) : (
                <span className="flex h-full w-full items-center justify-center font-serif text-[13px] text-ink/60">
                  {(profile?.full_name ?? email ?? '?').charAt(0).toUpperCase()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px] gap-10 px-5 py-8 md:px-8 md:py-10">
        <aside className="hidden w-[210px] shrink-0 lg:block">
          <div className="sticky top-[86px]">
            <p className="px-3 text-[9px] uppercase tracking-label text-ink/30">Dein Bereich</p>
            <div className="mt-3">{nav}</div>
            <div className="mt-8 border-t border-ink/10 px-3 pt-5">
              <p className="text-[11px] leading-relaxed text-ink/40">
                Angemeldet als
                <br />
                <span className="text-ink/70">{email}</span>
              </p>
            </div>
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
            className="fixed inset-0 z-50 bg-ink/40 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="h-full w-[280px] bg-ivory p-5"
            >
              <div className="mb-8 flex items-center justify-between">
                <Wordmark href="/app" />
                <button onClick={() => setOpen(false)} aria-label="Schließen">
                  <X className="h-5 w-5" strokeWidth={1.5} />
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
