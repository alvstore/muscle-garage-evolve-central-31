
import { supabase } from '@/integrations/supabase/client';
import { WorkoutPlan, MemberWorkout, WorkoutDay, Exercise } from '@/types/class';
import { toast } from 'sonner';

type PlanType = 'public' | 'assigned' | 'private';

interface WorkoutPlanDB {
  id: string;
  type: PlanType;
  title: string;
  description: string;
  created_by: string;
  member_id?: string;
  trainer_id?: string;
  assigned_by?: string;
  created_at: string;
  updated_at: string;
  days: WorkoutDay[];
  exercises: Exercise[];
}

export const workoutService = {
  // Get active plan for a member based on priority
  async getActivePlan(memberId: string): Promise<WorkoutPlanDB | null> {
    try {
      // 1. Check for private plan from assigned trainer
      const { data: privatePlan } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('member_id', memberId)
        .eq('type', 'private')
        .single();

      if (privatePlan) return privatePlan;

      // 2. Check for assigned plan
      const { data: assignedPlan } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('member_id', memberId)
        .eq('type', 'assigned')
        .single();

      if (assignedPlan) return assignedPlan;

      // 3. Fall back to public plan
      const { data: publicPlan } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('type', 'public')
        .single();

      return publicPlan;
    } catch (error: any) {
      toast.error('Failed to fetch active workout plan');
      return null;
    }
  },

  // Get all workout plans based on role and filters
  async getWorkoutPlans(filters?: {
    type?: PlanType[];
    memberId?: string;
    trainerId?: string;
  }): Promise<WorkoutPlanDB[]> {
    try {
      let query = supabase.from('workout_plans').select('*');

      if (filters?.type?.length) {
        query = query.in('type', filters.type);
      }

      if (filters?.memberId) {
        query = query.eq('member_id', filters.memberId);
      }

      if (filters?.trainerId) {
        query = query.eq('trainer_id', filters.trainerId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast.error('Failed to fetch workout plans');
      return [];
    }
  },


  // Create a new workout plan
  async createWorkoutPlan(plan: Omit<WorkoutPlanDB, 'id' | 'created_at' | 'updated_at'>): Promise<WorkoutPlanDB | null> {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .insert([{
          ...plan,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      toast.success('Workout plan created successfully');
      return data;
    } catch (error: any) {
      toast.error('Failed to create workout plan');
      return null;
    }
  },


  // Update an existing workout plan
  async updateWorkoutPlan(id: string, plan: Partial<WorkoutPlanDB>): Promise<WorkoutPlanDB | null> {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .update({
          ...plan,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Workout plan updated successfully');
      return data;
    } catch (error: any) {
      toast.error('Failed to update workout plan');
      return null;
    }
  },


  // Delete a workout plan
  async deleteWorkoutPlan(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('workout_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Workout plan deleted successfully');
      return true;
    } catch (error: any) {
      toast.error('Failed to delete workout plan');
      return false;
    }
  },


  // Assign a workout plan to a member
  async assignWorkoutPlan(params: {
    planId: string;
    memberId: string;
    assignedBy: string;
    type: 'assigned' | 'private';
    trainerId?: string;
  }): Promise<WorkoutPlanDB | null> {
    try {
      // Get the original plan
      const { data: originalPlan } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('id', params.planId)
        .single();

      if (!originalPlan) throw new Error('Plan not found');

      // Create a new assigned/private plan
      const { data, error } = await supabase
        .from('workout_plans')
        .insert([
          {
            ...originalPlan,
            id: undefined, // Let Supabase generate new ID
            type: params.type,
            member_id: params.memberId,
            trainer_id: params.trainerId,
            assigned_by: params.assignedBy,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      toast.success('Workout plan assigned successfully');
      return data;
    } catch (error: any) {
      toast.error('Failed to assign workout plan');
      return null;
    }
  },

  // Get a member's assigned workout plans
  async getMemberWorkouts(memberId: string): Promise<WorkoutPlanDB[]> {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('member_id', memberId);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast.error('Failed to fetch member workouts');
      return [];
    }
  },

  // Get a specific workout plan
  async getWorkoutPlanById(id: string): Promise<WorkoutPlanDB | null> {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast.error('Failed to fetch workout plan');
      return null;
    }
  }
};
