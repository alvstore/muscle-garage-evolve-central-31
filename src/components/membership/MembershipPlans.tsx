
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import { MembershipPlan } from "@/types/membership";
import MembershipPlanForm from "./MembershipPlanForm";
import { toast } from "sonner";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { supabase } from "@/services/supabaseClient";

const MembershipPlans = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const { data: plans, isLoading, error } = useSupabaseQuery<MembershipPlan[]>({
    tableName: 'membership_plans',
    select: '*',
    orderBy: {
      column: 'created_at',
      ascending: false
    }
  });

  const handleAddPlan = () => {
    setEditingPlan(null);
    setIsFormOpen(true);
  };

  const handleEditPlan = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  const handleDeletePlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('membership_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Membership plan deleted successfully");
    } catch (err) {
      toast.error("Failed to delete membership plan");
      console.error("Error deleting plan:", err);
    }
  };

  const handleSavePlan = async (plan: MembershipPlan) => {
    try {
      if (editingPlan) {
        const { error } = await supabase
          .from('membership_plans')
          .update(plan)
          .eq('id', plan.id);

        if (error) throw error;
        toast.success("Membership plan updated successfully");
      } else {
        const { error } = await supabase
          .from('membership_plans')
          .insert([plan]);

        if (error) throw error;
        toast.success("Membership plan created successfully");
      }
      setIsFormOpen(false);
    } catch (err) {
      toast.error("Failed to save membership plan");
      console.error("Error saving plan:", err);
    }
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
