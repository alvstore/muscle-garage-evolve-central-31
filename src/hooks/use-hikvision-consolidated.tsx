import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branch';
import { hikvisionService, HikvisionApiSettings, HikvisionDevice } from '@/services/hikvisionService';
import { toast } from 'sonner';

// Extend the HikvisionApiSettings interface to ensure compatibility
export interface HikvisionSettings extends Omit<HikvisionApiSettings, 'branch_id' | 'is_active'> {
  id?: string;
  branch_id: string; // Make branch_id required
  is_active: boolean; // Make is_active required
  devices?: any[];
  created_at?: string;
  updated_at?: string;
}

export const useHikvision = () => {
  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [settings, setSettings] = useState<HikvisionSettings | null>(null);
  const [devices, setDevices] = useState<HikvisionDevice[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  
  const { currentBranch } = useBranch();

  // Settings Management
  const fetchSettings = useCallback(async (branchId?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const targetBranchId = branchId || currentBranch?.id;
      
      if (!targetBranchId) {
        throw new Error('No branch ID provided');
      }
      
      // Try to get settings from the service first
      try {
        const data = await hikvisionService.getSettings(targetBranchId);
        setSettings(data);
        setIsConnected(data?.is_active || false);
        return data;
      } catch (serviceErr) {
        // Fallback to direct Supabase query if service fails
        const { data, error } = await supabase
          .from('hikvision_api_settings')
          .select('*')
          .eq('branch_id', targetBranchId)
          .single();
        
        if (error) throw error;
        
        setSettings(data);
        setIsConnected(data?.is_active || false);
        return data;
      }
    } catch (err: any) {
      setError(err);
      console.error('Error fetching Hikvision settings:', err);
      setIsConnected(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  const saveSettings = useCallback(async (newSettings: Partial<HikvisionSettings> & { branch_id: string }) => {
    // Ensure required fields are present
    const settingsWithDefaults: HikvisionApiSettings = {
      app_key: '',
      app_secret: '',
      api_url: 'https://api.hikvision.com',
      is_active: false,
      ...newSettings,
      branch_id: newSettings.branch_id || currentBranch?.id || ''
    };
    
    setIsSaving(true);
    setError(null);
    
    try {
      const targetBranchId = newSettings.branch_id || currentBranch?.id;
      
      if (!targetBranchId) {
        throw new Error('No branch ID provided');
      }
      
      const payload = {
        ...settingsWithDefaults,
        branch_id: targetBranchId,
        updated_at: new Date().toISOString()
      };
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .upsert(payload, { onConflict: 'branch_id' })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      const savedSettings = data as HikvisionSettings;
      setSettings(savedSettings);
      setIsConnected(savedSettings.is_active || false);
      toast.success('Hikvision settings saved successfully');
      return true;
    } catch (err: any) {
      setError(err);
      console.error('Error saving Hikvision settings:', err);
      toast.error('Failed to save Hikvision settings');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [currentBranch?.id, settings?.id]);

  // Device Management
  const fetchDevices = useCallback(async (branchId: string = currentBranch?.id || '') => {
    setIsLoadingDevices(true);
    try {
      const targetBranchId = branchId || currentBranch?.id;
      
      if (!targetBranchId) {
        throw new Error('No branch ID provided');
      }
      
      const devicesList = await hikvisionService.getDevices(settings);
      setDevices(devicesList);
      return devicesList;
    } catch (err) {
      console.error('Error fetching devices:', err);
      toast.error('Failed to load devices');
      return [];
    } finally {
      setIsLoadingDevices(false);
    }
  }, [currentBranch?.id, settings]);

  // Token Management
  const fetchToken = useCallback(async (branchId?: string) => {
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
  }, [currentBranch?.id]);

  // Connection Testing
  const testConnection = useCallback(async (testSettings?: HikvisionSettings) => {
    if (!testSettings && !settings) return false;
    
    const settingsToTest = testSettings || settings as HikvisionSettings;
    try {
      const success = await hikvisionService.testConnection(settingsToTest);
      if (success) {
        toast.success('Successfully connected to Hikvision API');
        setIsConnected(true);
      } else {
        toast.error('Failed to connect to Hikvision API');
        setIsConnected(false);
      }
      return success;
    } catch (error) {
      console.error('Connection test failed:', error);
      toast.error('Connection test failed');
      setIsConnected(false);
      return false;
    }
  }, [settings]);

  // Member Management
  const registerMember = useCallback(async (member: any, picture?: string): Promise<boolean> => {
    if (!settings) return false;
    setIsLoading(true);
    setError(null);
    
    try {
      // Log the biometric registration attempt
      await supabase.from('biometric_logs').insert({
        member_id: member.id,
        action: 'register',
        status: 'pending',
        branch_id: currentBranch?.id
      });
      
      // TODO: Implement actual Hikvision member registration
      console.log('Registering member to Hikvision:', member.id, 'with picture:', !!picture);
      
      // Update log on success
      await supabase.from('biometric_logs')
        .update({ status: 'success' })
        .eq('member_id', member.id)
        .eq('action', 'register');
      
      return true;
    } catch (err: any) {
      setError(err);
      console.error('Error registering member with Hikvision:', err);
      
      // Update log on error
      await supabase.from('biometric_logs')
        .update({ 
          status: 'failed',
          error_message: err.message 
        })
        .eq('member_id', member.id)
        .eq('action', 'register');
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [settings, currentBranch?.id]);

  // Initialize
  useEffect(() => {
    if (currentBranch?.id) {
      fetchSettings();
    }
  }, [currentBranch?.id, fetchSettings]);

  return {
    // State
    isLoading,
    isSaving,
    isConnected,
    error,
    settings,
    devices,
    isLoadingDevices,
    
    // Actions
    fetchSettings,
    saveSettings,
    fetchDevices,
    fetchToken,
    testConnection,
    registerMember,
    
    // Aliases for backward compatibility
    getSettings: fetchSettings,
    updateSettings: saveSettings,
    getDevices: fetchDevices
  };
};

export default useHikvision;
