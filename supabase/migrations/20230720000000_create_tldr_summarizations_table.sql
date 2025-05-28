-- Create the tldr_summarizations table
CREATE TABLE tldr_summarizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on the user_id column for faster queries
CREATE INDEX tldr_summarizations_user_id_idx ON tldr_summarizations(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE tldr_summarizations ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to select only their own summaries
CREATE POLICY "Users can view their own summaries" ON tldr_summarizations
  FOR SELECT USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own summaries
CREATE POLICY "Users can insert their own summaries" ON tldr_summarizations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update their own summaries
CREATE POLICY "Users can update their own summaries" ON tldr_summarizations
  FOR UPDATE USING (auth.uid() = user_id);

-- Create a policy that allows users to delete their own summaries
CREATE POLICY "Users can delete their own summaries" ON tldr_summarizations
  FOR DELETE USING (auth.uid() = user_id);
