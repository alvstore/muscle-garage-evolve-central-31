
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { format } from 'date-fns';
import { MoreHorizontal, Plus } from 'lucide-react';
import { DietPlan } from '@/types/fitness';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface DietPlanListProps {
  plans?: DietPlan[];
  onAdd?: () => void;
  onEdit?: (plan: DietPlan) => void;
  onDelete?: (planId: string) => void;
  isLoading?: boolean;
}

const DietPlanList: React.FC<DietPlanListProps> = ({
  plans = [],
  onAdd,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlans = searchTerm
    ? plans.filter(plan => 
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plan.description && plan.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (plan.dietType && plan.dietType.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : plans;

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (e) {
      return date;
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this diet plan?')) {
      onDelete && onDelete(id);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Diet Plans</CardTitle>
            <CardDescription>Manage diet plans for members</CardDescription>
          </div>
          {onAdd && (
            <Button onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Plan
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search diet plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Loading diet plans...
                  </TableCell>
                </TableRow>
              ) : filteredPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No diet plans found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.description || 'No description'}</TableCell>
                    <TableCell>
                      {plan.dietType ? (
                        <Badge variant="outline">{plan.dietType}</Badge>
                      ) : (
                        'Standard'
                      )}
                    </TableCell>
                    <TableCell>{formatDate(plan.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(plan)}>
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem 
                              onClick={() => handleDelete(plan.id)}
                              className="text-destructive"
                            >
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DietPlanList;
