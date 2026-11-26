-- DEJAVU — 0004 matching engine
-- Server-side compatibility scoring. Never exposed to clients: only admins call it.

create or replace function public.match_score(a uuid, b uuid)
returns numeric
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  pa public.profiles;
  pb public.profiles;
  qa public.questionnaire_responses;
  qb public.questionnaire_responses;
  score numeric := 0;
  shared_interests int := 0;
  shared_categories int := 0;
  shared_availability int := 0;
  dietary_conflict boolean := false;
  similarity numeric := 0;
  complement numeric := 0;
begin
  if a = b then return 0; end if;

  select * into pa from public.profiles where id = a;
  select * into pb from public.profiles where id = b;
  if pa.id is null or pb.id is null then return 0; end if;
  if pa.status <> 'active' or pb.status <> 'active' then return 0; end if;

  -- hard blocks either direction
  if exists (
    select 1 from public.blocked_users bu
    where (bu.blocker_id = a and bu.blocked_id = b)
       or (bu.blocker_id = b and bu.blocked_id = a)
  ) then return 0; end if;

  -- city is a hard requirement: DEJAVU tables are in-person
  if coalesce(pa.city,'') <> coalesce(pb.city,'') then return 0; end if;
  score := score + 10;

  select count(*) into shared_interests
  from public.user_interests ia
  join public.user_interests ib on lower(ia.interest) = lower(ib.interest)
  where ia.user_id = a and ib.user_id = b;
  score := score + least(shared_interests, 8) * 2.5;

  select count(*) into shared_categories
  from unnest(pa.preferred_categories) ca
  join unnest(pb.preferred_categories) cb on lower(ca) = lower(cb);
  score := score + least(shared_categories, 6) * 2;

  select count(*) into shared_availability
  from unnest(pa.availability) aa
  join unnest(pb.availability) ab on lower(aa) = lower(ab);
  score := score + least(shared_availability, 4) * 1.5;

  -- dietary compatibility: vegetarian/vegan guests should never be alone at a table
  if ('vegetarian' = any(pa.dietary_restrictions) or 'vegan' = any(pa.dietary_restrictions))
     and ('vegetarian' = any(pb.dietary_restrictions) or 'vegan' = any(pb.dietary_restrictions)) then
    score := score + 2;
  end if;
  if 'vegetarian' = any(pa.dietary_restrictions) and 'non-vegetarian' = any(pb.food_preferences) then
    dietary_conflict := true;
  end if;
  if dietary_conflict then score := score - 1; end if;

  select * into qa from public.questionnaire_responses where user_id = a;
  select * into qb from public.questionnaire_responses where user_id = b;

  if qa.user_id is not null and qb.user_id is not null then
    -- similarity brings comfort
    similarity := 5 - (abs(qa.energy - qb.energy) + abs(qa.curiosity - qb.curiosity)) / 2.0
                     - abs(qa.newness - qb.newness) / 2.0;
    score := score + greatest(similarity, 0) * 1.6;

    -- moderate talkativity complement makes conversation flow
    complement := 5 - abs(qa.talkativity - qb.talkativity);
    score := score + greatest(complement, 0) * 0.8;
  end if;

  return round(greatest(score, 0), 1);
end;
$$;

-- Admin-only: scored candidate tables for a city
create or replace function public.candidate_matches(target_city text, min_score numeric default 12)
returns table (
  user_a uuid, name_a text, user_b uuid, name_b text,
  score numeric, shared_city text
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorised';
  end if;
  return query
    select p1.id, p1.full_name, p2.id, p2.full_name,
           public.match_score(p1.id, p2.id), p1.city
    from public.profiles p1
    join public.profiles p2 on p2.id > p1.id
    where p1.city = target_city
      and p2.city = target_city
      and p1.status = 'active'
      and p2.status = 'active'
      and public.match_score(p1.id, p2.id) >= min_score
    order by 5 desc
    limit 250;
  end if;
end;
$$;

revoke all on function public.match_score(uuid, uuid) from public, anon, authenticated;
revoke all on function public.candidate_matches(text, numeric) from public, anon;
grant execute on function public.candidate_matches(text, numeric) to authenticated;
