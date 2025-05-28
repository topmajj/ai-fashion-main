-- Check if columns exist and add them if they don't
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'instagram_captions' AND column_name = 'mood') THEN
        ALTER TABLE instagram_captions ADD COLUMN mood TEXT;
    END IF;
END $$;

-- Ensure the table has the correct primary key and foreign key
ALTER TABLE instagram_captions
    ALTER COLUMN id SET DEFAULT uuid_generate_v4(),
    ALTER COLUMN user_id SET NOT NULL,
    ALTER COLUMN created_at SET DEFAULT TIMEZONE('utc'::text, NOW()),
    ALTER COLUMN topic SET NOT NULL,
    ALTER COLUMN caption SET NOT NULL;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'instagram_captions_user_id_fkey') THEN
        ALTER TABLE instagram_captions
        ADD CONSTRAINT instagram_captions_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE instagram_captions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any) and recreate them
DROP POLICY IF EXISTS "Users can insert their own instagram captions" ON instagram_captions;
DROP POLICY IF EXISTS "Users can view their own instagram captions" ON instagram_captions;
DROP POLICY IF EXISTS "Users can update their own instagram captions" ON instagram_captions;
DROP POLICY IF EXISTS "Users can delete their own instagram captions" ON instagram_captions;

-- Recreate policies
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
