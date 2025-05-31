
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FeedbackSummaryChart from '@/components/dashboard/FeedbackSummaryChart';
import { Feedback } from '@/types/communication/notification';

interface FeedbackSectionProps {
  data: Feedback[];
}

const FeedbackSection = ({ data }: FeedbackSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Feedback</CardTitle>
        <CardDescription>
          Recent member reviews and ratings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FeedbackSummaryChart feedback={data} />
      </CardContent>
    </Card>
  );
};

export default FeedbackSection;
