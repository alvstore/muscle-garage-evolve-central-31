// Hook for managing Hikvision settings
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { hikvisionService } from '@/services/integrations/hikvisionService';
import { toast } from 'sonner';

interface HikvisionSettings {
  id?: string;
  apiUrl: string;
  appKey: string;
  appSecret: string;
  isActive: boolean;
  branchId: string;
  syncInterval?: number;
  lastSync?: string;
}

interface TestConnectionParams {
  apiUrl: string;
  appKey: string;
  appSecret?: string;
  isActive: boolean;
}

interface HikvisionDevice {
  id: string;
  deviceId: string;
  name: string;
  deviceType: string;
  isActive: boolean;
  isCloudManaged: boolean;
  useIsupFallback: boolean;
  branchId: string;
  doors: any[];
  ipAddress?: string;
  port?: number;
  username?: string;
  password?: string;
  siteId?: string;
  serialNumber?: string;
  location?: string;
}

interface UseHikvisionSettingsReturn {
  settings: HikvisionSettings | null;
  devices: HikvisionDevice[];
  isLoading: boolean;
  isSaving: boolean;
  isConnected: boolean;
  isSyncing: boolean;
  lastSync: string | null;
  error: string | null;
  saveSettings: (settings: Partial<HikvisionSettings>) => Promise<void>;
  testConnection: (params: TestConnectionParams) => Promise<{ success: boolean; message?: string }>;
  syncDevices: () => Promise<void>;
  getDevices: (branchId: string) => Promise<HikvisionDevice[]>;
  saveDevice: (device: Partial<HikvisionDevice>) => Promise<void>;
  deleteDevice: (deviceId: string) => Promise<void>;
  testDevice: (deviceId: string) => Promise<{ success: boolean; message?: string }>;
  availableSites: any[];
  fetchAvailableSites: () => Promise<void>;
}

export const useHikvisionSettings = (branchId: string): UseHikvisionSettingsReturn => {
  const [settings, setSettings] = useState<HikvisionSettings | null>(null);
  const [devices, setDevices] = useState<HikvisionDevice[]>([]);
  const [availableSites, setAvailableSites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (branchId) {
      fetchSettings();
    }
  }, [branchId]);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setSettings({
          id: data.id,
          apiUrl: data.api_url,
          appKey: data.app_key,
          appSecret: data.app_secret,
          isActive: data.is_active,
          branchId: data.branch_id,
          syncInterval: data.sync_interval,
          lastSync: data.last_sync
        });
        setLastSync(data.last_sync);
        setIsConnected(data.is_active);
        
        // Load devices if settings exist
        if (data.is_active) {
          await getDevices(branchId);
        }
      }
    } catch (err) {
      console.error('Error fetching Hikvision settings:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: Partial<HikvisionSettings>) => {
    try {
      setIsSaving(true);
      setError(null);

      const settingsData = {
        api_url: newSettings.apiUrl,
        app_key: newSettings.appKey,
        app_secret: newSettings.appSecret,
        is_active: newSettings.isActive,
        branch_id: branchId,
        sync_interval: newSettings.syncInterval,
        updated_at: new Date().toISOString()
      };

      if (settings?.id) {
        const { error } = await supabase
          .from('hikvision_api_settings')
          .update(settingsData)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('hikvision_api_settings')
          .insert([{ ...settingsData, created_at: new Date().toISOString() }])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setSettings(prev => ({ ...prev, id: data.id } as HikvisionSettings));
        }
      }

      await fetchSettings();
      setIsConnected(newSettings.isActive || false);
    } catch (err) {
      console.error('Error saving Hikvision settings:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async (params: TestConnectionParams) => {
    try {
      setError(null);
      
      // Test by requesting a token
      const { data, error } = await supabase.functions.invoke('hikvision-auth', {
        body: { branchId, forceRefresh: true }
      });

      if (error) {
        setIsConnected(false);
        const message = error.message || 'Connection test failed';
        setError(message);
        return { success: false, message };
      }

      if (!data.success) {
        setIsConnected(false);
        const message = data.error || 'Authentication failed';
        setError(message);
        return { success: false, message };
      }

      setIsConnected(true);
      return { success: true, message: 'Successfully connected to Hikvision API' };
    } catch (err) {
      console.error('Error testing connection:', err);
      setIsConnected(false);
      const message = err instanceof Error ? err.message : 'Connection test failed';
      setError(message);
      return { success: false, message };
    }
  };

  const syncDevices = async () => {
    try {
      setIsSyncing(true);
      setError(null);
      
      // Fetch and process events
      const fetchResult = await hikvisionService.fetchEvents(branchId);
      if (!fetchResult.success) {
        throw new Error(fetchResult.error);
      }

      const processResult = await hikvisionService.processEvents(branchId);
      if (!processResult.success) {
        throw new Error(processResult.error);
      }
      
      const now = new Date().toISOString();
      setLastSync(now);
      
      if (settings?.id) {
        await supabase
          .from('hikvision_api_settings')
          .update({ last_sync: now })
          .eq('id', settings.id);
      }
    } catch (err) {
      console.error('Error syncing devices:', err);
      setError(err instanceof Error ? err.message : 'Sync failed');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  // Fetch devices for a branch
  const getDevices = async (branchId: string): Promise<HikvisionDevice[]> => {
    try {
      const { data, error } = await supabase
        .from('hikvision_devices')
        .select('*')
        .eq('branch_id', branchId);

      if (error) throw error;
      
      const formattedDevices = data.map(device => ({
        id: device.id,
        deviceId: device.device_id,
        name: device.name,
        deviceType: device.device_type,
        isActive: device.status === 'active',
        isCloudManaged: true,
        useIsupFallback: false,
        branchId: device.branch_id,
        doors: [],
        ipAddress: device.ip_address,
        port: device.port,
        username: device.username,
        password: device.password,
        serialNumber: device.serial_number,
        location: device.location || ''
      }));
      
      setDevices(formattedDevices);
      return formattedDevices;
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch devices');
      throw err;
    }
  };

  // Save a device
  const saveDevice = async (device: Partial<HikvisionDevice>): Promise<void> => {
    try {
      setIsSaving(true);
      
      const result = await hikvisionService.addDevice(device, branchId);
      if (!result.success) {
        throw new Error(result.error);
      }

      // Refresh devices list
      await getDevices(branchId);
      toast.success('Device added successfully');
    } catch (err) {
      console.error('Error saving device:', err);
      setError(err instanceof Error ? err.message : 'Failed to save device');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a device
  const deleteDevice = async (deviceId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('hikvision_devices')
        .delete()
        .eq('id', deviceId);

      if (error) throw error;

      // Refresh devices list
      await getDevices(branchId);
      toast.success('Device deleted successfully');
    } catch (err) {
      console.error('Error deleting device:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete device');
      throw err;
    }
  };

  // Test device connection
  const testDevice = async (deviceId: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // Get device details
      const { data: device } = await supabase
        .from('hikvision_devices')
        .select('*')
        .eq('id', deviceId)
        .single();

      if (!device) {
        return { success: false, message: 'Device not found' };
      }

      // Test device connection through proxy
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          branchId,
          endpoint: '/api/hpcgw/v1/device/list',
          method: 'POST',
          data: {
            deviceIds: [device.device_id]
          }
        }
      });

      if (error || !data.success) {
        return { success: false, message: data?.error || 'Device connection test failed' };
      }

      return { success: true, message: 'Device connection successful' };
    } catch (err) {
      console.error('Error testing device:', err);
      return { 
        success: false, 
        message: err instanceof Error ? err.message : 'Device connection test failed' 
      };
    }
  };

  // Fetch available sites
  const fetchAvailableSites = async (): Promise<void> => {
    try {
      if (!settings?.isActive) return;
      
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          branchId,
          endpoint: '/api/hpcgw/v1/site/search',
          method: 'POST',
          data: {}
        }
      });

      if (error || !data.success) {
        console.error('Failed to fetch sites:', data?.error || error?.message);
        return;
      }

      setAvailableSites(data.data.sites || []);
    } catch (err) {
      console.error('Error fetching sites:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sites');
    }
  };

  return {
    settings,
    devices,
    availableSites,
    isLoading,
    isSaving,
    isConnected,
    isSyncing,
    lastSync,
    error,
    saveSettings,
    testConnection,
    syncDevices,
    getDevices,
    saveDevice,
    deleteDevice,
    testDevice,
    fetchAvailableSites
  };
};
