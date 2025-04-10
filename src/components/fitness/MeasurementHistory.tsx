
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BodyMeasurement, PROGRESS_TIMEFRAMES } from "@/types/measurements";
import { format, parseISO, subDays, subMonths, subYears } from "date-fns";
import { Edit, Trash2 } from "lucide-react";

interface MeasurementHistoryProps {
  measurements: BodyMeasurement[];
  onEdit?: (measurement: BodyMeasurement) => void;
  onDelete?: (id: string) => void;
  canEdit: boolean;
}

const MeasurementHistory: React.FC<MeasurementHistoryProps> = ({
  measurements,
  onEdit,
  onDelete,
  canEdit
}) => {
  const [timeframe, setTimeframe] = useState<string>("30days");
  
  const filteredMeasurements = measurements.filter(measurement => {
    const measurementDate = new Date(measurement.date);
    const today = new Date();
    
    switch (timeframe) {
      case "7days":
        return measurementDate >= subDays(today, 7);
      case "30days":
        return measurementDate >= subDays(today, 30);
      case "3months":
        return measurementDate >= subMonths(today, 3);
      case "6months":
        return measurementDate >= subMonths(today, 6);
      case "1year":
        return measurementDate >= subYears(today, 1);
      default:
        return true; // "all" timeframe
    }
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Measurement History</CardTitle>
            <CardDescription>
              View your body measurement history over time
            </CardDescription>
          </div>
          <Select
            value={timeframe}
            onValueChange={setTimeframe}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {PROGRESS_TIMEFRAMES.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Height (cm)</TableHead>
                <TableHead>Weight (kg)</TableHead>
                <TableHead>BMI</TableHead>
                <TableHead>Body Fat %</TableHead>
                <TableHead>Chest (cm)</TableHead>
                <TableHead>Waist (cm)</TableHead>
                <TableHead>Hips (cm)</TableHead>
                <TableHead>Biceps (cm)</TableHead>
                <TableHead>Thighs (cm)</TableHead>
                <TableHead>Recorded By</TableHead>
                {canEdit && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMeasurements.length > 0 ? (
                filteredMeasurements.map(measurement => (
                  <TableRow key={measurement.id}>
                    <TableCell className="font-medium">
                      {format(parseISO(measurement.date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{measurement.height || "-"}</TableCell>
                    <TableCell>{measurement.weight || "-"}</TableCell>
                    <TableCell>{measurement.bmi || "-"}</TableCell>
                    <TableCell>{measurement.bodyFat ? `${measurement.bodyFat}%` : "-"}</TableCell>
                    <TableCell>{measurement.chest || "-"}</TableCell>
                    <TableCell>{measurement.waist || "-"}</TableCell>
                    <TableCell>{measurement.hips || "-"}</TableCell>
                    <TableCell>{measurement.biceps || "-"}</TableCell>
                    <TableCell>{measurement.thighs || "-"}</TableCell>
                    <TableCell>{measurement.addedBy.name}</TableCell>
                    {canEdit && (
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(measurement)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(measurement.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={canEdit ? 12 : 11} className="text-center py-4 text-muted-foreground">
                    No measurements found for the selected timeframe.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeasurementHistory;
