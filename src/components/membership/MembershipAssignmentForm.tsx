import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Member } from "@/types/member";
import { MembershipPlan } from "@/types/membership";
import { MembershipAssignment } from "@/types/membership-assignment";
import { invoiceService } from "@/services/invoiceService";
import { useBranch } from "@/hooks/use-branch";

const mockMembers: Member[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    phone: "9876543210",
    status: "active",
    membershipStatus: "active",
    membershipId: "basic",
    membershipStartDate: new Date(2023, 0, 1),
    membershipEndDate: new Date(2023, 11, 31),
    role: "member"
  },
  {
    id: "2",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "9876543211",
    status: "active",
    membershipStatus: "expired",
    membershipId: null,
    membershipStartDate: null,
    membershipEndDate: null,
    role: "member"
  }
];

const mockMembershipPlans: MembershipPlan[] = [
  {
    id: "basic",
    name: "Basic Membership",
    description: "Access to gym only",
    price: 1000,
    duration_days: 30,
    is_active: true,
    features: { gym: true, pool: false, classes: false }
  },
  {
    id: "premium",
    name: "Premium Membership",
    description: "Access to gym and swimming pool",
    price: 2000,
    duration_days: 30,
    is_active: true,
    features: { gym: true, pool: true, classes: false }
  },
  {
    id: "gold",
    name: "Gold Membership",
    description: "Access to all facilities including classes",
    price: 3000,
    duration_days: 90,
    is_active: true,
    features: { gym: true, pool: true, classes: true }
  }
];

interface Membership {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  is_active: boolean;
  features: {
    gym: boolean;
    pool: boolean;
    classes: boolean;
  }
}

interface MembershipAssignmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignMembership: (assignment: MembershipAssignment) => void;
}

const MembershipAssignmentForm = ({
  open,
  onOpenChange,
  onAssignMembership
}: MembershipAssignmentFormProps) => {
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [recordPayment, setRecordPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<Membership[]>([]);
  const { currentBranch } = useBranch();

  useEffect(() => {
    setMembers(mockMembers);
    setMembershipPlans(mockMembershipPlans);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    updateEndDate();
  }, [selectedPlanId, startDate]);

  const updateEndDate = () => {
    if (!selectedPlanId) return;
    
    const plan = membershipPlans.find(p => p.id === selectedPlanId);
    if (!plan) return;
    
    const newEndDate = new Date(startDate);
    newEndDate.setDate(newEndDate.getDate() + (plan.duration_days - 1));
    setEndDate(newEndDate);
    
    setTotalAmount(plan.price);
    setPaymentAmount(plan.price);
  };

  const resetForm = () => {
    setSelectedMemberId("");
    setSelectedPlanId("");
    setStartDate(new Date());
    setTotalAmount(0);
    setPaymentAmount(0);
    setRecordPayment(false);
    setPaymentMethod("cash");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMemberId || !selectedPlanId) {
      toast.error("Please select a member and a plan");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const selectedMember = members.find(m => m.id === selectedMemberId);
      const selectedPlan = membershipPlans.find(p => p.id === selectedPlanId);
      
      if (!selectedMember || !selectedPlan) {
        throw new Error("Selected member or plan not found");
      }
      
      const membershipAssignment = {
        memberId: selectedMemberId,
        planId: selectedPlanId,
        planName: selectedPlan.name,
        startDate: startDate,
        endDate: endDate,
        totalAmount: totalAmount,
        amountPaid: recordPayment ? paymentAmount : 0,
        paymentMethod: recordPayment ? paymentMethod : null,
        branchId: currentBranch?.id,
        paymentStatus: recordPayment ? "paid" : "pending",
      };
      
      await onAssignMembership(membershipAssignment);
      
      if (selectedMember && selectedPlan && currentBranch?.id) {
        const invoice = await invoiceService.generateInvoiceForMembership(
          selectedMemberId,
          selectedMember.name,
          selectedPlan.id,
          selectedPlan.name,
          totalAmount,
          startDate.toISOString(),
          endDate.toISOString(),
          currentBranch.id
        );
        
        if (recordPayment && invoice) {
          await invoiceService.recordPayment(
            invoice.id,
            paymentAmount,
            paymentMethod,
            new Date().toISOString(),
            currentBranch.id
          );
        }
      }
      
      resetForm();
      onOpenChange(false);
      toast.success("Membership plan assigned successfully");
      
    } catch (error) {
      console.error("Error assigning membership:", error);
      toast.error("Failed to assign membership plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentAmountChange = (value: string) => {
    const amount = parseFloat(value);
    if (isNaN(amount)) {
      setPaymentAmount(0);
    } else {
      setPaymentAmount(Math.min(amount, totalAmount));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Membership Plan</DialogTitle>
          <DialogDescription>
            Assign a membership plan to a member and set its duration.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="member">Select Member</Label>
              <Select
                value={selectedMemberId}
                onValueChange={setSelectedMemberId}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="plan">Select Plan</Label>
              <Select
                value={selectedPlanId}
                onValueChange={setSelectedPlanId}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {membershipPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} (₹{plan.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <DatePicker 
                date={startDate} 
                onSelect={setStartDate}
                className={isLoading ? "opacity-50 pointer-events-none" : ""}
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <DatePicker 
                date={endDate} 
                onSelect={setEndDate}
                className={isLoading ? "opacity-50 pointer-events-none" : ""}
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input
                id="totalAmount"
                placeholder="Enter amount"
                type="number"
                value={totalAmount.toString()}
                onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="recordPayment"
                checked={recordPayment}
                onCheckedChange={setRecordPayment}
                disabled={isLoading}
              />
              <Label htmlFor="recordPayment">Record Payment Now</Label>
            </div>
            
            {recordPayment && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="paymentAmount">Payment Amount</Label>
                  <Input
                    id="paymentAmount"
                    placeholder="Enter payment amount"
                    type="number"
                    value={paymentAmount.toString()}
                    onChange={(e) => handlePaymentAmountChange(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign Plan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MembershipAssignmentForm;
