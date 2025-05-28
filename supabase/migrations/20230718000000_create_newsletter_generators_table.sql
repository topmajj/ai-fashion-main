CREATE TABLE newsletter_generators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  target_audience TEXT,
  call_to_action TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on user_id for faster queries
CREATE INDEX newsletter_generators_user_id_idx ON newsletter_generators(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE newsletter_generators ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to select only their own records
CREATE POLICY select_own_newsletters ON newsletter_generators
  FOR SELECT USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own records
CREATE POLICY insert_own_newsletters ON newsletter_generators
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update only their own records
CREATE POLICY update_own_newsletters ON newsletter_generators
  FOR UPDATE USING (auth.uid() = user_id);

-- Create a policy that allows users to delete only their own records
CREATE POLICY delete_own_newsletters ON newsletter_generators
  FOR DELETE USING (auth.uid() = user_id);
