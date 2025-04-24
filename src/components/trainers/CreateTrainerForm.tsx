
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from '@/hooks/use-branch';
import { MultiSelect } from '@/components/ui/multi-select';
import { Card, CardContent } from '@/components/ui/card';

const specialtyOptions = [
  { value: "strength_training", label: "Strength Training" },
  { value: "weight_loss", label: "Weight Loss" },
  { value: "yoga", label: "Yoga" },
  { value: "cardio", label: "Cardio" },
  { value: "crossfit", label: "CrossFit" },
  { value: "rehabilitation", label: "Rehabilitation" },
  { value: "nutrition", label: "Nutrition" },
  { value: "pilates", label: "Pilates" },
  { value: "martial_arts", label: "Martial Arts" },
  { value: "functional_training", label: "Functional Training" }
];

const trainerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  gender: z.enum(['male', 'female', 'other']),
  specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
  bio: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  branchId: z.string().optional()
});

type TrainerFormData = z.infer<typeof trainerFormSchema>;

export function CreateTrainerForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const { currentBranch } = useBranch();

  const form = useForm<TrainerFormData>({
    resolver: zodResolver(trainerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      gender: 'male',
      specialties: [],
      bio: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      branchId: currentBranch?.id
    }
  });

  const onSubmit = async (data: TrainerFormData) => {
    try {
      setLoading(true);
      
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

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

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.name,
          email: data.email,
          role: 'trainer',
          phone: data.phone,
          gender: data.gender,
          specialty: data.specialties,
          bio: data.bio,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          branch_id: data.branchId || currentBranch?.id,
          avatar_url: avatarUrl,
          is_active: true
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center mb-6">
              <AvatarUpload
                onImageUploaded={setAvatarUrl}
                currentImageUrl={avatarUrl}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
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
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
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
                    <FormLabel>Phone *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialties"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Specialties *</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={specialtyOptions}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Select specialties..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Bio (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description about experience and qualifications" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 mt-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating...' : 'Create Trainer'}
        </Button>
      </form>
    </Form>
  );
}
