
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
import { MembershipPlan, MembershipDuration, ClassType, MembershipPlanStatus } from "@/types/membership";

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
    duration: MembershipDuration.MONTHLY,
    durationLabel: MembershipDuration.ONE_MONTH,
    benefits: [] as string[],
    allowedClasses: [ClassType.BASIC_ONLY],
    status: MembershipPlanStatus.ACTIVE,
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (plan) {
      // Ensure benefits is always an array
      const benefitsArray = Array.isArray(plan.benefits) ? plan.benefits : [];
      setFormData({
        ...plan,
        benefits: benefitsArray
      });
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
      const durationMap: Record<string, number> = {
        [MembershipDuration.ONE_MONTH]: 30,
        [MembershipDuration.THREE_MONTH]: 90,
        [MembershipDuration.SIX_MONTH]: 180,
        [MembershipDuration.TWELVE_MONTH]: 365,
      };
      setFormData(prev => ({
        ...prev,
        durationDays: durationMap[value] || 30,
        duration: value as MembershipDuration
      }));
    }
  };

  const handleBenefitsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const benefits = e.target.value.split('\n')
      .map(benefit => benefit.trim())
      .filter(benefit => benefit !== '');
    setFormData(prev => ({
      ...prev,
      benefits
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price),
      updated_at: new Date().toISOString(),
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
                  value={formData.durationLabel?.toString() || MembershipDuration.ONE_MONTH}
                  onValueChange={(value) => handleSelectChange('durationLabel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MembershipDuration.ONE_MONTH}>1 Month</SelectItem>
                    <SelectItem value={MembershipDuration.THREE_MONTH}>3 Months</SelectItem>
                    <SelectItem value={MembershipDuration.SIX_MONTH}>6 Months</SelectItem>
                    <SelectItem value={MembershipDuration.TWELVE_MONTH}>12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allowedClasses">Classes Access</Label>
                <Select
                  value={formData.allowedClasses ? formData.allowedClasses[0] : ClassType.BASIC_ONLY}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, allowedClasses: [value as ClassType] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ClassType.ALL}>All Classes</SelectItem>
                    <SelectItem value={ClassType.GROUP_ONLY}>Group Classes Only</SelectItem>
                    <SelectItem value={ClassType.BASIC_ONLY}>Basic Classes Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits (one per line)</Label>
              <Textarea
                id="benefits"
                value={(formData.benefits || []).join('\n')}
                onChange={handleBenefitsChange}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MembershipPlanStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={MembershipPlanStatus.INACTIVE}>Inactive</SelectItem>
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
