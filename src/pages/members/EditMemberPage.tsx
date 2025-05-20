
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth/use-auth';
import { useBranch } from '@/hooks/settings/use-branches';
import { Member } from '@/types/members/member';

// Import UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import MemberProfileForm from '@/components/members/MemberProfileForm';

const EditMemberPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          setMember(data as Member);
        }
      } catch (error) {
        console.error('Error fetching member:', error);
        toast.error('Failed to load member data');
        navigate('/members');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMember();
  }, [id, navigate]);

  const handleUpdateMember = async (updatedMember: Member) => {
    if (!id) return;
    
    try {
      setIsSaving(true);
      
      const updates = {
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
        goal: updatedMember.goal,
        occupation: updatedMember.occupation,
        blood_group: updatedMember.blood_group,
        id_type: updatedMember.id_type,
        id_number: updatedMember.id_number,
        profile_picture: updatedMember.profile_picture || updatedMember.avatar,
        status: updatedMember.status,
        updated_at: new Date().toISOString(),
        updated_by: user?.id,
        branch_id: currentBranch?.id || updatedMember.branch_id,
      };

      const { error } = await supabase
        .from('members')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Member updated successfully');
      navigate(`/members/${id}`);
    } catch (error: any) {
      console.error('Error updating member:', error);
      toast.error('Failed to update member: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Member not found</h2>
              <p className="mt-2 text-muted-foreground">
                The member you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button 
                onClick={() => navigate('/members')} 
                className="mt-4"
              >
                Back to Members List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Member</h1>
        <div className="w-24"></div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Member Profile</CardTitle>
          <CardDescription>
            Update the member's personal information
          </CardDescription>
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
    </div>
  );
};

export default EditMemberPage;
