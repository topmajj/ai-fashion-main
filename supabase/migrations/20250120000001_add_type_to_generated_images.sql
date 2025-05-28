-- Add type column to generated_images table
ALTER TABLE generated_images
ADD COLUMN IF NOT EXISTS type TEXT;
