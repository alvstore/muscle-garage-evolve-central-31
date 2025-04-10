
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import BodyMeasurementForm from "./BodyMeasurementForm";
import { BodyMeasurement } from "@/types/measurements";
import { User } from "@/types";

interface MemberBodyMeasurementsProps {
  memberId?: string;
  currentUser: User;
  onSaveMeasurements: (measurements: Partial<BodyMeasurement>) => void;
}

const MemberBodyMeasurements: React.FC<MemberBodyMeasurementsProps> = ({ 
  memberId, 
  currentUser,
  onSaveMeasurements
}) => {
  const [includeMeasurements, setIncludeMeasurements] = useState(false);

  const handleSaveMeasurements = (measurements: Partial<BodyMeasurement>) => {
    onSaveMeasurements(measurements);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Initial Body Measurements</CardTitle>
            <CardDescription>
              Include initial body measurements for this member
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="include-measurements" className="cursor-pointer">
              Include Measurements
            </Label>
            <Switch
              id="include-measurements"
              checked={includeMeasurements}
              onCheckedChange={setIncludeMeasurements}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {includeMeasurements ? (
          <BodyMeasurementForm
            memberId={memberId}
            currentUser={currentUser}
            onSave={handleSaveMeasurements}
          />
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Toggle the switch above to include initial body measurements.</p>
            <p className="text-sm mt-1">You can add measurements later from the member's profile.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberBodyMeasurements;
