-- Add missing columns to generated_images table
ALTER TABLE generated_images
ADD COLUMN IF NOT EXISTS mask_image TEXT,
ADD COLUMN IF NOT EXISTS original_image TEXT;
