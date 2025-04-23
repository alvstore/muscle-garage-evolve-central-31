
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@/components/ui/container";
import MemberProfile from "@/components/members/MemberProfile";
import MemberTransactionHistory from "@/components/members/MemberTransactionHistory";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/services/supabaseClient";
import { Member as MemberType } from "@/types/member";
import { Member } from "@/types/index";

// Using type assertion to create a compatible interface
type MemberWithStatus = MemberType & {
  status: string; // Required by src/types/member.ts
  goal?: string; // Adding goal property that appears in both interfaces
};

const MemberProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<MemberWithStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const fetchMember = async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        setMember(null);
        setLoading(false);
        toast.error(error.message || "Unable to fetch member profile");
      } else if (data) {
        // Convert Supabase data to Member type with status
        const memberData: MemberWithStatus = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: "member", // Setting fixed role as 'member'
          phone: data.phone,
          dateOfBirth: data.date_of_birth || undefined,
          gender: data.gender as "Male" | "Female" | "Other" | undefined,
          bloodGroup: data.blood_group || undefined,
          occupation: data.occupation || undefined,
          goal: data.goal || undefined,
          trainerId: data.trainer_id || undefined,
          membershipId: data.membership_id || undefined,
          membershipStatus: data.membership_status as "active" | "expired" | "none" | "inactive" || "none",
          membershipStartDate: data.membership_start_date || undefined,
          membershipEndDate: data.membership_end_date || undefined,
          status: data.status || "active", // Adding required status field
          branch_id: data.branch_id,
        };
        
        setMember(memberData);
        setLoading(false);
      } else {
        setMember(null);
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleUpdateMember = async (updatedMember: MemberWithStatus) => {
    setLoading(true);
    
    try {
      // Update the member in Supabase
      const { error } = await supabase
        .from("members")
        .update({
          name: updatedMember.name,
          email: updatedMember.email,
          phone: updatedMember.phone,
          gender: updatedMember.gender,
          blood_group: updatedMember.bloodGroup,
          occupation: updatedMember.occupation,
          date_of_birth: updatedMember.dateOfBirth,
          goal: updatedMember.goal,
          membership_id: updatedMember.membershipId,
          membership_status: updatedMember.membershipStatus,
          membership_start_date: updatedMember.membershipStartDate,
          membership_end_date: updatedMember.membershipEndDate,
          status: updatedMember.status,
        })
        .eq("id", updatedMember.id);

      if (error) throw error;
      
      // Update local state
      setMember(updatedMember);
      setLoading(false);
      toast.success("Member profile updated successfully");
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "Could not update member profile");
    }
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
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <MemberProfile 
                member={member as unknown as Member} 
                onUpdate={(updatedMember) => handleUpdateMember(updatedMember as unknown as MemberWithStatus)} 
              />
            </TabsContent>
            <TabsContent value="transactions">
              <MemberTransactionHistory />
            </TabsContent>
          </Tabs>
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
