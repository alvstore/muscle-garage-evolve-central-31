-- Function to assign membership with payment details
CREATE OR REPLACE FUNCTION public.assign_membership_with_payment(
  p_member_id uuid,
  p_membership_plan_id uuid,
  p_branch_id uuid,
  p_start_date timestamp with time zone,
  p_end_date timestamp with time zone,
  p_total_amount numeric,
  p_payment_method text,
  p_payment_status text,
  p_transaction_id text DEFAULT NULL,
  p_reference_number text DEFAULT NULL,
  p_notes text DEFAULT NULL,
  p_recorded_by uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_membership_id uuid;
  v_invoice_id uuid;
  v_transaction_id uuid;
  v_membership_plan_name text;
  v_due_date timestamp with time zone;
  v_category_id uuid;
  v_transaction_reference text;
BEGIN
  -- Get membership plan name
  SELECT name INTO v_membership_plan_name
  FROM public.memberships
  WHERE id = p_membership_plan_id;
  
  IF v_membership_plan_name IS NULL THEN
    RAISE EXCEPTION 'Membership plan not found';
  END IF;
  
  -- Get or create income category
  SELECT id INTO v_category_id
  FROM public.income_categories
  WHERE name = 'Membership' 
  AND (branch_id = p_branch_id OR branch_id IS NULL)
  ORDER BY 
    CASE WHEN branch_id IS NULL THEN 1 ELSE 0 END
  LIMIT 1;
  
  IF v_category_id IS NULL THEN
    INSERT INTO public.income_categories 
      (name, description, is_active, branch_id)
    VALUES 
      ('Membership', 'Membership payments', true, p_branch_id)
    RETURNING id INTO v_category_id;
  END IF;
  
  -- Calculate due date (7 days from now)
  v_due_date := (NOW() AT TIME ZONE 'UTC') + interval '7 days';
  
  -- Generate transaction reference if not provided
  v_transaction_reference := COALESCE(
    p_reference_number,
    'MEM' || to_char(NOW() AT TIME ZONE 'UTC', 'YYYYMMDDHH24MISS') || substr(md5(random()::text), 1, 6)
  );
  
  -- 1. Deactivate any existing active memberships
  UPDATE public.member_memberships
  SET status = 'inactive',
      updated_at = NOW()
  WHERE member_id = p_member_id
  AND status = 'active';
  
  -- 2. Create new membership
  INSERT INTO public.member_memberships (
    member_id,
    membership_plan_id,
    branch_id,
    start_date,
    end_date,
    status,
    total_amount,
    amount_paid,
    payment_status,
    payment_method,
    transaction_id,
    reference_number,
    notes,
    created_at,
    updated_at
  ) VALUES (
    p_member_id,
    p_membership_plan_id,
    p_branch_id,
    p_start_date::date,
    p_end_date::date,
    'active',
    p_total_amount,
    CASE WHEN p_payment_status = 'paid' THEN p_total_amount ELSE 0 END,
    p_payment_status,
    p_payment_method,
    p_transaction_id,
    v_transaction_reference,
    p_notes,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_membership_id;
  
  -- 3. Create invoice
  INSERT INTO public.invoices (
    member_id,
    membership_plan_id,
    branch_id,
    amount,
    status,
    payment_method,
    payment_date,
    due_date,
    description,
    notes,
    reference_number,
    items,
    created_at,
    updated_at
  ) VALUES (
    p_member_id,
    p_membership_plan_id,
    p_branch_id,
    p_total_amount,
    p_payment_status,
    p_payment_method,
    CASE WHEN p_payment_status = 'paid' THEN NOW() ELSE NULL END,
    v_due_date,
    'Membership: ' || v_membership_plan_name,
    p_notes,
    v_transaction_reference,
    jsonb_build_array(
      jsonb_build_object(
        'description', 'Membership: ' || v_membership_plan_name,
        'amount', p_total_amount,
        'quantity', 1,
        'total', p_total_amount
      )
    ),
    NOW(),
    NOW()
  )
  RETURNING id INTO v_invoice_id;
  
  -- 4. Create transaction record
  INSERT INTO public.transactions (
    type,
    amount,
    transaction_date,
    category,
    description,
    reference_id,
    payment_method,
    branch_id,
    status,
    created_at,
    updated_at
  ) VALUES (
    'income',
    p_total_amount,
    NOW(),
    'Membership',
    'Membership Payment: ' || v_membership_plan_name,
    v_invoice_id::text,
    p_payment_method,
    p_branch_id,
    p_payment_status,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_transaction_id;
  
  -- 5. Update member's membership info
  UPDATE public.members
  SET 
    membership_id = p_membership_plan_id,
    membership_status = 'active',
    membership_start_date = p_start_date::date,
    membership_end_date = p_end_date::date,
    status = 'active',
    updated_at = NOW()
  WHERE id = p_member_id;
  
  -- Return success with IDs
  RETURN jsonb_build_object(
    'success', true,
    'membership_id', v_membership_id,
    'invoice_id', v_invoice_id,
    'transaction_id', v_transaction_id,
    'reference_number', v_transaction_reference
  );
  
EXCEPTION WHEN OTHERS THEN
  -- Rollback transaction if any error occurs
  RAISE EXCEPTION 'Error in assign_membership_with_payment: %', SQLERRM;
END;
$$;
