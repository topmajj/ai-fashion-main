-- Create the youtube_video_tags table
CREATE TABLE youtube_video_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    keywords TEXT NOT NULL,
    tags TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add a foreign key constraint to link with the users table
ALTER TABLE youtube_video_tags
ADD CONSTRAINT fk_youtube_video_tags_user
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Create an index on user_id for faster queries
CREATE INDEX idx_youtube_video_tags_user_id ON youtube_video_tags(user_id);

-- Enable Row Level Security
ALTER TABLE youtube_video_tags ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to see only their own tags
CREATE POLICY "Users can view their own tags" ON youtube_video_tags
FOR SELECT USING (auth.uid() = user_id);

-- Create a policy to allow users to insert their own tags
CREATE POLICY "Users can insert their own tags" ON youtube_video_tags
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a policy to allow users to update their own tags
CREATE POLICY "Users can update their own tags" ON youtube_video_tags
FOR UPDATE USING (auth.uid() = user_id);

-- Create a policy to allow users to delete their own tags
CREATE POLICY "Users can delete their own tags" ON youtube_video_tags
FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to call the update_modified_column function
CREATE TRIGGER update_youtube_video_tags_modtime
BEFORE UPDATE ON youtube_video_tags
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
