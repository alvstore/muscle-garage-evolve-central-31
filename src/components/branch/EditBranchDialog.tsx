
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBranch } from '@/hooks/use-branch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Branch, BranchSchema, BranchFormValues } from '@/types/branch';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

interface EditBranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: Branch;
  onComplete?: () => void;
}

const EditBranchDialog: React.FC<EditBranchDialogProps> = ({ open, onOpenChange, branch, onComplete }) => {
  const { updateBranch } = useBranch();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(BranchSchema),
    defaultValues: {
      name: branch.name || '',
      address: branch.address || '',
      city: branch.city || '',
      state: branch.state || '',
      country: branch.country || 'India',
      email: branch.email || '',
      phone: branch.phone || '',
      is_active: branch.is_active ?? true,
      branch_code: branch.branch_code || '',
    }
  });

  useEffect(() => {
    // Update form values when branch changes
    form.reset({
      name: branch.name || '',
      address: branch.address || '',
      city: branch.city || '',
      state: branch.state || '',
      country: branch.country || 'India',
      email: branch.email || '',
      phone: branch.phone || '',
      is_active: branch.is_active ?? true,
      branch_code: branch.branch_code || '',
    });
  }, [branch, form]);

  const onSubmit = async (data: BranchFormValues) => {
    setIsSubmitting(true);
    try {
      const updatedBranch = await updateBranch(branch.id, data);
      if (updatedBranch) {
        toast.success("Branch updated successfully");
        if (onComplete) {
          onComplete();
        }
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error('Error updating branch:', error);
      toast.error(error.message || "Failed to update branch");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Branch: {branch.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Branch Name *</Label>
              <Input 
                id="name" 
                {...form.register('name')}
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                {...form.register('email')}
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
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input 
                id="city" 
                {...form.register('city')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input 
                id="state" 
                {...form.register('state')}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="is_active"
                checked={form.watch("is_active")}
                onCheckedChange={(checked) => form.setValue('is_active', checked)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBranchDialog;
