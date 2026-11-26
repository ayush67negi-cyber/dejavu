import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { Wordmark } from '@/components/ui/logo';

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { href: '/about', label: 'About' },
      { href: '/how-it-works', label: 'How it works' },
      { href: '/membership', label: 'Membership' },
      { href: '/tables', label: 'Tables' },
    ],
  },
  {
    title: 'Members',
    links: [
      { href: '/login', label: 'Login' },
      { href: '/signup', label: 'Join DEJAVU' },
      { href: '/app/experiences', label: 'My experiences' },
      { href: '/app/membership', label: 'My membership' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/contact', label: 'Contact' },
      { href: '/faq', label: 'FAQ' },
      { href: '/safety', label: 'Safety' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/guidelines', label: 'Community guidelines' },
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
            <p className="mt-6 max-w-[30ch] font-serif text-[26px] leading-[1.15] text-ivory/90">
              Strangers at lunch.
              <br />
              Friends by dessert.
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
          <p>© {new Date().getFullYear()} DEJAVU. All rights reserved.</p>
          <p className="max-w-[52ch] normal-case tracking-normal">
            DEJAVU facilitates introductions. Food and beverages are paid for by members at the
            restaurant. 18+ only.
          </p>
        </div>
      </div>
    </footer>
  );
}
