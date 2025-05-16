-- Create workout_plans table
CREATE TABLE IF NOT EXISTS workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  trainer_id UUID NOT NULL,
  member_id UUID,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  is_global BOOLEAN DEFAULT false,
  is_custom BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY admin_all ON workout_plans
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Staff can view all plans
CREATE POLICY staff_view ON workout_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'staff'
  ));

-- Trainers can view and manage their own plans
CREATE POLICY trainer_manage_own_plans ON workout_plans
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = trainer_id
  )
  WITH CHECK (
    auth.uid() = trainer_id
  );

-- Members can view their assigned plans and global plans
CREATE POLICY member_view_plans ON workout_plans
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = member_id OR
    is_global = true
  );

-- Create index for faster queries
CREATE INDEX workout_plans_member_id_idx ON workout_plans(member_id) WHERE member_id IS NOT NULL;
CREATE INDEX workout_plans_trainer_id_idx ON workout_plans(trainer_id);
CREATE INDEX workout_plans_is_global_idx ON workout_plans(is_global) WHERE is_global = true;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_workout_plan_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE TRIGGER workout_plan_updated_at
  BEFORE UPDATE ON workout_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_workout_plan_updated_at();
