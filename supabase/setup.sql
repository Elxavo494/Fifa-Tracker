-- Drop existing tables and policies
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Users can delete their own avatar" on storage.objects;
drop table if exists public.tournament_matches;
drop table if exists public.tournaments;
drop table if exists public.match_players;
drop table if exists public.matches;
drop table if exists public.profiles;

-- Create storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict do nothing;

-- Set up storage policies
create policy "Avatar images are publicly accessible"
on storage.objects for select
using ( bucket_id = 'avatars' );

create policy "Users can upload their own avatar"
on storage.objects for insert
with check (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update their own avatar"
on storage.objects for update
using (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own avatar"
on storage.objects for delete
using (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Set up profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up matches table
create table public.matches (
  id uuid primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  date timestamp with time zone not null,
  team1_score integer not null,
  team2_score integer not null,
  user_id uuid references auth.users(id) not null
);

-- Set up match_players table
create table public.match_players (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references public.matches(id) on delete cascade,
  player_id uuid references public.profiles(id),
  team integer not null check (team in (1, 2)),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up tournaments table
create table public.tournaments (
  id uuid primary key,
  name text not null,
  player_count integer not null,
  status text not null check (status in ('ongoing', 'completed')),
  winner_id uuid references public.profiles(id),
  user_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  completed_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up tournament_matches table
create table public.tournament_matches (
  id uuid primary key,
  tournament_id uuid references public.tournaments(id) on delete cascade,
  round integer not null,
  match_number integer not null,
  player1_id uuid references public.profiles(id),
  player2_id uuid references public.profiles(id),
  player1_score integer,
  player2_score integer,
  winner_id uuid references public.profiles(id),
  next_match_id uuid references public.tournament_matches(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up RLS policies for profiles
alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
on profiles for select
using (true);

create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id);

create policy "Users can insert own profile"
on profiles for insert
with check (auth.uid() = id);

-- Set up RLS policies for matches
alter table public.matches enable row level security;

create policy "Matches are viewable by everyone"
on matches for select
using (true);

create policy "Users can insert matches"
on matches for insert
with check (auth.uid() = user_id);

create policy "Users can update own matches"
on matches for update
using (auth.uid() = user_id);

create policy "Users can delete own matches"
on matches for delete
using (auth.uid() = user_id);

-- Set up RLS policies for match_players
alter table public.match_players enable row level security;

create policy "Match players are viewable by everyone"
on match_players for select
using (true);

create policy "Users can insert match players"
on match_players for insert
with check (
  exists (
    select 1 from matches
    where id = match_id
    and user_id = auth.uid()
  )
);

create policy "Users can update match players"
on match_players for update
using (
  exists (
    select 1 from matches
    where id = match_id
    and user_id = auth.uid()
  )
);

create policy "Users can delete match players"
on match_players for delete
using (
  exists (
    select 1 from matches
    where id = match_id
    and user_id = auth.uid()
  )
);

-- Set up RLS policies for tournaments
alter table public.tournaments enable row level security;

create policy "Tournaments are viewable by everyone"
on tournaments for select
using (true);

create policy "Users can insert tournaments"
on tournaments for insert
with check (auth.uid() = user_id);

create policy "Users can update own tournaments"
on tournaments for update
using (auth.uid() = user_id);

create policy "Users can delete own tournaments"
on tournaments for delete
using (auth.uid() = user_id);

-- Set up RLS policies for tournament matches
alter table public.tournament_matches enable row level security;

create policy "Tournament matches are viewable by everyone"
on tournament_matches for select
using (true);

create policy "Users can insert tournament matches"
on tournament_matches for insert
with check (
  exists (
    select 1 from tournaments
    where id = tournament_id
    and user_id = auth.uid()
  )
);

create policy "Users can update tournament matches"
on tournament_matches for update
using (
  exists (
    select 1 from tournaments
    where id = tournament_id
    and user_id = auth.uid()
  )
);

create policy "Users can delete tournament matches"
on tournament_matches for delete
using (
  exists (
    select 1 from tournaments
    where id = tournament_id
    and user_id = auth.uid()
  )
);