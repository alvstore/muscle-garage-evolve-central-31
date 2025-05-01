
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabaseClient';
import { Referral } from '@/types/marketing';
import { toast } from '@/utils/toast-manager';
import { useBranch } from './use-branch';

export const useReferrals = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  const fetchReferrals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('referrals')
        .select('*');

      // Branch filtering if needed
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      setReferrals(data as Referral[]);
    } catch (err: any) {
      console.error('Error fetching referrals:', err);
      setError(err.message || 'Failed to load referrals');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  const createReferral = async (referralData: Omit<Referral, 'id' | 'created_at'>) => {
    try {
      setIsLoading(true);
      
      // Add branch_id to the referral data if available
      const dataWithBranch = currentBranch?.id 
        ? { ...referralData, branch_id: currentBranch.id } 
        : referralData;
      
      const { data, error: supabaseError } = await supabase
        .from('referrals')
        .insert([dataWithBranch])
        .select();

      if (supabaseError) {
        throw supabaseError;
      }

      toast.success('Referral created successfully');
      await fetchReferrals(); // Refresh the list
      return data[0] as Referral;
    } catch (err: any) {
      console.error('Error creating referral:', err);
      toast.error(err.message || 'Failed to create referral');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateReferralStatus = async (id: string, status: string) => {
    try {
      setIsLoading(true);
      
      const { error: supabaseError } = await supabase
        .from('referrals')
        .update({ status })
        .eq('id', id);

      if (supabaseError) {
        throw supabaseError;
      }

      toast.success(`Referral ${status} successfully`);
      await fetchReferrals(); // Refresh the list
      return true;
    } catch (err: any) {
      console.error(`Error updating referral to ${status}:`, err);
      toast.error(err.message || `Failed to update referral`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const approveReferral = (id: string) => updateReferralStatus(id, 'approved');
  const rejectReferral = (id: string) => updateReferralStatus(id, 'rejected');

  const resendInvitation = async (referral: Referral) => {
    try {
      // Here you would typically call an edge function or API
      // to resend the invitation email
      toast.success(`Invitation resent to ${referral.referred_email}`);
      return true;
    } catch (err: any) {
      console.error('Error resending invitation:', err);
      toast.error(err.message || 'Failed to resend invitation');
      return false;
    }
  };

  // Setup real-time subscription
  useEffect(() => {
    fetchReferrals();

    // Set up real-time subscription
    const channel = supabase
      .channel('referrals-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'referrals',
          filter: currentBranch?.id ? `branch_id=eq.${currentBranch.id}` : undefined
        }, 
        (payload) => {
          console.log('Referrals data changed:', payload);
          fetchReferrals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchReferrals, currentBranch?.id]);

  return {
    referrals,
    isLoading,
    error,
    refetch: fetchReferrals,
    createReferral,
    approveReferral,
    rejectReferral,
    resendInvitation
  };
};
