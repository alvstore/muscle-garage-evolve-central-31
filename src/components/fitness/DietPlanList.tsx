
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { DietPlan } from "@/types/diet";
import { AlertCircle, MoreVertical, Edit, Trash, Copy, Eye } from "lucide-react";
import { formatDistance } from 'date-fns';

interface DietPlanListProps {
  plans: DietPlan[];
  onEdit?: (plan: DietPlan) => void;
  onDelete?: (planId: string) => void;
  onDuplicate?: (plan: DietPlan) => void;
  onView?: (plan: DietPlan) => void;
  emptyState?: React.ReactNode;
  isLoading?: boolean;
  showActions?: boolean;
  showFilters?: boolean;
}

export const DietPlanList = ({
  plans,
  onEdit,
  onDelete,
  onDuplicate,
  onView,
  emptyState,
  isLoading = false,
  showActions = true,
  showFilters = true,
}: DietPlanListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [showGlobalOnly, setShowGlobalOnly] = useState(false);
  const [showCustomOnly, setShowCustomOnly] = useState(false);

  const handleDeleteClick = (planId: string) => {
    setPlanToDelete(planId);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    if (planToDelete && onDelete) {
      onDelete(planToDelete);
    }
    setShowConfirmDelete(false);
    setPlanToDelete(null);
  };

  // Filter plans based on search query and filters
  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          plan.diet_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (showGlobalOnly && !plan.is_global) return false;
    if (showCustomOnly && !plan.is_custom) return false;
    
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-8 w-8 bg-muted rounded-full"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="w-full rounded-lg border border-dashed p-8 flex flex-col items-center justify-center">
        {emptyState || (
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Diet Plans</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You haven't created any diet plans yet.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1">
            <Input
              placeholder="Search diet plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="global-only" 
                checked={showGlobalOnly} 
                onCheckedChange={(checked) => setShowGlobalOnly(checked === true)}
              />
              <Label htmlFor="global-only">Global Plans</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="custom-only" 
                checked={showCustomOnly} 
                onCheckedChange={(checked) => setShowCustomOnly(checked === true)}
              />
              <Label htmlFor="custom-only">Custom Plans</Label>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {plan.diet_type} • {plan.daily_calories} calories
                  </CardDescription>
                </div>
                {showActions && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(plan)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(plan)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onDuplicate && (
                        <DropdownMenuItem onClick={() => onDuplicate(plan)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(plan.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                {plan.is_global && <Badge variant="outline">Global</Badge>}
                {plan.is_custom && <Badge variant="outline">Custom</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium">Meals</h4>
                  <p className="text-sm text-muted-foreground">{plan.meal_plans?.length || 0} meals planned</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium">Last Updated</h4>
                  <p className="text-sm text-muted-foreground">
                    {plan.updated_at ? 
                      formatDistance(new Date(plan.updated_at), new Date(), { addSuffix: true }) : 
                      'Never updated'}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 pt-3">
              <div className="w-full flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  {plan.meal_plans?.length || 0} meals • {plan.daily_calories} cal
                </div>
                {onView && (
                  <Button variant="ghost" size="sm" onClick={() => onView(plan)}>
                    View Plan
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this diet plan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DietPlanList;
