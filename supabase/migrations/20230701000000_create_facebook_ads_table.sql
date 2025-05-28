-- Create the facebook_ads table
CREATE TABLE IF NOT EXISTS facebook_ads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  prompt TEXT,
  content TEXT
);

-- Enable Row Level Security
ALTER TABLE facebook_ads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select their own ads
CREATE POLICY select_own_facebook_ads ON facebook_ads
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own ads
CREATE POLICY insert_own_facebook_ads ON facebook_ads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own ads
CREATE POLICY update_own_facebook_ads ON facebook_ads
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own ads
CREATE POLICY delete_own_facebook_ads ON facebook_ads
  FOR DELETE USING (auth.uid() = user_id);
