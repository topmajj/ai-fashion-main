-- Create the product_name_generators table
CREATE TABLE product_name_generators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_description TEXT NOT NULL,
    target_audience TEXT,
    industry TEXT,
    names TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE product_name_generators ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own product names
CREATE POLICY "Users can insert their own product names"
ON product_name_generators FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view their own product names
CREATE POLICY "Users can view their own product names"
ON product_name_generators FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Create policy to allow users to update their own product names
CREATE POLICY "Users can update their own product names"
ON product_name_generators FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own product names
CREATE POLICY "Users can delete their own product names"
ON product_name_generators FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Create an index on the user_id column for improved query performance
CREATE INDEX product_name_generators_user_id_idx ON product_name_generators (user_id);
