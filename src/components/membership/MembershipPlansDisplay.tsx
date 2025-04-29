
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, addDays } from 'date-fns';
import { Check, AlertCircle, CalendarClock } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface MembershipPlanDisplayProps {
  currentPlan?: {
    name: string;
    startDate: string;
    endDate: string;
    features: string[];
    price: number;
    status: 'active' | 'expired' | 'pending';
    trainer?: string;
  };
}

const MembershipPlansDisplay: React.FC<MembershipPlanDisplayProps> = ({ 
  currentPlan = {
    name: "Premium Quarterly",
    startDate: new Date(2025, 3, 1).toISOString(),
    endDate: new Date(2025, 6, 1).toISOString(),
    features: [
      "Full access to gym equipment",
      "Unlimited group classes",
      "Personal trainer (1 session/month)",
      "Nutrition consultation"
    ],
    price: 5499,
    status: 'active',
    trainer: "John Doe"
  }
}) => {
  const navigate = useNavigate();
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      default:
        return null;
    }
  };

  const handleRenewPlan = () => {
    navigate('/membership');
    toast.success("Redirecting to membership plans page");
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  const daysRemaining = currentPlan 
    ? Math.max(0, Math.ceil((new Date(currentPlan.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>My Membership</CardTitle>
          {getStatusBadge(currentPlan.status)}
        </div>
      </CardHeader>
      <CardContent>
        {currentPlan ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{currentPlan.name}</h3>
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <CalendarClock className="h-4 w-4 mr-1" />
                  <span>
                    {format(new Date(currentPlan.startDate), 'MMM d, yyyy')} - {format(new Date(currentPlan.endDate), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              <div className="mt-2 md:mt-0">
                <div className="text-2xl font-bold">{formatPrice(currentPlan.price)}</div>
              </div>
            </div>
            
            {daysRemaining <= 30 && currentPlan.status === 'active' && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Membership Expiring Soon</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Your membership will expire in {daysRemaining} days. Consider renewing to avoid interruption.
                  </p>
                  <Button 
                    className="mt-3" 
                    size="sm" 
                    onClick={handleRenewPlan}
                  >
                    Renew Membership
                  </Button>
                </div>
              </div>
            )}
            
            <div>
              <h4 className="font-medium mb-2">Membership Benefits</h4>
              <ul className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {currentPlan.trainer && (
              <div>
                <h4 className="font-medium mb-2">Assigned Trainer</h4>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="font-bold text-primary">
                      {currentPlan.trainer.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{currentPlan.trainer}</p>
                    <p className="text-sm text-muted-foreground">Personal Trainer</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => navigate('/invoices')}>
                View Invoices
              </Button>
              {currentPlan.status === 'active' && (
                <Button onClick={() => navigate('/fitness/plans')}>
                  View Fitness Plans
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No Active Membership</h3>
            <p className="text-muted-foreground mb-4">You don't have an active membership plan.</p>
            <Button onClick={handleRenewPlan}>
              Browse Membership Plans
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MembershipPlansDisplay;
