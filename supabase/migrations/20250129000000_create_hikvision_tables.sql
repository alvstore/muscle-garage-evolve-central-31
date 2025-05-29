
-- Create hikvision_api_settings table
CREATE TABLE IF NOT EXISTS public.hikvision_api_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  branch_id UUID NOT NULL,
  api_url TEXT NOT NULL DEFAULT 'https://open.hikvision.com',
  app_key TEXT NOT NULL,
  app_secret TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  site_id TEXT,
  site_name TEXT,
  sync_interval INTEGER DEFAULT 60,
  last_sync TIMESTAMP WITH TIME ZONE,
  devices JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_branch_hikvision UNIQUE (branch_id)
);

-- Create hikvision_tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.hikvision_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  branch_id UUID NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_in BIGINT,
  expire_time TIMESTAMP WITH TIME ZONE NOT NULL,
  token_type TEXT DEFAULT 'Bearer',
  scope TEXT,
  area_domain TEXT,
  available_sites JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_branch_token UNIQUE (branch_id)
);

-- Enable RLS
ALTER TABLE public.hikvision_api_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hikvision_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for hikvision_api_settings
CREATE POLICY "Users can view their branch hikvision settings" 
  ON public.hikvision_api_settings 
  FOR SELECT 
  USING (public.user_has_branch_access(branch_id));

CREATE POLICY "Users can insert hikvision settings for their branch" 
  ON public.hikvision_api_settings 
  FOR INSERT 
  WITH CHECK (public.user_has_branch_access(branch_id));

CREATE POLICY "Users can update hikvision settings for their branch" 
  ON public.hikvision_api_settings 
  FOR UPDATE 
  USING (public.user_has_branch_access(branch_id));

CREATE POLICY "Users can delete hikvision settings for their branch" 
  ON public.hikvision_api_settings 
  FOR DELETE 
  USING (public.user_has_branch_access(branch_id));

-- Create RLS policies for hikvision_tokens
CREATE POLICY "Users can view their branch hikvision tokens" 
  ON public.hikvision_tokens 
  FOR SELECT 
  USING (public.user_has_branch_access(branch_id));

CREATE POLICY "Users can insert hikvision tokens for their branch" 
  ON public.hikvision_tokens 
  FOR INSERT 
  WITH CHECK (public.user_has_branch_access(branch_id));

CREATE POLICY "Users can update hikvision tokens for their branch" 
  ON public.hikvision_tokens 
  FOR UPDATE 
  USING (public.user_has_branch_access(branch_id));

CREATE POLICY "Users can delete hikvision tokens for their branch" 
  ON public.hikvision_tokens 
  FOR DELETE 
  USING (public.user_has_branch_access(branch_id));
