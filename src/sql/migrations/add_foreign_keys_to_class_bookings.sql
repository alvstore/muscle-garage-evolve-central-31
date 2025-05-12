-- Migration: Add Foreign Keys to class_bookings table
-- This migration adds proper foreign key constraints to the class_bookings table
-- to establish relationships with profiles (for member_id) and classes (for class_id)

-- First, check if foreign keys already exist and drop them if they do
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'class_bookings_member_id_fkey' 
    AND table_name = 'class_bookings'
  ) THEN
    ALTER TABLE class_bookings DROP CONSTRAINT class_bookings_member_id_fkey;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'class_bookings_class_id_fkey' 
    AND table_name = 'class_bookings'
  ) THEN
    ALTER TABLE class_bookings DROP CONSTRAINT class_bookings_class_id_fkey;
  END IF;
END $$;

-- Add foreign key constraints
ALTER TABLE class_bookings
  ADD CONSTRAINT class_bookings_member_id_fkey
  FOREIGN KEY (member_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;

ALTER TABLE class_bookings
  ADD CONSTRAINT class_bookings_class_id_fkey
  FOREIGN KEY (class_id)
  REFERENCES classes(id)
  ON DELETE CASCADE;

-- Check if RLS is enabled on the class_bookings table, if not enable it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'class_bookings' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE class_bookings ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
  -- Drop policies on class_bookings table if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'class_bookings' 
    AND policyname = 'Users can view their own bookings'
  ) THEN
    DROP POLICY "Users can view their own bookings" ON class_bookings;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'class_bookings' 
    AND policyname = 'Staff and admins can insert bookings'
  ) THEN
    DROP POLICY "Staff and admins can insert bookings" ON class_bookings;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'class_bookings' 
    AND policyname = 'Staff and admins can update bookings'
  ) THEN
    DROP POLICY "Staff and admins can update bookings" ON class_bookings;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'class_bookings' 
    AND policyname = 'Staff and admins can delete bookings'
  ) THEN
    DROP POLICY "Staff and admins can delete bookings" ON class_bookings;
  END IF;
END $$;

-- Create new RLS policies
-- Allow authenticated users to select their own bookings
CREATE POLICY "Users can view their own bookings"
  ON class_bookings
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = member_id OR
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE role IN ('admin', 'staff', 'trainer')
    )
  );

-- Allow staff and admins to insert bookings
CREATE POLICY "Staff and admins can insert bookings"
  ON class_bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = member_id OR
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE role IN ('admin', 'staff')
    )
  );

-- Allow staff and admins to update bookings
CREATE POLICY "Staff and admins can update bookings"
  ON class_bookings
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = member_id OR
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE role IN ('admin', 'staff')
    )
  );

-- Allow staff and admins to delete bookings
CREATE POLICY "Staff and admins can delete bookings"
  ON class_bookings
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE role IN ('admin', 'staff')
    )
  );
