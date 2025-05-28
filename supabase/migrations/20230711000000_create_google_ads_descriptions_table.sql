-- Create the google_ads_descriptions table
CREATE TABLE google_ads_descriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_name TEXT NOT NULL,
    key_features TEXT NOT NULL,
    target_audience TEXT,
    call_to_action TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies
ALTER TABLE google_ads_descriptions ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own descriptions
CREATE POLICY "Users can insert their own descriptions"
ON google_ads_descriptions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to view their own descriptions
CREATE POLICY "Users can view their own descriptions"
ON google_ads_descriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create an index on user_id for faster queries
CREATE INDEX google_ads_descriptions_user_id_idx ON google_ads_descriptions (user_id);
