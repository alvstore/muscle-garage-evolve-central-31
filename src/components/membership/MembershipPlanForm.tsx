
import { useState, useEffect } from 'react';
import { useBranch } from '@/contexts/BranchContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { MembershipPlan } from '@/types/members/membership';

export interface MembershipPlanFormProps {
  plan?: MembershipPlan;
  onSave: (plan: MembershipPlan) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isEditing?: boolean;
  branchId?: string | null;
  key?: string;
}

// Default values for a new membership plan
const defaultPlan: MembershipPlan = {
  id: '',
  name: '',
  plan_name: '',
  description: '',
  price: 0,
  duration_days: 30,
  features: {},
  is_active: true,
  branch_id: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const MembershipPlanForm: React.FC<MembershipPlanFormProps> = ({
  plan,
  onSave,
  onCancel,
  isSubmitting = false,
  open = true,
  onOpenChange = () => {},
  isEditing = false,
  branchId
}) => {
  const { currentBranch } = useBranch();
  
  // Initialize form data with default values and merge with plan props if provided
  const [formData, setFormData] = useState<MembershipPlan>(() => ({
    ...defaultPlan,
    ...(plan || {}),
    branch_id: plan?.branch_id || branchId || currentBranch?.id || null
  }));
  
  // Update form data when plan or branch changes
  useEffect(() => {
    if (plan) {
      setFormData(prev => ({
        ...prev,
        ...plan,
        branch_id: plan.branch_id || branchId || currentBranch?.id || null
      }));
    } else {
      setFormData({
        ...defaultPlan,
        branch_id: branchId || currentBranch?.id || null
      });
    }
  }, [plan, branchId, currentBranch]);
  
  useEffect(() => {
    console.log('Initializing form with plan data:', plan || 'using default');
    const initialData = plan || defaultPlan;
    console.log('Form data being set:', JSON.stringify(initialData, null, 2));
    setFormData(initialData);
  }, [plan]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => {
      // Handle numeric inputs
      if (type === 'number' || name === 'price' || name === 'duration_days') {
        const numValue = value === '' ? undefined : Number(value);
        return { ...prev, [name]: numValue };
      }
      
      // Handle checkbox/switch inputs
      if (e.target instanceof HTMLInputElement && (e.target.type === 'checkbox' || e.target.type === 'switch')) {
        const { checked } = e.target as HTMLInputElement;
        return { ...prev, [name]: checked };
      }
      
      // Handle text inputs
      return { ...prev, [name]: value };
    });
  };

  const toggleFeature = (featureKey: string) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...(prev.features || {}),
        [featureKey]: !prev.features?.[featureKey]
      }
    }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_active: checked,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Form submitted with data:', JSON.stringify(formData, null, 2));
      // Validate required fields
      if (!formData.name || formData.price === undefined || formData.duration_days === undefined) {
        throw new Error('Please fill in all required fields');
      }
      
      // Format the plan data according to the database schema
      const planData = {
        name: formData.name.trim(),
        plan_name: formData.plan_name?.trim() || null,
        description: formData.description?.trim() || null,
        price: Number(formData.price),
        duration_days: Number(formData.duration_days),
        features: formData.features || {},
        is_active: formData.is_active !== undefined ? formData.is_active : true,
        // These will be set by the database
        created_at: undefined,
        updated_at: undefined,
        // These will be set by the parent component
        id: undefined,
        branch_id: undefined,
        // For backward compatibility
        durationDays: undefined,
        isActive: undefined,
        status: undefined,
        benefits: undefined,
        memberCount: undefined,
        durationLabel: undefined,
        allowed_classes: undefined
      };
      
      // Additional validation
      if (isNaN(planData.price) || planData.price < 0) {
        throw new Error('Price must be a positive number');
      }
      
      if (isNaN(planData.duration_days) || planData.duration_days < 1) {
        throw new Error('Duration must be at least 1 day');
      }
      
      onSave(planData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid form data');
      console.error('Form submission error:', error);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onCancel();
    }
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">
            {isEditing ? 'Edit' : 'Add New'} Membership Plan
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isEditing ? 'Update the membership plan details' : 'Fill in the details to create a new plan'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-3 py-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs">Plan Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  placeholder="e.g., Premium, Basic"
                  className="h-8 text-sm"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="plan_name" className="text-xs">Plan Code</Label>
                <Input
                  id="plan_name"
                  name="plan_name"
                  value={formData.plan_name || ''}
                  onChange={handleChange}
                  placeholder="e.g., PREMIUM-MONTHLY"
                  className="h-8 text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="price" className="text-xs">Price (₹) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price ?? ''}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="h-8 text-sm"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="duration_days" className="text-xs">Duration (Days) *</Label>
                <Input
                  id="duration_days"
                  name="duration_days"
                  type="number"
                  min="1"
                  value={formData.duration_days ?? ''}
                  onChange={handleChange}
                  placeholder="e.g., 30, 90"
                  className="h-8 text-sm"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="description" className="text-xs">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Plan details and benefits"
                rows={2}
                className="text-sm min-h-[60px]"
              />
            </div>
            
            <div className="space-y-2 pt-2 border-t">
              <h3 className="font-medium text-sm">Access Permissions</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'gym_access', label: 'Gym' },
                  { key: 'class_access', label: 'Classes' },
                  { key: 'cardio_access', label: 'Cardio' },
                  { key: 'ice_bath_access', label: 'Ice Bath' },
                  { key: 'swimming_access', label: 'Pool' }
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-muted/30 rounded-md h-full text-xs">
                    <span className="font-medium">{label}</span>
                    <Switch
                      checked={!!formData.features?.[key]}
                      onCheckedChange={() => toggleFeature(key)}
                      className="ml-2 h-4 w-7"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-1 pb-1">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, is_active: checked }))
                }
                className="h-4 w-8"
              />
              <Label htmlFor="is_active" className="text-xs">Active Plan</Label>
            </div>
          </div>
          
          <DialogFooter className="pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="h-8 px-3 text-xs"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-8 px-3 text-xs"
            >
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Create')} Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MembershipPlanForm;
