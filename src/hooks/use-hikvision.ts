
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HikvisionSettings {
  id?: string;
  branch_id: string;
  api_url: string;
  app_key: string;
  app_secret: string;
  devices: HikvisionDevice[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface HikvisionDevice {
  id?: string;
  serialNumber: string;
  deviceName: string;
  deviceType: string;
  isCloudManaged: boolean;
  useIsupFallback?: boolean;
  ipAddress?: string;
  port?: string;
  username?: string;
  password?: string;
  location?: string;
  siteId?: string;
  isOnline?: boolean;
  lastSync?: string;
}

export interface TokenData {
  accessToken: string;
  expireTime: number;
  areaDomain: string;
  siteId?: string;
  availableSites?: Array<{siteId: string, siteName: string}>;
}

interface UseHikvisionOptions {
  branchId?: string;
}

export function useHikvision({ branchId }: UseHikvisionOptions = {}) {
  const [settings, setSettings] = useState<HikvisionSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Fetch Hikvision settings from the database
  const fetchSettings = useCallback(async (branch?: string): Promise<HikvisionSettings | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branch || branchId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // Not found error code
          console.error('Error fetching Hikvision settings:', error);
          setError(error);
        }
        return null;
      }

      const hikvisionSettings = data as HikvisionSettings;
      setSettings(hikvisionSettings);
      
      // Check connection if we have settings
      if (hikvisionSettings && hikvisionSettings.is_active) {
        testConnection({
          api_url: hikvisionSettings.api_url,
          app_key: hikvisionSettings.app_key, 
          app_secret: hikvisionSettings.app_secret
        });
      }
      
      return hikvisionSettings;
    } catch (err: any) {
      console.error('Error in fetchSettings:', err);
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [branchId]);

  // Save Hikvision settings
  const saveSettings = useCallback(async (settingsData: Partial<HikvisionSettings>, branch?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const branchToUse = branch || branchId;
      if (!branchToUse) {
        throw new Error('No branch ID provided');
      }

      // Check if settings already exist
      const { data: existingData, error: fetchError } = await supabase
        .from('hikvision_api_settings')
        .select('id')
        .eq('branch_id', branchToUse)
        .maybeSingle();

      // Prepare data to save
      const dataToSave = {
        ...settingsData,
        branch_id: branchToUse,
        updated_at: new Date().toISOString()
      };

      let result;
      if (existingData?.id) {
        // Update existing settings
        result = await supabase
          .from('hikvision_api_settings')
          .update(dataToSave)
          .eq('id', existingData.id)
          .eq('branch_id', branchToUse);
      } else {
        // Create new settings
        result = await supabase
          .from('hikvision_api_settings')
          .insert({
            ...dataToSave,
            created_at: new Date().toISOString()
          });
      }

      if (result.error) {
        throw result.error;
      }

      // Refresh settings after save
      fetchSettings(branchToUse);
      toast.success('Hikvision settings saved successfully');
      return true;
    } catch (err: any) {
      console.error('Error saving Hikvision settings:', err);
      setError(err);
      toast.error(`Failed to save settings: ${err.message || 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [branchId, fetchSettings]);

  // Test connection to Hikvision API
  const testConnection = useCallback(async (credentials: {
    api_url: string;
    app_key: string;
    app_secret: string;
  }): Promise<{ success: boolean; message?: string; token?: TokenData }> => {
    try {
      setIsLoading(true);
      setIsConnected(null);
      setError(null);

      // Call the Edge Function or backend API to test the connection
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'get-token',
          apiUrl: credentials.api_url,
          appKey: credentials.app_key,
          secretKey: credentials.app_secret
        }
      });

      if (error || !data || !data.success) {
        setIsConnected(false);
        setError(new Error(error?.message || data?.message || 'Connection test failed'));
        return { 
          success: false, 
          message: error?.message || data?.message || 'Connection test failed' 
        };
      }

      setIsConnected(true);
      
      // Store token for future use
      if (data.token && branchId) {
        await supabase.from('hikvision_tokens').upsert({
          branch_id: branchId,
          access_token: data.token.accessToken,
          expire_time: data.token.expireTime,
          area_domain: data.token.areaDomain,
          created_at: new Date().toISOString()
        });
      }
      
      return { 
        success: true, 
        token: data.token
      };
    } catch (err: any) {
      console.error('Error testing connection:', err);
      setIsConnected(false);
      setError(err);
      return { 
        success: false, 
        message: err.message || 'Unknown error during connection test' 
      };
    } finally {
      setIsLoading(false);
    }
  }, [branchId]);
  
  // Get token (either from cache or fetch a new one)
  const getToken = useCallback(async (): Promise<{ success: boolean, token?: TokenData, message?: string }> => {
    try {
      if (!branchId) {
        return { success: false, message: 'No branch ID provided' };
      }

      // Check if we have a valid token in the database
      const { data: tokenData, error: tokenError } = await supabase
        .from('hikvision_tokens')
        .select('*')
        .eq('branch_id', branchId)
        .single();
        
      if (tokenData) {
        const now = Date.now();
        // Check if token is still valid (with 5 minute buffer)
        if (tokenData.expire_time > (now + 300000)) {
          return { 
            success: true, 
            token: {
              accessToken: tokenData.access_token,
              expireTime: tokenData.expire_time,
              areaDomain: tokenData.area_domain
            }
          };
        }
      }
      
      // Token doesn't exist or is expired, fetch settings to get credentials
      const settings = await fetchSettings();
      if (!settings) {
        return { success: false, message: 'No Hikvision settings found' };
      }
      
      // Get a new token
      return await testConnection({
        api_url: settings.api_url,
        app_key: settings.app_key,
        app_secret: settings.app_secret
      });
    } catch (err: any) {
      console.error('Error getting token:', err);
      return { success: false, message: err.message || 'Failed to get token' };
    }
  }, [branchId, fetchSettings, testConnection]);
  
  // Add a device
  const addDevice = useCallback(async (device: HikvisionDevice): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!branchId) {
        throw new Error('No branch ID provided');
      }
      
      // Get current settings with devices
      const currentSettings = await fetchSettings();
      if (!currentSettings) {
        throw new Error('No Hikvision settings found');
      }
      
      // Add device ID if not present
      const newDevice = {
        ...device,
        id: device.id || crypto.randomUUID()
      };
      
      // Add to devices array
      const updatedDevices = [...(currentSettings.devices || []), newDevice];
      
      // Update settings with new device list
      const success = await saveSettings({
        devices: updatedDevices
      });
      
      if (success) {
        toast.success(`Device "${device.deviceName}" added successfully`);
      }
      
      return success;
    } catch (err: any) {
      console.error('Error adding device:', err);
      toast.error(`Failed to add device: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [branchId, fetchSettings, saveSettings]);
  
  // Remove a device
  const removeDevice = useCallback(async (deviceId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!branchId) {
        throw new Error('No branch ID provided');
      }
      
      // Get current settings with devices
      const currentSettings = await fetchSettings();
      if (!currentSettings) {
        throw new Error('No Hikvision settings found');
      }
      
      // Filter out the device to remove
      const updatedDevices = currentSettings.devices.filter(d => 
        d.id !== deviceId && d.serialNumber !== deviceId
      );
      
      // Update settings with new device list
      const success = await saveSettings({
        devices: updatedDevices
      });
      
      if (success) {
        toast.success('Device removed successfully');
      }
      
      return success;
    } catch (err: any) {
      console.error('Error removing device:', err);
      toast.error(`Failed to remove device: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [branchId, fetchSettings, saveSettings]);
  
  // Sync member to Hikvision access control
  const syncMember = useCallback(async (memberId: string, deviceSerials?: string[]): Promise<boolean> => {
    try {
      if (!branchId || !memberId) {
        throw new Error('Branch ID and Member ID are required');
      }
      
      // Get token
      const tokenResult = await getToken();
      if (!tokenResult.success || !tokenResult.token) {
        throw new Error('Failed to get access token: ' + tokenResult.message);
      }
      
      // Call the Edge Function to sync member
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'sync-member',
          token: tokenResult.token.accessToken,
          branchId,
          memberId,
          deviceSerials
        }
      });
      
      if (error || !data || !data.success) {
        throw new Error(error?.message || data?.message || 'Failed to sync member');
      }
      
      toast.success('Member synchronized successfully with access control');
      return true;
    } catch (err: any) {
      console.error('Error syncing member:', err);
      toast.error(`Failed to sync member: ${err.message}`);
      return false;
    }
  }, [branchId, getToken]);
  
  // Remove member from access control
  const removeMember = useCallback(async (memberId: string): Promise<boolean> => {
    try {
      if (!branchId || !memberId) {
        throw new Error('Branch ID and Member ID are required');
      }
      
      // Get token
      const tokenResult = await getToken();
      if (!tokenResult.success || !tokenResult.token) {
        throw new Error('Failed to get access token: ' + tokenResult.message);
      }
      
      // Call the Edge Function to remove member
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'remove-member',
          token: tokenResult.token.accessToken,
          branchId,
          memberId
        }
      });
      
      if (error || !data || !data.success) {
        throw new Error(error?.message || data?.message || 'Failed to remove member');
      }
      
      toast.success('Member removed from access control');
      return true;
    } catch (err: any) {
      console.error('Error removing member from access control:', err);
      toast.error(`Failed to remove member: ${err.message}`);
      return false;
    }
  }, [branchId, getToken]);
  
  // Get member access details
  const getMemberAccessStatus = useCallback(async (memberId: string): Promise<any> => {
    try {
      if (!branchId || !memberId) {
        throw new Error('Branch ID and Member ID are required');
      }
      
      // Get member-device mapping from database
      const { data, error } = await supabase
        .from('member_hikvision_mapping')
        .select('*')
        .eq('member_id', memberId);
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (err: any) {
      console.error('Error getting member access status:', err);
      return [];
    }
  }, [branchId]);
  
  // Group member access-related functions
  const memberAccess = {
    syncMember,
    removeMember,
    getStatus: getMemberAccessStatus,
  };

  // Initialize on mount
  useEffect(() => {
    if (branchId) {
      fetchSettings();
    }
  }, [branchId, fetchSettings]);

  return {
    settings,
    isLoading,
    isConnected,
    error,
    fetchSettings,
    saveSettings,
    testConnection,
    getToken,
    addDevice,
    removeDevice,
    memberAccess
  };
}
