-- Announcements feed: posts with likes and comments.
--
-- Reconstructed from app/alumni/announcements/page.js (all reads and writes) and
-- components/ui/Post.js (rendering and derived state).

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,

  -- jsonb, not text: TextEditor is TipTap and stores a document node. Post.js
  -- feeds this straight back into useEditor({ content }), and page.js:181 writes
  -- the raw editor value on edit.
  content jsonb not null,

  -- Up to 4 public URLs, enforced client-side at page.js:238.
  image_urls text[] not null default '{}',

  created_at timestamptz not null default now(),

  -- Post.js:67 derives the "(edited)" label from updated_at !== created_at, so an
  -- untouched post must have the two exactly equal. That holds here: now() is
  -- transaction_timestamp(), which is constant within a statement, so both
  -- defaults resolve to the identical value on insert. Do not replace this with a
  -- BEFORE UPDATE trigger that also fires on insert, and do not use clock_timestamp().
  updated_at timestamptz not null default now()
);

-- The feed pages with .order("created_at", { ascending: false }).range(from, to).
create index posts_created_at_idx on public.posts (created_at desc);
create index posts_profile_id_idx on public.posts (profile_id);

create table public.likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),

  -- handleToggleLike (page.js:320) reads an existing like with .single(), which
  -- errors if a user ever has two likes on one post. This makes that impossible.
  unique (post_id, profile_id)
);

create index likes_post_id_idx on public.likes (post_id);
create index likes_profile_id_idx on public.likes (profile_id);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index comments_post_id_idx on public.comments (post_id);
create index comments_profile_id_idx on public.comments (profile_id);

alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;

-- The announcements page is wrapped in ProtectedRoute, so the feed is
-- authenticated-only. This is deliberately stricter than the profiles read policy.
create policy "Authenticated users can read posts"
  on public.posts for select to authenticated using (true);

create policy "Users can create own posts"
  on public.posts for insert to authenticated
  with check ((select auth.uid()) = profile_id);

create policy "Users can update own posts"
  on public.posts for update to authenticated
  using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);

create policy "Users can delete own posts"
  on public.posts for delete to authenticated
  using ((select auth.uid()) = profile_id);

-- Likes are read by everyone signed in: the feed embeds likes(profile_id) to
-- compute both the count and whether the current user has liked each post.
create policy "Authenticated users can read likes"
  on public.likes for select to authenticated using (true);

create policy "Users can create own likes"
  on public.likes for insert to authenticated
  with check ((select auth.uid()) = profile_id);

create policy "Users can delete own likes"
  on public.likes for delete to authenticated
  using ((select auth.uid()) = profile_id);

create policy "Authenticated users can read comments"
  on public.comments for select to authenticated using (true);

create policy "Users can create own comments"
  on public.comments for insert to authenticated
  with check ((select auth.uid()) = profile_id);

-- Matches the UI, which only shows the delete control on your own comments
-- (announcements/page.js:749). Post authors cannot remove others' comments.
create policy "Users can delete own comments"
  on public.comments for delete to authenticated
  using ((select auth.uid()) = profile_id);
