-- Add level, difficulty, and recurring fields to classes table

-- Check if level column exists and add if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'classes' AND column_name = 'level') THEN
        ALTER TABLE classes ADD COLUMN level text DEFAULT 'all';
    END IF;
END $$;

-- Check if difficulty column exists and add if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'classes' AND column_name = 'difficulty') THEN
        ALTER TABLE classes ADD COLUMN difficulty text DEFAULT 'all';
    END IF;
END $$;

-- Check if recurring column exists and add if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'classes' AND column_name = 'recurring') THEN
        ALTER TABLE classes ADD COLUMN recurring boolean DEFAULT false;
    END IF;
END $$;

-- Check if recurring_pattern column exists and add if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'classes' AND column_name = 'recurring_pattern') THEN
        ALTER TABLE classes ADD COLUMN recurring_pattern text DEFAULT NULL;
    END IF;
END $$;

-- Add level and difficulty to class_types table as well
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'class_types' AND column_name = 'level') THEN
        ALTER TABLE class_types ADD COLUMN level text DEFAULT 'all';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'class_types' AND column_name = 'difficulty') THEN
        ALTER TABLE class_types ADD COLUMN difficulty text DEFAULT 'all';
    END IF;
END $$;

-- Check if RLS is enabled on the classes table, if not enable it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'classes' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
  -- Drop policies on classes table if they exist
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
END $$;

-- Create new RLS policies
CREATE POLICY "Classes are viewable by everyone" ON classes
    FOR SELECT
    USING (true);

CREATE POLICY "Classes are editable by admins and trainers" ON classes
    FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM profiles
        WHERE role IN ('admin', 'trainer')
    ));

-- Comment on columns to document their purpose
COMMENT ON COLUMN classes.level IS 'Class level (beginner, intermediate, advanced, expert, all)';
COMMENT ON COLUMN classes.difficulty IS 'Class difficulty (beginner, intermediate, advanced, all)';
COMMENT ON COLUMN classes.recurring IS 'Whether the class is recurring';
COMMENT ON COLUMN classes.recurring_pattern IS 'Pattern for recurring classes (DAILY, WEEKLY, MONTHLY)';
COMMENT ON COLUMN class_types.level IS 'Class type level (beginner, intermediate, advanced, expert, all)';
COMMENT ON COLUMN class_types.difficulty IS 'Class type difficulty (beginner, intermediate, advanced, all)';
