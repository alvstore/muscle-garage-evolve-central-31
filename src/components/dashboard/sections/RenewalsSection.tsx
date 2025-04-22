
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UpcomingRenewals from '@/components/dashboard/UpcomingRenewals';
import { RenewalItem } from '@/types/dashboard';

const RenewalsSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [renewals, setRenewals] = useState<RenewalItem[]>([]);

  useEffect(() => {
    // Simulate API call to fetch renewals
    const fetchRenewals = async () => {
      // In a real app, this would be an API call with proper error handling
      setTimeout(() => {
        setRenewals([
          {
            id: "renewal1",
            memberName: "Emily Davidson",
            memberAvatar: "/placeholder.svg",
            membershipPlan: "Premium Annual",
            expiryDate: "2023-07-28T00:00:00Z",
            status: "active",
            renewalAmount: 999
          },
          {
            id: "renewal2",
            memberName: "Michael Wong",
            memberAvatar: "/placeholder.svg",
            membershipPlan: "Basic Quarterly",
            expiryDate: "2023-07-30T00:00:00Z",
            status: "active",
            renewalAmount: 249
          },
          {
            id: "renewal3",
            memberName: "David Clark",
            memberAvatar: "/placeholder.svg",
            membershipPlan: "Standard Monthly",
            expiryDate: "2023-08-01T00:00:00Z",
            status: "active",
            renewalAmount: 99
          }
        ]);
        setIsLoading(false);
      }, 1000);
    };

    fetchRenewals();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Renewals</CardTitle>
        <CardDescription>
          Memberships up for renewal soon
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-12 animate-pulse rounded bg-muted"></div>
            <div className="h-12 animate-pulse rounded bg-muted"></div>
            <div className="h-12 animate-pulse rounded bg-muted"></div>
          </div>
        ) : (
          <UpcomingRenewals renewals={renewals} />
        )}
      </CardContent>
    </Card>
  );
};

export default RenewalsSection;
