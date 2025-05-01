
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBranch } from '@/hooks/use-branch';

// Define the schema for the staff form
const staffSchema = z.object({
  full_name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  role: z.enum(['staff', 'trainer', 'admin']),
  department: z.string().optional(),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof staffSchema>;

export interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: 'staff' | 'trainer' | 'admin';
  department?: string;
  branch_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateStaffFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  staff: StaffMember[];
  refetch: () => Promise<void>;
}

const CreateStaffForm: React.FC<CreateStaffFormProps> = ({
  onSuccess,
  onCancel,
  refetch
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { currentBranch } = useBranch();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      role: 'staff',
      department: '',
      is_active: true,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!currentBranch?.id) {
      toast.error('Please select a branch first');
      return;
    }
    
    setIsLoading(true);
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: 'TemporaryPassword123!', // This should be changed on first login
        email_confirm: true,
        user_metadata: {
          full_name: data.full_name,
          role: data.role
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error('Failed to create user');
      }
      
      // Then create the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          department: data.department,
          branch_id: currentBranch.id,
          is_active: data.is_active,
        });
        
      if (profileError) throw profileError;
      
      toast.success('Staff member created successfully');
      await refetch();
      onSuccess();
    } catch (error: any) {
      console.error('Error creating staff member:', error);
      toast.error(error.message || 'Failed to create staff member');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Staff Member</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
                    <Input placeholder="john@example.com" type="email" {...field} />
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={(value) => field.onChange(value as 'staff' | 'trainer' | 'admin')}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="trainer">Trainer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Reception, Training" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Staff Member'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default CreateStaffForm;
