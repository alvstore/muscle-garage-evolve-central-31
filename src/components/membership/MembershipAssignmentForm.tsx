
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useBranch } from "@/hooks/use-branch";
import { Member } from "@/types/member";
import { MembershipPlan } from "@/types/membership";
import { MembershipAssignment } from "@/types/membership-assignment";
import { invoiceService } from "@/services/invoiceService";
import MemberSelect from "./MemberSelect";
import MembershipPlanSelect from "./MembershipPlanSelect";
import MembershipDatesForm from "./MembershipDatesForm";
import MembershipPaymentForm from "./MembershipPaymentForm";
import MembershipInvoiceSwitch from "./MembershipInvoiceSwitch";

const formSchema = z.object({
  memberId: z.string().min(1, {
    message: "Please select a member.",
  }),
  planId: z.string().min(1, {
    message: "Please select a membership plan.",
  }),
  startDate: z.date({
    required_error: "Please select a start date.",
  }),
  endDate: z.date({
    required_error: "Please select an end date.",
  }),
  totalAmount: z.number().min(1, {
    message: "Total amount must be greater than 0.",
  }),
  amountPaid: z.number().min(0, {
    message: "Amount paid cannot be negative.",
  }),
  paymentMethod: z.enum(["cash", "card", "bank", "pending"], {
    required_error: "Please select a payment method.",
  }),
  notes: z.string().optional(),
  createInvoice: z.boolean().default(false),
});

const MembershipAssignmentForm = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const { toast } = useToast();
  const { currentBranch } = useBranch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      memberId: "",
      planId: "",
      startDate: new Date(),
      endDate: new Date(),
      totalAmount: 0,
      amountPaid: 0,
      paymentMethod: "cash",
      notes: "",
      createInvoice: false,
    },
  });

  useEffect(() => {
    const mockMembers: Member[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        status: "active",
        membershipStatus: "active",
        membershipId: "1",
        membershipStartDate: new Date().toISOString(),
        membershipEndDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
        role: "member",
        branchId: currentBranch?.id,
      },
    ];

    const mockPlans: MembershipPlan[] = [
      {
        id: "1",
        name: "Basic",
        description: "Access to gym only",
        price: 1999,
        durationDays: 30,
        durationLabel: "1-month",
        benefits: ["Gym access", "24/7 entry"],
        allowedClasses: "basic-only",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Premium",
        description: "Full access to all facilities",
        price: 3999,
        durationDays: 90,
        durationLabel: "3-month",
        benefits: ["Gym access", "Pool access", "Group classes", "Personal trainer session"],
        allowedClasses: "all",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Annual",
        description: "Full year access to all facilities",
        price: 14999,
        durationDays: 365,
        durationLabel: "12-month",
        benefits: ["Gym access", "Pool access", "Group classes", "Personal trainer sessions"],
        allowedClasses: "all",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    setMembers(mockMembers);
    setPlans(mockPlans);
  }, [currentBranch?.id]);

  const handlePlanChange = (planId: string) => {
    const plan = plans.find((plan) => plan.id === planId);
    setSelectedPlan(plan);
    form.setValue("totalAmount", plan?.price || 0);
    form.setValue("amountPaid", plan?.price || 0);
  };

  const handleMemberChange = (memberId: string) => {
    const member = members.find((member) => member.id === memberId);
    setSelectedMember(member);
  };

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    const assignment: MembershipAssignment = {
      memberId: data.memberId,
      membershipId: data.planId,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      amount: selectedPlan?.price || 0,
      paymentStatus: data.paymentMethod === "pending" ? "pending" : "paid",
      notes: data.notes,
      branchId: currentBranch?.id,
      planId: data.planId,
      planName: selectedPlan?.name,
      totalAmount: data.totalAmount,
      amountPaid: data.amountPaid,
      paymentMethod: data.paymentMethod,
    };

    setTimeout(() => {
      console.log("Membership assignment created:", assignment);

      if (data.createInvoice) {
        invoiceService.createInvoice({
          memberId: data.memberId,
          memberName: selectedMember?.name || "",
          amount: data.totalAmount,
          description: `Membership: ${selectedPlan?.name || "Unknown Plan"}`,
          dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
          status: data.paymentMethod === "pending" ? "pending" : "paid",
          items: [
            {
              description: `${selectedPlan?.name || "Membership"} (${selectedPlan?.durationLabel || "Unknown duration"})`,
              quantity: 1,
              unitPrice: selectedPlan?.price || 0,
              amount: selectedPlan?.price || 0,
            },
          ],
        });
      }

      toast({
        title: "Membership Assigned",
        description: `Successfully assigned ${selectedPlan?.name} plan to ${selectedMember?.name}`,
      });

      setLoading(false);
      form.reset();
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Membership</CardTitle>
        <CardDescription>Assign a membership plan to a member</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <MemberSelect members={members} control={form.control} onChange={handleMemberChange} />
              <MembershipPlanSelect plans={plans} control={form.control} onChange={handlePlanChange} />
              <MembershipDatesForm control={form.control} />
              <MembershipPaymentForm control={form.control} />
              <MembershipInvoiceSwitch control={form.control} />
            </div>
            <Separator />
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => form.reset()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Assigning..." : "Assign Membership"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MembershipAssignmentForm;
