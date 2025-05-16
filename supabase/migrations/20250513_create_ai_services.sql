-- Create AI services table
CREATE TABLE IF NOT EXISTS ai_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL CHECK (service_name IN ('openai', 'gemini')),
  api_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(service_name, created_by)
);

-- Enable RLS
ALTER TABLE ai_services ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Only admins can manage AI services" 
ON ai_services
FOR ALL
TO authenticated
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  AND auth.uid() = created_by
)
WITH CHECK (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  AND auth.uid() = created_by
);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_ai_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER ai_services_updated_at
  BEFORE UPDATE ON ai_services
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_services_updated_at();
