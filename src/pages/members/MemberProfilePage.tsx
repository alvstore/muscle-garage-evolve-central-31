
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
        dateOfBirth: "1990-05-15",
        goal: "Build muscle and improve overall fitness",
        trainerId: "trainer-123",
        membershipId: "platinum-12m",
        membershipStatus: "active",
        membershipStartDate: "2023-01-15",
        membershipEndDate: "2024-01-15",
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
