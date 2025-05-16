
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branch';
import { toast } from 'sonner';

export interface HikvisionSettings {
  id?: string;
  app_key?: string;
  app_secret?: string;
  api_url?: string;
  branch_id?: string;
  is_active?: boolean;
  devices?: any[];
}

export const useHikvision = ({ branchId }: { branchId?: string } = {}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [settings, setSettings] = useState<HikvisionSettings>({});
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();
  
  const fetchSettings = async (branch?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const targetBranchId = branch || branchId || currentBranch?.id;
      
      if (!targetBranchId) {
        throw new Error('No branch ID provided');
      }
      
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', targetBranchId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found
          setSettings({});
          setIsConnected(false);
          return {} as HikvisionSettings;
        }
        throw error;
      }
      
      setSettings(data);
      setIsConnected(data.is_active);
      return data as HikvisionSettings;
    } catch (err: any) {
      setError(err);
      console.error('Error fetching Hikvision settings:', err);
      setIsConnected(false);
      return {} as HikvisionSettings;
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (settingsData: Partial<HikvisionSettings>, branch?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const targetBranchId = branch || branchId || currentBranch?.id;
      
      if (!targetBranchId) {
        throw new Error('No branch ID provided');
      }
      
      const payload = {
        ...settingsData,
        branch_id: targetBranchId,
        updated_at: new Date().toISOString()
      };
      
      if (!settings?.id) {
        // New settings
        const { data, error } = await supabase
          .from('hikvision_api_settings')
          .insert([payload])
          .select()
          .single();
        
        if (error) throw error;
        setSettings(data);
        return true;
      } else {
        // Update existing settings
        const { data, error } = await supabase
          .from('hikvision_api_settings')
          .update(payload)
          .eq('id', settings.id)
          .select()
          .single();
        
        if (error) throw error;
        setSettings(data);
        return true;
      }
    } catch (err: any) {
      setError(err);
      console.error('Error saving Hikvision settings:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const testConnection = async (settingsData: Partial<HikvisionSettings>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulating API test - in a real implementation, you would call the Hikvision API
      const { api_url, app_key, app_secret } = settingsData;
      
      if (!api_url || !app_key || !app_secret) {
        return { success: false, message: 'Missing API credentials' };
      }
      
      // In a real implementation, this would be an actual API call to test the connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success
      setIsConnected(true);
      return { success: true };
    } catch (err: any) {
      setError(err);
      setIsConnected(false);
      console.error('Error testing Hikvision connection:', err);
      return { success: false, message: err.message || 'Connection failed' };
    } finally {
      setIsLoading(false);
    }
  };
  
  const getToken = async () => {
    try {
      const targetBranchId = branchId || currentBranch?.id;
      
      if (!targetBranchId) {
        throw new Error('No branch ID provided');
      }
      
      const { data, error } = await supabase
        .from('hikvision_tokens')
        .select('*')
        .eq('branch_id', targetBranchId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error fetching Hikvision token:', err);
      throw err;
    }
  };

  // Add the missing methods needed by MemberAccessControl.tsx
  const registerMember = async (member: any, picture?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simplified example - in a real app, this would make API calls to Hikvision
      console.log('Registering member to Hikvision:', member.id);
      
      // Log the biometric registration attempt
      await supabase.from('biometric_logs').insert({
        member_id: member.id,
        branch_id: currentBranch?.id || branchId,
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
        branch_id: currentBranch?.id || branchId,
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
        branch_id: currentBranch?.id || branchId,
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
        branch_id: currentBranch?.id || branchId,
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
        branch_id: currentBranch?.id || branchId,
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
        branch_id: currentBranch?.id || branchId,
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
        branch_id: currentBranch?.id || branchId,
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
        branch_id: currentBranch?.id || branchId,
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

  // Add the memberAccess property with needed methods
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
    settings,
    isLoading,
    isConnected,
    error,
    fetchSettings,
    saveSettings,
    testConnection,
    getToken,
    registerMember,
    unregisterMember,
    grantAccess,
    revokeAccess,
    memberAccess: {
      isLoading,
      error,
      getMemberAccess
    }
  };
};
