
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Search, Plus } from 'lucide-react';
import { dietPlanService } from '@/services/dietPlanService';
import { DietPlan } from '@/types/diet';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface DietPlansManagerProps {
  forMemberId?: string;
  readOnly?: boolean;
  assignOnly?: boolean;
}

const DietPlansManager: React.FC<DietPlansManagerProps> = ({ 
  forMemberId, 
  readOnly = false,
  assignOnly = false
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(forMemberId || '');
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchDietPlans = async () => {
      setIsLoading(true);
      try {
        let plans: DietPlan[] = [];
        
        // Get different plans based on params
        if (forMemberId) {
          // Get diet plans assigned to a specific member
          const assignments = await dietPlanService.getMemberDietPlanAssignments(forMemberId);
          // Then fetch each plan
          if (assignments.length > 0) {
            const planPromises = assignments.map(assignment => 
              dietPlanService.getDietPlanById(assignment.planId)
            );
            const planResults = await Promise.all(planPromises);
            plans = planResults.filter(Boolean) as DietPlan[];
          }
        } else {
          // Get all plans (for trainers/admins)
          plans = await dietPlanService.getTrainerDietPlans(user?.id);
        }
        
        setDietPlans(plans);
      } catch (error) {
        console.error('Error fetching diet plans:', error);
        toast.error('Failed to load diet plans');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchMembers = async () => {
      if (assignOnly || !forMemberId) {
        try {
          const trainerMembers = await dietPlanService.getAssignedMembers(user?.id || '');
          setMembers(trainerMembers);
        } catch (error) {
          console.error('Error fetching members:', error);
        }
      }
    };

    fetchDietPlans();
    fetchMembers();
  }, [user?.id, forMemberId, assignOnly]);

  const filteredPlans = dietPlans.filter(plan => 
    plan.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignPlan = (plan: DietPlan) => {
    setSelectedPlan(plan);
    setIsAssigning(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedPlan || !selectedMemberId) {
      toast.error('Please select both a plan and a member');
      return;
    }

    try {
      const result = await dietPlanService.assignDietPlanToMember(
        selectedPlan.id,
        selectedMemberId,
        user?.id || '',
      );
      
      if (result) {
        toast.success('Diet plan assigned successfully');
        setIsAssigning(false);
      }
    } catch (error) {
      toast.error('Failed to assign diet plan');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center">
            <Utensils className="h-10 w-10 animate-pulse text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">Loading diet plans...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Assignment dialog
  const renderAssignmentDialog = () => (
    <Dialog open={isAssigning} onOpenChange={(open) => !open && setIsAssigning(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Diet Plan</DialogTitle>
          <DialogDescription>
            Select a member to assign this diet plan to
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="member">Member</Label>
            <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
              <SelectTrigger id="member">
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {members.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedPlan && (
            <div className="space-y-2">
              <Label>Selected Plan</Label>
              <div className="rounded-md border p-3">
                <h4 className="font-medium">{selectedPlan.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAssigning(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssignSubmit}>
            Assign Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Diet Plans</CardTitle>
            <CardDescription>
              {forMemberId ? 'Your assigned diet plans' : 'Manage and assign diet plans to members'}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search plans..."
                className="w-[200px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredPlans.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPlans.map(plan => (
                <Card key={plan.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 p-4">
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                    <CardDescription>
                      {plan.dietType ? plan.dietType.charAt(0).toUpperCase() + plan.dietType.slice(1) : 'Standard'} Diet
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <p className="text-sm mb-2 line-clamp-2">{plan.description || 'No description provided'}</p>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      {plan.goal && (
                        <div>
                          <span className="font-medium">Goal:</span> {plan.goal.replace('-', ' ').split(' ').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </div>
                      )}
                      
                      {plan.dailyCalories && (
                        <div>
                          <span className="font-medium">Daily Calories:</span> {plan.dailyCalories}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      {!readOnly && !forMemberId && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAssignPlan(plan)}
                        >
                          Assign to Member
                        </Button>
                      )}
                      
                      {!readOnly && !assignOnly && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2"
                          onClick={() => navigate(`/fitness/diet-plans/edit/${plan.id}`)}
                        >
                          Edit Plan
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Utensils className="h-10 w-10 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Diet Plans Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {forMemberId 
                  ? "You don't have any diet plans assigned yet."
                  : searchQuery
                    ? "No plans match your search criteria."
                    : "Create your first diet plan to get started."}
              </p>
              
              {!readOnly && !forMemberId && !assignOnly && (
                <Button onClick={() => navigate('/fitness/diet-plans/create')} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Diet Plan
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {renderAssignmentDialog()}
    </>
  );
};

export default DietPlansManager;
