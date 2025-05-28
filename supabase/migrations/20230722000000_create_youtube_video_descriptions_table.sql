-- Create the youtube_video_descriptions table
CREATE TABLE youtube_video_descriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  video_title TEXT NOT NULL,
  keywords TEXT,
  tone TEXT,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on the user_id column for faster queries
CREATE INDEX youtube_video_descriptions_user_id_idx ON youtube_video_descriptions(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE youtube_video_descriptions ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to select only their own descriptions
CREATE POLICY "Users can view their own descriptions"
  ON youtube_video_descriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own descriptions
CREATE POLICY "Users can insert their own descriptions"
  ON youtube_video_descriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update their own descriptions
CREATE POLICY "Users can update their own descriptions"
  ON youtube_video_descriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create a policy that allows users to delete their own descriptions
CREATE POLICY "Users can delete their own descriptions"
  ON youtube_video_descriptions
  FOR DELETE
  USING (auth.uid() = user_id);
