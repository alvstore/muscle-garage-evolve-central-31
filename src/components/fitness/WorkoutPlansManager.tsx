import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { workoutService } from '@/services/workoutService';
import { WorkoutPlan, WorkoutDay, Exercise, MemberWorkout } from '@/types/class';
import { toast } from 'sonner';
import { MoreHorizontal, Plus, Edit, Trash, Eye, Dumbbell } from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';

interface WorkoutPlansManagerProps {
  forMemberId?: string;
  viewOnly?: boolean;
}

const WorkoutPlansManager: React.FC<WorkoutPlansManagerProps> = ({ 
  forMemberId,
  viewOnly = false
}) => {
  const { user } = useAuth();
  const { can } = usePermissions();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [memberWorkouts, setMemberWorkouts] = useState<MemberWorkout[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  
  // Form state
  const [formData, setFormData] = useState<Partial<WorkoutPlan>>({
    name: '',
    description: '',
    isCommon: true,
    days: []
  });
  
  const fetchWorkoutPlans = async () => {
    setIsLoading(true);
    try {
      let plans: WorkoutPlan[];
      
      if (forMemberId) {
        // Fetch member-specific workouts
        const memberWorkouts = await workoutService.getMemberWorkouts(forMemberId);
        setMemberWorkouts(memberWorkouts);
        
        // Fetch the workout plan details for each assigned plan
        const planPromises = memberWorkouts.map(mw => 
          workoutService.getWorkoutPlanById(mw.workoutPlanId)
        );
        
        const resolvedPlans = await Promise.all(planPromises);
        plans = resolvedPlans.filter((plan): plan is WorkoutPlan => plan !== null);
      } else {
        // Fetch all workout plans for admin/staff/trainer
        plans = await workoutService.getWorkoutPlans();
      }
      
      setWorkoutPlans(plans);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      toast.error('Failed to load workout plans');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchWorkoutPlans();
  }, [forMemberId]);
  
  const handleCreatePlan = () => {
    setFormData({
      name: '',
      description: '',
      isCommon: true,
      days: []
    });
    setModalMode('create');
    setIsModalOpen(true);
  };
  
  const handleEditPlan = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setFormData({ ...plan });
    setModalMode('edit');
    setIsModalOpen(true);
  };
  
  const handleViewPlan = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setModalMode('view');
    setIsModalOpen(true);
  };
  
  const handleDeletePlan = async (planId: string) => {
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      try {
        await workoutService.deleteWorkoutPlan(planId);
        toast.success('Workout plan deleted successfully');
        fetchWorkoutPlans();
      } catch (error) {
        console.error('Error deleting workout plan:', error);
        toast.error('Failed to delete workout plan');
      }
    }
  };
  
  const handleSavePlan = async () => {
    if (!formData.name || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      if (modalMode === 'create') {
        const newPlan = {
          ...formData,
          createdBy: user?.id || '',
          days: formData.days || []
        };
        
        await workoutService.createWorkoutPlan(newPlan as Omit<WorkoutPlan, 'id' | 'createdAt' | 'updatedAt'>);
        toast.success('Workout plan created successfully');
      } else if (modalMode === 'edit' && selectedPlan) {
        await workoutService.updateWorkoutPlan(selectedPlan.id, formData);
        toast.success('Workout plan updated successfully');
      }
      
      setIsModalOpen(false);
      fetchWorkoutPlans();
    } catch (error) {
      console.error('Error saving workout plan:', error);
      toast.error('Failed to save workout plan');
    }
  };
  
  const renderWorkoutPlanTable = () => {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {forMemberId ? 'Your Workout Plans' : 'Workout Plans'}
            </CardTitle>
            {!viewOnly && can('assign_workout_plan') && (
              <Button onClick={handleCreatePlan}>
                <Plus className="mr-1 h-4 w-4" /> Create New Plan
              </Button>
            )}
          </div>
          <CardDescription>
            {forMemberId 
              ? 'View your assigned workout plans' 
              : 'Manage workout plans for your gym members'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center p-4">Loading workout plans...</div>
          ) : workoutPlans.length === 0 ? (
            <div className="text-center p-4">
              {forMemberId 
                ? 'No workout plans have been assigned to you yet.' 
                : 'No workout plans have been created yet.'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workoutPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.description}</TableCell>
                    <TableCell>{plan.days.length} days</TableCell>
                    <TableCell>{plan.isCommon ? 'Common' : 'Custom'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewPlan(plan)}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          {!viewOnly && can('manage_fitness_data') && (
                            <>
                              <DropdownMenuItem onClick={() => handleEditPlan(plan)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeletePlan(plan.id)}
                                className="text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    );
  };
  
  const renderPlanDetails = () => {
    if (!selectedPlan) return null;
    
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">{selectedPlan.name}</h3>
        <p className="text-muted-foreground">{selectedPlan.description}</p>
        
        <div className="space-y-6 mt-4">
          {selectedPlan.days.map((day, index) => (
            <Card key={day.id}>
              <CardHeader>
                <CardTitle>Day {index + 1}: {day.dayLabel}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exercise</TableHead>
                      <TableHead>Sets</TableHead>
                      <TableHead>Reps</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Muscle Group</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {day.exercises.map((exercise) => (
                      <TableRow key={exercise.id}>
                        <TableCell>{exercise.name}</TableCell>
                        <TableCell>{exercise.sets}</TableCell>
                        <TableCell>{exercise.reps}</TableCell>
                        <TableCell>{exercise.weight || 'N/A'}</TableCell>
                        <TableCell>{exercise.muscleGroupTag || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {renderWorkoutPlanTable()}
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalMode === 'create' ? 'Create New Workout Plan' : 
               modalMode === 'edit' ? 'Edit Workout Plan' : 'View Workout Plan'}
            </DialogTitle>
            <DialogDescription>
              {modalMode === 'view' 
                ? 'Detailed view of the workout plan'
                : 'Fill in the details for the workout plan'}
            </DialogDescription>
          </DialogHeader>
          
          {modalMode === 'view' ? (
            renderPlanDetails()
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Beginner Full Body Plan"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the workout plan"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Plan Type</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isCommon"
                      checked={formData.isCommon}
                      onChange={(e) => setFormData({...formData, isCommon: e.target.checked})}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="isCommon" className="font-normal">Make this a common plan (available to all members)</Label>
                  </div>
                </div>
              </div>
              
              {/* TODO: Add day and exercise editor UI here */}
            </div>
          )}
          
          <DialogFooter>
            {modalMode !== 'view' && (
              <Button onClick={handleSavePlan} disabled={viewOnly}>
                Save Plan
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              {modalMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutPlansManager;
