-- Create the grammar_corrections table
CREATE TABLE grammar_corrections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  corrected_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE grammar_corrections ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to see only their own corrections
CREATE POLICY "Users can view their own corrections" ON grammar_corrections
  FOR SELECT USING (auth.uid() = user_id);

-- Create a policy to allow users to insert their own corrections
CREATE POLICY "Users can insert their own corrections" ON grammar_corrections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a policy to allow users to delete their own corrections
CREATE POLICY "Users can delete their own corrections" ON grammar_corrections
  FOR DELETE USING (auth.uid() = user_id);

-- Create an index on user_id for faster queries
CREATE INDEX grammar_corrections_user_id_idx ON grammar_corrections (user_id);
