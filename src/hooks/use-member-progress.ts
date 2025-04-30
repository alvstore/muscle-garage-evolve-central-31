
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useBranch } from './use-branch';

export interface MemberProgress {
  id: string;
  member_id: string;
  trainer_id: string;
  weight: number;
  bmi: number;
  fat_percent: number;
  muscle_mass: number;
  workout_completion_percent: number;
  diet_adherence_percent: number;
  last_updated: string;
  branch_id?: string;
}

export const useMemberProgress = (memberId: string) => {
  const [progress, setProgress] = useState<MemberProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchMemberProgress = async () => {
      if (!memberId || !user) return;

      setIsLoading(true);
      try {
        // First try to get from member_progress table
        let { data, error } = await supabase
          .from('member_progress')
          .select('*')
          .eq('member_id', memberId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        // If no data in member_progress, try fitness_progress
        if (!data) {
          const { data: fitnessData, error: fitnessError } = await supabase
            .from('fitness_progress')
            .select('*')
            .eq('member_id', memberId)
            .order('date', { ascending: false })
            .limit(1)
            .maybeSingle();
            
          if (fitnessError && fitnessError.code !== 'PGRST116') {
            throw fitnessError;
          }
          
          if (fitnessData) {
            // Convert fitness_progress data to member_progress format
            data = {
              id: fitnessData.id,
              member_id: fitnessData.member_id,
              trainer_id: fitnessData.created_by || user.id,
              weight: fitnessData.weight || 0,
              bmi: fitnessData.body_fat_percentage || 0,
              fat_percent: fitnessData.body_fat_percentage || 0,
              muscle_mass: fitnessData.muscle_mass || 0,
              workout_completion_percent: fitnessData.workout_completion || 0,
              diet_adherence_percent: fitnessData.diet_adherence || 0,
              last_updated: fitnessData.updated_at,
              branch_id: fitnessData.branch_id
            };
          }
        }

        // If still no data, create a mock progress object for UI display
        if (!data) {
          console.log('No progress data found for member, using mock data');
          setProgress({
            id: `mock-${memberId}`,
            member_id: memberId,
            trainer_id: user.id,
            weight: 75,
            bmi: 24.5,
            fat_percent: 18,
            muscle_mass: 65,
            workout_completion_percent: 85,
            diet_adherence_percent: 70,
            last_updated: new Date().toISOString(),
            branch_id: currentBranch?.id
          });
        } else {
          setProgress(data);
        }
      } catch (err: any) {
        console.error('Error fetching member progress:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberProgress();

    // Real-time subscription with proper channel name
    const channel = supabase
      .channel(`member_progress_changes_${memberId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fitness_progress',
          filter: `member_id=eq.${memberId}`
        },
        (payload) => {
          console.log('Real-time update:', payload);
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const fitnessData = payload.new;
            // Convert fitness_progress data to member_progress format
            const progressData = {
              id: fitnessData.id,
              member_id: fitnessData.member_id,
              trainer_id: fitnessData.created_by || user.id,
              weight: fitnessData.weight || 0,
              bmi: fitnessData.body_fat_percentage || 0,
              fat_percent: fitnessData.body_fat_percentage || 0,
              muscle_mass: fitnessData.muscle_mass || 0,
              workout_completion_percent: fitnessData.workout_completion || 0,
              diet_adherence_percent: fitnessData.diet_adherence || 0,
              last_updated: fitnessData.updated_at,
              branch_id: fitnessData.branch_id
            };
            setProgress(progressData as MemberProgress);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [memberId, user, currentBranch]);

  const updateProgress = async (updatedProgress: Partial<MemberProgress>) => {
    if (!progress || !user) return { error: 'Not authorized or no progress data found' };
    
    try {
      // Check if we're updating a mock object
      if (progress.id.startsWith('mock-')) {
        // Create a new entry in fitness_progress
        const { data, error } = await supabase
          .from('fitness_progress')
          .insert({
            member_id: progress.member_id,
            weight: updatedProgress.weight,
            body_fat_percentage: updatedProgress.fat_percent,
            muscle_mass: updatedProgress.muscle_mass,
            workout_completion: updatedProgress.workout_completion_percent,
            diet_adherence: updatedProgress.diet_adherence_percent,
            created_by: user.id,
            branch_id: currentBranch?.id
          })
          .select();
          
        if (error) throw error;
        
        // Update local state with the new data
        if (data && data.length > 0) {
          const fitnessData = data[0];
          const progressData = {
            id: fitnessData.id,
            member_id: fitnessData.member_id,
            trainer_id: fitnessData.created_by,
            weight: fitnessData.weight || 0,
            bmi: fitnessData.body_fat_percentage || 0,
            fat_percent: fitnessData.body_fat_percentage || 0,
            muscle_mass: fitnessData.muscle_mass || 0,
            workout_completion_percent: fitnessData.workout_completion || 0,
            diet_adherence_percent: fitnessData.diet_adherence || 0,
            last_updated: fitnessData.updated_at,
            branch_id: fitnessData.branch_id
          };
          setProgress(progressData as MemberProgress);
        }
        
        return { data: data ? data[0] : null };
      } else {
        // Handle existing progress object update
        const { data, error } = await supabase
          .from('fitness_progress')
          .insert({
            member_id: progress.member_id,
            weight: updatedProgress.weight,
            body_fat_percentage: updatedProgress.fat_percent,
            muscle_mass: updatedProgress.muscle_mass,
            workout_completion: updatedProgress.workout_completion_percent,
            diet_adherence: updatedProgress.diet_adherence_percent,
            created_by: user.id,
            branch_id: currentBranch?.id
          })
          .select();
          
        if (error) throw error;
        
        return { data };
      }
    } catch (err) {
      console.error('Error updating progress:', err);
      return { error: err instanceof Error ? err.message : 'Unknown error' };
    }
  };

  return { progress, isLoading, error, updateProgress };
};
