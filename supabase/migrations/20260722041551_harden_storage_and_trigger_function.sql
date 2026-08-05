-- Follow-up to the initial schema, addressing everything flagged by
-- `supabase advisors --type security` after the first four migrations.

-- Public buckets serve objects via /storage/v1/object/public/... which bypasses
-- RLS entirely, so these SELECT policies were never needed for the app's
-- getPublicUrl() flow. Their only effect was to let any client enumerate every
-- file in both buckets. The app never calls .list(), .download(), or
-- createSignedUrl(), so removing them changes no application behavior.
--
-- If you later add a feature that lists bucket contents, re-add a policy scoped
-- to the caller's own folder rather than a blanket `using (bucket_id = ...)`.
drop policy "Post images are publicly readable" on storage.objects;
drop policy "Profile images are publicly readable" on storage.objects;

-- handle_new_user() is a trigger function and is never meant to be invoked
-- directly. Because it lives in the public schema it was exposed at
-- /rest/v1/rpc/handle_new_user to both anon and authenticated. A direct call
-- would error ("trigger functions can only be called as triggers"), but the
-- grant is still unnecessary attack surface on a SECURITY DEFINER function.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
