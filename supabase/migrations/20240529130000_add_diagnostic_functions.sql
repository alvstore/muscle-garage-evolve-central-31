-- Function to get table information
CREATE OR REPLACE FUNCTION public.get_table_info(table_name text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  schema_name text := 'public';
  table_oid oid;
BEGIN
  -- Get the table OID
  SELECT c.oid INTO table_oid
  FROM pg_catalog.pg_class c
  LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relname = table_name
  AND n.nspname = schema_name;
  
  IF table_oid IS NULL THEN
    RETURN json_build_object(
      'exists', false,
      'message', format('Table %I does not exist in schema %I', table_name, schema_name)
    );
  END IF;
  
  -- Get table information
  SELECT json_build_object(
    'exists', true,
    'schema', schema_name,
    'name', table_name,
    'has_pk', EXISTS (
      SELECT 1
      FROM pg_index i
      WHERE i.indrelid = table_oid
      AND i.indisprimary
    ),
    'row_count', (SELECT reltuples::bigint FROM pg_class WHERE oid = table_oid)
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Function to get RLS policies
CREATE OR REPLACE FUNCTION public.get_rls_policies(table_name text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  schema_name text := 'public';
  table_oid oid;
BEGIN
  -- Get the table OID
  SELECT c.oid INTO table_oid
  FROM pg_catalog.pg_class c
  LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relname = table_name
  AND n.nspname = schema_name;
  
  IF table_oid IS NULL THEN
    RETURN json_build_object(
      'error', format('Table %I does not exist in schema %I', table_name, schema_name)
    );
  END IF;
  
  -- Get RLS policies
  SELECT json_agg(
    json_build_object(
      'schema', n.nspname,
      'table', c.relname,
      'policy_name', pol.polname,
      'command', CASE pol.polcmd
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        WHEN '*' THEN 'ALL'
      END,
      'permissive', CASE pol.polpermissive WHEN true THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END,
      'roles', pol.polroles,
      'using', pg_get_expr(pol.polqual, pol.polrelid),
      'with_check', pg_get_expr(pol.polwithcheck, pol.polrelid)
    )
  ) INTO result
  FROM pg_policy pol
  JOIN pg_class c ON pol.polrelid = c.oid
  LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE c.oid = table_oid;
  
  RETURN result;
END;
$$;

-- Grant execute permissions to authenticated users
GRANTE EXECUTE ON FUNCTION public.get_table_info(text) TO authenticated;
GRANTE EXECUTE ON FUNCTION public.get_rls_policies(text) TO authenticated;
