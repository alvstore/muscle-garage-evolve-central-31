
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ruler, BarChart2 } from "lucide-react";
import { BodyMeasurement } from "@/types/measurements";
import { useNavigate } from "react-router-dom";

interface MemberBodyMeasurementCardProps {
  memberId: string;
  latestMeasurement?: BodyMeasurement;
}

const MemberBodyMeasurementCard: React.FC<MemberBodyMeasurementCardProps> = ({ 
  memberId,
  latestMeasurement
}) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getBMICategory = (bmi?: number) => {
    if (!bmi) return { label: "N/A", color: "text-gray-400" };
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500" };
    if (bmi < 25) return { label: "Normal", color: "text-green-500" };
    if (bmi < 30) return { label: "Overweight", color: "text-yellow-500" };
    return { label: "Obese", color: "text-red-500" };
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Ruler className="mr-2 h-4 w-4" />
          Body Measurements
        </CardTitle>
        <CardDescription>
          {latestMeasurement 
            ? `Last updated on ${formatDate(latestMeasurement.date)}`
            : "No measurements recorded yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {latestMeasurement ? (
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-accent/20 rounded">
              <div className="text-sm text-muted-foreground">Weight</div>
              <div className="font-semibold">{latestMeasurement.weight ? `${latestMeasurement.weight} kg` : "N/A"}</div>
            </div>
            <div className="p-2 bg-accent/20 rounded">
              <div className="text-sm text-muted-foreground">Height</div>
              <div className="font-semibold">{latestMeasurement.height ? `${latestMeasurement.height} cm` : "N/A"}</div>
            </div>
            <div className="p-2 bg-accent/20 rounded">
              <div className="text-sm text-muted-foreground">BMI</div>
              <div className="font-semibold flex items-center gap-1">
                {latestMeasurement.bmi || "N/A"}
                {latestMeasurement.bmi && (
                  <span className={`text-xs ${getBMICategory(latestMeasurement.bmi).color}`}>
                    ({getBMICategory(latestMeasurement.bmi).label})
                  </span>
                )}
              </div>
            </div>
            <div className="p-2 bg-accent/20 rounded">
              <div className="text-sm text-muted-foreground">Body Fat</div>
              <div className="font-semibold">
                {latestMeasurement.body_fat_percentage ? `${latestMeasurement.body_fat_percentage}%` : "N/A"}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-2 text-center text-muted-foreground">
            No measurement data available
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate(`/fitness/measurements/${memberId}`)}
        >
          <BarChart2 className="mr-2 h-4 w-4" />
          {latestMeasurement ? "View Progress" : "Add Measurements"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MemberBodyMeasurementCard;
