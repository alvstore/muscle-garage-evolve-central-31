
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBranch } from '@/hooks/settings/use-branches';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BranchSchema, BranchFormValues } from '@/types/settings/branch';
import { toast } from 'sonner';

interface CreateBranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

const CreateBranchDialog: React.FC<CreateBranchDialogProps> = ({ open, onOpenChange, onComplete }) => {
  const { createBranch } = useBranch();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(BranchSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      email: '',
      phone: '',
      is_active: true,
      branch_code: '',
    },
  });

  const onSubmit = async (data: BranchFormValues) => {
    setIsSubmitting(true);
    try {
      // Ensure a name is provided, which is required by the Branch type
      if (!data.name) {
        toast.error("Branch name is required");
        setIsSubmitting(false);
        return;
      }
      
      const createdBranch = await createBranch({
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        email: data.email,
        phone: data.phone,
        is_active: data.is_active,
        branch_code: data.branch_code,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        manager_id: null
      });
      
      if (createdBranch) {
        toast.success("Branch created successfully");
        form.reset();
        if (onComplete) {
          onComplete();
        }
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error('Error creating branch:', error);
      toast.error(error.message || "Failed to create branch");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Branch</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Branch Name *</Label>
              <Input 
                id="name" 
                {...form.register('name')}
                placeholder="Main Branch" 
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch_code">Branch Code</Label>
              <Input 
                id="branch_code" 
                {...form.register('branch_code')}
                placeholder="MB001" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                type="tel"
                {...form.register('phone')}
                placeholder="+91 98765 43210" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                {...form.register('email')}
                placeholder="branch@example.com" 
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                {...form.register('address')}
                placeholder="123 Main Street" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input 
                id="city" 
                {...form.register('city')}
                placeholder="Mumbai" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input 
                id="state" 
                {...form.register('state')}
                placeholder="Maharashtra" 
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Creating...' : 'Create Branch'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBranchDialog;
