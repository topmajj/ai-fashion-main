-- Create the blog_sections table
CREATE TABLE blog_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    keywords TEXT,
    tone TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE blog_sections ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own blog sections
CREATE POLICY "Users can insert their own blog sections"
ON blog_sections FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view their own blog sections
CREATE POLICY "Users can view their own blog sections"
ON blog_sections FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Create policy to allow users to update their own blog sections
CREATE POLICY "Users can update their own blog sections"
ON blog_sections
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own blog sections
CREATE POLICY "Users can delete their own blog sections"
ON blog_sections FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Create an index on the user_id column for improved query performance
CREATE INDEX blog_sections_user_id_idx ON blog_sections (user_id);
