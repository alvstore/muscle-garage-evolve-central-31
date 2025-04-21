
import React from 'react';
import { Member, User } from '@/types';
import { BodyMeasurement } from '@/types/fitness';

export interface MemberBodyMeasurementsProps {
  memberId: string;
  viewOnly?: boolean;
  currentUser?: User;
  onSaveMeasurements?: (measurements: Partial<BodyMeasurement>) => void;
}

const MemberBodyMeasurements: React.FC<MemberBodyMeasurementsProps> = ({ 
  memberId, 
  viewOnly = false,
  currentUser,
  onSaveMeasurements
}) => {
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
