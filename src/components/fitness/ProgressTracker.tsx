import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Camera, Save, Plus, Loader2 } from "lucide-react";
import { ProgressMetrics } from "@/types/class";
import { Member } from '@/types'; 
import { toast } from "sonner";
import MemberProgressChart from '@/features/dashboard/components/MemberProgressChart';
import { supabase } from '@/services/api/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemberMeasurements } from '@/hooks/members/use-member-measurements';
import { useMemberProgress } from '@/hooks/members/use-member-progress';

interface ProgressTrackerProps {
  member: Member;
}

const ProgressTracker = ({ member }: ProgressTrackerProps) => {
  const { measurements, latestMeasurement, isLoading: measurementsLoading } = useMemberMeasurements(member.id);
  const { progress, isLoading: progressLoading, updateProgress } = useMemberProgress(member.id);
  
  // Current progress metrics
  const [currentMetrics, setCurrentMetrics] = useState<ProgressMetrics>({
    weight: 0,
    bodyFatPercentage: 0,
    bmi: 0,
    muscleGain: 0
  });
  
  // Update current metrics when data is loaded
  useEffect(() => {
    if (latestMeasurement) {
      setCurrentMetrics({
        weight: latestMeasurement.weight || 0,
        bodyFatPercentage: latestMeasurement.bodyFat || 0,
        bmi: latestMeasurement.bmi || 0,
        muscleGain: progress?.muscle_mass || 0
      });
    } else if (progress) {
      setCurrentMetrics({
        weight: progress.weight || 0,
        bodyFatPercentage: progress.fat_percent || 0,
        bmi: progress.bmi || 0,
        muscleGain: progress.muscle_mass || 0
      });
    }
  }, [latestMeasurement, progress]);
  
  // Transform measurements for chart display
  const progressHistory = measurements.map(measurement => ({
    date: measurement.date,
    metrics: {
      weight: measurement.weight || 0,
      bodyFatPercentage: measurement.bodyFat || 0,
      bmi: measurement.bmi || 0,
      muscleGain: 0 // This isn't tracked in measurements table
    }
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Handle input changes
  const handleMetricChange = (metric: keyof ProgressMetrics, value: string) => {
    setCurrentMetrics({
      ...currentMetrics,
      [metric]: parseFloat(value) || 0
    });
  };
  
  // Handle save progress
  const handleSaveProgress = async () => {
    try {
      // Save to measurements table
      const { data, error } = await supabase
        .from('measurements')
        .insert([
          {
            member_id: member.id,
            weight: currentMetrics.weight,
            body_fat_percentage: currentMetrics.bodyFatPercentage,
            bmi: currentMetrics.bmi,
            recorded_by: member.id, // This would ideally be the current user's ID
            notes: 'Recorded from admin dashboard'
          }
        ])
        .select();

      if (error) throw error;
      
      // Update member_progress table if it exists
      if (progress) {
        const result = await updateProgress({
          weight: currentMetrics.weight,
          fat_percent: currentMetrics.bodyFatPercentage,
          bmi: currentMetrics.bmi,
          muscle_mass: currentMetrics.muscleGain
        });
        
        if (result.error) throw new Error(result.error);
      }
      
      toast.success("Progress saved successfully");
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error("Failed to save progress");
    }
  };
  
  // Calculate changes since last entry
  const calculateChange = (metric: keyof ProgressMetrics) => {
    if (progressHistory.length < 2) return { value: 0, direction: 'neutral' as const };
    
    const latest = progressHistory[progressHistory.length - 1].metrics[metric];
    const previous = progressHistory[progressHistory.length - 2].metrics[metric];
    const change = latest - previous;
    
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' as const : change < 0 ? 'down' as const : 'neutral' as const
    };
  };
  
  const formatChange = (change: { value: number, direction: 'up' | 'down' | 'neutral' }) => {
    if (change.direction === 'neutral') return '0';
    return `${change.direction === 'up' ? '+' : '-'}${change.value.toFixed(1)}`;
  };
  
  const getChangeIcon = (change: { direction: 'up' | 'down' | 'neutral' }, metric: keyof ProgressMetrics) => {
    // For most metrics, down is good (except muscle gain)
    const isGood = (metric === 'muscleGain' && change.direction === 'up') || 
                  (metric !== 'muscleGain' && change.direction === 'down');
    
    if (change.direction === 'neutral') return null;
    
    return change.direction === 'up' ? 
      <TrendingUp className={`h-4 w-4 ${isGood ? 'text-green-500' : 'text-red-500'}`} /> : 
      <TrendingDown className={`h-4 w-4 ${isGood ? 'text-green-500' : 'text-red-500'}`} />;
  };
  
  const isLoading = measurementsLoading || progressLoading;
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">Current Progress</TabsTrigger>
          <TabsTrigger value="history">Progress History</TabsTrigger>
          <TabsTrigger value="photos">Progress Photos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Weight</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics.weight.toFixed(1)} kg</div>
                <div className="flex items-center mt-1 text-sm">
                  {getChangeIcon(calculateChange('weight'), 'weight')}
                  <span className="ml-1">{formatChange(calculateChange('weight'))} kg</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Body Fat %</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics.bodyFatPercentage.toFixed(1)}%</div>
                <div className="flex items-center mt-1 text-sm">
                  {getChangeIcon(calculateChange('bodyFatPercentage'), 'bodyFatPercentage')}
                  <span className="ml-1">{formatChange(calculateChange('bodyFatPercentage'))}%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">BMI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics.bmi.toFixed(1)}</div>
                <div className="flex items-center mt-1 text-sm">
                  {getChangeIcon(calculateChange('bmi'), 'bmi')}
                  <span className="ml-1">{formatChange(calculateChange('bmi'))}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Muscle Gain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics.muscleGain.toFixed(1)} kg</div>
                <div className="flex items-center mt-1 text-sm">
                  {getChangeIcon(calculateChange('muscleGain'), 'muscleGain')}
                  <span className="ml-1">{formatChange(calculateChange('muscleGain'))} kg</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Record New Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={currentMetrics.weight}
                    onChange={(e) => handleMetricChange('weight', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bodyFat">Body Fat (%)</Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    step="0.1"
                    value={currentMetrics.bodyFatPercentage}
                    onChange={(e) => handleMetricChange('bodyFatPercentage', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bmi">BMI</Label>
                  <Input
                    id="bmi"
                    type="number"
                    step="0.1"
                    value={currentMetrics.bmi}
                    onChange={(e) => handleMetricChange('bmi', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="muscleGain">Muscle Gain (kg)</Label>
                  <Input
                    id="muscleGain"
                    type="number"
                    step="0.1"
                    value={currentMetrics.muscleGain}
                    onChange={(e) => handleMetricChange('muscleGain', e.target.value)}
                  />
                </div>
              </div>
              
              <Button className="mt-6" onClick={handleSaveProgress}>
                <Save className="mr-2 h-4 w-4" />
                Save Progress
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Progress Charts</CardTitle>
            </CardHeader>
            <CardContent>
              {progressHistory.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium mb-4">Body Metrics</h3>
                    <MemberProgressChart 
                      data={progressHistory} 
                      memberId={member.id}
                      memberName={member.name}
                      metricType="weight"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium mb-4">Body Fat Percentage</h3>
                    <MemberProgressChart 
                      data={progressHistory} 
                      memberId={member.id}
                      memberName={member.name}
                      metricType="bodyFatPercentage"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No historical data available for this member</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle>Progress Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4 py-8">
                <Camera className="h-16 w-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-medium">No progress photos yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload photos to track visual progress
                  </p>
                </div>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Photos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressTracker;
