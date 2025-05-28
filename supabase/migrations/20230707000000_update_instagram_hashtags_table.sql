-- Add the missing number_of_hashtags column
ALTER TABLE instagram_hashtags
ADD COLUMN IF NOT EXISTS number_of_hashtags INTEGER;

-- Update existing rows to set a default value for number_of_hashtags
UPDATE instagram_hashtags
SET number_of_hashtags = array_length(hashtags, 1)
WHERE number_of_hashtags IS NULL;

-- Add a NOT NULL constraint to number_of_hashtags
ALTER TABLE instagram_hashtags
ALTER COLUMN number_of_hashtags SET NOT NULL;

-- Ensure RLS is enabled
ALTER TABLE instagram_hashtags ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own hashtags" ON instagram_hashtags;
DROP POLICY IF EXISTS "Users can view their own hashtags" ON instagram_hashtags;
DROP POLICY IF EXISTS "Users can delete their own hashtags" ON instagram_hashtags;

-- Create policies
CREATE POLICY "Users can insert their own hashtags"
ON instagram_hashtags FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own hashtags"
ON instagram_hashtags FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hashtags"
ON instagram_hashtags FOR DELETE
USING (auth.uid() = user_id);

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_instagram_hashtags_user_id ON instagram_hashtags(user_id);
