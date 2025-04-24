
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from '@/hooks/use-branch';

const trainerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  specialty: z.string().min(2, 'Specialty is required'),
  bio: z.string().optional(),
  branchId: z.string().optional()
});

type TrainerFormData = z.infer<typeof trainerFormSchema>;

export function CreateTrainerForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const { currentBranch } = useBranch();

  const form = useForm<TrainerFormData>({
    resolver: zodResolver(trainerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      specialty: '',
      bio: '',
      branchId: currentBranch?.id
    }
  });

  const onSubmit = async (data: TrainerFormData) => {
    try {
      setLoading(true);
      
      // Generate a random password for the new user
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

      // Create a new user in the auth system
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: tempPassword,
        options: {
          data: {
            full_name: data.name,
            role: 'trainer'
          }
        }
      });

      if (authError) throw authError;

      // Create or update profile with trainer-specific fields
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.name,
          email: data.email,
          role: 'trainer',
          phone: data.phone || null,
          specialty: data.specialty,
          bio: data.bio || null,
          branch_id: data.branchId || currentBranch?.id,
          is_active: true,
          rating: 5.0 // Default rating
        })
        .eq('id', authData.user?.id);

      if (profileError) throw profileError;

      toast.success('Trainer created successfully');
      onSuccess();
      form.reset();
    } catch (error: any) {
      console.error('Error creating trainer:', error);
      toast.error(error.message || 'Failed to create trainer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialty</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Weight Loss, Strength Training" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Brief description about the trainer's experience and qualifications"
                  className="resize-none"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Trainer'}
        </Button>
      </form>
    </Form>
  );
}
