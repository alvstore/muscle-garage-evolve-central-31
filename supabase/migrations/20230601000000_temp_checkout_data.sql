
CREATE TABLE IF NOT EXISTS public.temp_checkout_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT UNIQUE NOT NULL,
  external_id TEXT,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  item_type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS
ALTER TABLE public.temp_checkout_data ENABLE ROW LEVEL SECURITY;

-- Define RLS policy for admins
CREATE POLICY "Admins can do anything with temp_checkout_data" 
ON public.temp_checkout_data 
FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Create index on reference_id for quick lookups
CREATE INDEX IF NOT EXISTS temp_checkout_data_reference_idx ON public.temp_checkout_data(reference_id);

-- Create cleanup function for expired data
CREATE OR REPLACE FUNCTION cleanup_expired_checkout_data() RETURNS void AS $$
BEGIN
  DELETE FROM public.temp_checkout_data
  WHERE expires_at < now() AND status = 'pending';
END;
$$ LANGUAGE plpgsql;
