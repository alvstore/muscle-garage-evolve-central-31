
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgressTracker from './ProgressTracker';
import MeasurementHistory from './MeasurementHistory';
import BodyMeasurementForm from './BodyMeasurementForm';
import { BodyMeasurement } from '@/types/measurements';
import { measurementService } from '@/services/measurementService';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

interface MemberBodyMeasurementsProps {
  memberId: string;
  canAddMeasurements?: boolean;
}

const MemberBodyMeasurements = ({ memberId, canAddMeasurements = true }: MemberBodyMeasurementsProps) => {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tracker');

  useEffect(() => {
    const fetchMeasurements = async () => {
      if (!memberId) return;
      
      setIsLoading(true);
      try {
        const result = await measurementService.getMeasurementHistory(memberId);
        setMeasurements(result);
      } catch (error) {
        console.error('Error fetching measurements:', error);
        toast.error('Failed to load measurement data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMeasurements();
  }, [memberId]);

  const handleSaveMeasurement = async (measurement: Partial<BodyMeasurement>) => {
    if (!memberId) return;
    
    try {
      const savedMeasurement = await measurementService.saveMeasurement({
        ...measurement,
        memberId
      });
      
      setMeasurements(prev => [savedMeasurement, ...prev]);
      toast.success('Measurement saved successfully');
      
      // Switch to the tracker tab after saving
      setActiveTab('tracker');
    } catch (error) {
      console.error('Error saving measurement:', error);
      toast.error('Failed to save measurement');
      throw error;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Body Measurements</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="tracker">Progress Tracker</TabsTrigger>
            <TabsTrigger value="history">Measurement History</TabsTrigger>
            {canAddMeasurements && (
              <TabsTrigger value="add">Add Measurement</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="tracker">
            <ProgressTracker measurements={measurements} />
          </TabsContent>
          
          <TabsContent value="history">
            <MeasurementHistory 
              measurements={measurements}
              isLoading={isLoading}
            />
          </TabsContent>
          
          {canAddMeasurements && (
            <TabsContent value="add">
              {user && (
                <BodyMeasurementForm
                  memberId={memberId}
                  currentUser={user}
                  onSave={handleSaveMeasurement}
                />
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MemberBodyMeasurements;
