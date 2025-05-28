-- Create a function to safely delete a trainer
CREATE OR REPLACE FUNCTION delete_trainer(trainer_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the trainer record
  UPDATE trainers
  SET 
    is_active = false,
    updated_at = NOW()
  WHERE profile_id = trainer_id;
  
  -- Update the associated profile
  UPDATE profiles
  SET 
    is_active = false,
    updated_at = NOW()
  WHERE id = trainer_id;
  
  -- Log the deletion
  INSERT INTO audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    'DELETE',
    'trainers',
    trainer_id,
    '{}'::jsonb,
    jsonb_build_object('is_active', false)
  );
END;
$$;
