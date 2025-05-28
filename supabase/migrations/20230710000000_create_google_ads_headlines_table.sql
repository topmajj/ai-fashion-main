-- Create the google_ads_headlines table
CREATE TABLE google_ads_headlines (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    key_features TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    number_of_headlines INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the user_id column for faster queries
CREATE INDEX idx_google_ads_headlines_user_id ON google_ads_headlines(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE google_ads_headlines ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to select only their own records
CREATE POLICY select_own_google_ads_headlines ON google_ads_headlines
    FOR SELECT USING (auth.uid() = user_id);

-- Create a policy that allows users to insert only their own records
CREATE POLICY insert_own_google_ads_headlines ON google_ads_headlines
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update only their own records
CREATE POLICY update_own_google_ads_headlines ON google_ads_headlines
    FOR UPDATE USING (auth.uid() = user_id);

-- Create a policy that allows users to delete only their own records
CREATE POLICY delete_own_google_ads_headlines ON google_ads_headlines
    FOR DELETE USING (auth.uid() = user_id);
