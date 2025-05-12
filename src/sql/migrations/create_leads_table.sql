-- Migration: Create Leads Table for Sales Funnel System
-- This migration creates the leads table and sets up RLS policies

-- Create the leads table if it doesn't exist
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'qualified')),
  stage TEXT NOT NULL CHECK (stage IN ('cold', 'warm', 'hot')),
  source TEXT,
  notes TEXT,
  assigned_to UUID REFERENCES profiles(id),
  branch_id UUID REFERENCES branches(id),
  interest_level TEXT CHECK (interest_level IN ('low', 'medium', 'high')),
  membership_interest TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_followup TIMESTAMP WITH TIME ZONE,
  last_contacted TIMESTAMP WITH TIME ZONE
);

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS update_leads_updated_at_trigger ON leads;

-- Create the trigger
CREATE TRIGGER update_leads_updated_at_trigger
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_leads_updated_at();

-- Enable RLS on the leads table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' 
    AND policyname = 'Leads are viewable by staff, admins and trainers'
  ) THEN
    DROP POLICY "Leads are viewable by staff, admins and trainers" ON leads;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' 
    AND policyname = 'Leads are editable by staff, admins and trainers'
  ) THEN
    DROP POLICY "Leads are editable by staff, admins and trainers" ON leads;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' 
    AND policyname = 'Leads are insertable by staff, admins and trainers'
  ) THEN
    DROP POLICY "Leads are insertable by staff, admins and trainers" ON leads;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' 
    AND policyname = 'Leads are deletable by staff and admins'
  ) THEN
    DROP POLICY "Leads are deletable by staff and admins" ON leads;
  END IF;
END $$;

-- Create RLS policies for the leads table
-- Only staff, admins, and trainers can view leads
CREATE POLICY "Leads are viewable by staff, admins and trainers" ON leads
    FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM profiles
        WHERE role IN ('admin', 'staff', 'trainer')
    ));

-- Only staff, admins, and trainers can update leads
CREATE POLICY "Leads are editable by staff, admins and trainers" ON leads
    FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM profiles
        WHERE role IN ('admin', 'staff', 'trainer')
    ));

-- Only staff, admins, and trainers can insert leads
CREATE POLICY "Leads are insertable by staff, admins and trainers" ON leads
    FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM profiles
        WHERE role IN ('admin', 'staff', 'trainer')
    ));

-- Only staff and admins can delete leads (not trainers)
CREATE POLICY "Leads are deletable by staff and admins" ON leads
    FOR DELETE
    USING (auth.uid() IN (
        SELECT id FROM profiles
        WHERE role IN ('admin', 'staff')
    ));

-- Add comments to document the table and columns
COMMENT ON TABLE leads IS 'Leads for the sales funnel system';
COMMENT ON COLUMN leads.full_name IS 'Full name of the lead';
COMMENT ON COLUMN leads.email IS 'Email address of the lead';
COMMENT ON COLUMN leads.phone IS 'Phone number of the lead';
COMMENT ON COLUMN leads.status IS 'Status of the lead (new, contacted, qualified)';
COMMENT ON COLUMN leads.stage IS 'Stage of the lead in the sales funnel (cold, warm, hot)';
COMMENT ON COLUMN leads.source IS 'Source of the lead (website, referral, walk-in, social media, etc.)';
COMMENT ON COLUMN leads.notes IS 'Notes about the lead';
COMMENT ON COLUMN leads.assigned_to IS 'Staff member assigned to the lead';
COMMENT ON COLUMN leads.branch_id IS 'Branch the lead is associated with';
COMMENT ON COLUMN leads.interest_level IS 'Interest level of the lead (low, medium, high)';
COMMENT ON COLUMN leads.membership_interest IS 'Membership plan the lead is interested in';
COMMENT ON COLUMN leads.next_followup IS 'Date and time of the next follow-up';
COMMENT ON COLUMN leads.last_contacted IS 'Date and time the lead was last contacted';
