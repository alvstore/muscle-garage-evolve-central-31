
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, UserCog, ClipboardList } from 'lucide-react';
import { Button } from "@/components/ui/button";
import MemberProfileForm from "@/components/members/MemberProfileForm";
import MemberProfile from "@/components/members/MemberProfile";
import { Member } from '@/types/members/member';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useBranch } from '@/hooks/settings/use-branches';
import { useAuth } from '@/hooks/auth/use-auth';

const MemberProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchMemberData = async () => {
      setIsLoading(true);
      try {
        let memberId = id;
        
        // If no ID is provided, try to load the current user's profile
        if (!memberId && user) {
          // First, check if the user has a member profile
          const { data: memberData, error: memberError } = await supabase
            .from('members')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (!memberError && memberData) {
            setMember(memberData as Member);
            setIsLoading(false);
            return;
          }
          
          // If no member profile, get user profile directly
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (!userError && userData) {
            // Map user profile to member format
            const profileAsMember: Member = {
              id: userData.id,
              name: userData.full_name || '',
              email: userData.email || '',
              phone: userData.phone || '',
              address: userData.address || '',
              city: userData.city || '',
              state: userData.state || '',
              country: userData.country || '',
              gender: userData.gender || '',
              date_of_birth: userData.date_of_birth || '',
              profile_picture: userData.avatar_url || '',
              branch_id: userData.branch_id,
              status: 'active'
            };
            setMember(profileAsMember);
            setIsLoading(false);
            return;
          }
        } else if (memberId) {
          // Fetch member data by ID
          const { data, error } = await supabase
            .from('members')
            .select(`
              *,
              trainers:trainer_id (name, avatar_url),
              memberships:membership_id (name)
            `)
            .eq('id', memberId)
            .single();
            
          if (error) {
            console.error('Error fetching member:', error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to load member data",
            });
            setIsLoading(false);
            return;
          }
          
          if (data) {
            // Add additional fields needed for display
            const enrichedMember = {
              ...data,
              membership_name: data.memberships?.name || null,
              trainer_name: data.trainers?.name || null,
              trainer_avatar: data.trainers?.avatar_url || null
            };
            
            setMember(enrichedMember);
          }
        }
      } catch (error) {
        console.error('Error fetching member data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load member data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberData();
  }, [id, user, toast]);

  const handleUpdateMember = async (updatedMember: Member) => {
    setIsSaving(true);
    try {
      let table = 'members';
      let targetId = updatedMember.id;
      
      // If no member ID but we have a user, we're updating a profile
      if (!id && user && updatedMember.id === user.id) {
        table = 'profiles';
        targetId = user.id;
        
        // Map member fields to profile fields
        const profileData = {
          full_name: updatedMember.name,
          email: updatedMember.email,
          phone: updatedMember.phone,
          address: updatedMember.address,
          city: updatedMember.city,
          state: updatedMember.state,
          country: updatedMember.country,
          gender: updatedMember.gender,
          date_of_birth: updatedMember.date_of_birth,
          avatar_url: updatedMember.profile_picture || updatedMember.avatar
        };
        
        const { error } = await supabase
          .from(table)
          .update(profileData)
          .eq('id', targetId);
          
        if (error) throw error;
      } else {
        // We're updating a member
        // Ensure branch_id is set
        if (!updatedMember.branch_id && currentBranch) {
          updatedMember.branch_id = currentBranch.id;
        }
        
        const { error } = await supabase
          .from(table)
          .update({
            name: updatedMember.name,
            email: updatedMember.email,
            phone: updatedMember.phone,
            address: updatedMember.address,
            city: updatedMember.city, 
            state: updatedMember.state,
            zip_code: updatedMember.zip_code || updatedMember.zipCode,
            country: updatedMember.country,
            gender: updatedMember.gender,
            date_of_birth: updatedMember.date_of_birth,
            profile_picture: updatedMember.profile_picture || updatedMember.avatar,
            goal: updatedMember.goal,
            occupation: updatedMember.occupation,
            blood_group: updatedMember.blood_group,
            id_type: updatedMember.id_type,
            id_number: updatedMember.id_number,
            status: updatedMember.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', targetId);
          
        if (error) throw error;
      }
      
      // Refresh member data
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', targetId)
        .single();
        
      if (error) throw error;
      
      setMember(data as Member);
      setActiveTab('profile'); // Switch back to profile view
      
    } catch (error) {
      console.error('Error updating member:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update member data",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-bold">
            {id ? `Member Profile: ${member?.name || 'Member'}` : 'My Profile'}
          </h1>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-1">
            <UserCog size={16} />
            Profile
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex items-center gap-1">
            <ClipboardList size={16} />
            Edit Details
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-4">
          <MemberProfile member={member} onEdit={() => setActiveTab('edit')} />
        </TabsContent>
        
        <TabsContent value="edit" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <MemberProfileForm 
                member={member}
                onSubmit={handleUpdateMember}
                disabled={isSaving}
                isLoading={isSaving}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberProfilePage;
