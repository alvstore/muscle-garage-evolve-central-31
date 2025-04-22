
import React from 'react';
import { WorkoutPlan } from '@/types/workout';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Copy, Users } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { format } from 'date-fns';

interface WorkoutPlanListProps {
  plans: WorkoutPlan[];
  onEdit: (planId: string) => void;
  onDelete: (planId: string) => void;
}

export const WorkoutPlanList: React.FC<WorkoutPlanListProps> = ({ 
  plans, 
  onEdit,
  onDelete 
}) => {
  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No workout plans found</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <Card key={plan.id} className="flex flex-col">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <Badge variant={plan.difficulty === 'beginner' ? 'outline' : plan.difficulty === 'intermediate' ? 'secondary' : 'destructive'}>
                {plan.difficulty.charAt(0).toUpperCase() + plan.difficulty.slice(1)}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {plan.description || 'No description provided'}
            </p>
            
            <div className="space-y-1 mb-4">
              <div className="text-sm">
                <span className="font-medium">Days:</span> {plan.workoutDays.length}
              </div>
              <div className="text-sm">
                <span className="font-medium">Exercises:</span> {plan.workoutDays.reduce((acc, day) => acc + day.exercises.length, 0)}
              </div>
              <div className="text-sm">
                <span className="font-medium">Last Updated:</span> {format(new Date(plan.updatedAt), 'MMM d, yyyy')}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {plan.targetGoals?.map((goal, idx) => (
                <Badge key={idx} variant="outline" className="bg-muted">
                  {goal}
                </Badge>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between mt-auto pt-4 border-t">
            <Button variant="outline" size="sm" onClick={() => onEdit(plan.id)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete the workout plan "{plan.name}"? 
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    variant="destructive" 
                    onClick={() => onDelete(plan.id)}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-1" />
                  Assign
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Workout Plan</DialogTitle>
                  <DialogDescription>
                    This feature will be available in the member assignment page.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button>Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
