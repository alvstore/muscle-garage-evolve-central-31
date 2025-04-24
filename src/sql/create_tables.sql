
-- Create class_types table
CREATE TABLE IF NOT EXISTS public.class_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  branch_id UUID REFERENCES public.branches(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for class_types
ALTER TABLE public.class_types ENABLE ROW LEVEL SECURITY;

-- Admin can do anything
CREATE POLICY "Admins can do anything with class_types" ON public.class_types
  FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Staff can read all class types in their branch
CREATE POLICY "Staff can read class_types in their branch" ON public.class_types
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('staff', 'trainer') 
      AND (branch_id = class_types.branch_id OR branch_id IS NULL)
    )
  );

-- Staff can insert/update/delete class_types in their branch
CREATE POLICY "Staff can manage class_types in their branch" ON public.class_types
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role = 'staff' 
      AND branch_id = class_types.branch_id
    )
  );

-- Create motivational_messages table
CREATE TABLE IF NOT EXISTS public.motivational_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT DEFAULT 'Unknown',
  category TEXT NOT NULL CHECK (category IN ('motivation', 'fitness', 'nutrition', 'wellness')),
  tags TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for motivational_messages
ALTER TABLE public.motivational_messages ENABLE ROW LEVEL SECURITY;

-- Admin can do anything
CREATE POLICY "Admins can do anything with motivational_messages" ON public.motivational_messages
  FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Staff can read all messages
CREATE POLICY "Staff can read motivational_messages" ON public.motivational_messages
  FOR SELECT USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('staff', 'trainer')));

-- Staff can insert/update/delete messages
CREATE POLICY "Staff can manage motivational_messages" ON public.motivational_messages
  FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'staff'));

-- Create backup_logs table
CREATE TABLE IF NOT EXISTS public.backup_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  total_records INTEGER NOT NULL,
  success_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for backup_logs
ALTER TABLE public.backup_logs ENABLE ROW LEVEL SECURITY;

-- Admin can do anything with backup logs
CREATE POLICY "Admins can do anything with backup_logs" ON public.backup_logs
  FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Staff can read backup logs
CREATE POLICY "Staff can read backup_logs" ON public.backup_logs
  FOR SELECT USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'staff'));
