-- Create the facebook_headlines table
CREATE TABLE facebook_headlines (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    topic TEXT NOT NULL,
    keywords TEXT,
    tone TEXT,
    headlines TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE facebook_headlines ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to see only their own headlines
CREATE POLICY "Users can view their own headlines" ON facebook_headlines
    FOR SELECT USING (auth.uid() = user_id);

-- Create a policy to allow users to insert their own headlines
CREATE POLICY "Users can insert their own headlines" ON facebook_headlines
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a policy to allow users to update their own headlines
CREATE POLICY "Users can update their own headlines" ON facebook_headlines
    FOR UPDATE USING (auth.uid() = user_id);

-- Create a policy to allow users to delete their own headlines
CREATE POLICY "Users can delete their own headlines" ON facebook_headlines
    FOR DELETE USING (auth.uid() = user_id);

-- Create an index on user_id for faster queries
CREATE INDEX idx_facebook_headlines_user_id ON facebook_headlines(user_id);

-- Create an index on created_at for faster sorting
CREATE INDEX idx_facebook_headlines_created_at ON facebook_headlines(created_at);
