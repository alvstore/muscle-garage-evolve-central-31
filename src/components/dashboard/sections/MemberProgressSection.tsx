import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileBarChart, Users, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from '@/hooks/use-branch';
import { Skeleton } from '@/components/ui/skeleton';
import { Member } from '@/types';
import { useMemberProgress } from '@/hooks/use-member-progress';
import { useMemberMeasurements } from '@/hooks/use-member-measurements';

const MemberProgressSection = () => {
  const navigate = useNavigate();
  const { currentBranch } = useBranch();
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  
  const { progress, isLoading: progressLoading } = useMemberProgress(selectedMemberId);
  const { measurements, isLoading: measurementsLoading } = useMemberMeasurements(selectedMemberId);
  
  const isLoading = loadingMembers || progressLoading || measurementsLoading;
  
  const selectedMember = members.find(m => m.id === selectedMemberId);
  
  useEffect(() => {
    const fetchMembers = async () => {
      setLoadingMembers(true);
      try {
        let query = supabase
          .from('profiles')
          .select('id, full_name, email, role, branch_id')
          .eq('role', 'member');
          
        if (currentBranch?.id) {
          query = query.eq('branch_id', currentBranch.id);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          const formattedMembers = data.map(member => ({
            id: member.id,
            name: member.full_name || 'Unknown',
            email: member.email || '',
            role: 'member' as const,
            membershipStatus: 'active' as const,
            status: 'active' // Add the required status property
          }));
          
          setMembers(formattedMembers);
          
          // Auto-select first member if there are any
          if (formattedMembers.length > 0 && !selectedMemberId) {
            setSelectedMemberId(formattedMembers[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoadingMembers(false);
      }
    };
    
    fetchMembers();
  }, [currentBranch]);
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const latestMeasurement = measurements && measurements.length > 0 
    ? measurements[0] 
    : null;
  
  // Replace these hardcoded values:
  const weightLossPercentage = progress ? 75 : 0;
  const bodyFatReductionPercentage = progress ? 62 : 0;
  const bmiImprovementPercentage = progress ? 55 : 0;
  
  // With actual data from the progress object:
  const weightLossPercentage = progress?.weight_loss_percent || 0;
  const bodyFatReductionPercentage = progress?.body_fat_reduction_percent || 0;
  const bmiImprovementPercentage = progress?.bmi_improvement_percent || 0;
  
  const workoutCompletionPercentage = progress?.workout_completion_percent || 0;
  const classAttendancePercentage = 70;
  
  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <CardTitle>Member Progress</CardTitle>
          <CardDescription>
            Track and analyze fitness progress of your members
          </CardDescription>
        </div>
        <div className="flex gap-2 items-center">
          <Label htmlFor="member-select" className="sr-only">Select Member</Label>
          {loadingMembers ? (
            <Skeleton className="h-10 w-[180px]" />
          ) : (
            <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="sm" onClick={() => navigate('/fitness/progress')}>
            <FileBarChart className="h-4 w-4 mr-1" />
            Detailed View
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
          </div>
        ) : selectedMember ? (
          <>
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" alt={selectedMember.name} />
                <AvatarFallback>{getInitials(selectedMember.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{selectedMember.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {selectedMember.id}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Body Metrics</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Weight Loss</span>
                      <span>{weightLossPercentage}%</span>
                    </div>
                    <Progress value={weightLossPercentage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Body Fat Reduction</span>
                      <span>{bodyFatReductionPercentage}%</span>
                    </div>
                    <Progress value={bodyFatReductionPercentage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>BMI Improvement</span>
                      <span>{bmiImprovementPercentage}%</span>
                    </div>
                    <Progress value={bmiImprovementPercentage} className="h-2" />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Workout Adherence</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Workout Completion</span>
                      <span>{workoutCompletionPercentage}%</span>
                    </div>
                    <Progress value={workoutCompletionPercentage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Class Attendance</span>
                      <span>{classAttendancePercentage}%</span>
                    </div>
                    <Progress value={classAttendancePercentage} className="h-2" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Current Weight</p>
                  <p className="text-2xl font-bold">{latestMeasurement?.weight || progress?.weight || 'N/A'} kg</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Body Fat</p>
                  <p className="text-2xl font-bold">{latestMeasurement?.bodyFat || progress?.fat_percent || 'N/A'}%</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">BMI</p>
                  <p className="text-2xl font-bold">{latestMeasurement?.bmi || progress?.bmi || 'N/A'}</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Muscle Gain</p>
                  <p className="text-2xl font-bold">{progress?.muscle_mass || 'N/A'} kg</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-2">No Members Found</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any members assigned to you yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberProgressSection;
