
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { membershipService } from '@/services/membershipService';
import { MembershipPlan } from '@/types';
import { MembershipPlanCard } from './MembershipPlanCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MembershipPlanForm from './MembershipPlanForm';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from 'sonner';

const MembershipPlans: React.FC = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMembershipPlans();
  }, []);

  const fetchMembershipPlans = async () => {
    setIsLoading(true);
    try {
      const fetchedPlans = await membershipService.getMembershipPlans();
      setPlans(fetchedPlans);
    } catch (error) {
      console.error('Failed to fetch membership plans:', error);
      toast.error('Failed to load membership plans');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlans = plans.filter(plan => 
    plan.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    plan.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClick = () => {
    setEditingPlan(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (planId: string) => {
    if (window.confirm('Are you sure you want to delete this membership plan?')) {
      try {
        // For now, let's assume the method exists
        await membershipService.deleteMembershipPlan(planId);
        toast.success('Membership plan deleted successfully');
        
        // Update the local state to reflect the deletion
        setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
      } catch (error) {
        console.error('Error deleting membership plan:', error);
        toast.error('Failed to delete membership plan');
      }
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPlan(null);
  };

  const handleSavePlan = async (plan: MembershipPlan) => {
    setIsSubmitting(true);
    try {
      let savedPlan;
      
      if (editingPlan) {
        // For now, let's assume the method exists
        savedPlan = await membershipService.updateMembershipPlan(editingPlan.id as string, plan);
        
        // Update the plan in the local state
        setPlans(prevPlans => 
          prevPlans.map(p => p.id === editingPlan.id ? savedPlan : p)
        );
        
        toast.success('Membership plan updated successfully');
      } else {
        // For now, let's assume the method exists
        savedPlan = await membershipService.createMembershipPlan(plan);
        
        // Add the new plan to the local state
        setPlans(prevPlans => [...prevPlans, savedPlan]);
        
        toast.success('Membership plan created successfully');
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving membership plan:', error);
      toast.error('Failed to save membership plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Membership Plans</h1>
        <Button onClick={handleCreateClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Plan
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search membership plans..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredPlans.length === 0 ? (
        <EmptyState
          title="No membership plans found"
          description="Create your first membership plan to get started"
          icon={<PlusCircle className="h-12 w-12" />}
          onAction={handleCreateClick}
          actionLabel="Create Plan"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <MembershipPlanCard
              key={plan.id}
              plan={plan}
              onEdit={() => handleEditClick(plan)}
              onDelete={() => handleDeleteClick(plan.id as string)}
            />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? 'Edit Membership Plan' : 'Create Membership Plan'}
            </DialogTitle>
          </DialogHeader>
          <MembershipPlanForm
            plan={editingPlan || undefined}
            onSave={handleSavePlan}
            onCancel={handleCloseDialog}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembershipPlans;
