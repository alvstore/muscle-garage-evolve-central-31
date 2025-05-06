
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface ClassSchedulePageProps {
  hideHeader?: boolean;
}

const ClassSchedulePage: React.FC<ClassSchedulePageProps> = ({ hideHeader = false }) => {
  return (
    <div>
      {!hideHeader && (
        <Card>
          <CardHeader>
            <CardTitle>Class Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Schedule content */}
            <p>Class schedule content goes here</p>
          </CardContent>
        </Card>
      )}
      {hideHeader && (
        <div>
          {/* Schedule content without header */}
          <p>Class schedule content goes here</p>
        </div>
      )}
    </div>
  );
};

export default ClassSchedulePage;
