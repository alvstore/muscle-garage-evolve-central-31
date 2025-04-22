
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useAuth } from './use-auth';

interface MemberProgress {
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
}

export const useMemberProgress = (memberId: string) => {
  const [progress, setProgress] = useState<MemberProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

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

        if (error) throw error;
        setProgress(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberProgress();

    // Real-time subscription
    const channel = supabase
      .channel('member_progress_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'member_progress',
          filter: `member_id=eq.${memberId}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setProgress(payload.new as MemberProgress);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [memberId, user?.id]);

  return { progress, isLoading, error };
};
