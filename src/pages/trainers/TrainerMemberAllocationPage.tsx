import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, ArrowLeft, UserPlus, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useBranch } from '@/hooks/use-branch';

interface Trainer {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membership_plan?: string;
  avatar_url?: string;
  is_assigned: boolean;
}

const TrainerMemberAllocationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentBranch } = useBranch();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [assignedMembers, setAssignedMembers] = useState<Member[]>([]);
  const [unassignedMembers, setUnassignedMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('assigned');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch trainer and members data
  useEffect(() => {
    if (!id || !currentBranch?.id) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch trainer data
        const { data: trainerData, error: trainerError } = await supabase
          .from('profiles')
          .select('id, full_name, email, role, avatar_url')
          .eq('id', id)
          .eq('role', 'trainer')
          .single();
        
        if (trainerError) throw trainerError;
        
        if (!trainerData) {
          toast({
            title: 'Error',
            description: 'Trainer not found',
            variant: 'destructive',
          });
          navigate('/trainers');
          return;
        }
        
        setTrainer({
          id: trainerData.id,
          name: trainerData.full_name || '',
          email: trainerData.email || '',
          role: trainerData.role || 'trainer',
          avatar_url: trainerData.avatar_url || '',
        });
        
        // Fetch all members in the branch
        const { data: membersData, error: membersError } = await supabase
          .from('members')
          .select('id, full_name, email, phone, membership_plan, avatar_url')
          .eq('role', 'member')
          .eq('branch_id', currentBranch.id);
        
        if (membersError) throw membersError;
        
        // Fetch trainer-member assignments
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('trainer_assignments')
          .select('member_id')
          .eq('trainer_id', id);
        
        if (assignmentsError) throw assignmentsError;
        
        // Create a set of assigned member IDs for quick lookup
        const assignedMemberIds = new Set(assignmentsData.map(a => a.member_id));
        
        // Map and categorize members
        const allMembers = membersData.map(member => ({
          id: member.id,
          name: member.full_name || '',
          email: member.email || '',
          phone: member.phone || '',
          membership_plan: member.membership_plan || '',
          avatar_url: member.avatar_url || '',
          is_assigned: assignedMemberIds.has(member.id),
        }));
        
        setMembers(allMembers);
        setAssignedMembers(allMembers.filter(m => m.is_assigned));
        setUnassignedMembers(allMembers.filter(m => !m.is_assigned));
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, currentBranch, navigate, toast]);

  // Filter members based on search query
  const filteredAssignedMembers = assignedMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.phone && member.phone.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredUnassignedMembers = unassignedMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.phone && member.phone.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle member selection
  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // Handle assignment changes
  const handleSaveAssignments = async () => {
    if (!id || !currentBranch?.id) return;
    
    setIsSaving(true);
    
    try {
      // Get current assignments
      const { data: currentAssignments, error: fetchError } = await supabase
        .from('trainer_assignments')
        .select('member_id')
        .eq('trainer_id', id);
      
      if (fetchError) throw fetchError;
      
      const currentAssignedIds = new Set(currentAssignments.map(a => a.member_id));
      
      // Determine which members to add and which to remove
      const membersToAdd = activeTab === 'unassigned'
        ? selectedMembers
        : [];
      
      const membersToRemove = activeTab === 'assigned'
        ? selectedMembers
        : [];
      
      // Add new assignments
      if (membersToAdd.length > 0) {
        const newAssignments = membersToAdd
          .filter(memberId => !currentAssignedIds.has(memberId))
          .map(memberId => ({
            trainer_id: id,
            member_id: memberId,
            branch_id: currentBranch.id,
            created_at: new Date().toISOString(),
          }));
        
        if (newAssignments.length > 0) {
          const { error: insertError } = await supabase
            .from('trainer_assignments')
            .insert(newAssignments);
          
          if (insertError) throw insertError;
        }
      }
      
      // Remove assignments
      if (membersToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from('trainer_assignments')
          .delete()
          .eq('trainer_id', id)
          .in('member_id', membersToRemove);
        
        if (deleteError) throw deleteError;
      }
      
      // Refresh data
      const { data: refreshData, error: refreshError } = await supabase
        .from('trainer_assignments')
        .select('member_id')
        .eq('trainer_id', id);
      
      if (refreshError) throw refreshError;
      
      const refreshedAssignedIds = new Set(refreshData.map(a => a.member_id));
      
      // Update local state
      setMembers(prev => prev.map(member => ({
        ...member,
        is_assigned: refreshedAssignedIds.has(member.id),
      })));
      
      setAssignedMembers(members.filter(m => refreshedAssignedIds.has(m.id)));
      setUnassignedMembers(members.filter(m => !refreshedAssignedIds.has(m.id)));
      
      // Clear selection
      setSelectedMembers([]);
      
      toast({
        title: 'Success',
        description: activeTab === 'unassigned'
          ? 'Members assigned successfully'
          : 'Members unassigned successfully',
      });
      
    } catch (error) {
      console.error('Error saving assignments:', error);
      toast({
        title: 'Error',
        description: 'Failed to update assignments',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p>Loading trainer data...</p>
        </div>
      </Container>
    );
  }

  if (!trainer) {
    return (
      <Container>
        <div className="py-6">
          <h1 className="text-2xl font-bold mb-4">Trainer Not Found</h1>
          <p className="mb-4">The trainer you are looking for does not exist or you do not have permission to view it.</p>
          <Button onClick={() => navigate('/trainers')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trainers
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/trainers')}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Trainers
            </Button>
            <h1 className="text-2xl font-bold">Member Allocation</h1>
            <p className="text-muted-foreground">Manage members assigned to this trainer</p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Trainer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={trainer.avatar_url} alt={trainer.name} />
                <AvatarFallback className="bg-primary-500 text-white text-lg">
                  {getInitials(trainer.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{trainer.name}</h2>
                <p className="text-muted-foreground">{trainer.email}</p>
                <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
                  Trainer
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search members..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleSaveAssignments} 
            disabled={selectedMembers.length === 0 || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : activeTab === 'unassigned' ? (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Assign Selected ({selectedMembers.length})
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Unassign Selected ({selectedMembers.length})
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="assigned" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-4">
            <TabsTrigger value="assigned">
              Assigned Members ({assignedMembers.length})
            </TabsTrigger>
            <TabsTrigger value="unassigned">
              Unassigned Members ({unassignedMembers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assigned" className="space-y-4">
            {filteredAssignedMembers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No assigned members found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAssignedMembers.map(member => (
                  <Card key={member.id} className={`overflow-hidden ${selectedMembers.includes(member.id) ? 'border-primary-500 ring-1 ring-primary-500' : ''}`}>
                    <CardContent className="p-0">
                      <div className="p-4 flex items-start gap-3">
                        <Checkbox
                          id={`member-${member.id}`}
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={() => toggleMemberSelection(member.id)}
                          className="mt-1"
                        />
                        <div className="flex flex-1 items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar_url} alt={member.name} />
                            <AvatarFallback className="bg-primary-100 text-primary-800">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{member.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                            {member.membership_plan && (
                              <Badge variant="outline" className="mt-1">
                                {member.membership_plan}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="unassigned" className="space-y-4">
            {filteredUnassignedMembers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No unassigned members found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUnassignedMembers.map(member => (
                  <Card key={member.id} className={`overflow-hidden ${selectedMembers.includes(member.id) ? 'border-primary-500 ring-1 ring-primary-500' : ''}`}>
                    <CardContent className="p-0">
                      <div className="p-4 flex items-start gap-3">
                        <Checkbox
                          id={`member-${member.id}`}
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={() => toggleMemberSelection(member.id)}
                          className="mt-1"
                        />
                        <div className="flex flex-1 items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar_url} alt={member.name} />
                            <AvatarFallback className="bg-primary-100 text-primary-800">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{member.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                            {member.membership_plan && (
                              <Badge variant="outline" className="mt-1">
                                {member.membership_plan}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default TrainerMemberAllocationPage;
