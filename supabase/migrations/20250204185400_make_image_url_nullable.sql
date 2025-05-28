-- Make image_url column nullable
ALTER TABLE generated_images
ALTER COLUMN image_url DROP NOT NULL;
