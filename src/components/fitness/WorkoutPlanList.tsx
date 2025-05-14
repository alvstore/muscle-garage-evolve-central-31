
import React, { useState } from 'react';
import { WorkoutPlan } from '@/types/fitness';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

interface WorkoutPlanListProps {
  plans: WorkoutPlan[];
  onSelectPlan?: (plan: WorkoutPlan) => void;
  onCreatePlan?: () => void;
  onEditPlan?: (plan: WorkoutPlan) => void;
  onDeletePlan?: (planId: string) => void;
  viewOnly?: boolean;
}

export const WorkoutPlanList = ({
  plans,
  onSelectPlan,
  onCreatePlan,
  onEditPlan,
  onDeletePlan,
  viewOnly = false
}: WorkoutPlanListProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Workout Plans</h2>
        {!viewOnly && onCreatePlan && (
          <Button onClick={onCreatePlan}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Plan
          </Button>
        )}
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No workout plans found</p>
          {!viewOnly && onCreatePlan && (
            <Button onClick={onCreatePlan}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Plan
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectPlan && onSelectPlan(plan)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{plan.name || 'Unnamed Plan'}</CardTitle>
                  <div className="flex space-x-1">
                    {plan.is_custom && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Custom
                      </Badge>
                    )}
                    {plan.is_global && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Global
                      </Badge>
                    )}
                    {plan.difficulty && (
                      <Badge variant="outline" className="capitalize">
                        {plan.difficulty}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription>
                  {plan.description || 'No description provided'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>Workout Days: {plan.workout_days?.length || 0}</p>
                  {plan.target_goals && plan.target_goals.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium mb-1">Goals:</p>
                      <div className="flex flex-wrap gap-1">
                        {plan.target_goals.map((goal, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              {!viewOnly && (
                <CardFooter className="flex justify-end space-x-2">
                  {onEditPlan && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPlan(plan);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  {onDeletePlan && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePlan(plan.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanList;
