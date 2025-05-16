
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branch';
import { toast } from 'sonner';

export const useHikvision = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();
  
  const fetchToken = async (branchId?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const targetBranchId = branchId || currentBranch?.id;
      
      if (!targetBranchId) {
        throw new Error('No branch ID provided for Hikvision operation');
      }
      
      const { data, error } = await supabase
        .from('hikvision_tokens')
        .select('*')
        .eq('branch_id', targetBranchId)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('No token found for this branch');
      
      return data;
    } catch (err: any) {
      setError(err);
      console.error('Error fetching Hikvision token:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const registerMember = async (member: any, picture?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simplified example - in a real app, this would make API calls to Hikvision
      console.log('Registering member to Hikvision:', member.id);
      
      // Log the biometric registration attempt
      await supabase.from('biometric_logs').insert({
        member_id: member.id,
        branch_id: currentBranch?.id,
        device_type: 'hikvision',
        action: 'register',
        status: 'success',
        details: { member_name: member.name, photo_provided: !!picture }
      });
      
      toast.success('Member registered successfully to access control system');
      return true;
    } catch (err: any) {
      setError(err);
      console.error('Error registering member to Hikvision:', err);
      
      // Log the error
      await supabase.from('biometric_logs').insert({
        member_id: member.id,
        branch_id: currentBranch?.id,
        device_type: 'hikvision',
        action: 'register',
        status: 'failed',
        error_message: err.message
      });
      
      toast.error('Failed to register member to access control system');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const unregisterMember = async (memberId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simplified example for removing a member from the access control system
      console.log('Unregistering member from Hikvision:', memberId);
      
      // Log the biometric unregistration attempt
      await supabase.from('biometric_logs').insert({
        member_id: memberId,
        branch_id: currentBranch?.id,
        device_type: 'hikvision',
        action: 'unregister',
        status: 'success'
      });
      
      toast.success('Member unregistered from access control system');
      return true;
    } catch (err: any) {
      setError(err);
      console.error('Error unregistering member from Hikvision:', err);
      
      // Log the error
      await supabase.from('biometric_logs').insert({
        member_id: memberId,
        branch_id: currentBranch?.id,
        device_type: 'hikvision',
        action: 'unregister',
        status: 'failed',
        error_message: err.message
      });
      
      toast.error('Failed to unregister member from access control system');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const grantAccess = async (
    memberId: string,
    deviceSerialNo: string,
    doorList: number[],
    validStartTime: string,
    validEndTime: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the Hikvision API
      console.log('Granting access to member:', memberId, 'for device:', deviceSerialNo);
      
      // Log the access grant attempt
      await supabase.from('biometric_logs').insert({
        member_id: memberId,
        branch_id: currentBranch?.id,
        device_type: 'hikvision',
        action: 'grant_access',
        status: 'success',
        details: { 
          deviceSerialNo, 
          doors: doorList, 
          validStartTime, 
          validEndTime 
        }
      });
      
      toast.success('Access granted successfully');
      return true;
    } catch (err: any) {
      setError(err);
      console.error('Error granting access:', err);
      
      // Log the error
      await supabase.from('biometric_logs').insert({
        member_id: memberId,
        branch_id: currentBranch?.id,
        device_type: 'hikvision',
        action: 'grant_access',
        status: 'failed',
        error_message: err.message,
        details: { deviceSerialNo }
      });
      
      toast.error('Failed to grant access');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const revokeAccess = async (memberId: string, deviceSerialNo: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the Hikvision API
      console.log('Revoking access for member:', memberId, 'from device:', deviceSerialNo);
      
      // Log the access revocation attempt
      await supabase.from('biometric_logs').insert({
        member_id: memberId,
        branch_id: currentBranch?.id,
        device_type: 'hikvision',
        action: 'revoke_access',
        status: 'success',
        details: { deviceSerialNo }
      });
      
      toast.success('Access revoked successfully');
      return true;
    } catch (err: any) {
      setError(err);
      console.error('Error revoking access:', err);
      
      // Log the error
      await supabase.from('biometric_logs').insert({
        member_id: memberId,
        branch_id: currentBranch?.id,
        device_type: 'hikvision',
        action: 'revoke_access',
        status: 'failed',
        error_message: err.message,
        details: { deviceSerialNo }
      });
      
      toast.error('Failed to revoke access');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Add the missing memberAccess functions and properties
  const getMemberAccess = async (memberId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get access details for the member
      const { data, error } = await supabase
        .from('member_access_credentials')
        .select('*')
        .eq('member_id', memberId);
        
      if (error) throw error;
      
      return data || [];
    } catch (err: any) {
      setError(err);
      console.error('Error getting member access:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerMember,
    unregisterMember,
    grantAccess,
    revokeAccess,
    fetchToken,
    isLoading,
    error,
    memberAccess: {
      isLoading,
      error,
      getMemberAccess
    }
  };
};
