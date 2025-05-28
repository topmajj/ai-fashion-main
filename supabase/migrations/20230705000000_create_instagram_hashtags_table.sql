-- Create instagram_hashtags table
CREATE TABLE IF NOT EXISTS instagram_hashtags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  topic TEXT NOT NULL,
  niche TEXT,
  number_of_hashtags INTEGER NOT NULL,
  hashtags TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE instagram_hashtags ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own hashtags
CREATE POLICY insert_own_hashtags ON instagram_hashtags FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view their own hashtags
CREATE POLICY select_own_hashtags ON instagram_hashtags FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own hashtags
CREATE POLICY delete_own_hashtags ON instagram_hashtags FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_instagram_hashtags_user_id ON instagram_hashtags(user_id);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_instagram_hashtags_created_at ON instagram_hashtags(created_at);
