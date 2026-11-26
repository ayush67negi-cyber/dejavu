import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getCategories, getProfile } from '@/lib/queries';
import { categoryImage, type ExperienceVenue, venueFor } from '@/lib/types';
import { formatDateTime } from '@/lib/format';
import { RequestToJoin } from '@/components/app/request-to-join';

export const metadata: Metadata = { title: 'Discover' };

export default async function DiscoverPage() {
  const supabase = await createClient();
  const [categories, profile] = await Promise.all([getCategories(), getProfile()]);

  const [{ data: experiences }, { data: requests }, { data: mine }, { data: venues }] =
    await Promise.all([
      supabase
        .from('experiences')
        .select('id, name, description, city, starts_at, group_size, status, category_id')
        .in('status', ['matching', 'confirmed'])
        .order('starts_at', { ascending: true })
        .limit(30),
      supabase.from('experience_requests').select('experience_id, status'),
      supabase.from('experience_participants').select('experience_id'),
      supabase.from('experience_venues').select('experience_id, venue_name, venue_address'),
    ]);

  type PublicExperience = {
    id: string;
    name: string;
    description: string | null;
    city: string;
    starts_at: string | null;
    group_size: number;
    status: string;
    category_id: string | null;
  };

  const list = (experiences ?? []) as PublicExperience[];
  const requested = new Map((requests ?? []).map((r) => [r.experience_id as string, r.status as string]));
  const assigned = new Set((mine ?? []).map((m) => m.experience_id as string));

  const city = profile?.city;
  const inCity = city ? list.filter((e) => e.city === city) : list;
  const elsewhere = city ? list.filter((e) => e.city !== city) : [];

  return (
    <div className="space-y-12">
      <div className="border-b border-ink/12 pb-8">
        <p className="label text-ink/35">Discover</p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.98] text-ink">
          Tables looking for people.
        </h1>
        <p className="mt-3 max-w-[56ch] text-[14px] leading-relaxed text-ink/55">
          These tables are open for requests. Confirmation is not automatic — our team composes the
          final group for balance, and you’ll be notified as soon as your seat is confirmed.
          {city ? ` Showing ${city} first.` : ''}
        </p>
      </div>

      <section>
        <div className="mb-5 flex items-baseline justify-between border-b border-ink/12 pb-3">
          <h2 className="label text-ink/50">{city ? `In ${city}` : 'Open tables'}</h2>
          <span className="text-[10px] uppercase tracking-label text-ink/30">{inCity.length}</span>
        </div>
        {inCity.length === 0 ? (
          <div className="border border-dashed border-ink/20 p-10 text-center">
            <p className="font-serif text-[22px] leading-tight text-ink">
              No open tables in {city ?? 'your city'} right now.
            </p>
            <p className="mx-auto mt-2 max-w-[44ch] text-[13px] leading-relaxed text-ink/50">
              New tables are published weekly for Sunday seatings. We’ll notify you the moment one
              opens in your city.
            </p>
            <Link
              href="/tables"
              className="mt-5 inline-block border-b border-ink/30 pb-1 text-[10px] uppercase tracking-[0.16em] text-ink hover:border-cherry hover:text-cherry"
            >
              Browse table categories
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {inCity.map((e) => {
              const category = categories.find((c) => c.id === e.category_id);
              const status = requested.get(e.id);
              const isMine = assigned.has(e.id);
              return (
                <div key={e.id} className="group border border-ink/12">
                  <div className="relative aspect-[16/9] overflow-hidden bg-sand">
                    <Image
                      src={categoryImage(category?.slug ?? 'mixed', category?.image_url)}
                      alt={category?.name ?? 'DEJAVU table'}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[1100ms] ease-edit group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
                      <span className="text-[9px] uppercase tracking-label text-ivory/70">
                        {category?.name ?? 'Mixed'} · {e.city}
                      </span>
                      <span className="text-[9px] uppercase tracking-label text-ivory/70">
                        {e.status === 'confirmed' ? 'Confirmed' : 'Open'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-[22px] leading-tight text-ink">{e.name}</h3>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink/55">
                      {e.description ?? 'A curated DEJAVU table.'}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-ink/55">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-ink/30" strokeWidth={1.5} />
                        {venueFor(venues as ExperienceVenue[], e.id).name ??
                          'Venue revealed on confirmation'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-ink/30" strokeWidth={1.5} />
                        {e.group_size} seats
                      </span>
                    </div>
                    <p className="mt-2 text-[12px] text-ink/40">
                      {e.starts_at ? formatDateTime(e.starts_at) : 'Date to be announced'}
                    </p>

                    <div className="mt-5 border-t border-ink/10 pt-4">
                      {isMine ? (
                        <p className="text-[10px] uppercase tracking-[0.14em] text-olive">
                          You are at this table
                        </p>
                      ) : status === 'pending' ? (
                        <p className="text-[10px] uppercase tracking-[0.14em] text-ember">
                          Request received · awaiting review
                        </p>
                      ) : status === 'approved' ? (
                        <p className="text-[10px] uppercase tracking-[0.14em] text-olive">
                          Approved
                        </p>
                      ) : status === 'declined' ? (
                        <p className="text-[10px] uppercase tracking-[0.14em] text-ink/40">
                          Not this time — we’ll place you soon
                        </p>
                      ) : (
                        <RequestToJoin experienceId={e.id} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {elsewhere.length > 0 && (
        <section>
          <div className="mb-5 flex items-baseline justify-between border-b border-ink/12 pb-3">
            <h2 className="label text-ink/50">Other cities</h2>
            <span className="text-[10px] uppercase tracking-label text-ink/30">{elsewhere.length}</span>
          </div>
          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {elsewhere.map((e) => {
              const category = categories.find((c) => c.id === e.category_id);
              return (
                <div key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="font-serif text-[19px] leading-none text-ink">{e.name}</p>
                    <p className="mt-1.5 text-[11.5px] text-ink/45">
                      {category?.name ?? 'Mixed'} · {e.city} ·{' '}
                      {e.starts_at ? formatDateTime(e.starts_at) : 'Date TBA'}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-ink/35">
                    {e.city} <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
