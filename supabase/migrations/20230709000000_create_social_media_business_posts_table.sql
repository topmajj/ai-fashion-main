-- Create the social_media_business_posts table
CREATE TABLE social_media_business_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  post_type TEXT NOT NULL,
  key_message TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Set up Row Level Security (RLS)
ALTER TABLE social_media_business_posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own posts
CREATE POLICY "Users can insert their own posts" ON social_media_business_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view their own posts
CREATE POLICY "Users can view their own posts" ON social_media_business_posts FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to update their own posts
CREATE POLICY "Users can update their own posts" ON social_media_business_posts FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own posts
CREATE POLICY "Users can delete their own posts" ON social_media_business_posts FOR DELETE USING (auth.uid() = user_id);

-- Create index on user_id for faster queries
CREATE INDEX social_media_business_posts_user_id_idx ON social_media_business_posts (user_id);
