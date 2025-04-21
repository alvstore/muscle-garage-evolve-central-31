
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/use-auth';
import { usePermissions } from '@/hooks/use-permissions';
import WorkoutPlanForm from '@/components/fitness/WorkoutPlanForm';
import MemberSelector from '@/components/fitness/MemberSelector';
import { useLocation } from 'react-router-dom';
import { Member, WorkoutPlan } from '@/types';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const WorkoutPlansPage = () => {
  const { user } = useAuth();
  const { userRole } = usePermissions();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const memberId = queryParams.get('memberId');
  
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [generalPlans, setGeneralPlans] = useState<WorkoutPlan[]>([]);
  const [memberPlans, setMemberPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  
  // For staff/admin/trainer, show the full workout plan manager
  // For members, show only their assigned plans
  const isStaffOrTrainer = userRole === 'admin' || userRole === 'staff' || userRole === 'trainer';
  
  useEffect(() => {
    // Simulate API call to fetch workout plans
    setLoading(true);
    
    setTimeout(() => {
      // Mock data for general plans
      const mockGeneralPlans: WorkoutPlan[] = [
        {
          id: 'plan-1',
          name: 'Beginner Full Body',
          description: 'A complete full body workout for beginners',
          isCustom: false,
          createdBy: 'trainer-123',
          createdAt: '2023-01-15T00:00:00Z',
          updatedAt: '2023-01-15T00:00:00Z',
          workoutDays: [
            {
              id: 'day-1',
              name: 'Day 1 - Upper Body',
              dayLabel: 'Monday',
              exercises: [
                { id: 'ex-1', name: 'Push Ups', sets: 3, reps: 10 },
                { id: 'ex-2', name: 'Dumbbell Rows', sets: 3, reps: 12 }
              ]
            },
            {
              id: 'day-2',
              name: 'Day 2 - Lower Body',
              dayLabel: 'Wednesday',
              exercises: [
                { id: 'ex-3', name: 'Squats', sets: 3, reps: 15 },
                { id: 'ex-4', name: 'Lunges', sets: 3, reps: 10 }
              ]
            }
          ],
          memberId: '',
          trainerId: 'trainer-123'
        },
        {
          id: 'plan-2',
          name: 'Intermediate Split',
          description: 'A 3-day split for intermediate trainees',
          isCustom: false,
          createdBy: 'trainer-456',
          createdAt: '2023-02-10T00:00:00Z',
          updatedAt: '2023-02-10T00:00:00Z',
          workoutDays: [
            {
              id: 'day-1',
              name: 'Push Day',
              dayLabel: 'Monday',
              exercises: [
                { id: 'ex-1', name: 'Bench Press', sets: 4, reps: 8 },
                { id: 'ex-2', name: 'Shoulder Press', sets: 3, reps: 10 }
              ]
            },
            {
              id: 'day-2',
              name: 'Pull Day',
              dayLabel: 'Wednesday',
              exercises: [
                { id: 'ex-3', name: 'Deadlifts', sets: 4, reps: 6 },
                { id: 'ex-4', name: 'Pull Ups', sets: 3, reps: 8 }
              ]
            },
            {
              id: 'day-3',
              name: 'Leg Day',
              dayLabel: 'Friday',
              exercises: [
                { id: 'ex-5', name: 'Squats', sets: 4, reps: 8 },
                { id: 'ex-6', name: 'Leg Press', sets: 3, reps: 12 }
              ]
            }
          ],
          memberId: '',
          trainerId: 'trainer-456'
        }
      ];
      
      // Mock data for member specific plans
      const mockMemberPlans: WorkoutPlan[] = [
        {
          id: 'custom-plan-1',
          name: 'John\'s Custom Plan',
          description: 'Custom plan for John with focus on upper body',
          isCustom: true,
          createdBy: 'trainer-123',
          createdAt: '2023-03-20T00:00:00Z',
          updatedAt: '2023-03-20T00:00:00Z',
          workoutDays: [
            {
              id: 'day-1',
              name: 'Day 1 - Chest & Triceps',
              dayLabel: 'Monday',
              exercises: [
                { id: 'ex-1', name: 'Incline Bench Press', sets: 4, reps: 10 },
                { id: 'ex-2', name: 'Tricep Dips', sets: 3, reps: 12 }
              ]
            },
            {
              id: 'day-2',
              name: 'Day 2 - Back & Biceps',
              dayLabel: 'Wednesday',
              exercises: [
                { id: 'ex-3', name: 'Barbell Rows', sets: 4, reps: 10 },
                { id: 'ex-4', name: 'Hammer Curls', sets: 3, reps: 12 }
              ]
            }
          ],
          memberId: 'member-1',
          trainerId: 'trainer-123'
        }
      ];
      
      setGeneralPlans(mockGeneralPlans);
      setMemberPlans(mockMemberPlans);
      setLoading(false);
      
      // If memberId is provided in the URL, fetch and select that member
      if (memberId) {
        // Simulate fetching member by ID
        setTimeout(() => {
          const mockMember: Member = {
            id: memberId,
            email: "john.doe@example.com",
            name: "John Doe",
            role: "member",
            membershipStatus: "active",
          };
          setSelectedMember(mockMember);
        }, 500);
      }
    }, 1000);
  }, [memberId]);
  
  const handleSaveWorkoutPlan = (plan: WorkoutPlan) => {
    if (plan.isCustom && selectedMember) {
      // Save as a member-specific plan
      if (plan.id && memberPlans.some(p => p.id === plan.id)) {
        // Update existing plan
        setMemberPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
      } else {
        // Add new plan
        setMemberPlans(prev => [...prev, { ...plan, id: `custom-plan-${Date.now()}` }]);
      }
      toast.success(`Custom workout plan saved for ${selectedMember.name}`);
    } else {
      // Save as a general plan
      if (plan.id && generalPlans.some(p => p.id === plan.id)) {
        // Update existing plan
        setGeneralPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
      } else {
        // Add new plan
        setGeneralPlans(prev => [...prev, { ...plan, id: `plan-${Date.now()}` }]);
      }
      toast.success("General workout plan saved");
    }
    setIsCreatingPlan(false);
  };
  
  const renderPlanCard = (plan: WorkoutPlan) => (
    <Card key={plan.id} className="mb-4">
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Created: </span>
            {new Date(plan.createdAt).toLocaleDateString()}
          </div>
          
          <div className="grid gap-2">
            {plan.workoutDays.map(day => (
              <div key={day.id} className="border p-3 rounded-md">
                <h4 className="font-medium">{day.name}</h4>
                <div className="mt-2 space-y-1">
                  {day.exercises.map(exercise => (
                    <div key={exercise.id} className="text-sm">
                      {exercise.name}: {exercise.sets} sets x {exercise.reps} reps
                      {exercise.weight && ` @ ${exercise.weight}kg`}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            {isStaffOrTrainer && (
              <>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                {plan.isCustom ? (
                  <Button variant="ghost" size="sm" className="text-destructive">
                    Delete
                  </Button>
                ) : selectedMember && (
                  <Button variant="default" size="sm">
                    Assign to {selectedMember.name}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  if (isCreatingPlan) {
    return (
      <Container>
        <WorkoutPlanForm
          member={selectedMember || { id: user?.id || '', name: user?.name || '', email: user?.email || '', role: 'member', membershipStatus: 'active' }}
          trainerId={user?.id || 'trainer-123'}
          onSave={handleSaveWorkoutPlan}
          onCancel={() => setIsCreatingPlan(false)}
        />
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Workout Plans</h1>
          
          {isStaffOrTrainer && (
            <Button onClick={() => setIsCreatingPlan(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          )}
        </div>
        
        {isStaffOrTrainer && (
          <div className="mb-6">
            <MemberSelector
              onSelectMember={setSelectedMember}
              selectedMemberId={selectedMember?.id}
            />
            
            {selectedMember && (
              <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                <h2 className="text-lg font-medium">Selected member: {selectedMember.name}</h2>
                <p className="text-sm text-muted-foreground">
                  You can create custom plans or assign general plans to this member
                </p>
              </div>
            )}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue={selectedMember ? "member-plans" : "general-plans"}>
            <TabsList>
              {selectedMember && <TabsTrigger value="member-plans">Custom Plans</TabsTrigger>}
              <TabsTrigger value="general-plans">General Plans</TabsTrigger>
            </TabsList>
            
            {selectedMember && (
              <TabsContent value="member-plans" className="mt-6">
                {memberPlans.filter(plan => plan.memberId === selectedMember.id).length > 0 ? (
                  memberPlans
                    .filter(plan => plan.memberId === selectedMember.id)
                    .map(renderPlanCard)
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <p className="text-muted-foreground mb-4">No custom plans created for this member yet</p>
                    {isStaffOrTrainer && (
                      <Button onClick={() => setIsCreatingPlan(true)}>
                        Create Custom Plan
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            )}
            
            <TabsContent value="general-plans" className="mt-6">
              {generalPlans.length > 0 ? (
                generalPlans.map(renderPlanCard)
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground mb-4">No general workout plans available</p>
                  {isStaffOrTrainer && (
                    <Button onClick={() => setIsCreatingPlan(true)}>
                      Create General Plan
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Container>
  );
};

export default WorkoutPlansPage;
