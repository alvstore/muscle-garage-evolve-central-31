import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WorkoutDay } from "@/types/fitness"
import { useAuth } from '@/hooks/use-auth';
import { useBranch } from '@/hooks/use-branch';
import { supabase } from '@/integrations/supabase/client';
import { WorkoutPlanDB, MemberWorkout } from '@/types/fitness';
import { useToast } from '@/components/ui/use-toast';

interface WorkoutPlansManagerProps {
  forMemberId?: string;
}

const WorkoutPlansManager: React.FC<WorkoutPlansManagerProps> = ({ forMemberId }) => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlanDB[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isCommon, setIsCommon] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkoutPlans();
    fetchMembers();
  }, [currentBranch]);

  const fetchWorkoutPlans = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('workout_plans')
        .select('*')
        .eq('branch_id', currentBranch?.id);

      if (forMemberId) {
        query = query.eq('member_id', forMemberId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setWorkoutPlans(data || []);
    } catch (error: any) {
      console.error('Error fetching workout plans:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch workout plans',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('branch_id', currentBranch?.id);

      if (error) throw error;

      setMembers(data || []);
    } catch (error: any) {
      console.error('Error fetching members:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch members',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createWorkoutPlan = async (planData: { 
    createdBy: string; 
    name: string; 
    description: string; 
    isCommon: boolean; 
    days: WorkoutDay[]; 
  }) => {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .insert({
          created_by: planData.createdBy,
          name: planData.name,
          title: planData.name, // Add required field
          type: planData.isCommon ? 'common' : 'custom', // Add required field
          description: planData.description,
          exercises: [] // Add required field
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating workout plan:', error);
      toast.error('Failed to create workout plan');
      return null;
    }
  };

  const assignWorkoutPlanToMember = async (assignmentData: Omit<MemberWorkout, "id" | "assignedAt">) => {
    try {
      const { data, error } = await supabase
        .from('member_workout_assignments')
        .insert({
          member_id: assignmentData.memberId,
          workout_plan_id: assignmentData.workoutPlanId,
          plan_id: assignmentData.workoutPlanId, // Set planId from workoutPlanId
          is_custom: assignmentData.isCustom,
          assigned_by: assignmentData.assignedBy,
          type: 'assigned', // Add the required type field
          trainer_id: assignmentData.trainerId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error assigning workout plan:', error);
      toast.error('Failed to assign workout plan');
      return null;
    }
  };

  const handleCreatePlan = async () => {
    if (!name || !description) {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      if (!user) {
        toast.error('User not authenticated.');
        return;
      }

      const newPlan = await createWorkoutPlan({
        createdBy: user.id,
        name,
        description,
        isCommon,
        days: [],
      });

      if (newPlan) {
        toast.success('Workout plan created successfully!');
        fetchWorkoutPlans();
        setName('');
        setDescription('');
        setIsCommon(false);
      }
    } catch (error: any) {
      console.error('Error creating workout plan:', error);
      toast.error(error.message || 'Failed to create workout plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignPlan = async () => {
    if (!selectedMemberId || !selectedPlanId) {
      toast.error('Please select a member and a workout plan.');
      return;
    }

    setIsLoading(true);
    try {
      if (!user) {
        toast.error('User not authenticated.');
        return;
      }

      const assignmentData: Omit<MemberWorkout, "id" | "assignedAt"> = {
        memberId: selectedMemberId,
        workoutPlanId: selectedPlanId,
        isCustom: false,
        assignedBy: user.id,
        trainerId: user.id
      };

      const assignment = await assignWorkoutPlanToMember(assignmentData);

      if (assignment) {
        toast.success('Workout plan assigned successfully!');
        setSelectedMemberId(null);
        setSelectedPlanId(null);
      }
    } catch (error: any) {
      console.error('Error assigning workout plan:', error);
      toast.error(error.message || 'Failed to assign workout plan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Plans</CardTitle>
        <CardDescription>Manage workout plans for members.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="planName">Plan Name</Label>
            <Input
              id="planName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter plan name"
            />
          </div>
          <div>
            <Label htmlFor="planDescription">Description</Label>
            <Input
              id="planDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>
          <div>
            <Label htmlFor="isCommon">Common Plan</Label>
            <Input
              id="isCommon"
              type="checkbox"
              checked={isCommon}
              onChange={(e) => setIsCommon(e.target.checked)}
            />
          </div>
          <Button onClick={handleCreatePlan} disabled={isLoading}>
            Create Plan
          </Button>
        </div>

        <div className="mt-8">
          <Label htmlFor="memberSelect">Select Member</Label>
          <Select onValueChange={(value) => setSelectedMemberId(value)}>
            <SelectTrigger>
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
        </div>

        <div className="mt-4">
          <Label htmlFor="planSelect">Select Workout Plan</Label>
          <Select onValueChange={(value) => setSelectedPlanId(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a workout plan" />
            </SelectTrigger>
            <SelectContent>
              {workoutPlans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleAssignPlan} disabled={isLoading} className="mt-4">
          Assign Plan to Member
        </Button>

        <div className="mt-8">
          <CardTitle>Existing Workout Plans</CardTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workoutPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>{plan.description}</TableCell>
                  <TableCell>{plan.created_by}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutPlansManager;
