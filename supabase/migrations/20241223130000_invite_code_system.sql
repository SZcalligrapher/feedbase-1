-- Create invite_codes table
create table if not exists invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  valid_date date not null unique,
  created_at timestamptz default now()
);

-- Create function to generate daily invite code
create or replace function generate_daily_invite_code()
returns void
language plpgsql
as $$
declare
  new_code text;
begin
  -- Generate random invite code (8 characters, uppercase)
  new_code := upper(
    substr(md5(random()::text), 1, 8)
  );

  -- Delete today's existing invite code (idempotent)
  delete from invite_codes
  where valid_date = current_date;

  -- Insert today's invite code
  insert into invite_codes (code, valid_date)
  values (new_code, current_date);
end;
$$;

-- Enable RLS
alter table invite_codes enable row level security;

-- Create policy: only allow reading today's invite code
create policy "allow read today invite"
on invite_codes
for select
using (valid_date = current_date);

-- Enable pg_cron extension
create extension if not exists pg_cron;

-- Schedule daily job to generate invite code at 00:00 UTC (08:00 Beijing time)
-- If you want Beijing time 00:00, use '0 16 * * *' instead
select cron.schedule(
  'daily_invite_code_job',
  '0 0 * * *',
  $$select generate_daily_invite_code();$$
);

-- Generate initial invite code for today
select generate_daily_invite_code();

