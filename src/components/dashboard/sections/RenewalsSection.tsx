
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { RenewalItem } from '@/types/dashboard';

interface RenewalsSectionProps {
  renewals?: RenewalItem[];
}

const RenewalsSection = ({ renewals = [] }: RenewalsSectionProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Upcoming Renewals</CardTitle>
          <CardDescription>Memberships due for renewal soon</CardDescription>
        </div>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {renewals.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No upcoming renewals</p>
          </div>
        ) : (
          <div className="space-y-4">
            {renewals.map((renewal) => (
              <div key={renewal.id} className="flex items-center gap-4">
                <div className="rounded-full w-10 h-10 flex items-center justify-center bg-muted">
                  <span className="font-medium text-xs">{(renewal.memberName || renewal.member_name || "").substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium truncate">{renewal.memberName || renewal.member_name}</div>
                    <Badge
                      variant={
                        renewal.status === 'upcoming' || renewal.status === 'active' ? 'default' :
                        renewal.status === 'overdue' || renewal.status === 'expired' ? 'destructive' : 'secondary'
                      }
                      className="ml-2"
                    >
                      {renewal.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{renewal.membershipName || renewal.membership_plan || renewal.membershipPlan || renewal.plan_name}</span>
                    <span className="font-medium">₹{(renewal.renewal_amount || renewal.renewalAmount || renewal.amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Expires: {format(parseISO(renewal.expiryDate || renewal.expiry_date || ""), 'dd MMM yyyy')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RenewalsSection;
