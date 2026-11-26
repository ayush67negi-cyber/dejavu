import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import {
  CATEGORY_FALLBACK,
  type Category,
  type MembershipRow,
  type Profile,
} from '@/lib/types';

/** Live table categories with a static fallback so marketing pages never break. */
export const getCategories = cache(async (): Promise<Category[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('table_categories')
      .select('id, slug, name, tagline, description, image_url, accent, sort_order, is_active')
      .eq('is_active', true)
      .order('sort_order');
    if (error || !data || data.length === 0) return CATEGORY_FALLBACK;
    return data as Category[];
  } catch {
    return CATEGORY_FALLBACK;
  }
});

export const getSession = cache(async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user ?? null;
  } catch {
    return null;
  }
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getSession();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  return (data as Profile) ?? null;
});

export const getIsAdmin = cache(async (): Promise<boolean> => {
  const user = await getSession();
  if (!user) return false;
  const supabase = await createClient();
  const { data } = await supabase
    .from('admin_roles')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();
  return Boolean(data);
});

export const getMembership = cache(async (): Promise<MembershipRow | null> => {
  const user = await getSession();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from('memberships')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as MembershipRow) ?? null;
});
