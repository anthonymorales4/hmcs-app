-- Stop exposing personal contact details to anonymous visitors.
--
-- 20260722041443 made every column of every profile world-readable, and its own
-- comment flagged this as the one privacy-sensitive choice in the schema. Two
-- things made it worse than "scrapable": the anon key ships in the client
-- bundle, and components/ui/PlayerProfileModal.js renders email, phone_number
-- and hometown from /roster and /board -- neither of which is behind
-- ProtectedRoute. A stranger did not need the API; they clicked a card.
--
-- Approach: keep the public pages working (photos, class years, positions are
-- the point of a public roster) but make the private columns unreadable at the
-- privilege layer, not just absent from the UI. Column-level grants mean a
-- widened RLS policy later cannot silently re-expose them.

-- Anon loses blanket column access and gets back only what the roster and board
-- cards actually render. Everything omitted here -- email, phone_number,
-- hometown, house, concentration, bio, final_club, board_position, current_job,
-- current_company, current_location -- is now unreachable with the anon key.
--
-- house/concentration/hometown were previously rendered on the board page. That
-- page has no data right now (its fabricated JSON was deleted), so dropping them
-- from the public set costs nothing today. Revisit deliberately if verified board
-- records come back and those fields should be public.
revoke select on public.profiles from anon;
grant select (id, full_name, graduation_year, role, position, profile_image_url)
  on public.profiles to anon;

-- The row policy is split by role so the two audiences are explicit. Column
-- privileges above are what actually fence anon; this keeps the rows visible.
drop policy "Profiles are publicly readable" on public.profiles;

create policy "Anon can read public profile columns"
  on public.profiles for select to anon
  using (true);

-- Signed-in users keep full read access: that is what the alumni directory is
-- for, and since 20260808200215 every account requires an access code, so
-- authenticated is a vetted population rather than anyone with an email address.
create policy "Members can read profiles"
  on public.profiles for select to authenticated
  using (true);

-- Convenience view so client code can keep using select("*") on public pages.
--
-- security_invoker = true is required, not stylistic. A default (definer) view
-- would run as its owner, bypassing RLS and the column grants above -- it would
-- hand back exactly the data this migration is removing, and would trip the
-- security_definer_view advisor.
create view public.public_profiles
with (security_invoker = true) as
  select id, full_name, graduation_year, role, position, profile_image_url
  from public.profiles;

grant select on public.public_profiles to anon, authenticated;
