
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectGroup, 
  SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
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

type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'upi' | 'other';

interface PaymentDetails {
  amount: number;
  method: PaymentMethod;
  transaction_id?: string;
  reference_number?: string;
  paid_at?: string;
  notes?: string;
}

interface MembershipAssignmentFormProps {
  memberId: string;
  onComplete?: () => void;
}

const MembershipAssignmentForm: React.FC<MembershipAssignmentFormProps> = ({
  memberId,
  onComplete,
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    const fetchMembershipPlans = async () => {
      try {
        setIsLoading(true);
        if (!currentBranch?.id) {
          console.error('No branch selected');
          toast.error('Please select a branch first');
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
    
    fetchMembershipPlans();
  }, [currentBranch?.id]);

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

  const validateForm = (): { isValid: boolean; message?: string } => {
    if (!selectedPlanId) {
      return { isValid: false, message: 'Please select a membership plan' };
    }
    if (!startDate) {
      return { isValid: false, message: 'Please select a start date' };
    }
    if (!endDate) {
      return { isValid: false, message: 'Please select an end date' };
    }
    if (!currentBranch?.id) {
      return { isValid: false, message: 'No branch selected' };
    }
    if (amount <= 0) {
      return { isValid: false, message: 'Amount must be greater than 0' };
    }
    if (amountPaid < 0) {
      return { isValid: false, message: 'Paid amount cannot be negative' };
    }
    if (amountPaid > amount) {
      return { isValid: false, message: 'Paid amount cannot be greater than total amount' };
    }
    return { isValid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, message } = validateForm();
    if (!isValid) {
      toast.error(message || 'Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!selectedPlanId) {
        throw new Error('Please select a membership plan');
      }
      
      if (isNaN(amountPaid) || amountPaid < 0) {
        throw new Error('Please enter a valid payment amount (must be 0 or greater)');
      }
      
      if (!memberId) {
        throw new Error('Member ID is required');
      }
      
      const paymentDetails: PaymentDetails = {
        amount: amountPaid,
        method: paymentMethod,
        notes: notes || undefined,
        paid_at: new Date().toISOString()
      };
      
      const assignmentOptions = {
        branchId: currentBranch?.id || null,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        notes: notes || undefined,
        staffId: undefined
      };
      
      toast.loading('Assigning membership...');
      
      const result = await membershipService.assignMembership(
        memberId,
        selectedPlanId,
        paymentDetails,
        assignmentOptions
      );
      
      toast.dismiss();
      
      console.log('Membership assignment result:', result);
      
      if (result.success) {
        toast.success(result.message || 'Membership assigned successfully');
        onComplete?.();
      } else {
        throw new Error(result.error || 'Failed to assign membership');
      }
    } catch (error) {
      console.error('Error assigning membership:', error);
      
      if (error instanceof Error) {
        const errorMessage = error.message;
        
        if (errorMessage.includes('Member not found')) {
          toast.error('Member not found. Please check the member ID and try again.');
        } else if (errorMessage.includes('Invalid membership plan')) {
          toast.error('The selected membership plan is not valid. Please refresh the page and try again.');
        } else if (errorMessage.includes('Invalid branch')) {
          toast.error('The selected branch is not valid. Please select a different branch or contact support.');
        } else if (errorMessage.includes('already has an active membership')) {
          toast.error('This member already has an active membership. Please check the member\'s current membership status.');
        } else if (errorMessage.includes('violates foreign key constraint')) {
          if (errorMessage.includes('member_id')) {
            toast.error('Invalid member. The specified member does not exist.');
          } else if (errorMessage.includes('membership_id')) {
            toast.error('Invalid membership plan. The selected plan does not exist.');
          } else if (errorMessage.includes('branch_id')) {
            toast.error('Invalid branch. The specified branch does not exist.');
          } else {
            toast.error('Data validation error. Please check your input and try again.');
          }
        } else if (errorMessage.includes('network')) {
          toast.error('Network error. Please check your connection and try again.');
        } else {
          toast.error(errorMessage || 'Failed to assign membership. Please try again.');
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
  );
};

export default MembershipAssignmentForm;
