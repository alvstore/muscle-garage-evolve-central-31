
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DietPlan } from '@/types';
import { Loader2, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface DietPlansListProps {
  plans: DietPlan[];
  isLoading: boolean;
  onPlanCreated: (plan: DietPlan) => void;
  onPlanUpdated: (plan: DietPlan) => void;
  onPlanDeleted: (planId: string) => void;
  canCreateGlobal: boolean;
}

const DietPlansList: React.FC<DietPlansListProps> = ({
  plans,
  isLoading,
  onPlanCreated,
  onPlanUpdated,
  onPlanDeleted,
  canCreateGlobal
}) => {
  const [viewingPlan, setViewingPlan] = useState<DietPlan | null>(null);
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this diet plan?')) {
      onPlanDeleted(id);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (plans.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No diet plans found.</p>
      </div>
    );
  }
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Meals</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell>{plan.diet_type || 'Standard'}</TableCell>
              <TableCell>{plan.mealPlans.length} meals</TableCell>
              <TableCell>
                {plan.created_at ? format(new Date(plan.created_at), 'MMM d, yyyy') : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setViewingPlan(plan)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onPlanUpdated(plan)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(plan.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={!!viewingPlan} onOpenChange={(open) => !open && setViewingPlan(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewingPlan?.name}</DialogTitle>
          </DialogHeader>
          
          {viewingPlan && (
            <div className="py-4">
              <div className="mb-4">
                <p className="text-muted-foreground text-sm">
                  {viewingPlan.description}
                </p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Diet Type:</span> {viewingPlan.diet_type || 'Standard'}
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Meal Plan</h3>
                {viewingPlan.mealPlans.map((meal, i) => (
                  <Card key={meal.id} className="p-4">
                    <h4 className="font-medium text-lg">
                      {i + 1}. {meal.name} {meal.time && `(${meal.time})`}
                    </h4>
                    
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                      {meal.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                    
                    {meal.macros && (
                      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div className="p-2 bg-muted/50 rounded-md">
                          <div className="text-xs text-muted-foreground">Protein</div>
                          <div className="font-medium">{meal.macros.protein}g</div>
                        </div>
                        <div className="p-2 bg-muted/50 rounded-md">
                          <div className="text-xs text-muted-foreground">Carbs</div>
                          <div className="font-medium">{meal.macros.carbs}g</div>
                        </div>
                        <div className="p-2 bg-muted/50 rounded-md">
                          <div className="text-xs text-muted-foreground">Fats</div>
                          <div className="font-medium">{meal.macros.fats}g</div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
              
              {viewingPlan.notes && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Notes</h3>
                  <p className="text-sm">{viewingPlan.notes}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingPlan(null)}>
              Close
            </Button>
            <Button onClick={() => {
              if (viewingPlan) onPlanUpdated(viewingPlan);
              setViewingPlan(null);
            }}>
              Edit Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DietPlansList;
