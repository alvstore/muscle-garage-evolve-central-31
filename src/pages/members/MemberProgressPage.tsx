
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { Member } from "@/types";
import ProgressTracker from "@/components/members/ProgressTracker";
import { MemberMeasurement } from "@/types/user";
import { toast } from "sonner";

const MemberProgressPage = () => {
  const { user } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch member data
    setTimeout(() => {
      // Mock data - in a real app, you would fetch this from an API
      const mockMember: Member = {
        id: user?.id || '1',
        email: user?.email || 'member@example.com',
        name: user?.name || 'Current Member',
        role: 'member',
        membershipStatus: 'active',
        // Body measurements
        height: 175,
        weight: 75,
        chest: 95,
        waist: 82,
        biceps: 36,
        thigh: 58,
        hips: 92,
        bodyFat: 14.5,
        // Progress tracking
        measurements: [
          {
            id: "measure-1",
            date: "2024-01-15",
            weight: 78,
            chest: 93,
            waist: 84,
            biceps: 34,
            thigh: 56,
            hips: 94,
            bodyFat: 16,
            notes: "Starting my fitness journey",
            updatedBy: "self",
            updatedByRole: "member"
          },
          {
            id: "measure-2",
            date: "2024-02-15",
            weight: 76,
            chest: 94,
            waist: 83,
            biceps: 35,
            thigh: 57,
            hips: 93,
            bodyFat: 15,
            notes: "Seeing some progress with diet changes",
            updatedBy: "self",
            updatedByRole: "member"
          },
          {
            id: "measure-3",
            date: "2024-03-15",
            weight: 75,
            chest: 95,
            waist: 82,
            biceps: 36,
            thigh: 58,
            hips: 92,
            bodyFat: 14.5,
            notes: "Great progress this month!",
            updatedBy: "self",
            updatedByRole: "member"
          }
        ]
      };
      
      setMember(mockMember);
      setLoading(false);
    }, 1000);
  }, [user]);

  const handleUpdateProgress = (measurement: MemberMeasurement) => {
    // Simulate API call to update progress data
    setLoading(true);
    setTimeout(() => {
      if (member) {
        const updatedMember = { 
          ...member,
          measurements: [measurement, ...(member.measurements || [])]
        };
        setMember(updatedMember);
      }
      setLoading(false);
      toast.success("Progress updated successfully");
    }, 1000);
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">My Fitness Progress</h1>
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : member ? (
          <ProgressTracker 
            member={member} 
            onUpdateProgress={handleUpdateProgress} 
          />
        ) : (
          <div className="p-4 border rounded bg-yellow-50 text-yellow-700">
            Member data not found
          </div>
        )}
      </div>
    </Container>
  );
};

export default MemberProgressPage;
