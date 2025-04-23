
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import { MembershipPlan } from "@/types/membership";
import MembershipPlanForm from "./MembershipPlanForm";
import { membershipService } from "@/services/membershipService";
import { useBranch } from "@/hooks/use-branch";

const MembershipPlans = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchPlans = async () => {
      const fetchedPlans = await membershipService.getMembershipPlans();
      setPlans(fetchedPlans);
    };

    fetchPlans();
  }, [currentBranch]);

  const handleAddPlan = () => {
    setEditingPlan(null);
    setIsFormOpen(true);
  };

  const handleEditPlan = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  const handleDeletePlan = async (id: string) => {
    const success = await membershipService.deleteMembershipPlan(id);
    if (success) {
      setPlans(plans.filter(plan => plan.id !== id));
    }
  };

  const handleSavePlan = async (plan: MembershipPlan) => {
    if (editingPlan) {
      // Update existing plan
      const updatedPlan = await membershipService.updateMembershipPlan(plan);
      if (updatedPlan) {
        setPlans(plans.map(p => p.id === plan.id ? updatedPlan : p));
      }
    } else {
      // Create new plan
      const newPlan = await membershipService.createMembershipPlan(plan);
      if (newPlan) {
        setPlans([...plans, newPlan]);
      }
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
          <CardTitle>
            Membership Plans 
            {currentBranch && ` - ${currentBranch.name}`}
          </CardTitle>
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
