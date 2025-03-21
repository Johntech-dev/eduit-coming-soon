-- Add phone_number column to waitlist table
ALTER TABLE IF EXISTS public.waitlist
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Update the create_waitlist_if_not_exists function to include phone_number
CREATE OR REPLACE FUNCTION public.create_waitlist_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'waitlist') THEN
        CREATE TABLE public.waitlist (
            id BIGSERIAL PRIMARY KEY,
            school_name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone_number TEXT,
            discount INTEGER DEFAULT 50,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
    END IF;
END;
$$; 