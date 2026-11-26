-- DEJAVU — 0001 core schema
-- Enums
create type public.experience_status as enum ('draft','matching','confirmed','completed','cancelled');
create type public.membership_status as enum ('pending','active','expired','cancelled');
create type public.participant_status as enum ('invited','confirmed','declined','removed');
create type public.request_status as enum ('pending','approved','declined');
create type public.report_status as enum ('open','reviewing','resolved','dismissed');
create type public.account_status as enum ('active','suspended','deleted');
create type public.visibility_level as enum ('table','members','private');

-- Admin roles (kept separate from profiles so users can never self-elevate)
create table public.admin_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','moderator')),
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id) on delete set null
);

create or replace function public.is_admin(check_uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_roles where user_id = check_uid);
$$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to authenticated, anon;

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  date_of_birth date,
  city text,
  occupation text,
  bio text,
  instagram_handle text,
  food_preferences text[] not null default '{}',
  dietary_restrictions text[] not null default '{}',
  social_preferences text[] not null default '{}',
  preferred_categories text[] not null default '{}',
  availability text[] not null default '{}',
  visibility public.visibility_level not null default 'table',
  status public.account_status not null default 'active',
  onboarding_completed boolean not null default false,
  onboarding_step int not null default 0,
  adult_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint adult_check check (date_of_birth is null or date_of_birth <= (current_date - interval '18 years'))
);
create index profiles_city_idx on public.profiles (city);
create index profiles_status_idx on public.profiles (status);

-- Profile bootstrap on signup
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
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Interests
create table public.user_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  interest text not null,
  created_at timestamptz not null default now(),
  unique (user_id, interest)
);
create index user_interests_user_idx on public.user_interests (user_id);

-- Questionnaire
create table public.questionnaire_responses (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  -- derived, non-identifying traits used by the matching engine
  energy int check (energy between 1 and 5),
  talkativity int check (talkativity between 1 and 5),
  curiosity int check (curiosity between 1 and 5),
  newness int check (newness between 1 and 5),
  updated_at timestamptz not null default now()
);

-- Table categories
create table public.table_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  description text,
  image_url text,
  accent text default '#C4172F',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Membership plans
create table public.membership_plans (
  id text primary key,
  name text not null,
  duration_months int not null check (duration_months > 0),
  price_inr int not null check (price_inr >= 0),
  description text,
  is_active boolean not null default true,
  sort_order int not null default 0
);

-- Memberships
create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id text not null references public.membership_plans(id),
  status public.membership_status not null default 'pending',
  starts_at timestamptz,
  ends_at timestamptz,
  cancelled_at timestamptz,
  payment_reference text,
  activated_by_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index memberships_user_idx on public.memberships (user_id);
create index memberships_status_idx on public.memberships (status);

-- Payment records (Razorpay-ready, never simulated as paid)
create table public.membership_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  membership_id uuid references public.memberships(id) on delete set null,
  plan_id text not null references public.membership_plans(id),
  amount_inr int not null,
  currency text not null default 'INR',
  provider text not null default 'razorpay',
  provider_order_id text,
  provider_payment_id text,
  status text not null default 'created' check (status in ('created','pending','paid','failed','refunded')),
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index membership_payments_user_idx on public.membership_payments (user_id);

-- Experiences
create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category_id uuid references public.table_categories(id) on delete set null,
  city text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  venue_name text,
  venue_address text,
  group_size int not null default 6 check (group_size between 4 and 6),
  status public.experience_status not null default 'draft',
  instructions text,
  admin_notes text,
  dietary_notes text,
  reveal_venue boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index experiences_city_idx on public.experiences (city);
create index experiences_status_idx on public.experiences (status);
create index experiences_starts_idx on public.experiences (starts_at);

create table public.experience_participants (
  experience_id uuid not null references public.experiences(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.participant_status not null default 'invited',
  joined_at timestamptz not null default now(),
  primary key (experience_id, user_id)
);
create index experience_participants_user_idx on public.experience_participants (user_id);

create table public.experience_requests (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text,
  status public.request_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (experience_id, user_id)
);
create index experience_requests_user_idx on public.experience_requests (user_id);

-- Feedback
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  would_repeat boolean,
  created_at timestamptz not null default now(),
  unique (experience_id, user_id)
);

-- Safety
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete set null,
  experience_id uuid references public.experiences(id) on delete set null,
  category text not null check (category in ('safety','harassment','no_show','misrepresentation','other')),
  details text not null,
  status public.report_status not null default 'open',
  resolution_note text,
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);
create index reports_status_idx on public.reports (status);

create table public.blocked_users (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint no_self_block check (blocker_id <> blocked_id)
);

-- Notifications
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null default 'system',
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger memberships_touch before update on public.memberships for each row execute function public.touch_updated_at();
create trigger experiences_touch before update on public.experiences for each row execute function public.touch_updated_at();
create trigger categories_touch before update on public.table_categories for each row execute function public.touch_updated_at();
create trigger questionnaire_touch before update on public.questionnaire_responses for each row execute function public.touch_updated_at();
