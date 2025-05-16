
import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import MembershipPlanCard from './MembershipPlanCard';
import MembershipPlanForm from './MembershipPlanForm';
import { membershipService } from '@/services';
import { toast } from 'sonner';
import { MembershipPlan } from '@/types';
import { useDisclosure } from '@/hooks/use-disclosure';
import EmptyState from '@/components/ui/empty-state';
import { useBranch } from '@/hooks/use-branch';

const MembershipPlans = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const { currentBranch } = useBranch();

  // Fetch plans when component mounts or when branch changes
  useEffect(() => {
    if (currentBranch?.id) {
      fetchMembershipPlans();
    }
  }, [currentBranch?.id]);

  const fetchMembershipPlans = async () => {
    setIsLoading(true);
    try {
      // Pass the current branch ID to filter plans by branch
      const data = await membershipService.getMembershipPlans(currentBranch?.id);
      setPlans(data || []);
    } catch (error) {
      console.error('Failed to fetch membership plans:', error);
      toast.error('Failed to fetch membership plans');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setDialogMode('create');
    onOpen();
  };

  const handleEditPlan = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setDialogMode('edit');
    onOpen();
  };

  const handleDeletePlan = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (!selectedPlan) return;
    
    setIsSubmitting(true);
    try {
      // Use the correct method signature that matches the service
      await membershipService.deleteMembershipPlan(selectedPlan.id);
      toast.success('Membership plan deleted successfully');
      fetchMembershipPlans();
      onDeleteClose();
    } catch (error) {
      console.error('Failed to delete membership plan:', error);
      toast.error('Failed to delete membership plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePlan = async (planData: MembershipPlan) => {
    setIsSubmitting(true);
    try {
      if (dialogMode === 'edit' && selectedPlan) {
        // Use the correct method signature that matches the service
        await membershipService.updateMembershipPlan(selectedPlan.id, planData);
        toast.success('Membership plan updated successfully');
      } else {
        // Use the correct method signature that matches the service
        await membershipService.createMembershipPlan(planData);
        toast.success('Membership plan created successfully');
      }
      
      fetchMembershipPlans();
      onClose();
    } catch (error) {
      console.error('Failed to save membership plan:', error);
      toast.error('Failed to save membership plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <EmptyState
        title="No Membership Plans"
        description="You haven't created any membership plans yet. Create your first plan to start enrolling members."
        icon={<PlusCircle className="w-10 h-10" />}
        actionLabel="Create Membership Plan"
        onAction={handleCreatePlan}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Membership Plans</h2>
          <p className="text-muted-foreground">Manage your gym's membership plans</p>
        </div>
        <Button onClick={handleCreatePlan}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <MembershipPlanCard
            key={plan.id}
            plan={plan}
            onEdit={() => handleEditPlan(plan)}
            onDelete={() => handleDeletePlan(plan)}
          />
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={(open) => !open && onDeleteClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Membership Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{selectedPlan?.name}" membership plan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={onDeleteClose} disabled={isSubmitting}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Plan'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembershipPlans;
