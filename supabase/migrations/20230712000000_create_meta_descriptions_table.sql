-- Create meta_descriptions table
CREATE TABLE meta_descriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  page_title TEXT NOT NULL,
  keywords TEXT,
  page_content TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE meta_descriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to-- Create policy to allow users to read their own meta descriptions
CREATE POLICY "Users can read own meta descriptions" ON meta_descriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own meta descriptions
CREATE POLICY "Users can insert own meta descriptions" ON meta_descriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own meta descriptions
CREATE POLICY "Users can update own meta descriptions" ON meta_descriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own meta descriptions
CREATE POLICY "Users can delete own meta descriptions" ON meta_descriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Create index on user_id for faster queries
CREATE INDEX meta_descriptions_user_id_idx ON meta_descriptions (user_id);

-- Create index on created_at for faster sorting
CREATE INDEX meta_descriptions_created_at_idx ON meta_descriptions (created_at DESC);
