-- Create trainer_schedules table
CREATE TABLE IF NOT EXISTS trainer_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES profiles(id),
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trainer_id, date, time_slot)
);

-- Create trainer_sessions table
CREATE TABLE IF NOT EXISTS trainer_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES profiles(id),
  member_id UUID REFERENCES profiles(id),
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT CHECK (status IN ('booked', 'cancelled', 'completed', 'no-show')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trainer_id, date, time_slot)
);

-- Create trainer_assignments table
CREATE TABLE IF NOT EXISTS trainer_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES profiles(id),
  member_id UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trainer_id, member_id)
);

-- Enable Row Level Security
ALTER TABLE trainer_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_assignments ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY admin_all_schedules ON trainer_schedules
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

CREATE POLICY admin_all_sessions ON trainer_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

CREATE POLICY admin_all_assignments ON trainer_assignments
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Staff can view all and manage sessions/assignments
CREATE POLICY staff_view_schedules ON trainer_schedules
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'staff'
  ));

CREATE POLICY staff_manage_sessions ON trainer_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'staff'
  ));

CREATE POLICY staff_manage_assignments ON trainer_assignments
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'staff'
  ));

-- Trainers can manage their own schedules and sessions
CREATE POLICY trainer_manage_schedules ON trainer_schedules
  FOR ALL
  TO authenticated
  USING (auth.uid() = trainer_id);

CREATE POLICY trainer_manage_sessions ON trainer_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = trainer_id);

CREATE POLICY trainer_view_assignments ON trainer_assignments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = trainer_id);

-- Members can view trainer schedules and their own sessions
CREATE POLICY member_view_schedules ON trainer_schedules
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trainer_assignments
      WHERE trainer_assignments.member_id = auth.uid()
      AND trainer_assignments.trainer_id = trainer_schedules.trainer_id
      AND trainer_assignments.is_active = true
    )
  );

CREATE POLICY member_view_sessions ON trainer_sessions
  FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX trainer_schedules_trainer_id_idx ON trainer_schedules(trainer_id);
CREATE INDEX trainer_schedules_date_idx ON trainer_schedules(date);
CREATE INDEX trainer_sessions_trainer_id_idx ON trainer_sessions(trainer_id);
CREATE INDEX trainer_sessions_member_id_idx ON trainer_sessions(member_id);
CREATE INDEX trainer_sessions_date_idx ON trainer_sessions(date);
CREATE INDEX trainer_assignments_trainer_id_idx ON trainer_assignments(trainer_id);
CREATE INDEX trainer_assignments_member_id_idx ON trainer_assignments(member_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_trainer_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at timestamp
CREATE TRIGGER trainer_schedules_updated_at
  BEFORE UPDATE ON trainer_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_trainer_updated_at();

CREATE TRIGGER trainer_sessions_updated_at
  BEFORE UPDATE ON trainer_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_trainer_updated_at();

CREATE TRIGGER trainer_assignments_updated_at
  BEFORE UPDATE ON trainer_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_trainer_updated_at();
