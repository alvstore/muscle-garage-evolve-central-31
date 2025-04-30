
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const MemberEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [member, setMember] = useState<any>(null);

  useEffect(() => {
    const fetchMember = async () => {
      if (!id || !currentBranch?.id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .eq('id', id)
          .eq('branch_id', currentBranch.id)
          .single();
        
        if (error) throw error;
        
        setMember(data);
      } catch (error) {
        console.error('Error fetching member:', error);
        toast.error('Failed to load member details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMember();
  }, [id, currentBranch?.id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMember({
      ...member,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member || !currentBranch?.id) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('members')
        .update({
          name: member.name,
          email: member.email,
          phone: member.phone,
          goal: member.goal,
        })
        .eq('id', id)
        .eq('branch_id', currentBranch.id);
        
      if (error) throw error;
      
      toast.success('Member updated successfully');
      navigate(`/members/${id}`);
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Failed to update member');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading member details...</span>
        </div>
      </Container>
    );
  }
  
  if (!member) {
    return (
      <Container>
        <div className="py-6">
          <Card>
            <CardContent className="pt-6">
              <p>Member not found or you don't have permission to edit this member.</p>
              <Button className="mt-4" onClick={() => navigate('/members')}>
                Back to Members
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="py-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={member.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={member.email || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={member.phone || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goal">Goal</Label>
                <Input
                  id="goal"
                  name="goal"
                  value={member.goal || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="flex space-x-4 pt-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(`/members/${id}`)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default MemberEditPage;
