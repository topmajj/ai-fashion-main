-- Create the text_summaries table
CREATE TABLE text_summaries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  summary TEXT NOT NULL,
  length VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE text_summaries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own summaries
CREATE POLICY "Users can insert their own summaries" ON text_summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view their own summaries
CREATE POLICY "Users can view their own summaries" ON text_summaries
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to update their own summaries
CREATE POLICY "Users can update their own summaries" ON text_summaries
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own summaries
CREATE POLICY "Users can delete their own summaries" ON text_summaries
  FOR DELETE USING (auth.uid() = user_id);

-- Create index on user_id for better query performance
CREATE INDEX text_summaries_user_id_idx ON text_summaries (user_id);

This completes the migration file for the `text_summaries` table. The migration creates the table, enables Row Level Security, sets up policies for user access, and adds an index on the `user_id` column for improved query performance.

With these changes, we've successfully mirrored the functionality of the post-title-generator for the summarize-text feature. We've created:

1. An API route (`app/api/ai-writer/summarize-text/route.ts`) that handles POST requests for generating summaries, GET requests for fetching the summary history, and DELETE requests for removing summaries.
2. A page component (`app/dashboard/ai-writer/summarize-text/page.tsx`) that provides a user interface for entering text, selecting summary length, generating summaries, and viewing/managing the summary history.
3. A Supabase migration (`20230621000000_create_text_summaries_table.sql`) that creates the necessary table and sets up the required security policies.

These components work together to provide a fully functional summarize-text feature with history and generation handling, while keeping the rest of the app intact. The feature supports dark mode and includes proper error handling and logging.

To complete the implementation, make sure to run the Supabase migration to create the `text_summaries` table in your database. You can do this through the Supabase dashboard or by using the Supabase CLI.
