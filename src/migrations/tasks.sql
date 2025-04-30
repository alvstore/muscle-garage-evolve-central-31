
-- Create tasks table for task management module
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    assigned_to UUID REFERENCES auth.users(id),
    completed BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    branch_id UUID REFERENCES public.branches(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view tasks they created or are assigned to
CREATE POLICY "Users can view their own tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (auth.uid() = created_by OR auth.uid() = assigned_to);

-- Create policy that allows users to create tasks
CREATE POLICY "Users can create tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

-- Create policy that allows users to update tasks they created or are assigned to
CREATE POLICY "Users can update their tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (auth.uid() = created_by OR auth.uid() = assigned_to);

-- Create policy that allows users to delete tasks they created
CREATE POLICY "Users can delete their own tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (auth.uid() = created_by);
