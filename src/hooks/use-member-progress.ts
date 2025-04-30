
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
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
        const { data, error } = await supabase
          .from('member_progress')
          .select('*')
          .eq('member_id', memberId)
          .eq('trainer_id', user.id)
          .single();

        if (error) {
          // If no data found, create a mock progress object for display purposes
          // In a production app, you would handle this differently
          if (error.code === 'PGRST116') {
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
              branch_id: currentBranch?.id || undefined
            });
          } else {
            throw error;
          }
        } else {
          setProgress(data);
        }
      } catch (err) {
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
          table: 'member_progress',
          filter: `member_id=eq.${memberId}`
        },
        (payload) => {
          console.log('Real-time update:', payload);
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setProgress(payload.new as MemberProgress);
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
      const { data, error } = await supabase
        .from('member_progress')
        .update({
          ...updatedProgress,
          updated_at: new Date().toISOString()
        })
        .eq('id', progress.id)
        .eq('trainer_id', user.id)
        .select();
        
      if (error) throw error;
      return { data };
    } catch (err) {
      console.error('Error updating progress:', err);
      return { error: err instanceof Error ? err.message : 'Unknown error' };
    }
  };

  return { progress, isLoading, error, updateProgress };
};
