
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import { MembershipPlan } from "@/types/membership";
import MembershipPlanForm from "./MembershipPlanForm";
import { toast } from "sonner";
import { supabase } from '@/services/supabaseClient';
import { useBranch } from '@/hooks/use-branch';

const MembershipPlans = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    fetchMembershipPlans();
  }, [currentBranch?.id]);

  const fetchMembershipPlans = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('memberships')
        .select('*')
        .order('price');
      
      // Filter by branch if a branch is selected
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        // Format the data to match the MembershipPlan type
        const formattedPlans = data.map(plan => ({
          id: plan.id,
          name: plan.name,
          description: plan.description || '',
          price: plan.price,
          durationDays: plan.duration_days,
          durationLabel: getDurationLabel(plan.duration_days),
          benefits: plan.features?.features || [],
          allowedClasses: plan.allowed_classes || 'basic-only',
          status: plan.is_active ? 'active' : 'inactive',
          createdAt: plan.created_at,
          updatedAt: plan.updated_at,
        }));
        
        setPlans(formattedPlans);
      }
    } catch (error) {
      console.error('Error fetching membership plans:', error);
      toast.error('Failed to load membership plans');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert duration days to label
  const getDurationLabel = (days: number): string => {
    if (days <= 31) return '1-month';
    if (days <= 92) return '3-month';
    if (days <= 183) return '6-month';
    return '12-month';
  };

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
        .from('memberships')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPlans(plans.filter(plan => plan.id !== id));
      toast.success("Membership plan deleted successfully");
    } catch (error) {
      console.error('Error deleting membership plan:', error);
      toast.error('Failed to delete membership plan');
    }
  };

  const handleSavePlan = async (plan: MembershipPlan) => {
    try {
      // Convert the plan data to match the database schema
      const dbPlan = {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        duration_days: plan.durationDays,
        features: { features: plan.benefits },
        allowed_classes: plan.allowedClasses,
        is_active: plan.status === 'active',
        branch_id: currentBranch?.id,
        updated_at: new Date().toISOString()
      };

      if (editingPlan) {
        // Update existing plan
        const { error } = await supabase
          .from('memberships')
          .update(dbPlan)
          .eq('id', plan.id);
        
        if (error) throw error;
        
        setPlans(plans.map(p => p.id === plan.id ? plan : p));
        toast.success("Membership plan updated successfully");
      } else {
        // Create new plan
        const { data, error } = await supabase
          .from('memberships')
          .insert({
            ...dbPlan,
            created_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (error) throw error;
        
        if (data) {
          const newPlan: MembershipPlan = {
            id: data.id,
            name: data.name,
            description: data.description || '',
            price: data.price,
            durationDays: data.duration_days,
            durationLabel: getDurationLabel(data.duration_days),
            benefits: data.features?.features || [],
            allowedClasses: data.allowed_classes || 'basic-only',
            status: data.is_active ? 'active' : 'inactive',
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
          
          setPlans([...plans, newPlan]);
          toast.success("Membership plan created successfully");
        }
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving membership plan:', error);
      toast.error('Failed to save membership plan');
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
          {isLoading ? (
            <div className="flex justify-center py-8">Loading membership plans...</div>
          ) : plans.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No membership plans found. Click "Add Plan" to create one.
            </div>
          ) : (
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
          )}
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
