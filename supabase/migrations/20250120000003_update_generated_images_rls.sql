-- Drop existing policies on the generated_images table
DROP POLICY IF EXISTS "Allow authenticated users to insert and read own records" ON "public"."generated_images";

-- Create a new policy to allow authenticated users to insert and read their own records
CREATE POLICY "Allow authenticated users to insert and read own records" 
ON "public"."generated_images"
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Enable RLS on the generated_images table (in case it wasn't enabled before)
ALTER TABLE "public"."generated_images" ENABLE ROW LEVEL SECURITY;
