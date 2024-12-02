-- Add updated_at column to tournaments if it doesn't exist
do $$ 
begin
  if not exists (select 1 from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'tournaments' 
    and column_name = 'updated_at') then
    
    alter table public.tournaments 
    add column updated_at timestamp with time zone default timezone('utc'::text, now());
  end if;
end $$;

-- Add updated_at column to tournament_matches if it doesn't exist
do $$ 
begin
  if not exists (select 1 from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'tournament_matches' 
    and column_name = 'updated_at') then
    
    alter table public.tournament_matches 
    add column updated_at timestamp with time zone default timezone('utc'::text, now());
  end if;
end $$;