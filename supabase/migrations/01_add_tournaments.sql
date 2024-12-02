-- Add new tournament tables without dropping existing ones
create table if not exists public.tournaments (
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

create table if not exists public.tournament_matches (
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

-- Set up RLS policies for tournaments
alter table public.tournaments enable row level security;

drop policy if exists "Tournaments are viewable by everyone" on tournaments;
create policy "Tournaments are viewable by everyone"
on tournaments for select
using (true);

drop policy if exists "Users can insert tournaments" on tournaments;
create policy "Users can insert tournaments"
on tournaments for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own tournaments" on tournaments;
create policy "Users can update own tournaments"
on tournaments for update
using (auth.uid() = user_id);

drop policy if exists "Users can delete own tournaments" on tournaments;
create policy "Users can delete own tournaments"
on tournaments for delete
using (auth.uid() = user_id);

-- Set up RLS policies for tournament matches
alter table public.tournament_matches enable row level security;

drop policy if exists "Tournament matches are viewable by everyone" on tournament_matches;
create policy "Tournament matches are viewable by everyone"
on tournament_matches for select
using (true);

drop policy if exists "Users can insert tournament matches" on tournament_matches;
create policy "Users can insert tournament matches"
on tournament_matches for insert
with check (
  exists (
    select 1 from tournaments
    where id = tournament_id
    and user_id = auth.uid()
  )
);

drop policy if exists "Users can update tournament matches" on tournament_matches;
create policy "Users can update tournament matches"
on tournament_matches for update
using (
  exists (
    select 1 from tournaments
    where id = tournament_id
    and user_id = auth.uid()
  )
);

drop policy if exists "Users can delete tournament matches" on tournament_matches;
create policy "Users can delete tournament matches"
on tournament_matches for delete
using (
  exists (
    select 1 from tournaments
    where id = tournament_id
    and user_id = auth.uid()
  )
);