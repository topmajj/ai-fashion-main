CREATE TABLE email_answer_generators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_email TEXT NOT NULL,
  tone TEXT,
  additional_info TEXT,
  generated_answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on user_id for faster queries
CREATE INDEX email_answer_generators_user_id_idx ON email_answer_generators(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE email_answer_generators ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to select only their own records
CREATE POLICY "Users can view own email_answer_generators" ON email_answer_generators FOR SELECT
  USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own records
CREATE POLICY "Users can insert own email_answer_generators" ON email_answer_generators FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update their own records
CREATE POLICY "Users can update own email_answer_generators" ON email_answer_generators FOR UPDATE
  USING (auth.uid() = user_id);

-- Create a policy that allows users to delete their own records
CREATE POLICY "Users can delete own email_answer_generators" ON email_answer_generators FOR DELETE
  USING (auth.uid() = user_id);
