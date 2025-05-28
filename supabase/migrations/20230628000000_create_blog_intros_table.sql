-- Create the blog_intros table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_intros (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  blog_title TEXT,
  target_audience TEXT,
  tone TEXT,
  intro TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_intros' AND column_name = 'blog_title') THEN
    ALTER TABLE blog_intros ADD COLUMN blog_title TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_intros' AND column_name = 'target_audience') THEN
    ALTER TABLE blog_intros ADD COLUMN target_audience TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_intros' AND column_name = 'tone') THEN
    ALTER TABLE blog_intros ADD COLUMN tone TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_intros' AND column_name = 'intro') THEN
    ALTER TABLE blog_intros ADD COLUMN intro TEXT;
  END IF;
END $$;

-- Create an index on the user_id column for faster queries if it doesn't exist
CREATE INDEX IF NOT EXISTS blog_intros_user_id_idx ON blog_intros(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE blog_intros ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$
BEGIN
  -- Create a policy that allows users to select only their own blog intros
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blog_intros' AND policyname = 'select_own_blog_intros'
  ) THEN
    CREATE POLICY select_own_blog_intros ON blog_intros
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  -- Create a policy that allows users to insert their own blog intros
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blog_intros' AND policyname = 'insert_own_blog_intros'
  ) THEN
    CREATE POLICY insert_own_blog_intros ON blog_intros
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Create a policy that allows users to update only their own blog intros
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blog_intros' AND policyname = 'update_own_blog_intros'
  ) THEN
    CREATE POLICY update_own_blog_intros ON blog_intros
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Create a policy that allows users to delete only their own blog intros
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blog_intros' AND policyname = 'delete_own_blog_intros'
  ) THEN
    CREATE POLICY delete_own_blog_intros ON blog_intros
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END
$$;
