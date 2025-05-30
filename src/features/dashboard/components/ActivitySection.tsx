
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RecentActivity, PendingPayments, Announcements } from '@/features/dashboard/components';

const ActivitySection = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest check-ins and transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivity activities={[]} />
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
          <CardDescription>
            Unpaid invoices and due dates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PendingPayments payments={[]} />
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>
            Latest news and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Announcements announcements={[]} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivitySection;
