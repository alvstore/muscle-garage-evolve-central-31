
-- Note: This file is for reference only and should be executed through the Supabase SQL editor

-- Create branches table if it doesn't exist
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  manager_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create classes table if it doesn't exist
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  trainer_id UUID REFERENCES auth.users(id),
  branch_id UUID REFERENCES branches(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create class_bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS class_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id),
  member_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'confirmed',
  attended BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add branch_id to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'branch_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN branch_id UUID REFERENCES branches(id);
  END IF;
END $$;

-- Add RLS policies for branches
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage branches" ON branches;
CREATE POLICY "Admins can manage branches"
ON branches
USING (auth.role() = 'admin')
WITH CHECK (auth.role() = 'admin');

-- Add RLS policies for classes
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage classes" ON classes;
CREATE POLICY "Admins can manage classes"
ON classes
USING (auth.role() = 'admin')
WITH CHECK (auth.role() = 'admin');

DROP POLICY IF EXISTS "Branch managers can manage their branch classes" ON classes;
CREATE POLICY "Branch managers can manage their branch classes"
ON classes
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_branch_manager = true
    AND profiles.branch_id = classes.branch_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_branch_manager = true
    AND profiles.branch_id = classes.branch_id
  )
);

-- Add RLS policies for class_bookings
ALTER TABLE class_bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage class bookings" ON class_bookings;
CREATE POLICY "Admins can manage class bookings"
ON class_bookings
USING (auth.role() = 'admin')
WITH CHECK (auth.role() = 'admin');

DROP POLICY IF EXISTS "Members can manage their own bookings" ON class_bookings;
CREATE POLICY "Members can manage their own bookings"
ON class_bookings
USING (member_id = auth.uid())
WITH CHECK (member_id = auth.uid());
