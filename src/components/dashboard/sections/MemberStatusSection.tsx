
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MemberStatusChart from '@/components/dashboard/MemberStatusChart';

interface MemberStatusSectionProps {
  data?: {
    name: string;
    value: number;
    color: string;
  }[];
}

const MemberStatusSection = ({ data }: MemberStatusSectionProps) => {
  const defaultData = [
    { name: 'Active', value: 187, color: '#10b981' },
    { name: 'Inactive', value: 43, color: '#f59e0b' },
    { name: 'Expired', value: 26, color: '#ef4444' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Status</CardTitle>
        <CardDescription>
          Distribution of member statuses
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <MemberStatusChart data={data || defaultData} />
      </CardContent>
    </Card>
  );
};

export default MemberStatusSection;
