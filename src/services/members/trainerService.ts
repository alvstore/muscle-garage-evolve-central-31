
import { supabase } from '@/integrations/supabase/client';
import { Trainer, Member, WorkoutPlan, DietPlan } from '@/types/index';
import { toast } from 'sonner';

export const trainerService = {
  // Fetch all trainers
  async getTrainers(): Promise<Trainer[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'trainer');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast.error('Failed to fetch trainers');
      return [];
    }
  },
  
  // Fetch a specific trainer by ID
  async getTrainerById(trainerId: string): Promise<Trainer | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', trainerId)
        .eq('role', 'trainer')
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast.error('Failed to fetch trainer details');
      return null;
    }
  },
  
  // Fetch trainer's schedule
  async getTrainerSchedule(trainerId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('trainer_schedules')
        .select('*')
        .eq('trainer_id', trainerId);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast.error('Failed to fetch trainer schedule');
      return [];
    }
  },
  
  // Get available slots for a trainer on a specific date
  async getTrainerAvailability(trainerId: string, date: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('trainer_schedules')
        .select('*')
        .eq('trainer_id', trainerId)
        .eq('date', date)
        .eq('is_available', true);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast.error('Failed to fetch trainer availability');
      return [];
    }
  },
  
  // Book a session with a trainer
  async bookTrainerSession(trainerId: string, memberId: string, date: string, timeSlot: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('trainer_sessions')
        .insert({
          trainer_id: trainerId,
          member_id: memberId,
          date,
          time_slot: timeSlot,
          status: 'booked'
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Session booked successfully');
      return data;
    } catch (error: any) {
      toast.error('Failed to book trainer session');
      return null;
    }
  },
  
  // Assign a trainer to a member
  async assignTrainerToMember(trainerId: string, memberId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('trainer_assignments')
        .insert({
          trainer_id: trainerId,
          member_id: memberId,
          assigned_at: new Date().toISOString(),
          status: 'active'
        });

      if (error) throw error;
      toast.success('Trainer assigned successfully');
      return true;
    } catch (error: any) {
      toast.error('Failed to assign trainer');
      return false;
    }
  },
  
  // Get members assigned to a trainer
  async getAssignedMembers(trainerId: string): Promise<any[]> {
    try {
      type ProfileResponse = {
        member: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          role: string;
          status: string;
          membership_status: string;
        };
      };

      const { data, error } = await supabase
        .from('trainer_assignments')
        .select(`
          member:member_id(
            id,
            first_name,
            last_name,
            email,
            role,
            status,
            membership_status
          )
        `)
        .eq('trainer_id', trainerId)
        .eq('status', 'active');

      if (error) throw error;
      
      return (data as unknown as ProfileResponse[])?.map(d => ({
        id: d.member.id,
        name: `${d.member.first_name} ${d.member.last_name}`,
        email: d.member.email,
        status: d.member.status as 'active' | 'inactive' | 'pending',
        membershipStatus: d.member.membership_status as 'active' | 'expired' | 'none',
        role: d.member.role as 'member' | 'trainer' | 'staff' | 'admin',
        membershipId: null,
        membershipStartDate: null,
        membershipEndDate: null
      })) || [];
    } catch (error: any) {
      toast.error('Failed to fetch assigned members');
      return [];
    }
  },
  
  // Create or update a workout plan for a member
  async createWorkoutPlan(plan: WorkoutPlan): Promise<WorkoutPlan | null> {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .insert({
          ...plan,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
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
  
  // Create or update a diet plan for a member
  async createDietPlan(plan: DietPlan): Promise<DietPlan | null> {
    try {
      const { data, error } = await supabase
        .from('diet_plans')
        .insert({
          ...plan,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Diet plan created successfully');
      return data;
    } catch (error: any) {
      toast.error('Failed to create diet plan');
      return null;
    }
  }
};
