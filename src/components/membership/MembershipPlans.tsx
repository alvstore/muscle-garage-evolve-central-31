import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MembershipPlan, MembershipPlanStatus } from '@/types/member';
import { PlusIcon, SearchIcon } from 'lucide-react';
import MembershipPlanCard from './MembershipPlanCard';
import MembershipPlanForm from './MembershipPlanForm';
import { useBranch } from '@/hooks/use-branch';
import { membershipService } from '@/services/membershipService';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

const MembershipPlans = () => {
  const { currentBranch } = useBranch();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<MembershipPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  useEffect(() => {
    if (currentBranch?.id) {
      fetchPlans();
    }
  }, [currentBranch?.id]);

  useEffect(() => {
    filterPlans();
  }, [plans, searchTerm, activeTab]);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const data = await membershipService.getMembershipPlans(currentBranch?.id);
      setPlans(data);
    } catch (error) {
      console.error('Error fetching membership plans:', error);
      toast.error('Failed to load membership plans');
    } finally {
      setIsLoading(false);
    }
  };

  const filterPlans = () => {
    let filtered = [...plans];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(plan => 
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(plan => {
        if (activeTab === 'active') {
          return plan.is_active || plan.isActive;
        } else if (activeTab === 'inactive') {
          return !(plan.is_active || plan.isActive);
        } else if (activeTab === 'draft') {
          return plan.status === MembershipPlanStatus.DRAFT;
        }
        return true;
      });
    }

    setFilteredPlans(filtered);
  };

  const createPlan = () => {
    setEditingPlan({
      id: '',
      name: '',
      description: '',
      price: 0,
      duration_days: 30,
      features: [],
      benefits: [],
      is_active: true,
      status: MembershipPlanStatus.DRAFT,
      branch_id: currentBranch?.id || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // For display only, not sent to API
      durationLabel: '30 Days'
    } as MembershipPlan);
    
    setShowPlanForm(true);
  };

  const editPlan = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setShowPlanForm(true);
  };

  const deletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this membership plan?')) {
      return;
    }

    try {
      await membershipService.deleteMembershipPlan(id);
      setPlans(plans.filter(plan => plan.id !== id));
      toast.success('Membership plan deleted successfully');
    } catch (error) {
      console.error('Error deleting membership plan:', error);
      toast.error('Failed to delete membership plan');
    }
  };

  const onSavePlan = async (plan: MembershipPlan) => {
    try {
      setIsSaving(true);
      
      // Remove properties that don't exist in the API
      const { durationLabel, createdAt, updatedAt, ...planData } = plan as any;
      
      // Use the consistent property names
      const apiPlan = {
        ...planData,
        created_at: plan.created_at || plan.createdAt,
        updated_at: plan.updated_at || plan.updatedAt,
      };
      
      let savedPlan;
      
      if (plan.id) {
        // Update existing plan
        savedPlan = await membershipService.updateMembershipPlan(plan.id, apiPlan);
        setPlans(plans.map(p => p.id === plan.id ? savedPlan : p));
        toast.success('Membership plan updated successfully');
      } else {
        // Create new plan
        savedPlan = await membershipService.createMembershipPlan(apiPlan);
        setPlans([...plans, savedPlan]);
        toast.success('Membership plan created successfully');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Failed to save membership plan');
    } finally {
      setIsSaving(false);
      setShowPlanForm(false);
    }
  };

  const onCancelEdit = () => {
    setShowPlanForm(false);
    setEditingPlan(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="bg-gray-100">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (filteredPlans.length === 0) {
      return (
        <EmptyState
          title="No membership plans found"
          description={
            searchTerm
              ? "No plans match your search criteria"
              : "Create your first membership plan to get started"
          }
          icon={<PlusIcon className="h-10 w-10" />}
          action={
            <Button onClick={createPlan}>
              Create Membership Plan
            </Button>
          }
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlans.map(plan => (
          <MembershipPlanCard
            key={plan.id}
            plan={plan}
            onEdit={() => editPlan(plan)}
            onDelete={() => deletePlan(plan.id)}
          />
        ))}
      </div>
    );
  };

  if (showPlanForm) {
    return (
      <MembershipPlanForm
        plan={editingPlan}
        onSave={onSavePlan}
        onCancel={onCancelEdit}
        isSubmitting={isSaving}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Membership Plans</h2>
          <p className="text-muted-foreground">
            Manage your gym's membership plans and pricing
          </p>
        </div>
        <Button onClick={createPlan} className="shrink-0">
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Plan
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All Plans</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-auto">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search plans..."
            className="pl-8 w-full sm:w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default MembershipPlans;
