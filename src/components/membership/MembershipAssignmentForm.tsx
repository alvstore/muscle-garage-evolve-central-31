import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectGroup, 
  SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { AccessibleDialog } from '@/components/ui/accessible-dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { membershipService } from '@/services/members/membershipService';
import type { MembershipPlan } from '@/types/members/membership';
import { useBranch } from '@/hooks/settings/use-branches';
import { toast } from 'sonner';

interface MembershipAssignmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
  onAssigned?: () => void;
  onSuccess?: () => void;
}

const MembershipAssignmentForm: React.FC<MembershipAssignmentFormProps> = ({
  memberId,
  memberName,
  isOpen,
  onClose,
  onAssigned,
  onSuccess,
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

  useEffect(() => {
    const fetchMembershipPlans = async () => {
      try {
        setIsLoading(true);
        if (!currentBranch?.id) {
          console.error('No branch selected');
          toast.error('Please select a branch first');
          onClose();
          return;
        }
        const plans = await membershipService.getMembershipPlans(currentBranch.id);
        if (!plans || plans.length === 0) {
          toast.error('No membership plans found for the selected branch');
          return;
        }
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
  }, [isOpen, currentBranch?.id, onClose]);

  useEffect(() => {
    if (selectedPlanId && startDate) {
      const selectedPlan = membershipPlans.find(plan => plan.id === selectedPlanId);
      
      if (selectedPlan) {
        setAmount(selectedPlan.price);
        setAmountPaid(selectedPlan.price);
        
        const calculatedEndDate = membershipService.calculateEndDate(
          startDate,
          selectedPlan.duration_days
        );
        
        setEndDate(calculatedEndDate);
      }
    }
  }, [selectedPlanId, startDate, membershipPlans]);

  useEffect(() => {
    if (amount > 0) {
      const discountAmount = (amount * discount) / 100;
      setAmountPaid(amount - discountAmount);
    }
  }, [amount, discount]);

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setStartDate(date);
      
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

  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setDiscount(isNaN(value) ? 0 : Math.min(value, 100));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlanId || !startDate || !endDate || !currentBranch?.id) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await membershipService.assignMembership({
        member_id: memberId,
        membership_id: selectedPlanId,
        branch_id: currentBranch.id,
        start_date: startDate,
        end_date: endDate,
        total_amount: amount,
        payment: {
          amount: amountPaid,
          method: 'cash',
          status: amountPaid >= amount ? 'paid' : 'partial',
          notes: notes
        },
        notes: notes
      });
      
      if (result.success) {
        toast.success('Membership assigned successfully');
        onSuccess?.();
        onAssigned?.();
        onClose();
      } else {
        throw new Error(result.error || 'Failed to assign membership');
      }
    } catch (error) {
      console.error('Error assigning membership:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to assign membership. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AccessibleDialog
      open={isOpen}
      onOpenChange={onClose}
      title="Assign Membership"
      description={`Assign a membership plan to ${memberName}`}
    >
      <div className="p-4">
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
                      {membershipPlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id || ''}>
                          {plan.name} - ₹{plan.price} for {plan.duration_days} days
                        </SelectItem>
                      ))}
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
                  placeholder="Any additional notes"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
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
            </div>
          </form>
        )}
      </div>
    </AccessibleDialog>
  );
};

export default MembershipAssignmentForm;
