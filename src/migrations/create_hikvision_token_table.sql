-- Create the hikvision_tokens table
CREATE TABLE IF NOT EXISTS public.hikvision_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL,
  access_token TEXT NOT NULL,
  expire_time BIGINT NOT NULL,
  area_domain TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT hikvision_tokens_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES branches(id)
) TABLESPACE pg_default;

-- Create index on branch_id
CREATE INDEX IF NOT EXISTS idx_hikvision_tokens_branch_id ON public.hikvision_tokens USING btree (branch_id) TABLESPACE pg_default;
