-- Create Hikvision API Settings Table
CREATE TABLE IF NOT EXISTS hikvision_api_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL,
  api_url TEXT NOT NULL,
  app_key TEXT NOT NULL,
  devices JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on branch_id
CREATE INDEX IF NOT EXISTS idx_hikvision_api_settings_branch_id ON hikvision_api_settings(branch_id);

-- Create Biometric Logs Table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS biometric_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL,
  branch_id UUID NOT NULL,
  device_type TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  details JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_biometric_logs_member_id ON biometric_logs(member_id);
CREATE INDEX IF NOT EXISTS idx_biometric_logs_branch_id ON biometric_logs(branch_id);
