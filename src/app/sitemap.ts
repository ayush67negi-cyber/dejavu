import type { MetadataRoute } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dejavu-dining.vercel.app';

const TABLE_SLUGS = [
  'mixed',
  'creators',
  'founders',
  'book-club',
  'foodies',
  'new-here',
  'after-hours',
  'her-table',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/how-it-works', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/tables', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/membership', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/safety', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/guidelines', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/faq', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/signup', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/login', priority: 0.5, changeFrequency: 'yearly' as const },
  ];

  const now = new Date();

  return [
    ...pages.map((page) => ({
      url: `${SITE}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...TABLE_SLUGS.map((slug) => ({
      url: `${SITE}/tables/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
