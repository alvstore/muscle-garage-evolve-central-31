
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Container } from '@/components/ui/container';
import ProgressTracker from '@/components/fitness/ProgressTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/use-auth';
import { Member } from '@/types';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from '@/hooks/use-branch';

const FitnessProgressPage = () => {
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  // Fetch all members
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        // If current user has a branch, filter by that branch
        let query = supabase
          .from('profiles')
          .select('id, full_name, email, role, branch_id')
          .eq('role', 'member');

        if (currentBranch?.id) {
          query = query.eq('branch_id', currentBranch.id);
        }

        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const formattedMembers: Member[] = data.map(member => ({
            id: member.id,
            name: member.full_name || 'Unknown',
            email: member.email || '',
            role: 'member',
            membershipStatus: 'active', // Default value as we don't have this info yet
          }));
          
          setMembers(formattedMembers);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        toast.error('Failed to load members');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembers();
  }, [currentBranch]);
  
  const handleMemberChange = (value: string) => {
    setSelectedMemberId(value);
    const member = members.find(m => m.id === value) || null;
    setSelectedMember(member);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fitness Progress</h1>
      </div>
      
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Member Selection</CardTitle>
          <CardDescription>Select a member to view their fitness progress</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={selectedMemberId} onValueChange={handleMemberChange}>
              <SelectTrigger className="w-full md:w-80">
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>
      
      {selectedMember ? (
        <Tabs defaultValue="tracker">
          <TabsList className="grid w-full md:w-auto grid-cols-2 h-auto">
            <TabsTrigger value="tracker">Progress Tracker</TabsTrigger>
            <TabsTrigger value="charts">Progress Charts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracker" className="mt-6">
            <ProgressTracker member={selectedMember} />
          </TabsContent>
          
          <TabsContent value="charts" className="mt-6">
            {selectedMember && (
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Body Metrics</CardTitle>
                    <CardDescription>Track body metrics over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Progress charts will be rendered by the ProgressTracker component */}
                    <p className="text-muted-foreground">Select metrics in the tracker to view detailed charts</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Key Measurements</CardTitle>
                    <CardDescription>View progress milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Data will be displayed when measurements are available</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="bg-muted/40">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-muted-foreground mb-2">Please select a member to view their progress</p>
            <p className="text-sm text-muted-foreground">Member fitness data will be displayed here after selection</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FitnessProgressPage;
