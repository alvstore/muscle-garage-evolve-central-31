
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { BodyMeasurement } from '@/types/measurements';
import { Loader2 } from 'lucide-react';

interface MeasurementHistoryProps {
  measurements: BodyMeasurement[];
  isLoading: boolean;
}

const MeasurementHistory: React.FC<MeasurementHistoryProps> = ({ 
  measurements,
  isLoading
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Measurement History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : measurements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium">Date</th>
                  <th className="py-3 px-4 text-left font-medium">Weight (kg)</th>
                  <th className="py-3 px-4 text-left font-medium">Body Fat (%)</th>
                  <th className="py-3 px-4 text-left font-medium">Waist (cm)</th>
                  <th className="py-3 px-4 text-left font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((measurement) => (
                  <tr key={measurement.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{formatDate(measurement.date)}</td>
                    <td className="py-3 px-4">{measurement.weight || '-'}</td>
                    <td className="py-3 px-4">{measurement.body_fat_percentage || '-'}</td>
                    <td className="py-3 px-4">{measurement.waist || '-'}</td>
                    <td className="py-3 px-4">{measurement.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No measurement history found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeasurementHistory;
