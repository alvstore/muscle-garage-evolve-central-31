import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Edit, Trash, Users, Calendar, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  features?: string[];
  isActive?: boolean;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
  memberCount?: number;
}

interface MembershipPlanCardProps {
  plan: MembershipPlan;
  onEdit?: (plan: MembershipPlan) => void;
  onDelete?: (plan: MembershipPlan) => void;
  showActions?: boolean;
  isPopular?: boolean;
}

export const MembershipPlanCard = ({
  plan,
  onEdit,
  onDelete,
  showActions = true,
  isPopular = false,
}: MembershipPlanCardProps) => {
  const {
    name,
    description,
    price,
    durationDays,
    features = [],
    isActive,
    memberCount = 0
  } = plan;

  return (
    <Card className={cn(
      "flex flex-col h-full transition-all duration-200 hover:shadow-lg",
      isPopular && "border-primary shadow-md scale-105"
    )}>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          {isPopular && (
            <Badge variant="default" className="bg-primary">
              Popular
            </Badge>
          )}
        </div>
        {description && (
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          <div className="flex items-baseline gap-x-2">
            <span className="text-3xl font-bold">{formatCurrency(price)}</span>
            <span className="text-muted-foreground">
              / {durationDays} days
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Key Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{durationDays} days</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{memberCount} members</span>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-1" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="flex justify-between pt-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={isActive ? "success" : "secondary"}>
                  {isActive ? "Active" : "Inactive"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isActive ? "Plan is currently active" : "Plan is not active"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(plan)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(plan)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default MembershipPlanCard;
