
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Edit, Trash, User, Dumbbell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
  rest_time?: string;
  media_url?: string;
  muscle_group_tag?: string;
}

interface WorkoutDay {
  id: string;
  name: string;
  day_label?: string;
  description?: string;
  notes?: string;
  exercises: Exercise[];
}

interface WorkoutPlanProps {
  id: string;
  name: string;
  description?: string;
  trainer_id: string;
  difficulty?: string;
  notes?: string;
  is_global: boolean;
  is_custom: boolean;
  created_at: string;
  updated_at: string;
}

const WorkoutPlanDetails = ({ workoutPlan }: { workoutPlan: WorkoutPlanProps }) => {
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('0');
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchWorkoutDays = async () => {
      try {
        setIsLoading(true);
        
        // Fetch workout days
        const { data: daysData, error: daysError } = await supabase
          .from('workout_days')
          .select('*')
          .eq('workout_plan_id', workoutPlan.id)
          .order('created_at', { ascending: true });
        
        if (daysError) throw daysError;
        
        // For each day, fetch exercises
        const daysWithExercises = await Promise.all(
          daysData.map(async (day) => {
            const { data: exercisesData, error: exercisesError } = await supabase
              .from('exercises')
              .select('*')
              .eq('workout_day_id', day.id)
              .order('created_at', { ascending: true });
            
            if (exercisesError) throw exercisesError;
            
            return { ...day, exercises: exercisesData || [] };
          })
        );
        
        setWorkoutDays(daysWithExercises);
        setActiveTab(daysWithExercises.length > 0 ? '0' : '0');
      } catch (error: any) {
        console.error('Error fetching workout days:', error);
        toast.error('Failed to load workout plan details');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (workoutPlan.id) {
      fetchWorkoutDays();
    }
  }, [workoutPlan.id]);
  
  const canEditPlan = () => {
    if (!user) return false;
    // Allow editing if user is trainer who created the plan or it's a custom plan for this user
    return user.id === workoutPlan.trainer_id || 
           (workoutPlan.is_custom && !workoutPlan.is_global);
  };
  
  // Check if there are any exercises with media URLs
  const hasMediaContent = workoutDays.some(day => 
    day.exercises.some(exercise => exercise.media_url)
  );
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{workoutPlan.name}</CardTitle>
            <CardDescription className="mt-2">
              {workoutPlan.description}
            </CardDescription>
          </div>
          {canEditPlan() && (
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {workoutPlan.difficulty && (
            <Badge variant="outline" className="bg-primary/10">
              <Dumbbell className="h-3 w-3 mr-1" />
              {workoutPlan.difficulty}
            </Badge>
          )}
          {workoutPlan.is_global && (
            <Badge variant="outline" className="bg-secondary/10">
              Global Plan
            </Badge>
          )}
          {workoutPlan.is_custom && (
            <Badge variant="outline" className="bg-accent/10">
              Custom Plan
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {workoutDays.length > 0 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 flex overflow-auto pb-2 w-full">
              {workoutDays.map((day, index) => (
                <TabsTrigger key={day.id} value={index.toString()} className="flex-shrink-0">
                  {day.day_label || day.name || `Day ${index + 1}`}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {workoutDays.map((day, index) => (
              <TabsContent key={day.id} value={index.toString()} className="mt-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{day.name}</h3>
                  {day.description && <p className="text-sm text-muted-foreground mt-1">{day.description}</p>}
                  {day.notes && <p className="text-sm italic mt-2">{day.notes}</p>}
                </div>
                
                <div className="space-y-4 mt-6">
                  {day.exercises.map((exercise) => (
                    <Card key={exercise.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{exercise.name}</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <span className="font-semibold">{exercise.sets}</span>
                                <span className="ml-1">sets</span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-semibold">{exercise.reps}</span>
                                <span className="ml-1">reps</span>
                              </div>
                              {exercise.weight && (
                                <div className="flex items-center">
                                  <span className="font-semibold">{exercise.weight}</span>
                                  <span className="ml-1">kg</span>
                                </div>
                              )}
                              {exercise.rest_time && (
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{exercise.rest_time} rest</span>
                                </div>
                              )}
                            </div>
                            {exercise.muscle_group_tag && (
                              <Badge variant="outline" className="mt-2">
                                {exercise.muscle_group_tag}
                              </Badge>
                            )}
                            {exercise.notes && (
                              <p className="mt-2 text-sm italic">{exercise.notes}</p>
                            )}
                          </div>
                          
                          {exercise.media_url && (
                            <div className="ml-4">
                              <img 
                                src={exercise.media_url} 
                                alt={`${exercise.name} demonstration`} 
                                className="w-16 h-16 object-cover rounded" 
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {day.exercises.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No exercises added to this day yet.
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Dumbbell className="mx-auto h-12 w-12 mb-4 opacity-30" />
            <p>This workout plan doesn't have any days or exercises set up yet.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          <span className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" /> Created {new Date(workoutPlan.created_at).toLocaleDateString()}
          </span>
        </div>
        {workoutPlan.trainer_id && (
          <div className="text-sm text-muted-foreground flex items-center">
            <User className="h-3 w-3 mr-1" /> Trainer ID: {workoutPlan.trainer_id.slice(0, 8)}...
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default WorkoutPlanDetails;
