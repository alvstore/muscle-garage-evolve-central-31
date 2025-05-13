-- Create AI-generated plans tables
CREATE TABLE IF NOT EXISTS ai_workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  goals TEXT[],
  restrictions TEXT[],
  days_per_week INTEGER,
  session_duration INTEGER,
  plan_content TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_diet_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  diet_type TEXT CHECK (diet_type IN ('vegetarian', 'non-vegetarian', 'vegan')),
  cuisine_type TEXT DEFAULT 'indian',
  calories_per_day INTEGER,
  goals TEXT[],
  restrictions TEXT[],
  plan_content TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ai_workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_diet_plans ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY admin_all_workout_plans ON ai_workout_plans
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ))
  WITH CHECK (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

CREATE POLICY admin_all_diet_plans ON ai_diet_plans
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ))
  WITH CHECK (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Everyone can read public plans
CREATE POLICY public_read_workout_plans ON ai_workout_plans
  FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY public_read_diet_plans ON ai_diet_plans
  FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Create indexes for better performance
CREATE INDEX ai_workout_plans_fitness_level_idx ON ai_workout_plans(fitness_level);
CREATE INDEX ai_workout_plans_is_public_idx ON ai_workout_plans(is_public);
CREATE INDEX ai_diet_plans_diet_type_idx ON ai_diet_plans(diet_type);
CREATE INDEX ai_diet_plans_is_public_idx ON ai_diet_plans(is_public);

-- Functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_workout_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_ai_diet_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at timestamp
CREATE TRIGGER ai_workout_plans_updated_at
  BEFORE UPDATE ON ai_workout_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_workout_plans_updated_at();

CREATE TRIGGER ai_diet_plans_updated_at
  BEFORE UPDATE ON ai_diet_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_diet_plans_updated_at();
