
import React from 'react';
import { Member } from '@/types';

export interface MemberBodyMeasurementsProps {
  memberId: string;
  viewOnly?: boolean;
}

const MemberBodyMeasurements: React.FC<MemberBodyMeasurementsProps> = ({ memberId, viewOnly = false }) => {
  // Placeholder implementation for compatibility
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Body Measurements History</h3>
      <div className="bg-muted/40 rounded-lg p-6 text-center">
        <p className="text-muted-foreground">
          No measurement data available for this member.
        </p>
      </div>
    </div>
  );
};

export default MemberBodyMeasurements;
