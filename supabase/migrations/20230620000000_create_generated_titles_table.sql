-- Create the generated_titles table
CREATE TABLE generated_titles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic TEXT NOT NULL,
  keywords TEXT,
  brevity TEXT NOT NULL,
  titles TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Add RLS policies
ALTER TABLE generated_titles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own titles
CREATE POLICY "Users can insert their own titles" ON generated_titles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to view their own titles
CREATE POLICY "Users can view their own titles" ON generated_titles FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to update their own titles
CREATE POLICY "Users can update their own titles" ON generated_titles FOR UPDATE USING (auth.uid() = user_id);

-- Policy to allow users to delete their own titles
CREATE POLICY "Users can delete their own titles" ON generated_titles FOR DELETE USING (auth.uid() = user_id);

-- Create an index on user_id for faster queries
CREATE INDEX idx_generated_titles_user_id ON generated_titles(user_id);
