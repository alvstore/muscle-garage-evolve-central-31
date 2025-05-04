
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Plus, Edit, Trash, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePermissions } from '@/hooks/use-permissions';
import { useMembershipPlans } from '@/hooks/use-membership';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  features?: string[];
  isActive?: boolean;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
}

const MembershipPlans = () => {
  const { currentBranch } = useBranch();
  const { membershipPlans, isLoading, error, refetch } = useMembershipPlans();
  const { userRole } = usePermissions();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [newPlan, setNewPlan] = useState<Partial<MembershipPlan>>({
    name: '',
    description: '',
    price: 0,
    durationDays: 30,
    features: [],
    isActive: true,
  });
  
  const canManagePlans = userRole === 'admin' || userRole === 'staff';

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
      {!currentBranch?.id && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Branch Selection Required</h4>
              <p className="text-sm text-amber-700 mt-1">
                Please select a branch from the top menu to view membership plans.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Available Membership Plans</h2>
        {canManagePlans && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!currentBranch?.id}>
                <Plus className="h-4 w-4 mr-2" />
                New Plan
              </Button>
            </DialogTrigger>
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
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-1/3 mb-6" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">Failed to load membership plans</h3>
            <p className="text-muted-foreground mb-4">
              {error}
            </p>
            <Button onClick={refetch}>Retry</Button>
          </CardContent>
        </Card>
      ) : membershipPlans?.length === 0 ? (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {membershipPlans.map((plan) => (
            <Card key={plan.id} className={cn("overflow-hidden", !plan.isActive && "opacity-75")}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                  {!plan.isActive && (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-6">
                  {formatPrice(plan.price)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{formatDuration(plan.durationDays).toLowerCase()}
                  </span>
                </div>
                <div className="space-y-2">
                  {(plan.features || []).map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-3">
                <Button 
                  variant="default" 
                  className="w-full"
                  disabled={!plan.isActive || !currentBranch?.id}
                >
                  Select Plan
                </Button>
                
                {canManagePlans && (
                  <div className="flex ml-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setSelectedPlan(plan);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleToggleActive(plan.id, !!plan.isActive)}
                    >
                      {plan.isActive ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {canManagePlans && selectedPlan && (
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
