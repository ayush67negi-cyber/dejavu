-- DEJAVU — 0005 venue & internal-notes privacy
-- Reason: RLS is row-level, not column-level. Keeping venue details on the
-- experiences row meant any member who could see a table could also read the
-- restaurant before it was confirmed. Venue data now lives in its own table
-- with RLS that only reveals a row once the experience is confirmed AND the
-- organiser has allowed the reveal. Internal notes are admin-only.

create table public.experience_venues (
  experience_id uuid primary key references public.experiences(id) on delete cascade,
  venue_name text,
  venue_address text,
  updated_at timestamptz not null default now()
);

create trigger experience_venues_touch before update on public.experience_venues
for each row execute function public.touch_updated_at();

alter table public.experience_venues enable row level security;

create policy venues_select on public.experience_venues for select using (
  public.is_admin()
  or exists (
    select 1 from public.experiences e
    where e.id = experience_venues.experience_id
      and e.status = 'confirmed'
      and e.reveal_venue = true
      and public.is_experience_member(e.id)
  )
);

create policy venues_admin_write on public.experience_venues for all
  using (public.is_admin()) with check (public.is_admin());

-- Move any existing venue data across, then drop the exposed columns.
insert into public.experience_venues (experience_id, venue_name, venue_address)
select id, venue_name, venue_address from public.experiences
where venue_name is not null or venue_address is not null
on conflict (experience_id) do nothing;

alter table public.experiences drop column venue_name;
alter table public.experiences drop column venue_address;

-- Internal notes must never be member-readable either.
create or replace function public.guard_experience_notes()
returns trigger language plpgsql security definer set search_path = public as $fn$
begin
  if not public.is_admin() then
    new.admin_notes := old.admin_notes;
    new.reveal_venue := old.reveal_venue;
  end if;
  return new;
end;
$fn$;

create trigger experiences_guard_notes before update on public.experiences
for each row execute function public.guard_experience_notes();

-- Rewrite the member-facing RPC against the new table.
drop function if exists public.get_my_experiences();

create or replace function public.get_my_experiences()
returns table (
  id uuid, name text, description text, category_slug text, city text,
  starts_at timestamptz, ends_at timestamptz, venue_name text, venue_address text,
  instructions text, status public.experience_status, group_size int
)
language plpgsql stable security definer set search_path = public as $fn$
begin
  return query
    select e.id, e.name, e.description, c.slug, e.city, e.starts_at, e.ends_at,
           case when e.status = 'confirmed' and e.reveal_venue then v.venue_name end,
           case when e.status = 'confirmed' and e.reveal_venue then v.venue_address end,
           e.instructions, e.status, e.group_size
    from public.experiences e
    left join public.table_categories c on c.id = e.category_id
    left join public.experience_venues v on v.experience_id = e.id
    join public.experience_participants ep on ep.experience_id = e.id
    where ep.user_id = auth.uid()
    order by e.starts_at desc nulls last;
end;
$fn$;
grant execute on function public.get_my_experiences() to authenticated;
