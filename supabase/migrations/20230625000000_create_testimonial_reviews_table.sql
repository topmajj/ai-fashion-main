-- Create the testimonial_reviews table
CREATE TABLE testimonial_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    product_features TEXT NOT NULL,
    customer_experience TEXT NOT NULL,
    testimonial TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE testimonial_reviews ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own testimonial reviews
CREATE POLICY "Users can insert their own testimonial reviews"
ON testimonial_reviews FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view their own testimonial reviews
CREATE POLICY "Users can view their own testimonial reviews"
ON testimonial_reviews FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Create policy to allow users to update their own testimonial reviews
CREATE POLICY "Users can update their own testimonial reviews"
ON testimonial_reviews FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own testimonial reviews
CREATE POLICY "Users can delete their own testimonial reviews"
ON testimonial_reviews FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Create an index on the user_id column for improved query performance
CREATE INDEX testimonial_reviews_user_id_idx ON testimonial_reviews (user_id);
