CREATE TABLE faq_generators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic TEXT NOT NULL,
  context TEXT,
  number_of_questions INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create an index on user_id for faster queries
CREATE INDEX idx_faq_generators_user_id ON faq_generators(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE faq_generators ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to select only their own records
CREATE POLICY select_own_faq_generators ON faq_generators FOR SELECT
  USING (auth.uid() = user_id);

-- Create a policy that allows users to insert only their own records
CREATE POLICY insert_own_faq_generators ON faq_generators FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update only their own records
CREATE POLICY update_own_faq_generators ON faq_generators FOR UPDATE
  USING (auth.uid() = user_id);

-- Create a policy that allows users to delete only their own records
CREATE POLICY delete_own_faq_generators ON faq_generators FOR DELETE
  USING (auth.uid() = user_id);
