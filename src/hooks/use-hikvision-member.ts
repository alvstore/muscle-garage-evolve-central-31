
import { useState, useEffect, useCallback } from 'react';
import { useBranch } from './use-branch';
import { useHikvisionSettings } from './use-hikvision-settings';
import { HikvisionSettings } from '@/types/access-control';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

interface MemberAccessProps {
  branchId?: string;
}

interface MemberAccess {
  id: string;
  member_id: string;
  hikvision_person_id: string;
  device_serial: string;
  face_registered: boolean;
  card_registered: boolean;
  fingerprint_registered: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useHikvisionMember = ({ branchId }: MemberAccessProps) => {
  const { currentBranch } = useBranch();
  const { settings } = useHikvisionSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [memberAccess, setMemberAccess] = useState<MemberAccess[]>([]);
  
  const effectiveBranchId = branchId || currentBranch?.id;

  const getMemberAccess = useCallback(async (memberId: string) => {
    if (!effectiveBranchId) return [];
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('member_access')
        .select('*')
        .eq('member_id', memberId);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching member access:', error);
      toast.error('Failed to fetch member access');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [effectiveBranchId]);

  const syncMember = useCallback(async (memberId: string, deviceSerials: string[]) => {
    if (!effectiveBranchId || !settings) return false;
    
    setIsLoading(true);
    try {
      // Get member details
      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('id', memberId)
        .single();
        
      if (memberError) throw memberError;
      
      // In a real implementation, this would call the Hikvision API to register the member
      // For now, we'll just create entries in the member_access table
      
      // First, we'll delete any existing entries for this member
      const { error: deleteError } = await supabase
        .from('member_access')
        .delete()
        .eq('member_id', memberId);
        
      if (deleteError) throw deleteError;
      
      // Then, create new entries for each device
      const personId = `person_${memberId.substring(0, 8)}`;
      
      const entries = deviceSerials.map(serial => ({
        member_id: memberId,
        hikvision_person_id: personId,
        device_serial: serial,
        face_registered: true,
        card_registered: false,
        fingerprint_registered: false
      }));
      
      const { data, error } = await supabase
        .from('member_access')
        .insert(entries)
        .select();
        
      if (error) throw error;
      
      toast.success(`Member ${member.name} successfully synced to access control`);
      setMemberAccess(data);
      return true;
    } catch (error) {
      console.error('Error syncing member:', error);
      toast.error('Failed to sync member to access control');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [effectiveBranchId, settings]);

  const removeMember = useCallback(async (memberId: string) => {
    if (!effectiveBranchId) return false;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call the Hikvision API to remove the member
      // For now, we'll just delete entries from the member_access table
      
      const { error } = await supabase
        .from('member_access')
        .delete()
        .eq('member_id', memberId);
        
      if (error) throw error;
      
      toast.success('Member removed from access control');
      setMemberAccess([]);
      return true;
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member from access control');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [effectiveBranchId]);

  return {
    isLoading,
    memberAccess,
    getMemberAccess,
    syncMember,
    removeMember
  };
};
