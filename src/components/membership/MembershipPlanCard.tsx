
import React from 'react';
import { Edit, Trash, Users, Calendar, Check } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MembershipPlan } from '@/types';

interface MembershipPlanCardProps {
  plan: MembershipPlan;
  onEdit: (plan: MembershipPlan) => void;
  onDelete: (plan: MembershipPlan) => void;
}

const MembershipPlanCard: React.FC<MembershipPlanCardProps> = ({ plan, onEdit, onDelete }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const formatDuration = (days: number) => {
    if (days % 30 === 0) {
      const months = days / 30;
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    }
    if (days % 7 === 0) {
      const weeks = days / 7;
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    }
    return `${days} days`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <div className="mt-1 text-2xl font-bold">{formatPrice(plan.price)}</div>
          </div>
          <Badge variant={plan.is_active ? 'default' : 'outline'}>
            {plan.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow py-2">
        {plan.description && (
          <p className="text-muted-foreground mb-4">{plan.description}</p>
        )}
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Duration: {formatDuration(plan.duration_days)}</span>
        </div>
        
        {/* Only show member count if it's available */}
        {typeof plan.memberCount !== 'undefined' && (
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Users className="h-4 w-4 mr-2" />
            <span>{plan.memberCount} active members</span>
          </div>
        )}
        
        {plan.features && plan.features.length > 0 && (
          <div className="space-y-1 mt-4">
            <p className="text-sm font-medium">Features:</p>
            <ul className="space-y-1">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 border-t flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(plan)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(plan)}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MembershipPlanCard;
