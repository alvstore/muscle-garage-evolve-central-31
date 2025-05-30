
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { WorkoutPlan } from '@/types/fitness/workout';
import { DietPlan } from '@/types/fitness/diet';
import { Member } from '@/types/members/member';
import workoutPlansService from '../../services/workoutPlansService';
import dietPlansService from '../../services/dietPlansService';
import { memberService } from '@/services/members/memberService';
import { supabase } from '@/integrations/supabase/client';

interface FitnessPlanManagerProps {
  memberId: string;
}

const FitnessPlanManager: React.FC<FitnessPlanManagerProps> = ({ memberId }) => {
  const [member, setMember] = useState<Member | null>(null);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [selectedWorkoutPlanId, setSelectedWorkoutPlanId] = useState<string | null>(null);
  const [selectedDietPlanId, setSelectedDietPlanId] = useState<string | null>(null);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (memberId) {
      const fetchMember = async () => {
        try {
          const memberData = await memberService.getMemberById(memberId);
          if (memberData) {
            setMember(memberData);
            // Use trainer_id or trainerId (backward compatibility)
            if (memberData.trainer_id) {
              setSelectedTrainerId(memberData.trainer_id);
            }
          }
        } catch (error) {
          console.error('Error fetching member details:', error);
        }
      };
      
      fetchMember();
    }
  }, [memberId]);

  useEffect(() => {
    const loadPlans = async () => {
      setIsLoading(true);
      try {
        const workoutPlansData = await workoutPlansService.getWorkoutPlans();
        setWorkoutPlans(workoutPlansData);

        const dietPlansData = await dietPlansService.getDietPlans();
        setDietPlans(dietPlansData);
      } catch (error) {
        console.error('Error loading plans:', error);
        toast.error('Failed to load fitness plans');
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!member) {
        toast.error('Member data not loaded');
        return;
      }

      const updates: Partial<Member> = {};

      if (selectedTrainerId !== member.trainer_id) {
        updates.trainer_id = selectedTrainerId;
      }

      if (updates.trainer_id) {
        // Update the member's profile using Supabase directly since the method doesn't exist in the service
        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', memberId);
          
        if (error) throw error;
        toast.success('Fitness plans updated successfully');
      } else {
        toast.message('No changes to save');
      }
    } catch (error) {
      console.error('Error saving fitness plans:', error);
      toast.error('Failed to update fitness plans');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fitness Plan Manager</CardTitle>
        <CardDescription>Assign workout and diet plans to members</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="member-name">Member Name</Label>
              <Input id="member-name" value={member?.name || ''} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workout-plan">Workout Plan</Label>
              <Select
                value={selectedWorkoutPlanId || ''}
                onValueChange={(value) => setSelectedWorkoutPlanId(value)}
              >
                <SelectTrigger id="workout-plan">
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

            <div className="space-y-2">
              <Label htmlFor="diet-plan">Diet Plan</Label>
              <Select
                value={selectedDietPlanId || ''}
                onValueChange={(value) => setSelectedDietPlanId(value)}
              >
                <SelectTrigger id="diet-plan">
                  <SelectValue placeholder="Select a diet plan" />
                </SelectTrigger>
                <SelectContent>
                  {dietPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FitnessPlanManager;
