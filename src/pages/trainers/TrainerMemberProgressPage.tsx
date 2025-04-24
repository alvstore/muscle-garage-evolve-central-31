
import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressChart } from "@/components/fitness/ProgressChart";
import { MemberProgressTable } from "@/components/fitness/MemberProgressTable";
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

// Define a more compatible Member type for the page
interface MemberData {
  id: string;
  full_name: string;
  name?: string; // To handle data from database
  gender?: string;
  email?: string;
  phone?: string;
  goal?: string;
  branch_id?: string;
  branchId?: string;
}

const TrainerMemberProgressPage = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<MemberData[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTrainerMembers = async () => {
      try {
        setLoading(true);
        if (!user) return;
        
        // First get assigned members for this trainer
        const { data: assignedMembers, error: assignmentError } = await supabase
          .from('trainer_assignments')
          .select('member_id')
          .eq('trainer_id', user.id)
          .eq('is_active', true);

        if (assignmentError) {
          throw assignmentError;
        }

        if (!assignedMembers || assignedMembers.length === 0) {
          setMembers([]);
          setFilteredMembers([]);
          setLoading(false);
          return;
        }

        // Get the member details
        const memberIds = assignedMembers.map(assignment => assignment.member_id);
        
        const { data: memberData, error: memberError } = await supabase
          .from('members')
          .select('id, name, gender, email, phone, goal, branch_id')
          .in('id', memberIds);

        if (memberError) {
          throw memberError;
        }

        // Convert to Member type and handle the case where memberData is null
        if (memberData) {
          const formattedMembers: MemberData[] = memberData.map(m => ({
            id: m.id,
            full_name: m.name || '', // Map name from db to full_name for compatibility
            name: m.name,
            gender: m.gender || '',
            email: m.email || '',
            phone: m.phone || '',
            goal: m.goal || '',
            branchId: m.branch_id
          }));

          setMembers(formattedMembers);
          setFilteredMembers(formattedMembers);
        } else {
          setMembers([]);
          setFilteredMembers([]);
        }
      } catch (error) {
        console.error('Failed to fetch trainer members:', error);
        toast.error('Failed to load assigned members');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerMembers();
  }, [user]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(member => 
        member.full_name.toLowerCase().includes(term) || 
        member.email?.toLowerCase().includes(term) || 
        member.phone?.includes(term)
      );
      setFilteredMembers(filtered);
    }
  };

  return (
    <Container>
      <div className="py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Member Progress Tracking</h1>
            <p className="text-muted-foreground">Track and manage the progress of your assigned members</p>
          </div>
          
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full md:w-64"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading members...</p>
          </div>
        ) : members.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p>No members assigned to you yet.</p>
              <p className="text-muted-foreground mt-2">When members are assigned, they will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Summary of Member Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ProgressChart />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Member Progress Details</CardTitle>
              </CardHeader>
              <CardContent>
                <MemberProgressTable members={filteredMembers} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Container>
  );
};

export default TrainerMemberProgressPage;
