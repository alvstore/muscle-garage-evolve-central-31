
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HikvisionSettings, HikvisionDevice, HikvisionPerson } from '@/types/settings/hikvision-types';

export interface TestConnectionResult {
  success: boolean;
  message: string;
  errorCode?: string;
}

export function useHikvisionSettings(branchId?: string) {
  const [settings, setSettings] = useState<HikvisionSettings | null>(null);
  const [devices, setDevices] = useState<HikvisionDevice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [availableSites, setAvailableSites] = useState<{id: string, name: string}[]>([]);
  const [isLoadingSites, setIsLoadingSites] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!branchId) return null;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .single();
      
      if (error) throw error;
      
      const settings: HikvisionSettings = {
        apiUrl: data?.api_url || '',
        appKey: data?.app_key || '',
        appSecret: data?.app_secret || '',
        isActive: data?.is_active || false,
        siteId: data?.site_id || '',
        siteName: data?.site_name || '',
        branchId: data?.branch_id || branchId,
        syncInterval: data?.sync_interval || 60,
        lastSync: data?.last_sync || null
      };
      
      setSettings(settings);
      setIsConnected(data?.is_active || false);
      
      return settings;
    } catch (error) {
      console.error('Error fetching Hikvision settings:', error);
      setError(error as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [branchId]);

  const saveSettings = useCallback(async (settingsData: Partial<HikvisionSettings>) => {
    if (!branchId) {
      toast.error('No branch selected');
      return null;
    }
    
    try {
      setIsSaving(true);
      
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .upsert({
          branch_id: branchId,
          api_url: settingsData.apiUrl,
          app_key: settingsData.appKey,
          app_secret: settingsData.appSecret,
          is_active: settingsData.isActive,
          site_id: settingsData.siteId,
          site_name: settingsData.siteName,
          sync_interval: settingsData.syncInterval,
          updated_at: new Date().toISOString()
        }, { onConflict: 'branch_id' })
        .select();
      
      if (error) throw error;
      
      const updatedSettings: HikvisionSettings = {
        apiUrl: data[0]?.api_url || '',
        appKey: data[0]?.app_key || '',
        appSecret: data[0]?.app_secret || '',
        isActive: data[0]?.is_active || false,
        siteId: data[0]?.site_id || '',
        siteName: data[0]?.site_name || '',
        branchId: data[0]?.branch_id || branchId,
        syncInterval: data[0]?.sync_interval || 60,
        lastSync: data[0]?.last_sync || null
      };
      
      setSettings(updatedSettings);
      setIsConnected(updatedSettings.isActive);
      toast.success('Settings saved successfully');
      
      return updatedSettings;
    } catch (error) {
      console.error('Error saving Hikvision settings:', error);
      setError(error as Error);
      toast.error(`Failed to save settings: ${(error as Error).message}`);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [branchId]);

  const testConnection = useCallback(async (testSettings?: Partial<HikvisionSettings>): Promise<TestConnectionResult> => {
    try {
      setIsSaving(true);
      
      const settingsToTest = testSettings || settings;
      
      if (!settingsToTest) {
        return {
          success: false,
          message: 'No settings to test'
        };
      }
      
      if (!settingsToTest.apiUrl || !settingsToTest.appKey || !settingsToTest.appSecret) {
        return {
          success: false,
          message: 'API URL, App Key and Secret Key are required'
        };
      }
      
      // Call the edge function to test connection
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'getToken',
          apiUrl: settingsToTest.apiUrl,
          appKey: settingsToTest.appKey,
          secretKey: settingsToTest.appSecret,
          branchId
        }
      });
      
      if (error) {
        console.error('Error testing connection:', error);
        setIsConnected(false);
        return {
          success: false,
          message: `Error: ${error.message}`
        };
      }
      
      if (!data.success) {
        setIsConnected(false);
        return {
          success: false,
          message: data.error || 'Connection test failed',
          errorCode: data.errorCode
        };
      }
      
      setIsConnected(true);
      
      // If test was successful, fetch available sites
      fetchAvailableSites();
      
      return {
        success: true,
        message: 'Connection successful'
      };
    } catch (error) {
      console.error('Error in testConnection:', error);
      setIsConnected(false);
      return {
        success: false,
        message: `Error: ${(error as Error).message}`
      };
    } finally {
      setIsSaving(false);
    }
  }, [settings, branchId]);

  const fetchAvailableSites = useCallback(async () => {
    if (!branchId || !settings?.isActive) return [];
    
    try {
      setIsLoadingSites(true);
      
      // Call the edge function to get sites
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'searchSites',
          apiUrl: settings.apiUrl,
          branchId
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch sites');
      }
      
      const sites = data.sites || [];
      setAvailableSites(sites.map((site: any) => ({
        id: site.siteId,
        name: site.siteName
      })));
      
      return sites;
    } catch (error) {
      console.error('Error fetching Hikvision sites:', error);
      toast.error(`Failed to fetch sites: ${(error as Error).message}`);
      return [];
    } finally {
      setIsLoadingSites(false);
    }
  }, [branchId, settings]);

  const createSite = useCallback(async (siteName: string) => {
    if (!branchId || !settings?.isActive) {
      toast.error('Hikvision integration not active');
      return null;
    }
    
    try {
      // Call the edge function to create site
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'createSite',
          apiUrl: settings.apiUrl,
          siteName,
          branchId
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create site');
      }
      
      toast.success('Site created successfully');
      
      // Refresh available sites
      fetchAvailableSites();
      
      return data.data;
    } catch (error) {
      console.error('Error creating Hikvision site:', error);
      toast.error(`Failed to create site: ${(error as Error).message}`);
      return null;
    }
  }, [branchId, settings, fetchAvailableSites]);

  const getDevices = useCallback(async (deviceBranchId?: string) => {
    const targetBranchId = deviceBranchId || branchId;
    if (!targetBranchId) return [];
    
    try {
      setIsLoadingDevices(true);
      
      const { data, error } = await supabase
        .from('hikvision_devices')
        .select('*')
        .eq('branch_id', targetBranchId);
      
      if (error) throw error;
      
      const formattedDevices: HikvisionDevice[] = data.map(device => ({
        id: device.id,
        deviceId: device.device_id,
        name: device.name,
        serialNumber: device.serial_number,
        deviceType: device.device_type || 'entry',
        model: device.model,
        ipAddress: device.ip_address,
        port: device.port,
        username: device.username,
        password: device.password,
        isActive: device.status === 'active',
        isCloudManaged: device.is_cloud_managed || false,
        useIsupFallback: device.use_isup_fallback || false,
        lastOnline: device.last_online,
        lastSync: device.last_sync,
        location: device.location || '',
        branchId: device.branch_id,
        siteId: settings?.siteId || '',
        doors: []
      }));
      
      setDevices(formattedDevices);
      return formattedDevices;
    } catch (error) {
      console.error('Error fetching Hikvision devices:', error);
      return [];
    } finally {
      setIsLoadingDevices(false);
    }
  }, [branchId, settings]);

  const saveDevice = useCallback(async (device: HikvisionDevice) => {
    if (!branchId) {
      toast.error('No branch selected');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('hikvision_devices')
        .upsert({
          id: device.id,
          device_id: device.deviceId,
          name: device.name,
          serial_number: device.serialNumber,
          device_type: device.deviceType,
          model: device.model,
          ip_address: device.ipAddress,
          port: device.port,
          username: device.username,
          password: device.password,
          status: device.isActive ? 'active' : 'inactive',
          is_cloud_managed: device.isCloudManaged,
          use_isup_fallback: device.useIsupFallback,
          location: device.location,
          branch_id: branchId,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })
        .select();
      
      if (error) throw error;
      
      toast.success('Device saved successfully');
      
      // Refresh devices list
      getDevices();
      
      return data[0];
    } catch (error) {
      console.error('Error saving Hikvision device:', error);
      toast.error(`Failed to save device: ${(error as Error).message}`);
      return null;
    }
  }, [branchId, getDevices]);

  const deleteDevice = useCallback(async (deviceId: string) => {
    try {
      const { error } = await supabase
        .from('hikvision_devices')
        .delete()
        .eq('id', deviceId);
      
      if (error) throw error;
      
      toast.success('Device deleted successfully');
      
      // Refresh devices list
      getDevices();
      
      return true;
    } catch (error) {
      console.error('Error deleting Hikvision device:', error);
      toast.error(`Failed to delete device: ${(error as Error).message}`);
      return false;
    }
  }, [getDevices]);

  const testDevice = useCallback(async (device: HikvisionDevice) => {
    try {
      // Call the edge function to test device connectivity
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'testDevice',
          apiUrl: settings?.apiUrl,
          deviceId: device.deviceId,
          branchId
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Device test failed');
      }
      
      toast.success('Device connection successful');
      return true;
    } catch (error) {
      console.error('Error testing device connection:', error);
      toast.error(`Device test failed: ${(error as Error).message}`);
      return false;
    }
  }, [settings, branchId]);

  const getMemberAccess = useCallback(async (memberId: string) => {
    try {
      const { data, error } = await supabase
        .from('hikvision_access_privileges')
        .select(`
          id, 
          door_id, 
          privilege, 
          schedule, 
          status, 
          valid_start_time, 
          valid_end_time,
          access_doors(door_name, door_number)
        `)
        .eq('person_id', memberId);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching member access:', error);
      return [];
    }
  }, []);

  const syncMemberToDevice = useCallback(async (memberId: string, deviceId: string) => {
    if (!branchId || !settings?.isActive) {
      toast.error('Hikvision integration not active');
      return { success: false, message: 'Hikvision integration not active' };
    }
    
    try {
      // Get member data
      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('id', memberId)
        .single();
      
      if (memberError || !member) {
        throw new Error('Member not found');
      }
      
      // Call the edge function to register the member
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'registerPerson',
          apiUrl: settings.apiUrl,
          deviceId,
          personData: {
            id: member.id,
            name: member.name,
            gender: member.gender,
            phone: member.phone,
            email: member.email
          },
          branchId
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to sync member');
      }
      
      toast.success('Member synced successfully');
      return { success: true, personId: data.personId };
    } catch (error) {
      console.error('Error syncing member:', error);
      toast.error(`Failed to sync member: ${(error as Error).message}`);
      return { success: false, message: (error as Error).message };
    }
  }, [branchId, settings]);

  const assignAccessPrivileges = useCallback(async (
    personId: string, 
    doorId: string, 
    validStartTime?: string,
    validEndTime?: string
  ) => {
    if (!branchId || !settings?.isActive) {
      toast.error('Hikvision integration not active');
      return { success: false, message: 'Hikvision integration not active' };
    }
    
    try {
      // Get the device for this door
      const { data: doorData, error: doorError } = await supabase
        .from('access_doors')
        .select('device_id')
        .eq('id', doorId)
        .single();
      
      if (doorError || !doorData) {
        throw new Error('Door not found');
      }
      
      // Call the edge function to assign access privileges
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'assignAccessPrivileges',
          apiUrl: settings.apiUrl,
          deviceId: doorData.device_id,
          personData: { id: personId },
          doorList: [doorId],
          validStartTime,
          validEndTime,
          branchId
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to assign access privileges');
      }
      
      toast.success('Access privileges assigned successfully');
      return { success: true };
    } catch (error) {
      console.error('Error assigning access privileges:', error);
      toast.error(`Failed to assign access: ${(error as Error).message}`);
      return { success: false, message: (error as Error).message };
    }
  }, [branchId, settings]);

  useEffect(() => {
    if (branchId) {
      fetchSettings();
    }
  }, [branchId, fetchSettings]);

  return {
    isLoading,
    isSaving,
    isConnected,
    error,
    settings,
    devices,
    isLoadingDevices,
    availableSites,
    isLoadingSites,
    fetchSettings,
    saveSettings,
    testConnection,
    fetchAvailableSites,
    createSite,
    getDevices,
    saveDevice,
    deleteDevice,
    testDevice,
    getMemberAccess,
    syncMemberToDevice,
    assignAccessPrivileges
  };
}
