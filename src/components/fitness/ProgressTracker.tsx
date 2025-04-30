
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BodyMeasurement } from '@/types/measurements';
import { Member } from '@/types';

interface ProgressTrackerProps {
  measurements?: BodyMeasurement[];
  targetWeight?: number;
  targetBodyFat?: number;
  member?: Member;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  measurements = [],
  targetWeight,
  targetBodyFat,
  member
}) => {
  const getLatestAndOldest = () => {
    if (!measurements.length) return { latest: null, oldest: null };
    
    const sortedMeasurements = [...measurements].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return {
      latest: sortedMeasurements[0],
      oldest: sortedMeasurements[sortedMeasurements.length - 1]
    };
  };

  const { latest, oldest } = getLatestAndOldest();
  
  const calculateProgress = (current?: number, initial?: number, target?: number) => {
    if (!current || !initial || !target) return 0;
    
    // For weight loss or body fat reduction (where lower is better)
    if (initial > target) {
      return Math.min(100, Math.max(0, ((initial - current) / (initial - target)) * 100));
    } 
    // For weight gain or muscle gain (where higher is better)
    else {
      return Math.min(100, Math.max(0, ((current - initial) / (target - initial)) * 100));
    }
  };

  const weightProgress = calculateProgress(
    latest?.weight,
    oldest?.weight,
    targetWeight || (latest?.weight && latest.weight * 0.9) // Default target is 10% loss
  );
  
  const bodyFatProgress = calculateProgress(
    latest?.body_fat_percentage,
    oldest?.body_fat_percentage,
    targetBodyFat || (latest?.body_fat_percentage && latest.body_fat_percentage * 0.85) // Default target is 15% reduction
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  
  const calculateChange = (current?: number, initial?: number) => {
    if (!current || !initial) return 0;
    return current - initial;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Tracker</CardTitle>
        <CardDescription>
          {member ? `Tracking progress for ${member.name}` : ''}
          {oldest && latest ? 
            `Tracking progress from ${formatDate(oldest.date)} to ${formatDate(latest.date)}` : 
            "No measurement data available"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {latest && oldest ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Weight</span>
                <span className="font-medium">
                  {latest.weight || 'N/A'} kg
                  {calculateChange(latest.weight, oldest.weight) !== 0 && (
                    <span className={calculateChange(latest.weight, oldest.weight) < 0 ? 
                      "text-green-500 ml-2" : "text-rose-500 ml-2"}>
                      {calculateChange(latest.weight, oldest.weight) > 0 ? "+" : ""}
                      {calculateChange(latest.weight, oldest.weight).toFixed(1)} kg
                    </span>
                  )}
                </span>
              </div>
              <Progress value={weightProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Start: {oldest.weight || 'N/A'} kg</span>
                <span>Target: {targetWeight || (latest.weight && (latest.weight * 0.9).toFixed(1)) || 'N/A'} kg</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Body Fat</span>
                <span className="font-medium">
                  {latest.body_fat_percentage || 'N/A'}%
                  {calculateChange(latest.body_fat_percentage, oldest.body_fat_percentage) !== 0 && (
                    <span className={calculateChange(latest.body_fat_percentage, oldest.body_fat_percentage) < 0 ? 
                      "text-green-500 ml-2" : "text-rose-500 ml-2"}>
                      {calculateChange(latest.body_fat_percentage, oldest.body_fat_percentage) > 0 ? "+" : ""}
                      {calculateChange(latest.body_fat_percentage, oldest.body_fat_percentage).toFixed(1)}%
                    </span>
                  )}
                </span>
              </div>
              <Progress value={bodyFatProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Start: {oldest.body_fat_percentage || 'N/A'}%</span>
                <span>
                  Target: {targetBodyFat || (latest.body_fat_percentage && 
                    (latest.body_fat_percentage * 0.85).toFixed(1)) || 'N/A'}%
                </span>
              </div>
            </div>
            
            <div className="pt-2 text-center text-sm text-muted-foreground">
              Progress is calculated based on your initial measurements and targets
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>Not enough measurement data available to track progress.</p>
            <p>Please record at least two measurements to see your progress.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
