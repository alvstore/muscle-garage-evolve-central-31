
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  MembershipPlan, 
  MembershipDuration, 
  ClassType, 
  MembershipPlanStatus 
} from "@/types/membership";

interface MembershipPlanFormProps {
  plan: MembershipPlan | null;
  onSave: (plan: MembershipPlan) => void;
  onCancel: () => void;
}

const MembershipPlanForm = ({ plan, onSave, onCancel }: MembershipPlanFormProps) => {
  const [formData, setFormData] = useState<MembershipPlan>({
    id: '',
    name: '',
    description: '',
    price: 0,
    durationDays: 30,
    durationLabel: '1-month',
    benefits: [],
    allowedClasses: 'basic-only',
    status: 'active',
    createdAt: '',
    updatedAt: '',
  });

  useEffect(() => {
    if (plan) {
      setFormData(plan);
    }
  }, [plan]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });

    // Set duration days based on selected duration label
    if (name === 'durationLabel') {
      const durationMap: Record<MembershipDuration, number> = {
        '1-month': 30,
        '3-month': 90,
        '6-month': 180,
        '12-month': 365,
      };
      setFormData(prev => ({
        ...prev,
        durationDays: durationMap[value as MembershipDuration]
      }));
    }
  };

  const handleBenefitsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const benefits = e.target.value.split('\n').filter(benefit => benefit.trim() !== '');
    setFormData({ ...formData, benefits });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{plan ? 'Edit' : 'Add'} Membership Plan</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
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
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="durationLabel">Duration</Label>
                <Select
                  value={formData.durationLabel}
                  onValueChange={(value) => handleSelectChange('durationLabel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-month">1 Month</SelectItem>
                    <SelectItem value="3-month">3 Months</SelectItem>
                    <SelectItem value="6-month">6 Months</SelectItem>
                    <SelectItem value="12-month">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allowedClasses">Classes Access</Label>
                <Select
                  value={formData.allowedClasses}
                  onValueChange={(value) => handleSelectChange('allowedClasses', value as ClassType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="group-only">Group Classes Only</SelectItem>
                    <SelectItem value="basic-only">Basic Classes Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits (one per line)</Label>
              <Textarea
                id="benefits"
                value={formData.benefits.join('\n')}
                onChange={handleBenefitsChange}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value as MembershipPlanStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MembershipPlanForm;
