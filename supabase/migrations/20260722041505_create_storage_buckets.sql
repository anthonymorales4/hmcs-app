-- Storage buckets for post attachments and avatars.
--
-- Both are public because the app calls getPublicUrl() and persists the result
-- into the database (posts.image_urls, profiles.profile_image_url) rather than
-- minting signed URLs at render time.

insert into storage.buckets (id, name, public)
values
  ('post-images', 'post-images', true),
  ('profile-images', 'profile-images', true)
on conflict (id) do nothing;

-- Both buckets key objects by owner: announcements/page.js:146 builds
-- `${currentUserId}/${timestamp}_${random}.${ext}` and ProfileImageUpload.js:49
-- builds `${profile.id}/${fileName}`. Every write policy below keys off that
-- first path segment, so a user can only touch their own folder.

create policy "Post images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'post-images');

create policy "Users can upload own post images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'post-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Needed by handleDeletePost, which removes a post's images before deleting the row.
create policy "Users can delete own post images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'post-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Profile images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'profile-images');

create policy "Users can upload own profile image"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'profile-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- ProfileImageUpload uploads with upsert: false and removes the previous file
-- explicitly, so update is not strictly required — but replacing an avatar
-- in place is a natural enough operation to allow.
create policy "Users can update own profile image"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'profile-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can delete own profile image"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'profile-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
