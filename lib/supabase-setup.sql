-- Run this SQL in your Supabase SQL editor to set up the required tables and functions

-- Function to create the notifications table if it doesn't exist
create or replace function create_notifications_if_not_exists()
returns void as $$
begin
  create table if not exists notifications (
    id uuid default uuid_generate_v4() primary key,
    email text not null unique,
    created_at timestamp with time zone default now() not null
  );
end;
$$ language plpgsql security definer;

-- Function to create the waitlist table if it doesn't exist
create or replace function create_waitlist_if_not_exists()
returns void as $$
begin
  create table if not exists waitlist (
    id uuid default uuid_generate_v4() primary key,
    school_name text not null,
    email text not null unique,
    discount integer default 50 not null,
    created_at timestamp with time zone default now() not null
  );
end;
$$ language plpgsql security definer;

-- Function to create the sent_notifications table if it doesn't exist
create or replace function create_sent_notifications_if_not_exists()
returns void as $$
begin
  create table if not exists sent_notifications (
    id uuid default uuid_generate_v4() primary key,
    message text not null,
    recipients_count integer not null,
    sent_at timestamp with time zone default now() not null
  );
end;
$$ language plpgsql security definer;

-- Create the tables
select create_notifications_if_not_exists();
select create_waitlist_if_not_exists();
select create_sent_notifications_if_not_exists();

-- Set up row level security policies
alter table notifications enable row level security;
alter table waitlist enable row level security;
alter table sent_notifications enable row level security;

-- Create policies that allow the service role to do anything
create policy "Service role can do anything with notifications"
on notifications for all using (auth.role() = 'service_role');

create policy "Service role can do anything with waitlist"
on waitlist for all using (auth.role() = 'service_role');

create policy "Service role can do anything with sent_notifications"
on sent_notifications for all using (auth.role() = 'service_role');

