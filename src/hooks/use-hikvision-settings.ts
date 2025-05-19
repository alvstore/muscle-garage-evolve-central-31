
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  HikvisionSettings, 
  HikvisionDevice, 
  HikvisionPerson, 
  HikvisionSite, 
  HikvisionAccessPrivilege,
  HikvisionEvent,
  HikvisionDoor
} from '@/types/settings/hikvision-types';

type HikvisionApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
};

type HikvisionHookState = {
  isLoading: boolean;
  isSaving: boolean;
  isConnected: boolean | null;
  isLoadingDevices: boolean;
  isLoadingSites: boolean;
  error: Error | null;
  lastSync: string | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
};

export interface TestConnectionResult {
  success: boolean;
  message: string;
  errorCode?: string;
  data?: any;
}

export interface UseHikvisionSettingsReturn {
  // State
  settings: HikvisionSettings | null;
  devices: HikvisionDevice[];
  availableSites: HikvisionSite[];
  isLoading: boolean;
  isSaving: boolean;
  isSyncing: boolean;
  isConnected: boolean | null;
  isLoadingDevices: boolean;
  isLoadingSites: boolean;
  error: Error | null;
  lastSync: string | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  
  // Actions
  fetchSettings: () => Promise<HikvisionSettings | null>;
  saveSettings: (settings: Partial<HikvisionSettings>) => Promise<HikvisionSettings | null>;
  testConnection: (testSettings?: Partial<HikvisionSettings>) => Promise<TestConnectionResult>;
  fetchAvailableSites: () => Promise<HikvisionSite[]>;
  fetchDevices: () => Promise<HikvisionDevice[]>;
  syncDevices: () => Promise<boolean>;
  getDeviceStatus: (deviceId: string) => Promise<boolean>;
  getPersonAccess: (personId: string) => Promise<HikvisionAccessPrivilege[]>;
  getPersonEvents: (personId: string, limit?: number) => Promise<HikvisionEvent[]>;
}

export function useHikvisionSettings(branchId?: string): UseHikvisionSettingsReturn {
  // Main state
  const [settings, setSettings] = useState<HikvisionSettings | null>(null);
  const [devices, setDevices] = useState<HikvisionDevice[]>([]);
  const [availableSites, setAvailableSites] = useState<HikvisionSite[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [isLoadingSites, setIsLoadingSites] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  
  // Error state
  const [error, setError] = useState<Error | null>(null);
  
  // Reset states when branch changes
  useEffect(() => {
    if (branchId) {
      setSettings(null);
      setDevices([]);
      setAvailableSites([]);
      setIsConnected(null);
      setError(null);
      setSyncStatus('idle');
      fetchSettings();
    }
  }, [branchId]);

  const fetchSettings = useCallback(async (): Promise<HikvisionSettings | null> => {
    if (!branchId) {
      console.warn('No branch ID provided for fetchSettings');
      return null;
    }
    
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
      setLastSync(data?.last_sync || null);
      
      // If settings exist and active, fetch devices and sites
      if (data?.is_active) {
        await Promise.all([
          fetchDevices(),
          fetchAvailableSites()
        ]);
      }
      
      return settings;
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching Hikvision settings:', err);
      setError(err);
      toast.error(`Failed to load Hikvision settings: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [branchId]);

  const fetchDevices = useCallback(async (): Promise<HikvisionDevice[]> => {
    if (!branchId) {
      console.warn('No branch ID provided for fetchDevices');
      return [];
    }
    
    try {
      setIsLoadingDevices(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('hikvision_devices')
        .select('*')
        .eq('branch_id', branchId);
      
      if (error) throw error;
      
      const devices: HikvisionDevice[] = Array.isArray(data) ? data.map(device => ({
        id: device.id,
        deviceId: device.device_id || device.id,
        name: device.name || `Device ${device.device_id || device.id}`,
        serialNumber: device.serial_number,
        model: device.model,
        deviceType: device.device_type || 'entry',
        ipAddress: device.ip_address,
        port: device.port,
        username: device.username,
        password: device.password ? '••••••' : undefined,
        isActive: device.is_active !== false,
        isCloudManaged: device.is_cloud_managed === true,
        useIsupFallback: device.use_isup_fallback === true,
        lastOnline: device.last_online,
        lastSync: device.last_sync,
        location: device.location,
        branchId: device.branch_id || branchId,
        siteId: device.site_id,
        doors: Array.isArray(device.doors) ? device.doors.map((door: any) => ({
          id: door.id || '',
          doorNumber: door.door_number,
          doorName: door.door_name || `Door ${door.door_number || ''}`.trim(),
          deviceId: door.device_id
        })) : []
      })) : [];
      
      setDevices(devices);
      return devices;
      
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching Hikvision devices:', err);
      setError(err);
      toast.error(`Failed to fetch devices: ${err.message}`);
      return [];
    } finally {
      setIsLoadingDevices(false);
    }
  }, [branchId]);

  const syncDevices = useCallback(async (): Promise<boolean> => {
    if (!branchId || !settings) return false;
    
    try {
      setIsSyncing(true);
      setSyncStatus('syncing');
      setIsLoadingDevices(true);
      setError(null);
      
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'sync-devices',
          branchId,
          settings: {
            apiUrl: settings.apiUrl,
            appKey: settings.appKey,
            appSecret: settings.appSecret
          }
        }
      });
      
      if (error) throw error;
      
      // Update devices in state
      if (data?.devices) {
        setDevices(data.devices);
      }
      
      // Update last sync time
      const now = new Date().toISOString();
      setLastSync(now);
      
      // Update settings with last sync time
      await supabase
        .from('hikvision_api_settings')
        .update({ last_sync: now })
        .eq('branch_id', branchId);
      
      setSyncStatus('success');
      toast.success('Devices synchronized successfully');
      return true;
      
    } catch (error: any) {
      console.error('Error syncing devices:', error);
      setError(error);
      setSyncStatus('error');
      toast.error(`Failed to sync devices: ${error.message}`);
      throw error; // Re-throw to allow error handling in the component
    } finally {
      setIsSyncing(false);
      setIsLoadingDevices(false);
    }
  }, [branchId, settings, fetchDevices]);

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

  // Fetch available Hikvision sites
  const fetchAvailableSites = useCallback(async (): Promise<HikvisionSite[]> => {
    if (!branchId) {
      console.warn('No branch ID provided for fetchAvailableSites');
      return [];
    }
    
    if (!settings?.isActive) {
      console.warn('Hikvision integration is not active');
      return [];
    }
    
    try {
      setIsLoadingSites(true);
      setError(null);
      
      // Call the edge function to get sites
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'searchSites',
          apiUrl: settings.apiUrl,
          branchId,
          // Include auth details if needed for direct API calls
          ...(settings.appKey && settings.appSecret ? {
            appKey: settings.appKey,
            secretKey: settings.appSecret
          } : {})
        }
      });
      
      if (error) throw error;
      
      if (!data?.success) {
        throw new Error(data?.error || 'Failed to fetch sites');
      }
      
      const sites: HikvisionSite[] = Array.isArray(data.data) ? data.data.map((site: any) => ({
        siteId: site.siteId || '',
        siteName: site.siteName || 'Unnamed Site',
        parentSiteId: site.parentSiteId,
        desc: site.desc
      })) : [];
      
      setAvailableSites(sites);
      return sites;
      
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching Hikvision sites:', err);
      setError(err);
      toast.error(`Failed to fetch sites: ${err.message}`);
      return [];
    } finally {
      setIsLoadingSites(false);
    }
  }, [branchId, settings]);

  const testConnection = useCallback(async (testSettings?: Partial<HikvisionSettings>): Promise<TestConnectionResult> => {
    try {
      setIsSaving(true);
      setError(null);
      
      const settingsToTest = testSettings || settings;
      
      if (!settingsToTest) {
        const message = 'No settings to test';
        toast.error(message);
        return { success: false, message };
      }
      
      // Validate required fields
      const missingFields = [];
      if (!settingsToTest.apiUrl) missingFields.push('API URL');
      if (!settingsToTest.appKey) missingFields.push('App Key');
      if (!settingsToTest.appSecret) missingFields.push('App Secret');
      
      if (missingFields.length > 0) {
        const message = `Missing required fields: ${missingFields.join(', ')}`;
        toast.error(message);
        return { success: false, message };
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
        const message = `API Error: ${error.message}`;
        toast.error(message);
        return { success: false, message };
      }
      
      if (!data?.success) {
        setIsConnected(false);
        const message = data?.error || 'Connection test failed';
        toast.error(message);
        return { 
          success: false, 
          message,
          errorCode: data?.errorCode,
          data
        };
      }
      
      setIsConnected(true);
      toast.success('Successfully connected to Hikvision API');
      
      // If test was successful, fetch available sites and devices
      await Promise.all([
        fetchAvailableSites(),
        fetchDevices()
      ]);
      
      return {
        success: true,
        message: 'Successfully connected to Hikvision API',
        data
      };
      
    } catch (error) {
      const err = error as Error;
      console.error('Error in testConnection:', err);
      setIsConnected(false);
      setError(err);
      
      let message = `Error: ${err.message}`;
      if (message.includes('Failed to fetch')) {
        message = 'Failed to connect to the Hikvision API. Please check the API URL and your internet connection.';
      } else if (message.includes('401')) {
        message = 'Authentication failed. Please check your App Key and Secret Key.';
      }
      
      toast.error(message);
      return { success: false, message };
      
    } finally {
      setIsSaving(false);
    }
  }, [settings, branchId, fetchAvailableSites, fetchDevices]);
  
  useEffect(() => {
    if (branchId) {
      fetchSettings();
    }
  }, [branchId, fetchSettings]);

  // Return all state and actions
  return {
    // State
    settings,
    devices,
    availableSites,
    isLoading,
    isSaving,
    isSyncing,
    isConnected,
    isLoadingDevices,
    isLoadingSites,
    error,
    lastSync,
    syncStatus,
    
    // Actions
    fetchSettings,
    saveSettings,
    testConnection,
    fetchAvailableSites,
    fetchDevices,
    syncDevices,
    
    // Stub implementations for interface compliance
    getDeviceStatus: async () => false,
    getPersonAccess: async () => [],
    getPersonEvents: async () => []
  };
}
