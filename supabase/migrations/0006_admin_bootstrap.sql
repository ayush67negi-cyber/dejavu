-- 0006_admin_bootstrap.sql
-- Secure owner bootstrap for the admin studio.
--
-- Problem: admin_roles is intentionally writable only by the service role, so the
-- very first administrator cannot be created from the application itself.
-- Solution: an allowlist table that no client can read or write. The signup trigger
-- grants admin_roles only when the new account's email already appears in the
-- allowlist. Adding an entry requires database owner access (Supabase SQL editor).

create table if not exists public.admin_allowlist (
  email text primary key,
  note text,
  created_at timestamptz not null default now()
);

comment on table public.admin_allowlist is
  'Server-side only. Emails that are granted admin_roles automatically on signup.';

alter table public.admin_allowlist enable row level security;
-- Deliberately no policies: anon/authenticated cannot select, insert, update or delete.
revoke all on public.admin_allowlist from anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;

  if exists (select 1 from public.admin_allowlist a where lower(a.email) = lower(new.email)) then
    insert into public.admin_roles (user_id, role)
    values (new.id, 'admin')
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

-- Backfill: if an allowlisted email already has an account, grant admin now.
insert into public.admin_roles (user_id, role)
select u.id, 'admin'
from auth.users u
join public.admin_allowlist a on lower(a.email) = lower(u.email)
on conflict (user_id) do nothing;
