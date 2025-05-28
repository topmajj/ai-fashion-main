-- Create the generated_articles table
CREATE TABLE generated_articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    topic TEXT NOT NULL,
    keywords TEXT,
    word_count INTEGER NOT NULL,
    article TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE generated_articles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own articles
CREATE POLICY "Users can insert their own articles" ON generated_articles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view their own articles
CREATE POLICY "Users can view their own articles" ON generated_articles FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to update their own articles
CREATE POLICY "Users can update their own articles" ON generated_articles FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own articles
CREATE POLICY "Users can delete their own articles" ON generated_articles FOR DELETE USING (auth.uid() = user_id);

-- Create index on user_id for faster queries
CREATE INDEX idx_generated_articles_user_id ON generated_articles(user_id);
