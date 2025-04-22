
import React, { useState, useEffect } from 'react';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import { Check, CreditCard } from "lucide-react";
import { Member } from "@/types";
import { MembershipPlan } from "@/types/membership";
import { toast } from "sonner";
import { addDays, format } from "date-fns";
import { supabase } from '@/services/supabaseClient';
import { useAuth } from '@/hooks/use-auth';
import { useBranch } from '@/hooks/use-branch';
import { invoiceService } from '@/services/invoiceService';

interface MembershipAssignmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignMembership: (assignment: any) => void;
}

const mockMembers: Member[] = [
  { id: "member-1", name: "John Doe", email: "john@example.com", role: "member", membershipStatus: "active" },
  { id: "member-2", name: "Jane Smith", email: "jane@example.com", role: "member", membershipStatus: "active" },
  { id: "member-3", name: "Bob Johnson", email: "bob@example.com", role: "member", membershipStatus: "expired" },
];

const mockMembershipPlans: MembershipPlan[] = [
  {
    id: "basic-1m",
    name: "Basic Monthly",
    description: "Basic gym access",
    price: 1999,
    durationDays: 30,
    durationLabel: "1-month",
    benefits: ["Gym access", "Locker access"],
    allowedClasses: "basic-only",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "premium-3m",
    name: "Premium Quarterly",
    description: "Premium features",
    price: 5499,
    durationDays: 90,
    durationLabel: "3-month",
    benefits: ["Gym access", "Unlimited classes", "Personal trainer session"],
    allowedClasses: "group-only",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MembershipAssignmentForm = ({ isOpen, onClose, onAssignMembership }: MembershipAssignmentFormProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [autoRenew, setAutoRenew] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recordPayment, setRecordPayment] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const { user } = useAuth();
  const { currentBranch } = useBranch();

  useEffect(() => {
    // In a real application, fetch members and plans from the database
    // For now, using mock data
    setMembers(mockMembers);
    setMembershipPlans(mockMembershipPlans);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Update end date when plan or start date changes
    updateEndDate();
  }, [selectedPlanId, startDate]);

  const updateEndDate = () => {
    const selectedPlan = membershipPlans.find(plan => plan.id === selectedPlanId);
    if (selectedPlan && startDate) {
      const calculatedEndDate = addDays(startDate, selectedPlan.durationDays);
      setEndDate(calculatedEndDate);
    } else {
      setEndDate(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMemberId || !selectedPlanId || !startDate || !endDate) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const selectedMember = members.find(member => member.id === selectedMemberId);
      const selectedPlan = membershipPlans.find(plan => plan.id === selectedPlanId);
      
      if (!selectedMember || !selectedPlan) {
        throw new Error("Selected member or plan not found");
      }
      
      // Create membership assignment
      const membershipAssignment = {
        memberId: selectedMemberId,
        planId: selectedPlanId,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        status: "active",
        autoRenew,
        totalAmount: selectedPlan.price,
        amountPaid: recordPayment ? selectedPlan.price : 0,
        paymentStatus: recordPayment ? "paid" : "pending",
      };
      
      // Call the parent component's callback to save the assignment
      await onAssignMembership(membershipAssignment);
      
      // Generate invoice automatically
      if (selectedMember && selectedPlan && currentBranch?.id) {
        const invoice = await invoiceService.generateInvoiceForMembership(
          selectedMemberId,
          selectedMember.name,
          selectedPlanId,
          selectedPlan.name,
          selectedPlan.price,
          format(startDate, "yyyy-MM-dd"),
          user?.id || "",
          currentBranch.id
        );
        
        // If we need to record payment immediately
        if (recordPayment && invoice) {
          await invoiceService.recordPayment(
            invoice.id,
            selectedPlan.price,
            paymentMethod,
            user?.id || "",
            currentBranch.id
          );
        }
        
        toast.success("Membership assigned and invoice generated successfully");
      }
      
      onClose();
    } catch (error) {
      console.error("Error assigning membership:", error);
      toast.error("Failed to assign membership");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Assign Membership Plan</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="member">Select Member</Label>
              <Select 
                value={selectedMemberId} 
                onValueChange={setSelectedMemberId}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan">Select Membership Plan</Label>
              <Select 
                value={selectedPlanId} 
                onValueChange={setSelectedPlanId}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {membershipPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(plan.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <DatePicker 
                  date={startDate} 
                  onSelect={setStartDate}
                  className={isLoading ? "opacity-50 pointer-events-none" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <div className="border rounded-md p-3 bg-muted/20">
                  {endDate ? format(endDate, "MMM dd, yyyy") : "Select a plan"}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="autoRenew" 
                checked={autoRenew} 
                onCheckedChange={setAutoRenew}
                disabled={isLoading}
              />
              <Label htmlFor="autoRenew">Auto-renew membership</Label>
            </div>
            
            <div className="space-y-4 pt-2 border-t mt-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="recordPayment" 
                  checked={recordPayment} 
                  onCheckedChange={setRecordPayment}
                  disabled={isLoading}
                />
                <Label htmlFor="recordPayment">Record payment now</Label>
              </div>
              
              {recordPayment && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="razorpay">Razorpay</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Assign Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MembershipAssignmentForm;
