-- Create the product_descriptions table
CREATE TABLE product_descriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    product_name TEXT NOT NULL,
    product_features TEXT NOT NULL,
    target_audience TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE product_descriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own product descriptions
CREATE POLICY "Users can insert their own product descriptions"
ON product_descriptions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view their own product descriptions
CREATE POLICY "Users can view their own product descriptions"
ON product_descriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create policy to allow users to update their own product descriptions
CREATE POLICY "Users can update their own product descriptions"
ON product_descriptions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own product descriptions
CREATE POLICY "Users can delete their own product descriptions"
ON product_descriptions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create an index on user_id for better query performance
CREATE INDEX idx_product_descriptions_user_id ON product_descriptions(user_id);
