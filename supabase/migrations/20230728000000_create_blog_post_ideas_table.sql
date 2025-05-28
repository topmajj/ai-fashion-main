CREATE TABLE IF NOT EXISTS blog_post_ideas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  target_audience TEXT,
  number_of_ideas INTEGER NOT NULL,
  ideas TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS blog_post_ideas_user_id_idx ON blog_post_ideas(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE blog_post_ideas ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to select their own blog post ideas
CREATE POLICY select_own_blog_post_ideas ON blog_post_ideas
  FOR SELECT USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own blog post ideas
CREATE POLICY insert_own_blog_post_ideas ON blog_post_ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update their own blog post ideas
CREATE POLICY update_own_blog_post_ideas ON blog_post_ideas
  FOR UPDATE USING (auth.uid() = user_id);

-- Create a policy that allows users to delete their own blog post ideas
CREATE POLICY delete_own_blog_post_ideas ON blog_post_ideas
  FOR DELETE USING (auth.uid() = user_id);
