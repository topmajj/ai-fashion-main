-- Create pros_cons table
CREATE TABLE pros_cons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  context TEXT,
  number_of_points INTEGER NOT NULL,
  pros TEXT[] NOT NULL,
  cons TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies
ALTER TABLE pros_cons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own pros_cons"
  ON pros_cons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own pros_cons"
  ON pros_cons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own pros_cons"
  ON pros_cons FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pros_cons"
  ON pros_cons FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX pros_cons_user_id_idx ON pros_cons(user_id);
