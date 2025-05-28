
// Hook for managing Hikvision settings
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

      if (error) throw error;

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
      
      // Simulate connection test
      console.log('Testing Hikvision connection with params:', params);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      return { success: true, message: 'Connection successful' };
    } catch (err) {
      console.error('Error testing connection:', err);
      setIsConnected(false);
      const message = err instanceof Error ? err.message : 'Connection failed';
      setError(message);
      return { success: false, message };
    }
  };

  const syncDevices = async () => {
    try {
      setIsSyncing(true);
      setError(null);
      
      // Simulate device sync
      console.log('Syncing Hikvision devices...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
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
        isActive: device.is_active,
        isCloudManaged: device.is_cloud_managed,
        useIsupFallback: device.use_isup_fallback,
        branchId: device.branch_id,
        doors: device.doors || [],
        ipAddress: device.ip_address,
        port: device.port,
        username: device.username,
        password: device.password,
        siteId: device.site_id,
        serialNumber: device.serial_number,
        location: device.location
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
      
      const deviceData = {
        name: device.name,
        device_id: device.deviceId,
        device_type: device.deviceType,
        is_active: device.isActive,
        is_cloud_managed: device.isCloudManaged,
        use_isup_fallback: device.useIsupFallback,
        branch_id: branchId,
        doors: device.doors || [],
        ip_address: device.ipAddress,
        port: device.port,
        username: device.username,
        password: device.password,
        site_id: device.siteId,
        serial_number: device.serialNumber,
        location: device.location,
        updated_at: new Date().toISOString()
      };

      if (device.id) {
        // Update existing device
        const { error } = await supabase
          .from('hikvision_devices')
          .update(deviceData)
          .eq('id', device.id);

        if (error) throw error;
      } else {
        // Create new device
        const { data, error } = await supabase
          .from('hikvision_devices')
          .insert([{ ...deviceData, created_at: new Date().toISOString() }])
          .select()
          .single();

        if (error) throw error;
      }

      // Refresh devices list
      await getDevices(branchId);
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
    } catch (err) {
      console.error('Error deleting device:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete device');
      throw err;
    }
  };

  // Test device connection
  const testDevice = async (deviceId: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // Simulate device test
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, message: 'Device connection successful' };
    } catch (err) {
      console.error('Error testing device:', err);
      return { 
        success: false, 
        message: err instanceof Error ? err.message : 'Device connection failed' 
      };
    }
  };

  // Fetch available sites
  const fetchAvailableSites = async (): Promise<void> => {
    try {
      if (!settings?.isActive) return;
      
      // Simulate fetching sites from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in a real app, this would come from the Hikvision API
      const mockSites = [
        { id: 'site1', name: 'Main Gym' },
        { id: 'site2', name: 'Swimming Pool' },
        { id: 'site3', name: 'Wellness Center' }
      ];
      
      setAvailableSites(mockSites);
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
