
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@/components/ui/container";
import MemberProfile from "@/components/members/MemberProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { Member } from "@/types";
import { toast } from "sonner";

const MemberProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch member data
    setTimeout(() => {
      // Mock data - in a real app, you would fetch this from an API
      const mockMember: Member = {
        id: id || "1",
        email: "john.doe@example.com",
        name: "John Doe",
        role: "member",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, Anytown, USA",
        dateOfBirth: "1990-05-15",
        goal: "Build muscle and improve overall fitness",
        trainerId: "trainer-123",
        membershipId: "platinum-12m",
        membershipStatus: "active",
        membershipStartDate: "2023-01-15",
        membershipEndDate: "2024-01-15",
        // Body measurements
        height: 178,
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
            date: "2023-12-15",
            weight: 78,
            chest: 93,
            waist: 84,
            biceps: 34,
            thigh: 56,
            hips: 94,
            bodyFat: 16,
            notes: "Starting to see some progress in arms and chest.",
            updatedBy: "trainer-123",
            updatedByRole: "trainer"
          },
          {
            id: "measure-2",
            date: "2024-01-15",
            weight: 77,
            chest: 94,
            waist: 83,
            biceps: 35,
            thigh: 57,
            hips: 93,
            bodyFat: 15,
            notes: "Good progress this month. Diet adherence at 90%.",
            updatedBy: "trainer-123",
            updatedByRole: "trainer"
          },
          {
            id: "measure-3",
            date: "2024-02-15",
            weight: 76,
            chest: 94.5,
            waist: 82.5,
            biceps: 35.5,
            thigh: 57.5,
            hips: 92.5,
            bodyFat: 14.8,
            notes: "Continuing to make good progress.",
            updatedBy: "trainer-123",
            updatedByRole: "trainer"
          }
        ]
      };
      
      setMember(mockMember);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleUpdateMember = (updatedMember: Member) => {
    // Simulate API call to update member data
    setLoading(true);
    setTimeout(() => {
      setMember(updatedMember);
      setLoading(false);
      toast.success("Member profile updated successfully");
    }, 1000);
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Member Profile</h1>
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : member ? (
          <MemberProfile 
            member={member} 
            onUpdate={handleUpdateMember} 
          />
        ) : (
          <div className="p-4 border rounded bg-yellow-50 text-yellow-700">
            Member not found
          </div>
        )}
      </div>
    </Container>
  );
};

export default MemberProfilePage;
