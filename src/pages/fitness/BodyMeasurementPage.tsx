
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";
import BodyMeasurementForm from "@/components/fitness/BodyMeasurementForm";
import MeasurementHistory from "@/components/fitness/MeasurementHistory";
import ProgressCharts from "@/components/fitness/ProgressCharts";
import { BodyMeasurement, PTPlan } from "@/types/measurements";
import { Member } from "@/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";

const BodyMeasurementPage = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  
  const [member, setMember] = useState<Member | null>(null);
  const [ptPlan, setPtPlan] = useState<PTPlan | null>(null);
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<BodyMeasurement | null>(null);
  
  // Check if current user has permission to add measurements
  const isTrainer = user?.role === "trainer";
  const isAdminOrStaff = user?.role === "admin" || user?.role === "staff";
  const isMember = user?.role === "member";
  
  // Determine if current user can edit this member's measurements
  const canAddMeasurements = 
    isAdminOrStaff || 
    (isTrainer && ptPlan?.trainerId === user?.id) ||
    (isMember && (!ptPlan || !ptPlan.isActive) && user?.id === memberId);

  // Mock data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, these would be API calls
        // For now, we'll use mock data
        
        // Mock member data
        const mockMember: Member = {
          id: memberId || "member-1",
          name: "John Doe",
          email: "john.doe@example.com",
          role: "member",
          membershipStatus: "active",
          goal: "Build muscle and improve overall fitness",
          phone: "+1234567890"
        };
        
        // Mock PT plan data (simulate having an active PT plan with trainer)
        const mockPTPlan: PTPlan | null = {
          id: "ptplan-1",
          memberId: memberId || "member-1",
          trainerId: "trainer-1",
          startDate: "2025-03-01",
          endDate: "2025-06-01",
          isActive: true
        };
        
        // Mock measurement history
        const mockMeasurements: BodyMeasurement[] = [
          {
            id: "measurement-1",
            memberId: memberId || "member-1",
            date: "2025-03-01",
            height: 175,
            weight: 80,
            bmi: 26.1,
            chest: 95,
            waist: 86,
            hips: 92,
            biceps: 35,
            thighs: 55,
            bodyFat: 22,
            addedBy: {
              id: "trainer-1",
              role: "trainer",
              name: "Trainer Name"
            }
          },
          {
            id: "measurement-2",
            memberId: memberId || "member-1",
            date: "2025-03-15",
            height: 175,
            weight: 78.5,
            bmi: 25.6,
            chest: 94,
            waist: 84,
            hips: 91,
            biceps: 35.5,
            thighs: 55.5,
            bodyFat: 21,
            addedBy: {
              id: "trainer-1",
              role: "trainer",
              name: "Trainer Name"
            }
          },
          {
            id: "measurement-3",
            memberId: memberId || "member-1",
            date: "2025-04-01",
            height: 175,
            weight: 77,
            bmi: 25.1,
            chest: 93,
            waist: 82.5,
            hips: 90,
            biceps: 36,
            thighs: 56,
            bodyFat: 20,
            addedBy: {
              id: "trainer-1",
              role: "trainer",
              name: "Trainer Name"
            }
          },
          {
            id: "measurement-4",
            memberId: memberId || "member-1",
            date: "2025-04-15",
            height: 175,
            weight: 76,
            bmi: 24.8,
            chest: 92,
            waist: 81,
            hips: 89,
            biceps: 36.5,
            thighs: 56.5,
            bodyFat: 19,
            addedBy: {
              id: "trainer-1",
              role: "trainer",
              name: "Trainer Name"
            }
          }
        ];
        
        setMember(mockMember);
        setPtPlan(mockPTPlan);
        setMeasurements(mockMeasurements);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load member data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [memberId]);

  const handleAddMeasurement = (data: Partial<BodyMeasurement>) => {
    // In a real app, this would be an API call
    const newMeasurement: BodyMeasurement = {
      id: `measurement-${Date.now()}`,
      memberId: memberId || "",
      date: data.date || format(new Date(), "yyyy-MM-dd"),
      height: data.height,
      weight: data.weight,
      bmi: data.bmi,
      chest: data.chest,
      waist: data.waist,
      hips: data.hips,
      biceps: data.biceps,
      thighs: data.thighs,
      bodyFat: data.bodyFat,
      notes: data.notes,
      addedBy: data.addedBy || {
        id: user?.id || "",
        role: user?.role || "member",
        name: user?.name || ""
      }
    };
    
    setMeasurements([...measurements, newMeasurement]);
    setIsAddingMeasurement(false);
    toast.success("Measurement added successfully");
  };

  const handleEditMeasurement = (data: Partial<BodyMeasurement>) => {
    if (!selectedMeasurement) return;
    
    // In a real app, this would be an API call
    const updatedMeasurements = measurements.map(m => 
      m.id === selectedMeasurement.id ? { ...m, ...data } : m
    );
    
    setMeasurements(updatedMeasurements);
    setSelectedMeasurement(null);
    toast.success("Measurement updated successfully");
  };

  const handleDeleteMeasurement = (id: string) => {
    // In a real app, this would be an API call
    const updatedMeasurements = measurements.filter(m => m.id !== id);
    setMeasurements(updatedMeasurements);
    toast.success("Measurement deleted successfully");
  };

  if (isLoading) {
    return (
      <Container>
        <div className="py-6 space-y-4">
          <div className="h-6 w-64 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-64 w-full bg-gray-200 animate-pulse rounded"></div>
        </div>
      </Container>
    );
  }

  if (!member) {
    return (
      <Container>
        <div className="py-6">
          <Card>
            <CardContent className="py-10">
              <div className="text-center text-muted-foreground">
                Member not found or you don't have permission to view this page.
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Body Measurements</h1>
            <p className="text-muted-foreground">
              Track and manage body measurements for {member.name}
            </p>
          </div>
          
          {canAddMeasurements && (
            <Button onClick={() => setIsAddingMeasurement(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Measurement
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="charts">
          <TabsList className="mb-6">
            <TabsTrigger value="charts">Progress Charts</TabsTrigger>
            <TabsTrigger value="history">Measurement History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="charts">
            <ProgressCharts measurements={measurements} />
          </TabsContent>
          
          <TabsContent value="history">
            <MeasurementHistory 
              measurements={measurements}
              onEdit={canAddMeasurements ? setSelectedMeasurement : undefined}
              onDelete={canAddMeasurements ? handleDeleteMeasurement : undefined}
              canEdit={canAddMeasurements}
            />
          </TabsContent>
        </Tabs>
        
        {/* Add Measurement Dialog */}
        <Dialog open={isAddingMeasurement} onOpenChange={setIsAddingMeasurement}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogTitle>Add New Measurement</DialogTitle>
            <BodyMeasurementForm
              memberId={memberId}
              currentUser={user!}
              onSave={handleAddMeasurement}
              onCancel={() => setIsAddingMeasurement(false)}
            />
          </DialogContent>
        </Dialog>
        
        {/* Edit Measurement Dialog */}
        <Dialog 
          open={!!selectedMeasurement} 
          onOpenChange={(open) => !open && setSelectedMeasurement(null)}
        >
          <DialogContent className="sm:max-w-[800px]">
            <DialogTitle>Edit Measurement</DialogTitle>
            {selectedMeasurement && (
              <BodyMeasurementForm
                initialData={selectedMeasurement}
                currentUser={user!}
                onSave={handleEditMeasurement}
                onCancel={() => setSelectedMeasurement(null)}
                isEditMode
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
};

export default BodyMeasurementPage;
