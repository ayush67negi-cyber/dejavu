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
  // No explicit og title/description here: each page's own title and description
  // are used for share previews, so every route reads correctly when linked.
  openGraph: {
    siteName: 'DEJAVU',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/images/hero-table.jpg', width: 1200, height: 630, alt: 'A DEJAVU table' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/hero-table.jpg'],
  },
  applicationName: 'DEJAVU',
  authors: [{ name: 'DEJAVU' }],
  formatDetection: { telephone: false, email: false, address: false },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dejavu-dining.vercel.app'),
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
