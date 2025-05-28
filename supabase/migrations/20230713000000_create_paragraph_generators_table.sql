-- Create the paragraph_generators table if it doesn't exist
CREATE TABLE IF NOT EXISTS paragraph_generators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT,
  keywords TEXT,
  tone TEXT,
  paragraph_length TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on the user_id column for faster queries if it doesn't exist
CREATE INDEX IF NOT EXISTS paragraph_generators_user_id_idx ON paragraph_generators(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE paragraph_generators ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$
BEGIN
  -- Create a policy that allows users to select only their own paragraphs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'paragraph_generators' AND policyname = 'select_own_paragraphs'
  ) THEN
    CREATE POLICY select_own_paragraphs ON paragraph_generators
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  -- Create a policy that allows users to insert their own paragraphs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'paragraph_generators' AND policyname = 'insert_own_paragraphs'
  ) THEN
    CREATE POLICY insert_own_paragraphs ON paragraph_generators
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Create a policy that allows users to update only their own paragraphs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'paragraph_generators' AND policyname = 'update_own_paragraphs'
  ) THEN
    CREATE POLICY update_own_paragraphs ON paragraph_generators
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Create a policy that allows users to delete only their own paragraphs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'paragraph_generators' AND policyname = 'delete_own_paragraphs'
  ) THEN
    CREATE POLICY delete_own_paragraphs ON paragraph_generators
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END
$$;
