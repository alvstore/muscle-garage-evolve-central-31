-- Migration: Add RLS policies to class_types table
-- This migration adds proper RLS policies to the class_types table to allow
-- admins and staff to manage class types

-- Check if RLS is enabled on the class_types table, if not enable it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'class_types' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE class_types ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
  -- Drop policies on class_types table if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'class_types' 
    AND policyname = 'Class types are viewable by everyone'
  ) THEN
    DROP POLICY "Class types are viewable by everyone" ON class_types;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'class_types' 
    AND policyname = 'Class types are editable by admins and staff'
  ) THEN
    DROP POLICY "Class types are editable by admins and staff" ON class_types;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'class_types' 
    AND policyname = 'Class types are insertable by admins and staff'
  ) THEN
    DROP POLICY "Class types are insertable by admins and staff" ON class_types;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'class_types' 
    AND policyname = 'Class types are deletable by admins and staff'
  ) THEN
    DROP POLICY "Class types are deletable by admins and staff" ON class_types;
  END IF;
END $$;

-- Create new RLS policies
-- Allow everyone to view class types
CREATE POLICY "Class types are viewable by everyone" ON class_types
    FOR SELECT
    USING (true);

-- Allow admins, staff, and trainers to update class types
CREATE POLICY "Class types are editable by admins, staff and trainers" ON class_types
    FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM profiles
        WHERE role IN ('admin', 'staff', 'trainer')
    ));

-- Allow admins, staff, and trainers to insert class types
CREATE POLICY "Class types are insertable by admins, staff and trainers" ON class_types
    FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM profiles
        WHERE role IN ('admin', 'staff', 'trainer')
    ));

-- Allow admins, staff, and trainers to delete class types
CREATE POLICY "Class types are deletable by admins, staff and trainers" ON class_types
    FOR DELETE
    USING (auth.uid() IN (
        SELECT id FROM profiles
        WHERE role IN ('admin', 'staff', 'trainer')
    ));

-- Update the classes RLS policies to include INSERT, UPDATE, and DELETE permissions
-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop existing policies for classes
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'classes' 
    AND policyname = 'Classes are viewable by everyone'
  ) THEN
    DROP POLICY "Classes are viewable by everyone" ON classes;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'classes' 
    AND policyname = 'Classes are editable by admins and trainers'
  ) THEN
    DROP POLICY "Classes are editable by admins and trainers" ON classes;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'classes' 
    AND policyname = 'Classes are insertable by admins and staff'
  ) THEN
    DROP POLICY "Classes are insertable by admins and staff" ON classes;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'classes' 
    AND policyname = 'Classes are deletable by admins and staff'
  ) THEN
    DROP POLICY "Classes are deletable by admins and staff" ON classes;
  END IF;
END $$;

-- Create comprehensive policies for classes
-- Everyone can view classes
CREATE POLICY "Classes are viewable by everyone" ON classes
    FOR SELECT
    USING (true);

-- Admins, staff, and trainers can insert classes
CREATE POLICY "Classes are insertable by admins, staff and trainers" ON classes
    FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM profiles
        WHERE role IN ('admin', 'staff', 'trainer')
    ));

-- Admins, staff, and trainers can update classes
CREATE POLICY "Classes are editable by admins, staff and trainers" ON classes
    FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM profiles
        WHERE role IN ('admin', 'staff', 'trainer')
    ));

-- Admins, staff, and trainers can delete classes
CREATE POLICY "Classes are deletable by admins, staff and trainers" ON classes
    FOR DELETE
    USING (auth.uid() IN (
        SELECT id FROM profiles
        WHERE role IN ('admin', 'staff', 'trainer')
    ));

-- Now set up policies for class_bookings
DO $$ 
BEGIN
  -- Check if RLS is enabled on the class_bookings table
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'class_bookings' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE class_bookings ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Drop existing policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'class_bookings' 
    AND policyname = 'Bookings are viewable by admins, staff, trainers and own member'
  ) THEN
    DROP POLICY "Bookings are viewable by admins, staff, trainers and own member" ON class_bookings;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'class_bookings' 
    AND policyname = 'Bookings are insertable by everyone'
  ) THEN
    DROP POLICY "Bookings are insertable by everyone" ON class_bookings;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'class_bookings' 
    AND policyname = 'Bookings are updatable by admins, staff, trainers and own member'
  ) THEN
    DROP POLICY "Bookings are updatable by admins, staff, trainers and own member" ON class_bookings;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'class_bookings' 
    AND policyname = 'Bookings are deletable by admins, staff, trainers and own member'
  ) THEN
    DROP POLICY "Bookings are deletable by admins, staff, trainers and own member" ON class_bookings;
  END IF;
END $$;

-- Create comprehensive policies for class_bookings
-- Admins, staff, trainers can view all bookings, members can only view their own
CREATE POLICY "Bookings are viewable by admins, staff, trainers and own member" ON class_bookings
    FOR SELECT
    USING (
      auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'staff', 'trainer')) OR
      auth.uid() = member_id
    );

-- Everyone can create bookings (members can book classes)
CREATE POLICY "Bookings are insertable by everyone" ON class_bookings
    FOR INSERT
    WITH CHECK (true);

-- Admins, staff, trainers can update any booking, members can only update their own
CREATE POLICY "Bookings are updatable by admins, staff, trainers and own member" ON class_bookings
    FOR UPDATE
    USING (
      auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'staff', 'trainer')) OR
      auth.uid() = member_id
    );

-- Admins, staff, trainers can delete any booking, members can only delete their own
CREATE POLICY "Bookings are deletable by admins, staff, trainers and own member" ON class_bookings
    FOR DELETE
    USING (
      auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'staff', 'trainer')) OR
      auth.uid() = member_id
    );
