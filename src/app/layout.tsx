import type { Metadata, Viewport } from 'next';
import '@fontsource/dm-sans/300.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'DEJAVU — Strangers at lunch. Friends by dessert.',
    template: '%s · DEJAVU',
  },
  description:
    'DEJAVU curates small tables of four to six people around real restaurants. Not a dating app — a social dining membership for people who would rather meet than swipe.',
  keywords: ['social dining', 'dinner club', 'meet new people', 'restaurant experiences', 'friendship'],
  openGraph: {
    title: 'DEJAVU — Strangers at lunch. Friends by dessert.',
    description: 'Six strangers. One table. Conversations you didn’t know you needed.',
    type: 'website',
    images: ['/images/hero-table.jpg'],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dejavu.vercel.app'),
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#120D0B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
