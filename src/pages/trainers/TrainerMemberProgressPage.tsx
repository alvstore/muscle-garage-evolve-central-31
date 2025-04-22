
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useMemberProgress, MemberProgress } from '@/hooks/use-member-progress';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { format } from 'date-fns';
import { Container } from "@/components/ui/container";
import { supabase } from "@/services/supabaseClient";
import { Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";

// Interface for member data
interface Member {
  id: string;
  name: string;
  trainerId: string;
  goal?: string;
}

const TrainerMemberProgressPage = () => {
  const { user } = useAuth();
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [trainerMembers, setTrainerMembers] = useState<Member[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  
  const { 
    progress, 
    isLoading, 
    error,
    updateProgress
  } = useMemberProgress(selectedMemberId);
  
  // Fetch members assigned to this trainer
  useEffect(() => {
    const fetchAssignedMembers = async () => {
      if (!user) return;
      
      try {
        // In a real implementation, this would fetch from the trainer_assignments table
        // For now, we'll use mock data but structure it as if it came from Supabase
        const { data, error } = await supabase
          .from('trainer_assignments')
          .select(`
            id,
            member_id,
            profiles:member_id (id, full_name, gender)
          `)
          .eq('trainer_id', user.id)
          .eq('is_active', true);
        
        if (error) throw error;
        
        // Transform the data to match our Member interface
        const members: Member[] = data?.map(assignment => ({
          id: assignment.profiles.id,
          name: assignment.profiles.full_name,
          trainerId: user.id,
          goal: assignment.profiles.gender === 'male' ? 'Muscle Gain' : 'Weight Loss' // Simplified example
        })) || [];
        
        setTrainerMembers(members);
        
        // If there are members and none is selected, select the first one
        if (members.length > 0 && !selectedMemberId) {
          setSelectedMemberId(members[0].id);
        }
      } catch (err) {
        console.error("Error fetching assigned members:", err);
        // Fallback to mock data if there's an error
        const mockMembers: Member[] = [
          { id: 'member1', name: 'John Doe', trainerId: user.id, goal: 'Weight Loss' },
          { id: 'member2', name: 'Jane Smith', trainerId: user.id, goal: 'Muscle Gain' },
          { id: 'member3', name: 'Mike Johnson', trainerId: user.id, goal: 'General Fitness' }
        ];
        setTrainerMembers(mockMembers);
        if (!selectedMemberId && mockMembers.length > 0) {
          setSelectedMemberId(mockMembers[0].id);
        }
      } finally {
        setIsLoadingMembers(false);
      }
    };
    
    fetchAssignedMembers();
  }, [user, selectedMemberId]);
  
  // Function to create a new progress entry
  const createProgressEntry = async () => {
    if (!selectedMemberId || !user) return;
    
    try {
      // Default progress data
      const newProgress: Partial<MemberProgress> = {
        member_id: selectedMemberId,
        trainer_id: user.id,
        weight: 75,
        bmi: 24.5,
        fat_percent: 18,
        muscle_mass: 30,
        workout_completion_percent: 80,
        diet_adherence_percent: 75
      };
      
      const { data, error } = await supabase
        .from('member_progress')
        .insert(newProgress)
        .select();
      
      if (error) throw error;
      
      toast.success('Progress entry created successfully');
    } catch (err) {
      console.error("Error creating progress entry:", err);
      toast.error('Failed to create progress entry');
    }
  };
  
  // Render loading state for members
  if (isLoadingMembers) {
    return (
      <Container>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Member Progress</h1>
            <p className="text-muted-foreground">
              Track fitness metrics for your assigned members
            </p>
          </div>
          {selectedMemberId && !progress && (
            <Button onClick={createProgressEntry}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Progress Entry
            </Button>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Select a member to view their detailed progress
                </CardDescription>
              </div>
              <Select 
                value={selectedMemberId} 
                onValueChange={setSelectedMemberId}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select Member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {trainerMembers.map(member => (
                      <SelectItem 
                        key={member.id} 
                        value={member.id}
                      >
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            
            {error && (
              <div className="text-center py-12 text-red-500">
                Error loading progress data: {error}
              </div>
            )}
            
            {selectedMemberId && progress ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Fitness Goals & Body Metrics
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Weight</span>
                          <span>{progress.weight} kg</span>
                        </div>
                        <Progress value={progress.weight / 100 * 100} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>BMI</span>
                          <span>{progress.bmi}</span>
                        </div>
                        <Progress value={progress.bmi / 40 * 100} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Body Fat %</span>
                          <span>{progress.fat_percent}%</span>
                        </div>
                        <Progress value={progress.fat_percent} />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Workout & Diet Progress
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Workout Completion</span>
                          <span>{progress.workout_completion_percent}%</span>
                        </div>
                        <Progress value={progress.workout_completion_percent} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Diet Adherence</span>
                          <span>{progress.diet_adherence_percent}%</span>
                        </div>
                        <Progress value={progress.diet_adherence_percent} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Last Updated: {format(new Date(progress.last_updated), 'PPpp')}
                </div>
              </div>
            ) : (
              !isLoading && (
                <div className="text-center py-12 text-muted-foreground">
                  {selectedMemberId ? 'No progress data available for this member' : 'Select a member to view their progress'}
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default TrainerMemberProgressPage;
