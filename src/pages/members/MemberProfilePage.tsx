
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MemberProfile } from "@/components/members/MemberProfile";
import { FitnessPlanManager } from "@/components/fitness";
import { mockMembers } from "@/data/mockData";
import { Member, User } from "@/types";
import { toast } from "sonner";

const MemberProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current user
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    // Simulate API call to fetch member data
    setTimeout(() => {
      const foundMember = mockMembers.find(m => m.id === id);
      if (foundMember) {
        setMember(foundMember as Member);
      } else {
        toast.error("Member not found");
      }
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleUpdateMember = (updatedMember: Member) => {
    // In a real app, this would make an API call
    setMember(updatedMember);
    toast.success("Member profile updated successfully");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-accent mx-auto animate-spin"></div>
          <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="container py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-2">Member Not Found</h2>
          <p className="text-muted-foreground">The member you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Member Profile</h1>
      
      <MemberProfile member={member} onUpdate={handleUpdateMember} />
      
      {currentUser?.role === "trainer" && (
        <div className="mt-8">
          <FitnessPlanManager members={[member]} trainerId={currentUser.id} />
        </div>
      )}
    </div>
  );
};

export default MemberProfilePage;
