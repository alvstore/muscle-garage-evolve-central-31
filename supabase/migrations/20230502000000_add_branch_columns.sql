
-- Add new columns to the branches table for multi-branch architecture
ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS max_capacity integer;

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS region text;

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS timezone text;

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS tax_rate numeric;
