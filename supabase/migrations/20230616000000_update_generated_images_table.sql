-- Add status column to generated_images table
ALTER TABLE generated_images
ADD COLUMN status TEXT NOT NULL DEFAULT 'completed';

-- Update existing rows to have 'completed' status
UPDATE generated_images
SET status = 'completed'
WHERE status IS NULL;
