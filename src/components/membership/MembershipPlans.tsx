
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, EditIcon, TrashIcon, Loader2 } from "lucide-react";
import { MembershipPlan } from "@/types/membership";
import MembershipPlanForm from "./MembershipPlanForm";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';

const MembershipPlans = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentBranch } = useBranch();

  // Fetch membership plans from Supabase
  useEffect(() => {
    const fetchMembershipPlans = async () => {
      setLoading(true);
      
      try {
        let query = supabase
          .from('memberships')
          .select('*')
          .order('created_at', { ascending: false });
        
        // Apply branch filter if available
        if (currentBranch?.id) {
          query = query.eq('branch_id', currentBranch.id);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform the data to match the MembershipPlan type
          const transformedData: MembershipPlan[] = data.map(plan => ({
            id: plan.id,
            name: plan.name,
            description: plan.description || '',
            price: plan.price,
            durationDays: plan.duration_days,
            durationLabel: getDurationLabel(plan.duration_days),
            benefits: plan.features ? (typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features) : [],
            allowedClasses: getClassType(plan.features),
            status: plan.is_active ? "active" : "inactive",
            createdAt: plan.created_at,
            updatedAt: plan.updated_at
          }));
          
          setPlans(transformedData);
        }
      } catch (error) {
        console.error('Error fetching membership plans:', error);
        toast.error('Failed to load membership plans');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembershipPlans();
  }, [currentBranch?.id]);

  // Helper to determine duration label from days
  const getDurationLabel = (days: number): "1-month" | "3-month" | "6-month" | "12-month" => {
    if (days <= 31) return "1-month";
    if (days <= 92) return "3-month";
    if (days <= 183) return "6-month";
    return "12-month";
  };
  
  // Helper to determine class type from features
  const getClassType = (features: any): "all" | "group-only" | "basic-only" => {
    if (!features) return "basic-only";
    
    const featureObj = typeof features === 'string' ? JSON.parse(features) : features;
    
    if (featureObj.classes && featureObj.gym && featureObj.pool) {
      return "all";
    } else if (featureObj.classes) {
      return "group-only";
    } else {
      return "basic-only";
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

  const handleDeletePlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('memberships')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setPlans(plans.filter(plan => plan.id !== id));
      toast.success("Membership plan deleted successfully");
    } catch (error) {
      console.error('Error deleting membership plan:', error);
      toast.error('Failed to delete membership plan');
    }
  };

  const handleSavePlan = async (plan: MembershipPlan) => {
    try {
      // Transform plan data to match Supabase schema
      const planData = {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        duration_days: plan.durationDays,
        features: {
          gym: true,
          pool: plan.allowedClasses === 'all',
          classes: plan.allowedClasses === 'all' || plan.allowedClasses === 'group-only'
        },
        is_active: plan.status === 'active',
        branch_id: currentBranch?.id
      };
      
      if (editingPlan) {
        // Update existing plan
        const { error } = await supabase
          .from('memberships')
          .update(planData)
          .eq('id', editingPlan.id);
        
        if (error) {
          throw error;
        }
        
        // Update local state
        setPlans(plans.map(p => p.id === editingPlan.id ? { ...p, ...plan } : p));
        toast.success("Membership plan updated successfully");
      } else {
        // Create new plan
        const { data, error } = await supabase
          .from('memberships')
          .insert(planData)
          .select();
        
        if (error) {
          throw error;
        }
        
        if (data && data[0]) {
          const newPlan: MembershipPlan = {
            ...plan,
            id: data[0].id,
            createdAt: data[0].created_at,
            updatedAt: data[0].updated_at
          };
          
          setPlans([newPlan, ...plans]);
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
      currency: 'INR',
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
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                {plans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No membership plans found. Click "Add Plan" to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  plans.map((plan) => (
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
                  ))
                )}
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
