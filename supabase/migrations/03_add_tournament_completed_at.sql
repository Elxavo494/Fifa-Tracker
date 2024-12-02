-- Add completed_at column to tournaments if it doesn't exist
do $$ 
begin
  if not exists (select 1 from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'tournaments' 
    and column_name = 'completed_at') then
    
    alter table public.tournaments 
    add column completed_at timestamp with time zone;
  end if;
end $$;