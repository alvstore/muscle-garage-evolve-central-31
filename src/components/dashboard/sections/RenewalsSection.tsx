
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UpcomingRenewals from '@/components/dashboard/UpcomingRenewals';

const RenewalsSection = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Upcoming Renewals</CardTitle>
        <CardDescription>
          Memberships up for renewal soon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UpcomingRenewals renewals={[]} />
      </CardContent>
    </Card>
  );
};

export default RenewalsSection;
