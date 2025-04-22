
import React from 'react';
import { DietPlan } from '@/types/diet';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Copy, Users, FileText } from 'lucide-react';
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

interface DietPlanListProps {
  plans: DietPlan[];
  onEdit: (planId: string) => void;
  onDelete: (planId: string) => void;
}

export const DietPlanList: React.FC<DietPlanListProps> = ({ 
  plans, 
  onEdit,
  onDelete 
}) => {
  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No diet plans found</p>
      </div>
    );
  }
  
  // Function to calculate total calories for a plan
  const calculateTotalCalories = (plan: DietPlan) => {
    return plan.mealPlans.reduce((total, meal) => total + meal.macros.calories, 0);
  };
  
  // Function to render diet type badge
  const renderDietTypeBadge = (dietType?: string) => {
    switch (dietType) {
      case 'vegetarian':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Vegetarian</Badge>;
      case 'vegan':
        return <Badge variant="outline" className="bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300">Vegan</Badge>;
      case 'keto':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Keto</Badge>;
      case 'paleo':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">Paleo</Badge>;
      case 'gluten-free':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Gluten-Free</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Standard</Badge>;
    }
  };
  
  // Function to render goal badge
  const renderGoalBadge = (goal?: string) => {
    switch (goal) {
      case 'weight-loss':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Weight Loss</Badge>;
      case 'muscle-gain':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Muscle Gain</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Maintenance</Badge>;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <Card key={plan.id} className="flex flex-col">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{plan.name || "Unnamed Plan"}</h3>
              <div className="flex flex-wrap gap-1">
                {renderDietTypeBadge(plan.dietType)}
                {renderGoalBadge(plan.goal)}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {plan.description || 'No description provided'}
            </p>
            
            <div className="space-y-1 mb-4">
              <div className="text-sm">
                <span className="font-medium">Daily Calories:</span> {plan.dailyCalories || calculateTotalCalories(plan)}
              </div>
              <div className="text-sm">
                <span className="font-medium">Meals:</span> {plan.mealPlans.length}
              </div>
              <div className="text-sm">
                <span className="font-medium">Last Updated:</span> {format(new Date(plan.updatedAt), 'MMM d, yyyy')}
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <h4 className="text-sm font-medium">Meal Overview:</h4>
              <ul className="text-xs space-y-1">
                {plan.mealPlans.slice(0, 3).map((meal) => (
                  <li key={meal.id} className="text-muted-foreground">
                    <span className="font-medium text-foreground">{meal.name}</span> ({meal.time}): {meal.macros.calories} kcal
                  </li>
                ))}
                {plan.mealPlans.length > 3 && (
                  <li className="text-muted-foreground italic">... and {plan.mealPlans.length - 3} more meals</li>
                )}
              </ul>
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
                    Are you sure you want to delete the diet plan "{plan.name}"? 
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
            
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
