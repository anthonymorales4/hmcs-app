-- Profiles: one row per authenticated user, keyed by auth.users.id.
--
-- Reconstructed from application code after the original project was lost to a
-- >90 day pause. Sources: contexts/AuthContext.js (fetch by id), components/ui/
-- ProfileEditForm.js (editable columns), hooks/useProfileCompletion.js (required
-- fields), app/signup/page.js (signup metadata + role derivation).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,

  -- Identity. Populated by handle_new_user() from signup metadata.
  full_name text,
  email text,
  graduation_year integer,
  role text check (role in ('current_player', 'alumni')),

  -- Set via components/ui/ProfileImageUpload.js after upload to storage.
  profile_image_url text,

  -- Personal info, all edited through ProfileEditForm.
  bio text,
  position text,
  house text,
  concentration text,
  hometown text,
  final_club text,
  board_position text,

  -- Contact info.
  phone_number text,
  linkedin_url text,
  instagram_url text,

  -- Career info. Only surfaced for role = 'alumni' (ProfileEditForm.js:429).
  current_job text,
  current_company text,
  current_location text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- app/board/page.js matches board members to profiles by name via .in("full_name", names);
-- app/roster/page.js does the same match client-side across the whole table.
create index profiles_full_name_idx on public.profiles (full_name);

-- app/alumni/directory/page.js filters with .eq("role", "alumni").
create index profiles_role_idx on public.profiles (role);

-- Signup never inserts into profiles directly. app/signup/page.js:57 passes
-- full_name, graduation_year and role through auth.signUp options.data, and
-- relies on this trigger to materialize the row. Without it, signup appears to
-- succeed but the user has no profile and AuthContext.fetchProfile fails.
--
-- security definer so the insert bypasses RLS: at this point in the signup
-- transaction there is no authenticated session to satisfy a policy.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, graduation_year, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    -- Guard the cast: metadata is client-supplied and may be absent or non-numeric.
    nullif(new.raw_user_meta_data ->> 'graduation_year', '')::integer,
    new.raw_user_meta_data ->> 'role'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

-- Read policy lives in its own migration so it can be tightened independently.

-- Users may only ever edit their own row. ProfileEditForm and ProfileImageUpload
-- both scope their updates with .eq("id", profile.id); this enforces it server-side.
create policy "Users can update own profile"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- No insert or delete policy: rows are created by the trigger above and removed
-- by the cascade from auth.users.
