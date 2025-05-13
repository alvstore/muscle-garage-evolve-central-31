-- Create access control tables for Hikvision integration

-- Table for access zones (gym areas like main gym, swimming pool, etc.)
CREATE TABLE IF NOT EXISTS access_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, branch_id)
);

-- Table for access doors (physical doors controlled by Hikvision)
CREATE TABLE IF NOT EXISTS access_doors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  door_name TEXT NOT NULL,
  door_number TEXT,
  hikvision_door_id TEXT NOT NULL,
  zone_id UUID REFERENCES access_zones(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  device_id UUID REFERENCES hikvision_api_settings(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hikvision_door_id, branch_id)
);

-- Table for membership plan access permissions
CREATE TABLE IF NOT EXISTS membership_access_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id UUID REFERENCES memberships(id) ON DELETE CASCADE,
  zone_id UUID REFERENCES access_zones(id) ON DELETE CASCADE,
  access_type TEXT CHECK (access_type IN ('allowed', 'denied', 'scheduled')) DEFAULT 'allowed',
  schedule_start_time TIME,
  schedule_end_time TIME,
  schedule_days TEXT[], -- Array of days like ['monday', 'wednesday', 'friday']
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(membership_id, zone_id)
);

-- Table for member access overrides (for special cases)
CREATE TABLE IF NOT EXISTS member_access_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  zone_id UUID REFERENCES access_zones(id) ON DELETE CASCADE,
  access_type TEXT CHECK (access_type IN ('allowed', 'denied', 'scheduled')) DEFAULT 'allowed',
  reason TEXT,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  schedule_start_time TIME,
  schedule_end_time TIME,
  schedule_days TEXT[], -- Array of days like ['monday', 'wednesday', 'friday']
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(member_id, zone_id)
);

-- Table for member access cards/credentials
CREATE TABLE IF NOT EXISTS member_access_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  credential_type TEXT CHECK (credential_type IN ('card', 'face', 'fingerprint', 'pin')),
  credential_value TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(member_id, credential_type, credential_value)
);

-- Table for access logs from Hikvision
CREATE TABLE IF NOT EXISTS access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  member_id UUID REFERENCES profiles(id),
  door_id UUID REFERENCES access_doors(id),
  event_time TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('entry', 'exit', 'denied')),
  credential_type TEXT,
  credential_value TEXT,
  hikvision_event_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id)
);

-- Enable Row Level Security
ALTER TABLE access_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_doors ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_access_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_access_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_access_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY admin_all_access_zones ON access_zones FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY admin_all_access_doors ON access_doors FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY admin_all_membership_permissions ON membership_access_permissions FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY admin_all_member_overrides ON member_access_overrides FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY admin_all_member_credentials ON member_access_credentials FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY admin_all_access_logs ON access_logs FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Staff can view all and manage some tables
CREATE POLICY staff_manage_access_zones ON access_zones FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'staff'));

CREATE POLICY staff_manage_access_doors ON access_doors FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'staff'));

CREATE POLICY staff_view_membership_permissions ON membership_access_permissions FOR SELECT TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'staff'));

CREATE POLICY staff_manage_member_overrides ON member_access_overrides FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'staff'));

CREATE POLICY staff_manage_member_credentials ON member_access_credentials FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'staff'));

CREATE POLICY staff_view_access_logs ON access_logs FOR SELECT TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'staff'));

-- Members can view their own credentials and access logs
CREATE POLICY member_view_own_credentials ON member_access_credentials FOR SELECT TO authenticated
  USING (auth.uid() = member_id);

CREATE POLICY member_view_own_access_logs ON access_logs FOR SELECT TO authenticated
  USING (auth.uid() = member_id);

-- Create indexes for better performance
CREATE INDEX access_doors_branch_id_idx ON access_doors(branch_id);
CREATE INDEX access_doors_zone_id_idx ON access_doors(zone_id);
CREATE INDEX access_zones_branch_id_idx ON access_zones(branch_id);
CREATE INDEX membership_permissions_membership_id_idx ON membership_access_permissions(membership_id);
CREATE INDEX membership_permissions_zone_id_idx ON membership_access_permissions(zone_id);
CREATE INDEX member_overrides_member_id_idx ON member_access_overrides(member_id);
CREATE INDEX member_overrides_zone_id_idx ON member_access_overrides(zone_id);
CREATE INDEX member_credentials_member_id_idx ON member_access_credentials(member_id);
CREATE INDEX access_logs_member_id_idx ON access_logs(member_id);
CREATE INDEX access_logs_door_id_idx ON access_logs(door_id);
CREATE INDEX access_logs_event_time_idx ON access_logs(event_time);

-- Functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_access_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at timestamp
CREATE TRIGGER access_zones_updated_at
  BEFORE UPDATE ON access_zones
  FOR EACH ROW
  EXECUTE FUNCTION update_access_updated_at();

CREATE TRIGGER access_doors_updated_at
  BEFORE UPDATE ON access_doors
  FOR EACH ROW
  EXECUTE FUNCTION update_access_updated_at();

CREATE TRIGGER membership_access_permissions_updated_at
  BEFORE UPDATE ON membership_access_permissions
  FOR EACH ROW
  EXECUTE FUNCTION update_access_updated_at();

CREATE TRIGGER member_access_overrides_updated_at
  BEFORE UPDATE ON member_access_overrides
  FOR EACH ROW
  EXECUTE FUNCTION update_access_updated_at();

CREATE TRIGGER member_access_credentials_updated_at
  BEFORE UPDATE ON member_access_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_access_updated_at();
