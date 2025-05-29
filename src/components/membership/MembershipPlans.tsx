
import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import MembershipPlanCard from './MembershipPlanCard';
import MembershipPlanForm from './MembershipPlanForm';
import { membershipService } from '@/services';
import { toast } from 'sonner';
import { MembershipPlan } from "@/types/members/membership";
import { useBranch } from '@/hooks/settings/use-branches';
import BranchSelector from '@/components/branch/BranchSelector';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MembershipPlans = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const { currentBranch } = useBranch();
  
  // Simple dialog controls
  const openDialog = (mode: 'create' | 'edit' = 'create') => {
    if (!currentBranch?.id) {
      toast.error('Please select a branch first');
      return;
    }
    setDialogMode(mode);
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => setIsDialogOpen(false);
  const openDeleteDialog = () => setIsDeleteDialogOpen(true);
  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);

  // Fetch plans when component mounts or when branch changes
  useEffect(() => {
    const loadPlans = async () => {
      if (!currentBranch?.id) {
        setPlans([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await membershipService.getMembershipPlans(currentBranch.id);
        setPlans(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch membership plans:', error);
        toast.error('Failed to load membership plans');
        setPlans([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPlans();
  }, [currentBranch?.id]);

  const handleCreatePlan = () => openDialog('create');
  
  const handleEditPlan = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    openDialog('edit');
  };
  
  const handleDeletePlan = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    openDeleteDialog();
  };
  
  const confirmDelete = async () => {
    if (!selectedPlan) return;
    
    setIsSubmitting(true);
    try {
      await membershipService.deleteMembershipPlan(selectedPlan.id);
      toast.success('Membership plan deleted successfully');
      setPlans(plans.filter(p => p.id !== selectedPlan.id));
      closeDeleteDialog();
    } catch (error) {
      console.error('Failed to delete plan:', error);
      toast.error('Failed to delete membership plan');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSavePlan = async (planData: MembershipPlan) => {
    try {
      setIsSubmitting(true);
      
      if (!currentBranch?.id) {
        throw new Error('No branch selected');
      }
      
      // Ensure branch_id is set from current branch
      const planWithBranch = {
        ...planData,
        branch_id: currentBranch.id
      };
      
      if (dialogMode === 'edit' && selectedPlan?.id) {
        // Update existing plan
        await membershipService.updateMembershipPlan(selectedPlan.id, planWithBranch);
        toast.success('Membership plan updated successfully');
      } else {
        // Create new plan
        await membershipService.createMembershipPlan(planWithBranch);
        toast.success('Membership plan created successfully');
      }
      
      // Refresh the plans list
      const data = await membershipService.getMembershipPlans(currentBranch.id);
      setPlans(data);
      
      closeDialog();
    } catch (error) {
      console.error('Error saving membership plan:', error);
      toast.error(`Failed to save membership plan: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentBranch?.id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select a Branch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Please select a branch to manage membership plans.</p>
            <BranchSelector branches={[]} onSelect={() => {}} />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Loading plans...</h2>
          <Button disabled>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          {plans.length} {plans.length === 1 ? 'plan' : 'plans'} for {currentBranch.name}
        </p>
        <Button onClick={handleCreatePlan}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>
      
      {!plans || plans.length === 0 ? (
        <Alert>
          <PlusCircle className="h-4 w-4" />
          <AlertTitle>No plans yet</AlertTitle>
          <AlertDescription>
            Get started by creating your first membership plan.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans?.map((plan) => (
            plan && plan.id ? (
              <MembershipPlanCard
                key={plan.id}
                plan={plan}
                onEdit={() => handleEditPlan(plan)}
                onDelete={() => handleDeletePlan(plan)}
              />
            ) : null
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'create' ? 'Create Membership Plan' : 'Edit Membership Plan'}</DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' 
                ? 'Create a new membership plan for your gym' 
                : 'Update the details of your membership plan'}
            </DialogDescription>
          </DialogHeader>
          <MembershipPlanForm
            plan={selectedPlan}
            onSave={handleSavePlan}
            onCancel={closeDialog}
            isSubmitting={isSubmitting}
            isEditing={dialogMode === 'edit'}
            branchId={currentBranch?.id}
            key={currentBranch?.id} // Force re-render when branch changes
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Membership Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this membership plan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={closeDeleteDialog} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete Plan'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembershipPlans;
