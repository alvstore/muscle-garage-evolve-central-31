import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle, Edit, Trash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MembershipPlan, MembershipPlanStatus } from '@/types/membership';
import { useMembershipPlans } from '@/hooks/use-membership';
import { usePermissions } from '@/hooks/use-permissions';
import { useBranch } from '@/hooks/use-branch';
import { supabase } from '@/integrations/supabase/client';
import { MembershipPlanCard } from './MembershipPlanCard';
import { formatPrice, formatDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';

// Using the MembershipPlan type directly from @/types/membership

const MembershipPlans = () => {
  const { currentBranch } = useBranch();
  const { membershipPlans: rawPlans = [], isLoading, error, refetch } = useMembershipPlans();
  
  const membershipPlans = useMemo(() => rawPlans.map(plan => ({
    ...plan,
    memberCount: 0, // This should be fetched from the backend
    status: plan.isActive ? 'active' : 'inactive' as MembershipPlanStatus
  })), [rawPlans]);
  const { userRole } = usePermissions();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [newPlan, setNewPlan] = useState<Partial<MembershipPlan>>({
    name: '',
    description: '',
    price: 0,
    durationDays: 30,
    durationLabel: '1-month',
    benefits: [],
    allowedClasses: 'all',
    status: 'active',
    memberCount: 0,
  });

  const canManagePlans = userRole === 'admin' || userRole === 'staff';

  // Filter plans based on active tab
  const filteredPlans = useMemo(() => {
    if (activeTab === 'all') return membershipPlans;
    return membershipPlans.filter(plan => 
      activeTab === 'active' ? plan.status === 'active' : plan.status === 'inactive'
    );
  }, [membershipPlans, activeTab]);

  // Find the most popular plan based on member count
  const popularPlan = useMemo(() => {
    if (!membershipPlans?.length) return null;
    return membershipPlans.reduce((max, plan) => 
      (plan.memberCount || 0) > (max.memberCount || 0) ? plan : max
    , membershipPlans[0]);
  }, [membershipPlans]);

  const handleCreatePlan = async () => {
    if (!currentBranch?.id) {
      toast.error("Please select a branch first");
      return;
    }
    
    if (!newPlan.name || !newPlan.price || !newPlan.durationDays) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      // Convert to Supabase format
      const planData = {
        name: newPlan.name,
        description: newPlan.description || '',
        price: newPlan.price,
        duration_days: newPlan.durationDays,
        is_active: newPlan.isActive || true,
        branch_id: currentBranch.id,
        features: {
          features: newPlan.features || []
        }
      };
      
      const { data, error } = await supabase
        .from('memberships')
        .insert(planData)
        .select();
        
      if (error) throw error;
      
      toast.success("Membership plan created successfully!");
      setIsCreateDialogOpen(false);
      setNewPlan({
        name: '',
        description: '',
        price: 0,
        durationDays: 30,
        features: [],
        isActive: true,
      });
      refetch();
    } catch (error) {
      console.error('Error creating membership plan:', error);
      toast.error("Failed to create membership plan");
    }
  };
  
  const handleUpdatePlan = async () => {
    if (!selectedPlan || !selectedPlan.id) {
      toast.error("No plan selected for editing");
      return;
    }
    
    try {
      // Convert to Supabase format
      const planData = {
        name: selectedPlan.name,
        description: selectedPlan.description || '',
        price: selectedPlan.price,
        duration_days: selectedPlan.durationDays,
        is_active: selectedPlan.isActive || true,
        features: {
          features: selectedPlan.features || []
        }
      };
      
      const { data, error } = await supabase
        .from('memberships')
        .update(planData)
        .eq('id', selectedPlan.id)
        .select();
        
      if (error) throw error;
      
      toast.success("Membership plan updated successfully!");
      setIsEditDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error updating membership plan:', error);
      toast.error("Failed to update membership plan");
    }
  };
  
  const handleDeletePlan = async (id: string) => {
    if (confirm("Are you sure you want to delete this membership plan?")) {
      try {
        const { error } = await supabase
          .from('memberships')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast.success("Membership plan deleted successfully!");
        refetch();
      } catch (error) {
        console.error('Error deleting membership plan:', error);
        toast.error("Failed to delete membership plan");
      }
    }
  };
  
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('memberships')
        .update({ is_active: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Membership plan ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      refetch();
    } catch (error) {
      console.error('Error updating membership plan status:', error);
      toast.error("Failed to update membership plan status");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDuration = (days: number) => {
    if (days % 365 === 0) return `${days / 365} Year${days > 365 ? 's' : ''}`;
    if (days % 30 === 0) return `${days / 30} Month${days > 30 ? 's' : ''}`;
    return `${days} Days`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Plan button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Membership Plans</h2>
        {canManagePlans && (
          <Button
            variant="default"
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="all">All Plans</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-8 w-1/2 mb-6" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-center p-6 border rounded-lg">
          <AlertCircle className="h-6 w-6 text-destructive mr-2" />
          <p className="text-destructive">Failed to load membership plans</p>
        </div>
      )}

      {/* Plans grid */}
      {!isLoading && !error && membershipPlans?.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="font-medium text-lg mb-2">No Membership Plans Found</h3>
            <p className="text-muted-foreground mb-4">
              {currentBranch?.id ? 
                "No membership plans have been created yet for this branch." : 
                "Please select a branch to view membership plans."}
            </p>
            {canManagePlans && currentBranch?.id && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>Create Your First Plan</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {membershipPlans?.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium">{formatPrice(plan.price)}</p>
                  <p className="text-sm text-muted-foreground">{formatDuration(plan.durationDays)}</p>
                </div>
                <div className="mt-4">
                  {plan.features?.map((feature, i) => (
                    <Badge key={i} className="mr-2">{feature}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                {canManagePlans && (
                  <Button variant="outline" onClick={() => {
                    setSelectedPlan({
        ...plan,
        durationLabel: '1-month',
        benefits: [],
        allowedClasses: 'all',
        status: 'active',
        memberCount: plan.memberCount || 0,
        createdAt: plan.createdAt || new Date().toISOString(),
        updatedAt: plan.updatedAt || new Date().toISOString()
      });
                    setIsEditDialogOpen(true);
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                <Button variant="destructive" onClick={() => handleDeletePlan(plan.id)}>
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Plan Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Membership Plan</DialogTitle>
            <DialogDescription>
              Create a new membership plan for your gym members.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={newPlan.price}
                onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                value={newPlan.durationDays}
                onChange={(e) => setNewPlan({ ...newPlan, durationDays: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                value={newPlan.description}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="features" className="text-right">Features</Label>
              <Textarea
                id="features"
                value={(newPlan.features || []).join('\n')}
                onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value.split('\n').filter(line => line.trim() !== '') })}
                className="col-span-3"
                placeholder="Enter each feature on a new line"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePlan}>Create Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      {selectedPlan && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Membership Plan</DialogTitle>
              <DialogDescription>
                Make changes to the membership plan details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  value={selectedPlan.name}
                  onChange={(e) => setSelectedPlan({ ...selectedPlan, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">Price (₹)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={selectedPlan.price}
                  onChange={(e) => setSelectedPlan({ ...selectedPlan, price: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-duration" className="text-right">Duration (days)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={selectedPlan.durationDays}
                  onChange={(e) => setSelectedPlan({ ...selectedPlan, durationDays: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedPlan.description}
                  onChange={(e) => setSelectedPlan({ ...selectedPlan, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-features" className="text-right">Features</Label>
                <Textarea
                  id="edit-features"
                  value={(selectedPlan.features || []).join('\n')}
                  onChange={(e) => setSelectedPlan({ 
                    ...selectedPlan, 
                    features: e.target.value.split('\n').filter(line => line.trim() !== '') 
                  })}
                  className="col-span-3"
                  placeholder="Enter each feature on a new line"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdatePlan}>Update Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MembershipPlans;
