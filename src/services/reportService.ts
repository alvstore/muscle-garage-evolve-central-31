
import { supabase } from "@/integrations/supabase/client";
import { Member, Trainer, Class, WorkoutPlan } from "@/types";

export const reportService = {
  async getMembersByTrainer(trainerId: string): Promise<Member[]> {
    try {
      const { data, error } = await supabase
        .from('members')
        .select(`
          id,
          name,
          email,
          phone,
          gender,
          date_of_birth,
          goal,
          status,
          membership_status,
          membership_start_date,
          membership_end_date,
          trainer_id
        `)
        .eq('trainer_id', trainerId);
      
      if (error) {
        throw error;
      }
      
      return data.map(member => ({
        id: member.id,
        name: member.name || '',
        email: member.email || '',
        role: 'member',
        status: member.status || 'active',
        phone: member.phone || '',
        dateOfBirth: member.date_of_birth,
        goal: member.goal || '',
        trainerId: member.trainer_id,
        membershipStatus: member.membership_status || 'none',
        membershipStartDate: member.membership_start_date,
        membershipEndDate: member.membership_end_date
      }));
    } catch (error) {
      console.error("Error fetching members by trainer:", error);
      return [];
    }
  },
  
  async getTrainerClasses(trainerId: string): Promise<Class[]> {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          id,
          name,
          description,
          start_time,
          end_time,
          capacity,
          trainer_id
        `)
        .eq('trainer_id', trainerId);
      
      if (error) {
        throw error;
      }
      
      const classes = data.map(cls => ({
        id: cls.id,
        name: cls.name,
        description: cls.description || '',
        trainerId: cls.trainer_id,
        capacity: cls.capacity,
        enrolled: 0, // Calculate this if needed
        startTime: cls.start_time,
        endTime: cls.end_time,
        type: 'Group',
        location: ''
      }));
      
      // Get enrollment count for each class
      for (const cls of classes) {
        const { count } = await supabase
          .from('class_bookings')
          .select('*', { count: 'exact', head: true })
          .eq('class_id', cls.id);
        
        cls.enrolled = count || 0;
      }
      
      return classes;
    } catch (error) {
      console.error("Error fetching trainer classes:", error);
      return [];
    }
  },
  
  async getWorkoutPlans(trainerId: string): Promise<WorkoutPlan[]> {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .select(`
          id,
          name,
          description,
          trainer_id,
          member_id,
          is_global,
          is_custom,
          created_at,
          updated_at,
          difficulty,
          notes
        `)
        .eq('trainer_id', trainerId);
      
      if (error) {
        throw error;
      }
      
      const plans = data.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
        trainerId: plan.trainer_id,
        isGlobal: plan.is_global,
        createdAt: plan.created_at,
        updatedAt: plan.updated_at,
        memberId: plan.member_id || '',
        difficulty: plan.difficulty || 'intermediate',
        workoutDays: [],
        targetGoals: [],
        isCommon: !plan.is_custom,
        notes: plan.notes
      }));
      
      // Get workout days for each plan
      for (const plan of plans) {
        const { data: workoutDays } = await supabase
          .from('workout_days')
          .select(`
            id,
            name,
            description,
            notes,
            day_label
          `)
          .eq('workout_plan_id', plan.id);
        
        if (workoutDays) {
          plan.workoutDays = await Promise.all(workoutDays.map(async (day) => {
            const { data: exercises } = await supabase
              .from('exercises')
              .select(`
                id,
                name,
                sets,
                reps,
                weight,
                rest,
                rest_time,
                notes,
                media_url,
                muscle_group_tag
              `)
              .eq('workout_day_id', day.id);
            
            return {
              id: day.id,
              name: day.name,
              dayLabel: day.day_label,
              notes: day.notes,
              description: day.description,
              exercises: exercises?.map(ex => ({
                id: ex.id,
                name: ex.name,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight,
                rest: ex.rest,
                restTime: ex.rest_time,
                notes: ex.notes,
                mediaUrl: ex.media_url,
                muscleGroupTag: ex.muscle_group_tag
              })) || []
            };
          }));
        }
      }
      
      return plans;
    } catch (error) {
      console.error("Error fetching workout plans:", error);
      return [];
    }
  },
  
  async getMemberStats(branchId?: string) {
    try {
      const { count: totalMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq(branchId ? 'branch_id' : '', branchId || '');
      
      const { count: activeMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq(branchId ? 'branch_id' : '', branchId || '')
        .eq('status', 'active');
      
      const today = new Date();
      const { count: newMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq(branchId ? 'branch_id' : '', branchId || '')
        .gte('created_at', new Date(today.getFullYear(), today.getMonth(), 1).toISOString());
      
      return {
        totalMembers: totalMembers || 0,
        activeMembers: activeMembers || 0,
        newMembers: newMembers || 0
      };
    } catch (error) {
      console.error("Error getting member stats:", error);
      return {
        totalMembers: 0,
        activeMembers: 0,
        newMembers: 0
      };
    }
  },
  
  async getTrainerStats(branchId?: string) {
    try {
      const { count: totalTrainers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'trainer')
        .eq(branchId ? 'branch_id' : '', branchId || '');
      
      return {
        totalTrainers: totalTrainers || 0
      };
    } catch (error) {
      console.error("Error getting trainer stats:", error);
      return {
        totalTrainers: 0
      };
    }
  },
  
  async getClassStats(branchId?: string) {
    try {
      const { count: totalClasses } = await supabase
        .from('classes')
        .select('*', { count: 'exact', head: true })
        .eq(branchId ? 'branch_id' : '', branchId || '')
        .eq('is_active', true);
      
      const today = new Date();
      const { count: todayClasses } = await supabase
        .from('classes')
        .select('*', { count: 'exact', head: true })
        .eq(branchId ? 'branch_id' : '', branchId || '')
        .gte('start_time', today.toISOString().split('T')[0])
        .lt('start_time', new Date(today.getTime() + 86400000).toISOString().split('T')[0]);
      
      return {
        totalClasses: totalClasses || 0,
        todayClasses: todayClasses || 0
      };
    } catch (error) {
      console.error("Error getting class stats:", error);
      return {
        totalClasses: 0,
        todayClasses: 0
      };
    }
  },
  
  async getFinanceStats(branchId?: string) {
    try {
      const { count: pendingInvoices, data: invoices } = await supabase
        .from('member_memberships')
        .select('total_amount', { count: 'exact' })
        .eq(branchId ? 'branch_id' : '', branchId || '')
        .eq('payment_status', 'pending');
      
      let totalPending = 0;
      if (invoices) {
        totalPending = invoices.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);
      }
      
      return {
        pendingCount: pendingInvoices || 0,
        pendingAmount: totalPending
      };
    } catch (error) {
      console.error("Error getting finance stats:", error);
      return {
        pendingCount: 0,
        pendingAmount: 0
      };
    }
  }
};
