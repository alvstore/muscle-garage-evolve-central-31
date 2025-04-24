
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/services/supabaseClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { messagingService } from '@/services/integrations/messagingService';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

// Define form validation schema
const staffFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters long'),
  role: z.enum(['admin', 'staff', 'trainer']),
  branch_id: z.string().uuid('Please select a branch'),
  position: z.string().min(2, 'Position must be at least 2 characters long'),
  sendWelcomeEmail: z.boolean().default(true),
  sendWelcomeSms: z.boolean().default(false)
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

// Password generator function
const generateRandomPassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

const CreateStaffForm = ({ branches, onSuccess }: { 
  branches: { id: string; name: string }[];
  onSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      role: 'staff',
      branch_id: '',
      position: '',
      sendWelcomeEmail: true,
      sendWelcomeSms: false
    }
  });

  const onSubmit = async (values: StaffFormValues) => {
    try {
      setIsSubmitting(true);
      const generatedPassword = generateRandomPassword();

      // 1. Create the user account
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: values.email,
        password: generatedPassword,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: values.fullName,
          role: values.role,
          phone: values.phone
        }
      });

      if (authError) throw new Error(authError.message);

      if (!authData.user) throw new Error('Failed to create user');

      // 2. Create the staff profile
      const { error: profileError } = await supabase.from('staff').insert({
        id: authData.user.id,
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        role: values.role,
        branch_id: values.branch_id,
        position: values.position,
        status: 'active'
      });

      if (profileError) throw new Error(profileError.message);

      // 3. Send welcome email if enabled
      if (values.sendWelcomeEmail) {
        await messagingService.sendEmail(
          values.email,
          'Welcome to Gym CRM System',
          `
            <h1>Welcome to Gym CRM, ${values.fullName}!</h1>
            <p>Your account has been created with the role: ${values.role}</p>
            <p>Here are your login credentials:</p>
            <p><strong>Email:</strong> ${values.email}</p>
            <p><strong>Temporary Password:</strong> ${generatedPassword}</p>
            <p>Please login and change your password immediately for security reasons.</p>
            <p>Best Regards,<br>Gym CRM Administration Team</p>
          `
        );
      }

      // 4. Send welcome SMS if enabled
      if (values.sendWelcomeSms && values.phone) {
        await messagingService.sendSMS(
          values.phone,
          `Welcome to Gym CRM, ${values.fullName}! Your account has been created. Email: ${values.email}, Temp Password: ${generatedPassword}. Please login and change your password.`
        );
      }

      toast({
        title: 'Staff Created',
        description: `${values.fullName} has been added to the system`,
      });
      
      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error('Error creating staff:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create staff member',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add New Staff Member</CardTitle>
        <CardDescription>Create a new staff account with welcome messages</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
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
                    <Input type="email" placeholder="staff@example.com" {...field} />
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
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
                name="branch_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="Fitness Trainer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="sendWelcomeEmail" className="flex flex-col gap-1">
                  <span>Send Welcome Email</span>
                  <span className="font-normal text-sm text-muted-foreground">User will receive login credentials by email</span>
                </Label>
                <FormField
                  control={form.control}
                  name="sendWelcomeEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sendWelcomeSms" className="flex flex-col gap-1">
                  <span>Send Welcome SMS</span>
                  <span className="font-normal text-sm text-muted-foreground">User will receive login credentials by SMS</span>
                </Label>
                <FormField
                  control={form.control}
                  name="sendWelcomeSms"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Staff Member
                  </>
                ) : (
                  'Create Staff Member'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 items-start">
        <div className="text-xs text-muted-foreground">
          <p>A secure random password will be generated and sent to the staff member.</p>
          <p>They will be asked to change it on first login.</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CreateStaffForm;
