import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getProfile, getCategories } from '@/lib/queries';
import { ProfileEditor } from '@/components/app/profile-editor';
import { BlockedList } from '@/components/app/blocked-list';

export const metadata: Metadata = { title: 'Profile' };

export default async function ProfilePage() {
  const supabase = await createClient();
  const [profile, categories] = await Promise.all([getProfile(), getCategories()]);

  const [{ data: interests }, { data: blocks }] = await Promise.all([
    supabase.from('user_interests').select('interest'),
    supabase.from('blocked_users').select('blocked_id, created_at'),
  ]);

  const blockedIds = (blocks ?? []).map((b) => b.blocked_id as string);
  let blockedProfiles: { id: string; full_name: string | null }[] = [];
  if (blockedIds.length) {
    const { data } = await supabase.from('profiles').select('id, full_name').in('id', blockedIds);
    blockedProfiles = (data ?? []) as { id: string; full_name: string | null }[];
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-4 border-b border-ink/12 pb-8 md:flex-row md:items-end">
        <div>
          <p className="label text-ink/35">Profile</p>
          <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.98] text-ink">
            How you appear at a table.
          </h1>
          <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-ink/55">
            Only what you choose is shared, and only with people seated at your table. Dietary
            information is shared with the venue.
          </p>
        </div>
        <Link
          href="/onboarding"
          className="btn border border-ink/25 px-6 py-3.5 text-ink hover:border-ink"
        >
          Guided onboarding
        </Link>
      </div>

      <ProfileEditor
        profile={profile}
        categories={categories}
        interests={(interests ?? []).map((i) => i.interest as string)}
      />

      <BlockedList blocked={blockedProfiles} />
    </div>
  );
}
