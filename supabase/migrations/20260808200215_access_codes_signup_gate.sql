-- Access codes replace roster-name matching as the signup gate.
--
-- The previous gate (lib/utils.js validatePlayerName, called from
-- app/signup/page.js) matched the entered name against public/data/rosters/*.json.
-- That was wrong in both directions: the JSON is a public static file, so the
-- check was trivially bypassed by calling supabase.auth.signUp() directly; and
-- the roster is sourced from IMLeagues registration, so it omits anyone who
-- played without registering and locked those real teammates out.
--
-- An access code inverts the question. Instead of "are you in our records?"
-- (which our records cannot answer), it asks "did someone who runs the club give
-- you this?" — which they can.

-- Codes are stored normalized: uppercase, alphanumeric only. See
-- normalize_access_code() below. Storing them pre-normalized means lookups hit
-- the primary key index instead of scanning with upper() applied per row.
create table public.access_codes (
  code       text primary key check (code ~ '^[A-Z0-9]+$' and length(code) >= 8),
  label      text,        -- who or which cohort this was issued to, for attribution
  max_uses   integer not null default 1 check (max_uses > 0),
  uses       integer not null default 0 check (uses >= 0),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.access_codes enable row level security;

-- Deliberately NO policies on this table. RLS with zero policies denies every
-- client read, which is the point: a readable code table is a public guest list.
-- The two functions below are SECURITY DEFINER and bypass RLS to do their work.

-- Shared normalization so a code typed as "k7m2-qx94-trb6" matches a code stored
-- as "K7M2QX94TRB6". Both the validation RPC and the signup trigger call this;
-- if they ever normalized differently, a code could pass the pre-check and then
-- fail at signup, which is exactly the confusing failure this design avoids.
create function public.normalize_access_code(p_code text)
returns text
language sql
immutable
set search_path = ''
as $$
  select upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'))
$$;

-- Advisory pre-check for the signup form. Returns only a boolean, never the code
-- list, so anon may call it. The signup form uses this to show a clean inline
-- error instead of letting the user submit and hit the trigger's raise, which
-- surfaces through GoTrue as an opaque "Database error saving new user".
--
-- This is UX only. handle_new_user() below is the actual enforcement — anyone
-- bypassing the form is still rejected. Because a boolean oracle is brute
-- forceable, issue long random codes (12+ characters).
create function public.check_access_code(p_code text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.access_codes
    where code = public.normalize_access_code(p_code)
      and uses < max_uses
      and (expires_at is null or expires_at > now())
  )
$$;

-- Supabase configures default privileges that grant EXECUTE on new public
-- functions to anon, authenticated and service_role, so revoking from `public`
-- alone leaves those grants in place. Both roles must be named explicitly.
-- Only anon needs this: it is called from the signup form before a session
-- exists, and a signed-in user has no reason to test access codes.
revoke execute on function public.check_access_code(text) from public, anon, authenticated;
grant execute on function public.check_access_code(text) to anon;

-- Internal helper: called only by the two functions above, never over the API.
revoke execute on function public.normalize_access_code(text) from public, anon, authenticated;

-- Rewritten signup trigger. Two changes from the previous version:
--
-- 1. Requires a valid access code. This runs in the same transaction as the
--    insert into auth.users, so raising here rolls that row back too — a
--    rejected signup leaves no orphaned auth user behind.
--
-- 2. Derives `role` instead of copying it from raw_user_meta_data. The old
--    version trusted a client-supplied value, so any caller could self-assign.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code            text;
  v_row             public.access_codes%rowtype;
  v_graduation_year integer;
  v_academic_year_end integer;
  v_role            text;
begin
  v_code := public.normalize_access_code(new.raw_user_meta_data ->> 'access_code');

  if v_code = '' then
    raise exception 'An access code is required to create an account.'
      using errcode = '28000';
  end if;

  -- for update serializes concurrent redemptions of the same code, so two people
  -- submitting a max_uses = 1 code simultaneously cannot both be admitted.
  select * into v_row
  from public.access_codes
  where code = v_code
  for update;

  if not found
     or v_row.uses >= v_row.max_uses
     or (v_row.expires_at is not null and v_row.expires_at <= now()) then
    raise exception 'That access code is not valid.'
      using errcode = '28000';
  end if;

  update public.access_codes
  set uses = uses + 1
  where code = v_row.code;

  -- Guard the cast: metadata is client-supplied and may be absent or non-numeric.
  v_graduation_year := nullif(new.raw_user_meta_data ->> 'graduation_year', '')::integer;

  -- The academic year ending in Y runs Aug (Y-1) through Jul Y, so from August
  -- onward the current academic year ends next calendar year. Someone graduating
  -- in that year or later is still playing. Comparing against the calendar year
  -- instead (the previous behavior) misclassified the graduating class.
  v_academic_year_end := case
    when extract(month from now()) >= 8 then extract(year from now())::integer + 1
    else extract(year from now())::integer
  end;

  v_role := case
    when v_graduation_year is null then 'alumni'
    when v_graduation_year >= v_academic_year_end then 'current_player'
    else 'alumni'
  end;

  insert into public.profiles (id, email, full_name, graduation_year, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    v_graduation_year,
    v_role
  );

  return new;
end;
$$;

-- create or replace preserves the ACL from 20260722041551, but re-stating it
-- keeps this migration correct if replayed against a database that predates it.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
