
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { usePermissions } from "@/hooks/auth/use-permissions";
import { useAuth } from "@/hooks/auth/use-auth";
import MeasurementHistory from "@/components/fitness/MeasurementHistory";
import ProgressCharts from "@/components/fitness/ProgressCharts";
import BodyMeasurementForm from "@/components/fitness/BodyMeasurementForm";
import { BodyMeasurement, PROGRESS_TIMEFRAMES } from "@/types/members/measurements";
import { measurementService } from "@/services/members/measurementService";
// No need for PERMISSIONS import, using direct string literal

const BodyMeasurementPage = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const { can } = usePermissions();
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState(PROGRESS_TIMEFRAMES[1].value); // Default to 30 days

  useEffect(() => {
    const fetchMeasurements = async () => {
      if (!memberId) return;
      
      setIsLoading(true);
      try {
        const data = await measurementService.getMeasurementHistory(memberId);
        setMeasurements(data);
      } catch (error) {
        console.error("Error fetching measurements:", error);
        toast({
          title: "Error",
          description: "Failed to load measurement history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMeasurements();
  }, [memberId, toast]);

  const canEditMeasurements = () => {
    if (!user || !memberId) return false;
    
    // Admin and staff can always edit
    const canEdit = can('edit:members');
    if (canEdit) return true;
    
    // Trainers can edit if they're assigned to this member
    if (user.role === "trainer" && memberAssignedToTrainer()) return true;
    
    // Members can edit their own measurements if they don't have an active PT plan
    if (user.role === "member" && user.id === memberId && !hasActivePTPlan()) return true;
    
    return false;
  };
  
  // These would be implemented with actual data in a real app
  const memberAssignedToTrainer = () => {
    // Check if the current trainer is assigned to this member
    return true; // Placeholder
  };
  
  const hasActivePTPlan = () => {
    // Check if member has an active PT plan
    return false; // Placeholder
  };

  const handleSaveMeasurement = async (measurement: Partial<BodyMeasurement>) => {
    if (!memberId) return;
    
    try {
      const savedMeasurement = await measurementService.saveMeasurement({
        ...measurement,
        memberId,
        date: new Date().toISOString(),
        addedBy: {
          id: user?.id || "",
          role: user?.role || "member",
          name: user?.name || "",
        },
      });
      
      if (savedMeasurement) {
        setMeasurements(prev => [savedMeasurement, ...prev]);
        toast({
          title: "Success",
          description: "Measurement saved successfully",
        });
      }
    } catch (error) {
      console.error("Error saving measurement:", error);
      toast({
        title: "Error",
        description: "Failed to save measurement",
        variant: "destructive",
      });
    }
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Body Measurements & Progress</h1>
        
        <Tabs defaultValue="charts">
          <TabsList className="mb-6">
            <TabsTrigger value="charts">Progress Charts</TabsTrigger>
            <TabsTrigger value="history">Measurement History</TabsTrigger>
            {canEditMeasurements() && (
              <TabsTrigger value="add">Add Measurement</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="charts">
            <ProgressCharts 
              measurements={measurements}
              timeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="history">
            <MeasurementHistory 
              measurements={measurements}
              isLoading={isLoading}
            />
          </TabsContent>
          
          {canEditMeasurements() && (
            <TabsContent value="add">
              <BodyMeasurementForm
                memberId={memberId}
                currentUser={user!}
                onSave={handleSaveMeasurement}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Container>
  );
};

export default BodyMeasurementPage;
