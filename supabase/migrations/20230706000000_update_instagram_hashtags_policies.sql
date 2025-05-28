-- Ensure the table exists (this won't do anything if it already exists)
CREATE TABLE IF NOT EXISTS instagram_hashtags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  topic TEXT NOT NULL,
  niche TEXT,
  number_of_hashtags INTEGER NOT NULL,
  hashtags TEXT NOT NULL
);

-- Enable Row Level Security (if not already enabled)
ALTER TABLE instagram_hashtags ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS insert_own_hashtags ON instagram_hashtags;
DROP POLICY IF EXISTS select_own_hashtags ON instagram_hashtags;
DROP POLICY IF EXISTS delete_own_hashtags ON instagram_hashtags;

-- Create or replace policies
CREATE POLICY insert_own_hashtags ON instagram_hashtags FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY select_own_hashtags ON instagram_hashtags FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY delete_own_hashtags ON instagram_hashtags FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_instagram_hashtags_user_id ON instagram_hashtags(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_hashtags_created_at ON instagram_hashtags(created_at);
