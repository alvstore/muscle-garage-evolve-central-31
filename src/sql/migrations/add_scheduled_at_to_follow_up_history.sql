-- Add scheduled_at field to follow_up_history table
ALTER TABLE public.follow_up_history ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

-- Add subject field to follow_up_history table (for scheduled follow-ups)
ALTER TABLE public.follow_up_history ADD COLUMN IF NOT EXISTS subject TEXT;

-- Modify status check constraint to include 'scheduled' status
ALTER TABLE public.follow_up_history DROP CONSTRAINT IF EXISTS follow_up_history_status_check;
ALTER TABLE public.follow_up_history ADD CONSTRAINT follow_up_history_status_check 
  CHECK (status = ANY (ARRAY['sent', 'delivered', 'read', 'failed', 'scheduled']));

-- Create index for scheduled follow-ups
CREATE INDEX IF NOT EXISTS idx_follow_up_history_scheduled_at ON public.follow_up_history(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_follow_up_history_status ON public.follow_up_history(status);

-- Update RLS policies to allow scheduled follow-ups management
-- First drop the policy if it exists to avoid errors
DROP POLICY IF EXISTS "Enable scheduled follow-ups management for staff and admin" ON public.follow_up_history;

-- Then create the policy
CREATE POLICY "Enable scheduled follow-ups management for staff and admin" 
ON public.follow_up_history
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = auth.uid() 
    AND (u.raw_user_meta_data->>'role' = 'admin' OR u.raw_user_meta_data->>'role' = 'staff')
  )
);
