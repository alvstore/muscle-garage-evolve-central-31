
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistance, parseISO } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RenewalItem } from '@/types/dashboard';

interface UpcomingRenewalsProps {
  renewals?: RenewalItem[];
  onViewAll?: () => void;
  emptyMessage?: string;
}

const UpcomingRenewals: React.FC<UpcomingRenewalsProps> = ({
  renewals = [],
  onViewAll,
  emptyMessage = 'No upcoming renewals'
}) => {
  // Sort renewals - first by status (overdue first), then by expiry date
  const sortedRenewals = [...renewals].sort((a, b) => {
    // Status priority: overdue > upcoming > renewed
    if (a.status === 'overdue' && b.status !== 'overdue') return -1;
    if (a.status !== 'overdue' && b.status === 'overdue') return 1;
    
    // Same status, sort by expiry date
    const dateA = new Date(a.expiry_date || a.expiryDate || '');
    const dateB = new Date(b.expiry_date || b.expiryDate || '');
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Upcoming Renewals</CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View All
        </Button>
      </CardHeader>

      <CardContent className="pt-2">
        {sortedRenewals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedRenewals.slice(0, 5).map((renewal) => (
              <div key={renewal.id} className="flex items-center space-x-4">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                  {(renewal.member_avatar || renewal.memberAvatar) ? (
                    <img 
                      src={renewal.member_avatar || renewal.memberAvatar} 
                      className="w-full h-full rounded-full object-cover" 
                      alt={renewal.member_name || renewal.memberName || "Member"} 
                    />
                  ) : (
                    <span className="font-medium text-xs">
                      {(renewal.member_name || renewal.memberName || "").substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {renewal.member_name || renewal.memberName}
                    </p>
                    <Badge 
                      variant={renewal.status === 'overdue' ? 'destructive' : 
                              renewal.status === 'upcoming' ? 'default' : 'outline'}
                    >
                      {renewal.status}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground flex justify-between mt-1">
                    <span>{renewal.membership_plan || renewal.membershipPlan || renewal.plan_name}</span>
                    <span>
                      {renewal.status === 'overdue' ? 'Expired ' : 'Expires '}
                      {formatDistance(new Date(renewal.expiry_date || renewal.expiryDate || ''), new Date(), { 
                        addSuffix: true 
                      })}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">
                    ₹{(renewal.renewal_amount || renewal.renewalAmount || renewal.amount || 0).toLocaleString()}
                  </p>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions for {renewal.member_name || renewal.memberName}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingRenewals;
