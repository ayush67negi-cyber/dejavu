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
    default: 'DEJAVU — Beim Mittagessen noch Fremde. Beim Dessert schon Freunde.',
    template: '%s · DEJAVU',
  },
  description:
    'DEJAVU stellt kleine Tische mit vier bis sechs Menschen in echten Restaurants zusammen. Keine Dating-App – eine Mitgliedschaft für gemeinsames Essen, für Menschen, die sich lieber treffen als wischen.',
  keywords: [
    'gemeinsam essen',
    'Dinnerclub',
    'neue Menschen kennenlernen',
    'Restaurant-Erlebnisse',
    'Freundschaft',
    'Social Dining',
  ],
  // No explicit og title/description here: each page's own title and description
  // are used for share previews, so every route reads correctly when linked.
  openGraph: {
    siteName: 'DEJAVU',
    locale: 'de_DE',
    type: 'website',
    images: [
      {
        url: '/images/hero-anticipation.jpg',
        width: 1200,
        height: 630,
        alt: 'Eine DEJAVU-Tischrunde lacht und teilt Essen in warmem Restaurantlicht.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/hero-anticipation.jpg'],
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
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
