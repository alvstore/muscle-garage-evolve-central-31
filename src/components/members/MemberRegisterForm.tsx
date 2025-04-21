
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createProfile } from '@/lib/supabase/profileService';
import { useAuth } from '@/hooks/use-auth';
import { useBranch } from '@/hooks/use-branch';

interface MemberRegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export default function MemberRegisterForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentBranch } = useBranch();

  const { register, handleSubmit, formState: { errors } } = useForm<MemberRegisterFormData>();

  const onSubmit = async (data: MemberRegisterFormData) => {
    try {
      setLoading(true);
      await createProfile({
        ...data,
        role: 'member',
        branch_id: currentBranch?.id
      });
      toast.success('Member registered successfully');
      navigate('/members');
    } catch (error: any) {
      toast.error(error.message || 'Failed to register member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register New Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/members')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register Member'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
