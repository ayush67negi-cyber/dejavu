export type VisibilityLevel = 'table' | 'members' | 'private';

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  city: string | null;
  occupation: string | null;
  bio: string | null;
  instagram_handle: string | null;
  food_preferences: string[];
  dietary_restrictions: string[];
  social_preferences: string[];
  preferred_categories: string[];
  availability: string[];
  visibility: VisibilityLevel;
  status: 'active' | 'suspended' | 'deleted';
  onboarding_completed: boolean;
  onboarding_step: number;
  adult_confirmed: boolean;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  image_url: string | null;
  accent: string | null;
  sort_order: number;
  is_active: boolean;
};

export type MembershipRow = {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  starts_at: string | null;
  ends_at: string | null;
  cancelled_at: string | null;
  payment_reference: string | null;
  activated_by_admin: boolean;
  created_at: string;
};

export type MyExperience = {
  id: string;
  name: string;
  description: string | null;
  category_slug: string | null;
  city: string;
  starts_at: string | null;
  ends_at: string | null;
  venue_name: string | null;
  venue_address: string | null;
  instructions: string | null;
  status: 'draft' | 'matching' | 'confirmed' | 'completed' | 'cancelled';
  group_size: number;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

export const CATEGORY_FALLBACK: Category[] = [
  { id: 'mixed', slug: 'mixed', name: 'Mixed', tagline: 'Different perspectives, one table', description: 'A table full of different perspectives, personalities and experiences.', image_url: '/images/cat-mixed.jpg', accent: '#C4172F', sort_order: 1, is_active: true },
  { id: 'creators', slug: 'creators', name: 'Creators', tagline: 'For people who make things', description: 'For curious minds, designers, writers, artists and people who enjoy creating.', image_url: '/images/cat-creators.jpg', accent: '#E2571E', sort_order: 2, is_active: true },
  { id: 'founders', slug: 'founders', name: 'Founders', tagline: 'Ambitious people, unhurried dinner', description: 'Entrepreneurs, professionals and ambitious people who enjoy exchanging ideas.', image_url: '/images/cat-founders.jpg', accent: '#3D0A18', sort_order: 3, is_active: true },
  { id: 'book-club', slug: 'book-club', name: 'Book Club', tagline: 'A table with a reading list', description: 'For people who love books, ideas and thoughtful discussions.', image_url: '/images/cat-book-club.jpg', accent: '#69734F', sort_order: 4, is_active: true },
  { id: 'foodies', slug: 'foodies', name: 'Foodies', tagline: 'Order for the table', description: 'For people who believe exploring food is an experience.', image_url: '/images/cat-foodies.jpg', accent: '#B8451B', sort_order: 5, is_active: true },
  { id: 'new-here', slug: 'new-here', name: 'New Here', tagline: 'For recent arrivals', description: 'For people who have moved cities or want to expand their circle.', image_url: '/images/cat-new-here.jpg', accent: '#C98A91', sort_order: 6, is_active: true },
  { id: 'after-hours', slug: 'after-hours', name: 'After Hours', tagline: 'An evening worth remembering', description: 'Relaxed conversations, interesting people and an evening worth remembering.', image_url: '/images/cat-after-hours.jpg', accent: '#1C1512', sort_order: 7, is_active: true },
  { id: 'her-table', slug: 'her-table', name: 'Her Table', tagline: 'A women-focused table', description: 'A women-focused social dining experience.', image_url: '/images/cat-her-table.jpg', accent: '#5A0F22', sort_order: 8, is_active: true },
];

export function categoryImage(slug: string, imageUrl?: string | null) {
  if (imageUrl) return imageUrl;
  const match = CATEGORY_FALLBACK.find((c) => c.slug === slug);
  return match?.image_url ?? '/images/cat-mixed.jpg';
}

export type ExperienceVenue = {
  experience_id: string;
  venue_name: string | null;
  venue_address: string | null;
};

/** Venue rows are only readable for confirmed, revealed tables (RLS enforces it). */
export function venueFor(
  venues: ExperienceVenue[] | null | undefined,
  experienceId: string,
): { name: string | null; address: string | null } {
  const v = (venues ?? []).find((x) => x.experience_id === experienceId);
  return { name: v?.venue_name ?? null, address: v?.venue_address ?? null };
}
