
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface ClassTypesPageProps {
  hideHeader?: boolean;
}

const ClassTypesPage: React.FC<ClassTypesPageProps> = ({ hideHeader = false }) => {
  return (
    <div>
      {!hideHeader && (
        <Card>
          <CardHeader>
            <CardTitle>Class Types</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Class types content */}
            <p>Class types content goes here</p>
          </CardContent>
        </Card>
      )}
      {hideHeader && (
        <div>
          {/* Class types content without header */}
          <p>Class types content goes here</p>
        </div>
      )}
    </div>
  );
};

export default ClassTypesPage;
