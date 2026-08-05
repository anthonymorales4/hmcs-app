-- Read policy for profiles. Isolated in its own migration because it is the one
-- privacy-sensitive choice in the schema and is likely to be revisited.
--
-- Current setting: fully public. app/roster/page.js and app/board/page.js are not
-- wrapped in ProtectedRoute, so anonymous visitors hit profiles directly and need
-- read access for photos, graduation years and positions to render.
--
-- Consequence: every column is world-readable, including phone_number, email and
-- hometown. The anon key ships in the client bundle, so this data is scrapable by
-- anyone who loads the site.
--
-- To restrict later, replace this policy with:
--
--   drop policy "Profiles are publicly readable" on public.profiles;
--   create policy "Authenticated users can read profiles"
--     on public.profiles for select
--     to authenticated
--     using (true);
--
-- The public pages degrade gracefully under that change: RLS returns an empty set
-- rather than an error, so the roster still renders names and numbers from
-- public/data/rosters/*.json and simply omits profile-derived fields.

create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);
