-- Create the blog_conclusions table
CREATE TABLE IF NOT EXISTS blog_conclusions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  topic TEXT,
  tone TEXT,
  conclusion TEXT
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS blog_conclusions_user_id_idx ON blog_conclusions(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE blog_conclusions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own blog conclusions"
  ON blog_conclusions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own blog conclusions"
  ON blog_conclusions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own blog conclusions"
  ON blog_conclusions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog conclusions"
  ON blog_conclusions FOR DELETE
  USING (auth.uid() = user_id);
