-- Create the pas_frameworks table
CREATE TABLE pas_frameworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    problem TEXT NOT NULL,
    target_audience TEXT,
    solution TEXT NOT NULL,
    generated_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE pas_frameworks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own PAS frameworks
CREATE POLICY "Users can insert their own PAS frameworks"
ON pas_frameworks FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view their own PAS frameworks
CREATE POLICY "Users can view their own PAS frameworks"
ON pas_frameworks FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Create policy to allow users to update their own PAS frameworks
CREATE POLICY "Users can update their own PAS frameworks"
ON pas_frameworks FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own PAS frameworks
CREATE POLICY "Users can delete their own PAS frameworks"
ON pas_frameworks FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Create an index on the user_id column for improved query performance
CREATE INDEX pas_frameworks_user_id_idx ON pas_frameworks (user_id);
