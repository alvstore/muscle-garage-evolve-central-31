import React from 'react';
import { Member, User } from '@/types';
import { BodyMeasurement } from '@/types/fitness';

export interface BodyMeasurementPageProps {
  memberId: string;
  viewOnly?: boolean;
  currentUser?: User;
  onSaveMeasurements?: (measurements: Partial<BodyMeasurement>) => void;
}

const BodyMeasurementPage: React.FC<BodyMeasurementPageProps> = ({ 
  memberId, 
  viewOnly = false,
  currentUser,
  onSaveMeasurements
}) => {

  const handleSaveMeasurement = () => {
    console.log("Save measurement called");
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Body Measurements History</h3>
      <div className="bg-muted/40 rounded-lg p-6 text-center">
        <p className="text-muted-foreground">
          No measurement data available for this member.
        </p>
        <button onClick={handleSaveMeasurement}>Save Measurement</button>
      </div>
    </div>
  );
};

export default BodyMeasurementPage;
