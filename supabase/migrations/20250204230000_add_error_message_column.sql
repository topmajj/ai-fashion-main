-- Add error_message column to generated_images table
ALTER TABLE generated_images
ADD COLUMN IF NOT EXISTS error_message TEXT;
