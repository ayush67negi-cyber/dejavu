import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { Wordmark } from '@/components/ui/logo';

const COLUMNS = [
  {
    title: 'Entdecken',
    links: [
      { href: '/about', label: 'Über uns' },
      { href: '/how-it-works', label: 'So funktioniert’s' },
      { href: '/membership', label: 'Mitgliedschaft' },
      { href: '/tables', label: 'Unsere Tische' },
    ],
  },
  {
    title: 'Mitglieder',
    links: [
      { href: '/login', label: 'Anmelden' },
      { href: '/signup', label: 'Werde Teil von DEJAVU' },
      { href: '/app/experiences', label: 'Meine Erlebnisse' },
      { href: '/app/membership', label: 'Meine Mitgliedschaft' },
    ],
  },
  {
    title: 'DEJAVU',
    links: [
      { href: '/contact', label: 'Kontakt' },
      { href: '/faq', label: 'FAQ' },
      { href: '/safety', label: 'Sicherheit' },
    ],
  },
  {
    title: 'Rechtliches',
    links: [
      { href: '/privacy', label: 'Datenschutz' },
      { href: '/terms', label: 'AGB' },
      { href: '/guidelines', label: 'Community-Richtlinien' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink text-ivory">
      <div className="mx-auto max-w-[1600px] px-5 pt-16 md:px-10 md:pt-24">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Wordmark tone="ivory" />
            <p className="mt-6 max-w-[32ch] font-serif text-[24px] leading-[1.2] text-ivory/90">
              Beim Mittagessen
              <br />
              noch Fremde. Beim Dessert
              <br />
              schon Freunde.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-8 inline-flex items-center gap-2 border-b border-ivory/25 pb-1 text-[10px] uppercase tracking-label text-ivory/60 transition-colors hover:border-ivory hover:text-ivory"
            >
              <Instagram className="h-3.5 w-3.5" strokeWidth={1.5} /> Instagram
            </a>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="label text-ivory/35">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-ivory/75 transition-colors hover:text-cherry"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 overflow-hidden border-t border-ivory/12 pt-8">
          <p className="select-none whitespace-nowrap font-serif text-[clamp(3rem,15vw,13rem)] leading-[0.8] tracking-[-0.05em] text-ivory/[0.07]">
            DEJAVU
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-ivory/12 py-7 text-[10px] uppercase tracking-[0.14em] text-ivory/35 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} DEJAVU. Alle Rechte vorbehalten.</p>
          <p className="max-w-[52ch] normal-case tracking-normal">
            DEJAVU vermittelt Begegnungen. Speisen und Getränke zahlen Mitglieder selbst im
            Restaurant. Nur ab 18 Jahren.
          </p>
        </div>
      </div>
    </footer>
  );
}
