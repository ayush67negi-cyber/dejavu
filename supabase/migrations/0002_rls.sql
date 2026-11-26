-- DEJAVU — 0002 row level security & access control

alter table public.admin_roles enable row level security;
alter table public.profiles enable row level security;
alter table public.user_interests enable row level security;
alter table public.questionnaire_responses enable row level security;
alter table public.table_categories enable row level security;
alter table public.membership_plans enable row level security;
alter table public.memberships enable row level security;
alter table public.membership_payments enable row level security;
alter table public.experiences enable row level security;
alter table public.experience_participants enable row level security;
alter table public.experience_requests enable row level security;
alter table public.feedback enable row level security;
alter table public.reports enable row level security;
alter table public.blocked_users enable row level security;
alter table public.notifications enable row level security;

-- helper: is the current user assigned to this experience?
create or replace function public.is_experience_member(exp_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.experience_participants p
    where p.experience_id = exp_id and p.user_id = auth.uid()
  );
$$;

-- ADMIN ROLES: readable only by admins; nobody can insert via API (service role / SQL only)
create policy admin_roles_select on public.admin_roles for select using (public.is_admin());

-- guard: users may not elevate their own status or verification flags
create or replace function public.guard_profile_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    new.status := old.status;
    new.id := old.id;
    new.created_at := old.created_at;
  end if;
  return new;
end;
$$;
create trigger profiles_guard before update on public.profiles
for each row execute function public.guard_profile_update();

-- PROFILES
create policy profiles_select_own on public.profiles for select
  using (id = auth.uid() or public.is_admin());
create policy profiles_update_own on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
create policy profiles_insert_own on public.profiles for insert
  with check (id = auth.uid());

-- INTERESTS
create policy interests_own on public.user_interests for all
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- QUESTIONNAIRE: strictly private to the owner + admins
create policy questionnaire_own on public.questionnaire_responses for all
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- TABLE CATEGORIES: public read of active rows, admin write
create policy categories_select on public.table_categories for select
  using (is_active or public.is_admin());
create policy categories_admin_write on public.table_categories for all
  using (public.is_admin()) with check (public.is_admin());

-- PLANS: public read
create policy plans_select on public.membership_plans for select using (true);
create policy plans_admin_write on public.membership_plans for all
  using (public.is_admin()) with check (public.is_admin());

-- MEMBERSHIPS: owner read; writes go through server routes with the service role
create policy memberships_select on public.memberships for select
  using (user_id = auth.uid() or public.is_admin());
create policy memberships_admin_write on public.memberships for all
  using (public.is_admin()) with check (public.is_admin());

-- PAYMENTS: owner read only
create policy payments_select on public.membership_payments for select
  using (user_id = auth.uid() or public.is_admin());

-- EXPERIENCES
create policy experiences_select on public.experiences for select
  using (
    public.is_admin()
    or (
      status in ('matching','confirmed','completed')
      and exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.onboarding_completed
      )
    )
  );
create policy experiences_admin_write on public.experiences for all
  using (public.is_admin()) with check (public.is_admin());

-- PARTICIPANTS: see your own rows; see co-participants of your own experiences
create policy participants_select on public.experience_participants for select
  using (
    user_id = auth.uid()
    or public.is_admin()
    or public.is_experience_member(experience_id)
  );
create policy participants_admin_write on public.experience_participants for all
  using (public.is_admin()) with check (public.is_admin());

-- REQUESTS
create policy requests_select on public.experience_requests for select
  using (user_id = auth.uid() or public.is_admin());
create policy requests_insert on public.experience_requests for insert
  with check (user_id = auth.uid());
create policy requests_admin_write on public.experience_requests for all
  using (public.is_admin()) with check (public.is_admin());

-- FEEDBACK
create policy feedback_select on public.feedback for select
  using (user_id = auth.uid() or public.is_admin());
create policy feedback_insert on public.feedback for insert
  with check (user_id = auth.uid() and public.is_experience_member(experience_id));

-- REPORTS: reporter reads own; admins read all
create policy reports_select on public.reports for select
  using (reporter_id = auth.uid() or public.is_admin());
create policy reports_insert on public.reports for insert
  with check (reporter_id = auth.uid());
create policy reports_admin_update on public.reports for update
  using (public.is_admin()) with check (public.is_admin());

-- BLOCKS
create policy blocks_own on public.blocked_users for all
  using (blocker_id = auth.uid() or public.is_admin())
  with check (blocker_id = auth.uid());

-- NOTIFICATIONS
create policy notifications_select on public.notifications for select
  using (user_id = auth.uid() or public.is_admin());
create policy notifications_update on public.notifications for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy notifications_admin_insert on public.notifications for insert
  with check (public.is_admin());

-- PUBLIC-SAFE participant view: only fields a table-mate should see
create or replace function public.get_table_participants(exp_id uuid)
returns table (user_id uuid, full_name text, avatar_url text, occupation text, bio text, city text)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not (public.is_experience_member(exp_id) or public.is_admin()) then
    return;
  end if;
  return query
    select p.id, p.full_name, p.avatar_url, p.occupation,
           case when p.visibility = 'private' then null else p.bio end,
           p.city
    from public.experience_participants ep
    join public.profiles p on p.id = ep.user_id
    where ep.experience_id = exp_id and p.status = 'active';
end;
$$;
grant execute on function public.get_table_participants(uuid) to authenticated;

-- Venue privacy: members only receive venue data once an experience is confirmed
-- AND the organiser has chosen to reveal it. Enforced server-side by RPC + app queries.
create or replace function public.get_my_experiences()
returns table (
  id uuid, name text, description text, category_slug text, city text,
  starts_at timestamptz, ends_at timestamptz, venue_name text, venue_address text,
  instructions text, status public.experience_status, group_size int
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return query
    select e.id, e.name, e.description, c.slug, e.city, e.starts_at, e.ends_at,
           case when e.status = 'confirmed' and e.reveal_venue then e.venue_name end,
           case when e.status = 'confirmed' and e.reveal_venue then e.venue_address end,
           e.instructions, e.status, e.group_size
    from public.experiences e
    left join public.table_categories c on c.id = e.category_id
    join public.experience_participants ep on ep.experience_id = e.id
    where ep.user_id = auth.uid()
    order by e.starts_at desc nulls last;
end;
$$;
grant execute on function public.get_my_experiences() to authenticated;
