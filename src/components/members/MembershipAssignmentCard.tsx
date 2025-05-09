
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MembershipAssignment } from "@/types/membership-assignment";
import { useBranch } from "@/hooks/use-branch";

interface MembershipAssignmentCardProps {
  memberId: string;
}

const MembershipAssignmentCard: React.FC<MembershipAssignmentCardProps> = ({ memberId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [membershipPlans, setMembershipPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // Default 30 days
  const { toast } = useToast();
  const { currentBranch } = useBranch();

  useEffect(() => {
    fetchMembershipPlans();
  }, [currentBranch?.id]);

  const fetchMembershipPlans = async () => {
    try {
      if (!currentBranch?.id) return;
      
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('branch_id', currentBranch.id)
        .eq('is_active', true);
      
      if (error) throw error;
      setMembershipPlans(data || []);
    } catch (error) {
      console.error('Error fetching membership plans:', error);
      toast({
        title: "Error",
        description: "Failed to load membership plans",
        variant: "destructive"
      });
    }
  };

  const handleAssignMembership = async () => {
    try {
      if (!selectedPlanId || !memberId) {
        toast({
          title: "Missing Information",
          description: "Please select a membership plan",
          variant: "destructive"
        });
        return;
      }

      setIsLoading(true);

      const selectedPlan = membershipPlans.find(plan => plan.id === selectedPlanId);
      if (!selectedPlan) {
        throw new Error("Selected plan not found");
      }

      // Create membership assignment
      const membershipAssignment: Partial<MembershipAssignment> = {
        memberId,
        membershipId: selectedPlanId,
        startDate,
        endDate,
        paymentStatus: 'pending',
        amount: selectedPlan.price,
        branchId: currentBranch?.id,
        planName: selectedPlan.name,
        totalAmount: selectedPlan.price
      };

      // Insert into member_memberships table
      const { data, error } = await supabase
        .from('member_memberships')
        .insert([{
          member_id: memberId,
          membership_id: selectedPlanId,
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd'),
          payment_status: 'pending',
          amount_paid: 0,
          total_amount: selectedPlan.price,
          branch_id: currentBranch?.id,
          status: 'active'
        }])
        .select();

      if (error) throw error;

      // Update the member's membership information
      const { error: memberUpdateError } = await supabase
        .from('members')
        .update({
          membership_id: selectedPlanId,
          membership_start_date: format(startDate, 'yyyy-MM-dd'),
          membership_end_date: format(endDate, 'yyyy-MM-dd'),
          membership_status: 'active'
        })
        .eq('id', memberId);

      if (memberUpdateError) throw memberUpdateError;

      toast({
        title: "Success",
        description: "Membership assigned successfully",
      });

      // Reset form
      setSelectedPlanId("");
    } catch (error) {
      console.error('Error assigning membership:', error);
      toast({
        title: "Error",
        description: "Failed to assign membership plan",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateEndDateBasedOnPlan = (planId: string) => {
    const plan = membershipPlans.find(p => p.id === planId);
    if (plan && plan.duration_days) {
      const newEndDate = new Date(startDate);
      newEndDate.setDate(newEndDate.getDate() + plan.duration_days);
      setEndDate(newEndDate);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Assign Membership Plan
        </CardTitle>
        <CardDescription>Assign a membership plan to this member</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Membership Plan</label>
            <Select
              value={selectedPlanId}
              onValueChange={(value) => {
                setSelectedPlanId(value);
                updateEndDateBasedOnPlan(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a membership plan" />
              </SelectTrigger>
              <SelectContent>
                {membershipPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} - ₹{plan.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Start Date</label>
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
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      if (date) {
                        setStartDate(date);
                        // Update end date based on selected plan
                        if (selectedPlanId) {
                          updateEndDateBasedOnPlan(selectedPlanId);
                        }
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                    disabled={(date) => date < startDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleAssignMembership} 
          disabled={isLoading || !selectedPlanId}
          className="w-full"
        >
          {isLoading ? "Assigning..." : "Assign Membership"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MembershipAssignmentCard;
