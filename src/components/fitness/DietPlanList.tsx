
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DietPlan } from "@/types";
import { toast } from "sonner";

interface DietPlanListProps {
  plans: DietPlan[];
  onEdit?: (plan: DietPlan) => void;
  onDelete?: (planId: string) => void;
  onAdd?: () => void;
  readOnly?: boolean;
}

export const DietPlanList: React.FC<DietPlanListProps> = ({
  plans,
  onEdit,
  onDelete,
  onAdd,
  readOnly = false
}) => {
  const handleDelete = (plan: DietPlan) => {
    if (window.confirm(`Are you sure you want to delete the diet plan "${plan.name}"?`)) {
      onDelete?.(plan.id);
      toast.success(`Diet plan "${plan.name}" deleted`);
    }
  };

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No diet plans found</p>
        {!readOnly && onAdd && (
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4 mr-1" />
            Create Diet Plan
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!readOnly && onAdd && (
        <div className="flex justify-end">
          <Button onClick={onAdd} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add New Plan
          </Button>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader className="pb-2">
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                {plan.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Diet Type:</span> {plan.diet_type || "Not specified"}
                </div>
                {plan.daily_calories && (
                  <div>
                    <span className="font-medium">Daily Calories:</span> {plan.daily_calories} kcal
                  </div>
                )}
                <div>
                  <span className="font-medium">Meals:</span> {plan.mealPlans?.length || 0}
                </div>
              </div>
            </CardContent>
            {!readOnly && (
              <CardFooter>
                <div className="flex justify-end w-full space-x-2">
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={() => onEdit(plan)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(plan)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
