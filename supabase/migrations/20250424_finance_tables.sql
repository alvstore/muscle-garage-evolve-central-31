
-- Enable Row Level Security on existing tables
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Add tables to the realtime publication for real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.income_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.expense_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.webhook_logs;

-- Set REPLICA IDENTITY to FULL for these tables to capture the full row data in change events
ALTER TABLE public.invoices REPLICA IDENTITY FULL;
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER TABLE public.income_categories REPLICA IDENTITY FULL;
ALTER TABLE public.expense_categories REPLICA IDENTITY FULL;
ALTER TABLE public.webhook_logs REPLICA IDENTITY FULL;

-- Create tables for inventory, products, and promotions if they don't exist
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    cost_price NUMERIC DEFAULT 0,
    sku TEXT,
    barcode TEXT,
    category TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    branch_id UUID REFERENCES public.branches(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    min_stock_level INTEGER DEFAULT 5,
    max_stock_level INTEGER,
    branch_id UUID REFERENCES public.branches(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id),
    transaction_type TEXT NOT NULL, -- 'purchase', 'sale', 'adjustment'
    quantity INTEGER NOT NULL,
    unit_price NUMERIC,
    total_amount NUMERIC,
    reference_id UUID,
    notes TEXT,
    staff_id UUID,
    branch_id UUID REFERENCES public.branches(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    branch_id UUID REFERENCES public.branches(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    code TEXT,
    discount_type TEXT NOT NULL, -- 'percentage', 'fixed'
    discount_value NUMERIC NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    branch_id UUID REFERENCES public.branches(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.referral_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    reward_type TEXT NOT NULL, -- 'discount', 'points', 'membership_extension'
    reward_value NUMERIC NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    branch_id UUID REFERENCES public.branches(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES public.members(id),
    referee_id UUID REFERENCES public.members(id),
    program_id UUID REFERENCES public.referral_programs(id),
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'rewarded', 'cancelled'
    reward_given BOOLEAN DEFAULT false,
    reward_date TIMESTAMP WITH TIME ZONE,
    branch_id UUID REFERENCES public.branches(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add new tables to the realtime publication for real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.suppliers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.promotions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.referral_programs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.referrals;

-- Set REPLICA IDENTITY to FULL for the new tables
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.inventory REPLICA IDENTITY FULL;
ALTER TABLE public.inventory_transactions REPLICA IDENTITY FULL;
ALTER TABLE public.suppliers REPLICA IDENTITY FULL;
ALTER TABLE public.promotions REPLICA IDENTITY FULL;
ALTER TABLE public.referral_programs REPLICA IDENTITY FULL;
ALTER TABLE public.referrals REPLICA IDENTITY FULL;

-- Enable Row Level Security on the new tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Create policies for all tables
-- For branches policy
CREATE POLICY "Staff can view branches they belong to" ON public.branches
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE branch_id = id OR 
      branch_id IN (SELECT accessible_branch_ids FROM public.profiles WHERE id = auth.uid())
    )
  );

-- For invoices policy
CREATE POLICY "Staff can view invoices in their branch" ON public.invoices
  FOR SELECT USING (
    branch_id IN (
      SELECT branch_id FROM public.profiles WHERE id = auth.uid()
      UNION
      SELECT unnest(accessible_branch_ids) FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Staff can create invoices in their branch" ON public.invoices
  FOR INSERT WITH CHECK (
    branch_id IN (
      SELECT branch_id FROM public.profiles WHERE id = auth.uid()
      UNION
      SELECT unnest(accessible_branch_ids) FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Staff can update invoices in their branch" ON public.invoices
  FOR UPDATE USING (
    branch_id IN (
      SELECT branch_id FROM public.profiles WHERE id = auth.uid()
      UNION
      SELECT unnest(accessible_branch_ids) FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Staff can delete invoices in their branch" ON public.invoices
  FOR DELETE USING (
    branch_id IN (
      SELECT branch_id FROM public.profiles WHERE id = auth.uid()
      UNION
      SELECT unnest(accessible_branch_ids) FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Similar policies for other tables (transactions, products, inventory, etc.)
-- Follow the same pattern as the invoices policies

-- Trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to relevant tables
CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
BEFORE UPDATE ON public.inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
