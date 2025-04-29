
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import { MembershipPlan } from "@/types/membership";
import MembershipPlanForm from "./MembershipPlanForm";
import { toast } from "sonner";
import { useEffect } from "react";
import { supabase } from '@/services/supabaseClient';

const mockPlans: MembershipPlan[] = [
  {
    id: "basic-1m",
    name: "Basic Monthly",
    description: "Access to basic facilities with limited class bookings",
    price: 1999,
    durationDays: 30,
    durationLabel: "1-month",
    benefits: ["Access to gym equipment", "2 group classes per week", "Locker access"],
    allowedClasses: "basic-only",
    status: "active",
    createdAt: new Date(2023, 0, 1).toISOString(),
    updatedAt: new Date(2023, 0, 1).toISOString(),
  },
  {
    id: "premium-3m",
    name: "Premium Quarterly",
    description: "Full access to all facilities and classes with added benefits",
    price: 5499,
    durationDays: 90,
    durationLabel: "3-month",
    benefits: ["Full access to gym equipment", "Unlimited group classes", "Personal trainer (1 session/month)", "Nutrition consultation"],
    allowedClasses: "group-only",
    status: "active",
    createdAt: new Date(2023, 0, 1).toISOString(),
    updatedAt: new Date(2023, 0, 1).toISOString(),
  },
  {
    id: "platinum-12m",
    name: "Platinum Annual",
    description: "Our most comprehensive package with all premium features",
    price: 18999,
    durationDays: 365,
    durationLabel: "12-month",
    benefits: ["24/7 access to gym equipment", "Unlimited group & premium classes", "Personal trainer (2 sessions/month)", "Nutrition consultation", "Free supplements"],
    allowedClasses: "all",
    status: "active",
    createdAt: new Date(2023, 0, 1).toISOString(),
    updatedAt: new Date(2023, 0, 1).toISOString(),
  },
];

const MembershipPlans = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  useEffect(() => {
    fetchMembershipPlans();
  }, []);

  const fetchMembershipPlans = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('membership_plans')
        .select('*')
        .order('price');
      
      if (error) throw error;
      
      if (data) {
        setPlans(data);
      }
    } catch (error) {
      console.error('Error fetching membership plans:', error);
      toast.error('Failed to load membership plans');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlan = () => {
    setEditingPlan(null);
    setIsFormOpen(true);
  };

  const handleEditPlan = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  const handleDeletePlan = (id: string) => {
    // In a real application, you would make an API call
    setPlans(plans.filter(plan => plan.id !== id));
    toast.success("Membership plan deleted successfully");
  };

  const handleSavePlan = (plan: MembershipPlan) => {
    // In a real application, you would make an API call
    if (editingPlan) {
      setPlans(plans.map(p => p.id === plan.id ? plan : p));
      toast.success("Membership plan updated successfully");
    } else {
      const newPlan: MembershipPlan = {
        ...plan,
        id: `plan-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPlans([...plans, newPlan]);
      toast.success("Membership plan created successfully");
    }
    setIsFormOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Membership Plans</CardTitle>
          <Button onClick={handleAddPlan} className="flex items-center gap-1">
            <PlusIcon className="h-4 w-4" /> Add Plan
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Class Access</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{plan.durationLabel}</TableCell>
                  <TableCell>{formatPrice(plan.price)}</TableCell>
                  <TableCell>
                    {plan.allowedClasses === 'all' ? 'All Classes' : 
                     plan.allowedClasses === 'group-only' ? 'Group Classes Only' : 
                     'Basic Classes Only'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(plan.status)}>
                      {plan.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditPlan(plan)}>
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeletePlan(plan.id)}>
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isFormOpen && (
        <MembershipPlanForm
          plan={editingPlan}
          onSave={handleSavePlan}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
};

export default MembershipPlans;
