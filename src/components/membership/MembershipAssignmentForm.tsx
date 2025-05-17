
// Update the MembershipAssignmentForm component to use the new calculateEndDate and assignMembership methods
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectGroup, 
  SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { membershipService } from '@/services/membershipService';
import { MembershipPlan } from '@/types';
import { useBranch } from '@/hooks/use-branches';
import { toast } from 'sonner';

interface MembershipAssignmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
  onAssigned?: () => void;
}

const MembershipAssignmentForm: React.FC<MembershipAssignmentFormProps> = ({
  isOpen,
  onClose,
  memberId,
  memberName,
  onAssigned
}) => {
  const { currentBranch } = useBranch();
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [discount, setDiscount] = useState<number>(0);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  
  // Load membership plans
  useEffect(() => {
    const fetchMembershipPlans = async () => {
      try {
        setIsLoading(true);
        const plans = await membershipService.getMembershipPlans(currentBranch?.id);
        setMembershipPlans(plans);
      } catch (error) {
        console.error('Error fetching membership plans:', error);
        toast.error('Failed to load membership plans');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchMembershipPlans();
    }
  }, [isOpen, currentBranch?.id]);
  
  // Update end date and amount when plan changes
  useEffect(() => {
    if (selectedPlanId && startDate) {
      const selectedPlan = membershipPlans.find(plan => plan.id === selectedPlanId);
      
      if (selectedPlan) {
        // Update amount
        setAmount(selectedPlan.price);
        setAmountPaid(selectedPlan.price);
        
        // Calculate end date based on duration
        const calculatedEndDate = membershipService.calculateEndDate(
          startDate,
          selectedPlan.duration_days
        );
        
        setEndDate(calculatedEndDate);
      }
    }
  }, [selectedPlanId, startDate, membershipPlans]);
  
  // Update amount paid when discount changes
  useEffect(() => {
    if (amount > 0) {
      const discountAmount = (amount * discount) / 100;
      setAmountPaid(amount - discountAmount);
    }
  }, [amount, discount]);
  
  // Handle start date changes
  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setStartDate(date);
      
      // Recalculate end date if plan selected
      if (selectedPlanId) {
        const selectedPlan = membershipPlans.find(plan => plan.id === selectedPlanId);
        if (selectedPlan) {
          const calculatedEndDate = membershipService.calculateEndDate(
            date,
            selectedPlan.duration_days
          );
          setEndDate(calculatedEndDate);
        }
      }
    }
  };
  
  // Handle plan selection
  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
  };
  
  // Handle discount change
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setDiscount(isNaN(value) ? 0 : Math.min(value, 100));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlanId || !startDate || !endDate) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const membershipData = {
        member_id: memberId,
        membership_id: selectedPlanId,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        total_amount: amount,
        amount_paid: amountPaid,
        payment_status: amountPaid >= amount ? 'paid' : 'partial',
        status: 'active',
        branch_id: currentBranch?.id
      };
      
      const success = await membershipService.assignMembership(membershipData);
      
      if (success) {
        toast.success('Membership assigned successfully');
        if (onAssigned) {
          onAssigned();
        }
        onClose();
      } else {
        toast.error('Failed to assign membership');
      }
    } catch (error) {
      console.error('Error assigning membership:', error);
      toast.error('Failed to assign membership');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Membership</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Member</Label>
                <Input value={memberName} disabled />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="membership_plan">Membership Plan</Label>
                <Select onValueChange={handlePlanChange} value={selectedPlanId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a membership plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {membershipPlans.map((plan) =>
                        plan.is_active && (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - ₹{plan.price} for {plan.duration_days} days
                          </SelectItem>
                        )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={handleStartDateChange}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                        disabled
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Calculated from plan"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    disabled={!selectedPlanId}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={handleDiscountChange}
                    disabled={!selectedPlanId}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="amount_paid">Amount Paid (₹)</Label>
                <Input
                  id="amount_paid"
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  disabled={!selectedPlanId}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !selectedPlanId}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Assign Membership"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MembershipAssignmentForm;
