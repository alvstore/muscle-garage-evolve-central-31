
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@/components/ui/container";
import MemberProfile from "@/components/members/MemberProfile";
import MemberTransactionHistory from "@/components/members/MemberTransactionHistory";
import { Skeleton } from "@/components/ui/skeleton";
import { Member } from "@/types/member";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/services/supabaseClient";

const MemberProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
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
        // Convert Supabase data to Member type as much as possible
        setMember({
          id: data.id,
          name: data.name,
          email: data.email,
          role: "member",
          phone: data.phone,
          dateOfBirth: data.date_of_birth || undefined,
          gender: data.gender || undefined,
          bloodGroup: data.blood_group || undefined,
          occupation: data.occupation || undefined,
          goal: data.goal || undefined,
          trainerId: data.trainer_id || undefined,
          membershipId: data.membership_id || undefined,
          membershipStatus: data.membership_status || "none",
          membershipStartDate: data.membership_start_date || undefined,
          membershipEndDate: data.membership_end_date || undefined,
          status: data.status || "active",
          branch_id: data.branch_id,
        });
        setLoading(false);
      } else {
        setMember(null);
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleUpdateMember = async (updatedMember: Member) => {
    setLoading(true);
    // Save update to supabase (not implemented here, just UI update)
    setMember(updatedMember);
    setLoading(false);
    toast.success("Member profile updated successfully");
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
                member={member} 
                onUpdate={handleUpdateMember} 
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
