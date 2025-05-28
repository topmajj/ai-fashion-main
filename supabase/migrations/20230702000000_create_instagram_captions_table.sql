CREATE TABLE instagram_captions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  topic TEXT NOT NULL,
  mood TEXT,
  caption TEXT NOT NULL
);

-- Add RLS policies
ALTER TABLE instagram_captions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own instagram captions"
  ON instagram_captions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own instagram captions"
  ON instagram_captions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own instagram captions"
  ON instagram_captions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own instagram captions"
  ON instagram_captions FOR DELETE
  USING (auth.uid() = user_id);
