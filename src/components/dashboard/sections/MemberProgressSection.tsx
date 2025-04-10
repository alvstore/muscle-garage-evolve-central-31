
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MemberProgressChart from '@/components/dashboard/MemberProgressChart';

const MemberProgressSection = () => {
  // Mock data for member progress
  const progressData = [
    { date: '2022-01-01', metrics: { weight: 80, bodyFatPercentage: 22, bmi: 26.4, muscleGain: 0 } },
    { date: '2022-02-01', metrics: { weight: 78, bodyFatPercentage: 21, bmi: 25.8, muscleGain: 1.5 } },
    { date: '2022-03-01', metrics: { weight: 77, bodyFatPercentage: 20, bmi: 25.4, muscleGain: 2.2 } },
    { date: '2022-04-01', metrics: { weight: 76, bodyFatPercentage: 19, bmi: 25.1, muscleGain: 2.8 } },
    { date: '2022-05-01', metrics: { weight: 75, bodyFatPercentage: 18, bmi: 24.8, muscleGain: 3.5 } },
    { date: '2022-06-01', metrics: { weight: 74, bodyFatPercentage: 17, bmi: 24.4, muscleGain: 4.2 } }
  ];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Member Progress</CardTitle>
        <CardDescription>
          Average fitness metrics over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MemberProgressChart 
          data={progressData} 
          memberId="member1" 
          memberName="John Doe" 
        />
      </CardContent>
    </Card>
  );
};

export default MemberProgressSection;
