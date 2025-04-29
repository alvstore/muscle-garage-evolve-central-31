-- Example RLS policy for members table
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own data
CREATE POLICY "Users can view own data"
ON public.members
FOR SELECT
USING (auth.uid() = user_id);

-- Allow staff to view members in their branch
CREATE POLICY "Staff can view branch members"
ON public.members
FOR SELECT
USING (
  branch_id IN (
    SELECT branch_id FROM profiles
    WHERE id = auth.uid() AND (role = 'staff' OR role = 'admin')
  )
);

-- Allow trainers to view assigned members
CREATE POLICY "Trainers can view assigned members"
ON public.members
FOR SELECT
USING (
  id IN (
    SELECT member_id FROM trainer_assignments
    WHERE trainer_id = auth.uid() AND is_active = true
  )
);