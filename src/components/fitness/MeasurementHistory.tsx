
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BodyMeasurement } from '@/types/measurements';
import { Skeleton } from '@/components/ui/skeleton';

export interface MeasurementHistoryProps {
  measurements: BodyMeasurement[];
  isLoading: boolean;
}

export const MeasurementHistory: React.FC<MeasurementHistoryProps> = ({ measurements, isLoading }) => {
  const sortedMeasurements = [...measurements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  
  if (measurements.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No measurement history available.</p>
        <p className="text-sm text-muted-foreground mt-1">Add your first measurement to see your history.</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Weight (kg)</TableHead>
            <TableHead>BMI</TableHead>
            <TableHead>Measurements (cm)</TableHead>
            <TableHead>Body Fat %</TableHead>
            <TableHead>Added By</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMeasurements.map((measurement) => (
            <TableRow key={measurement.id}>
              <TableCell>{new Date(measurement.date).toLocaleDateString()}</TableCell>
              <TableCell>{measurement.weight || '-'}</TableCell>
              <TableCell>{measurement.bmi?.toFixed(1) || '-'}</TableCell>
              <TableCell>
                <div className="text-xs space-y-1">
                  {measurement.chest && <div>Chest: {measurement.chest} cm</div>}
                  {measurement.waist && <div>Waist: {measurement.waist} cm</div>}
                  {measurement.hips && <div>Hips: {measurement.hips} cm</div>}
                  {measurement.biceps && <div>Biceps: {measurement.biceps} cm</div>}
                  {measurement.thighs && <div>Thighs: {measurement.thighs} cm</div>}
                </div>
              </TableCell>
              <TableCell>{measurement.bodyFat ? `${measurement.bodyFat}%` : '-'}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {measurement.addedBy.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MeasurementHistory;
