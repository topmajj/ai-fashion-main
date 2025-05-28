-- Create the youtube_video_titles table
CREATE TABLE youtube_video_titles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  keywords TEXT NOT NULL,
  tone TEXT,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on the user_id column for faster queries
CREATE INDEX youtube_video_titles_user_id_idx ON youtube_video_titles(user_id);

-- Enable Row Level Security
ALTER TABLE youtube_video_titles ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to select only their own records
CREATE POLICY select_own_youtube_video_titles ON youtube_video_titles
  FOR SELECT USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own records
CREATE POLICY insert_own_youtube_video_titles ON youtube_video_titles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update only their own records
CREATE POLICY update_own_youtube_video_titles ON youtube_video_titles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create a policy that allows users to delete only their own records
CREATE POLICY delete_own_youtube_video_titles ON youtube_video_titles
  FOR DELETE USING (auth.uid() = user_id);
