-- Create custom_generations table
CREATE TABLE custom_generations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE custom_generations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select their own custom generations
CREATE POLICY select_own_custom_generations ON custom_generations
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own custom generations
CREATE POLICY insert_own_custom_generations ON custom_generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own custom generations
CREATE POLICY delete_own_custom_generations ON custom_generations
    FOR DELETE USING (auth.uid() = user_id);

-- Create index on user_id for faster queries
CREATE INDEX custom_generations_user_id_idx ON custom_generations(user_id);
