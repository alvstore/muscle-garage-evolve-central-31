
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MembershipPlan, MembershipPlanStatus } from '@/types';
import { Switch } from '@/components/ui/switch';

export interface MembershipPlanFormProps {
  plan: MembershipPlan;
  onSave: (plan: MembershipPlan) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Default values for a new membership plan
const defaultPlan: MembershipPlan = {
  id: '',
  name: '',
  description: '',
  price: 0,
  duration_days: 30,
  features: [],
  benefits: [],
  is_active: true,
  status: 'active',
  branch_id: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const MembershipPlanForm = ({ plan, onSave, onCancel, isSubmitting = false }: MembershipPlanFormProps) => {
  const [formData, setFormData] = useState<MembershipPlan>(plan || defaultPlan);
  
  useEffect(() => {
    setFormData(plan || defaultPlan);
  }, [plan]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'duration_days' ? parseFloat(value) : value,
    }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_active: checked,
      isActive: checked,
    }));
  };
  
  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as MembershipPlanStatus,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Plan Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price || ''}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration_days">Duration (days)</Label>
          <Input
            id="duration_days"
            name="duration_days"
            type="number"
            value={formData.duration_days || formData.durationDays || ''}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          name="status"
          value={formData.status || 'active'}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active || formData.isActive || false}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Plan'}
        </Button>
      </div>
    </form>
  );
};

export default MembershipPlanForm;
