-- This file is for reference only and doesn't need to be executed directly
-- Supabase will create these tables automatically when you use the actions.ts file

-- Table for notification subscribers (just email)
create table notifications (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  created_at timestamp with time zone default now() not null
);

-- Table for waitlist entries (school name and email with 50% discount)
create table waitlist (
  id uuid default uuid_generate_v4() primary key,
  school_name text not null,
  email text not null unique,
  discount integer default 50 not null,
  created_at timestamp with time zone default now() not null
);

-- Table to track sent notifications
create table sent_notifications (
  id uuid default uuid_generate_v4() primary key,
  message text not null,
  recipients_count integer not null,
  sent_at timestamp with time zone default now() not null
);

