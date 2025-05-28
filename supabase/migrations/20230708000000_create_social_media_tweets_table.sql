-- Create the social_media_tweets table
CREATE TABLE social_media_tweets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    tone TEXT,
    keywords TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE social_media_tweets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own tweets
CREATE POLICY "Users can view their own tweets" ON social_media_tweets
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own tweets
CREATE POLICY "Users can insert their own tweets" ON social_media_tweets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own tweets
CREATE POLICY "Users can update their own tweets" ON social_media_tweets
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own tweets
CREATE POLICY "Users can delete their own tweets" ON social_media_tweets
    FOR DELETE USING (auth.uid() = user_id);

-- Create index on user_id for faster queries
CREATE INDEX idx_social_media_tweets_user_id ON social_media_tweets(user_id);

-- Create index on created_at for faster sorting
CREATE INDEX idx_social_media_tweets_created_at ON social_media_tweets(created_at);
