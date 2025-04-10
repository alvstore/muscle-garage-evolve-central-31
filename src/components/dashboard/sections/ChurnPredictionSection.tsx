
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ChurnPredictionWidget from '@/components/dashboard/ChurnPredictionWidget';

const ChurnPredictionSection = () => {
  // Mock data for churn prediction
  const churnMembers = [
    {
      id: "member1",
      name: "Michael Johnson",
      avatar: "/avatars/01.png",
      churnRisk: 78,
      lastVisit: "22 days ago",
      missedClasses: 5,
      subscriptionEnd: "Jun 30, 2022",
      contactInfo: {
        phone: "+1234567890",
        email: "michael@example.com"
      },
      factors: [
        { name: "Low Attendance", impact: "high" as const },
        { name: "Expiring Soon", impact: "medium" as const }
      ]
    },
    {
      id: "member2",
      name: "Emily Wilson",
      avatar: "/avatars/02.png",
      churnRisk: 65,
      lastVisit: "15 days ago",
      missedClasses: 3,
      subscriptionEnd: "Jul 10, 2022",
      contactInfo: {
        email: "emily@example.com"
      },
      factors: [
        { name: "Declining Usage", impact: "medium" as const },
        { name: "Few Class Bookings", impact: "low" as const }
      ]
    }
  ];

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Churn Prediction</CardTitle>
        <CardDescription>
          Members at risk of not renewing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChurnPredictionWidget members={churnMembers} />
      </CardContent>
    </Card>
  );
};

export default ChurnPredictionSection;
