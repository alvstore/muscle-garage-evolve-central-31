
import { useState, useEffect, useCallback } from 'react';
import { useHikvision, HikvisionDevice, HikvisionSettings } from './use-hikvision';
import { useBranch } from './use-branch';
import { toast } from 'sonner';

export interface HikvisionApiSettings {
  app_key: string;
  app_secret: string;
  api_url: string;
  branch_id: string;
  is_active: boolean;
  devices: HikvisionDevice[];
}

export function useHikvisionSettings() {
  const { currentBranch } = useBranch();
  const branchId = currentBranch?.id;
  
  const { 
    settings,
    isLoading,
    isConnected,
    fetchSettings,
    saveSettings,
    testConnection,
    addDevice,
    removeDevice,
  } = useHikvision({ branchId });
  
  const [devices, setDevices] = useState<HikvisionDevice[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  
  // Save settings
  const handleSaveSettings = useCallback(async (data: HikvisionApiSettings): Promise<boolean> => {
    try {
      setIsSaving(true);
      const result = await saveSettings({
        api_url: data.api_url,
        app_key: data.app_key,
        app_secret: data.app_secret,
        is_active: data.is_active,
        devices: data.devices || []
      }, data.branch_id);
      
      return result;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [saveSettings]);
  
  // Test connection
  const handleTestConnection = useCallback(async (credentials: HikvisionApiSettings) => {
    return testConnection({
      api_url: credentials.api_url,
      app_key: credentials.app_key,
      app_secret: credentials.app_secret
    });
  }, [testConnection]);
  
  // Fetch devices
  const fetchDevices = useCallback(async () => {
    try {
      setIsLoadingDevices(true);
      
      if (!settings) {
        await fetchSettings();
      }
      
      // For now, just use the devices from settings
      if (settings?.devices) {
        setDevices(settings.devices);
      }
      
      return settings?.devices || [];
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast.error('Failed to load devices');
      return [];
    } finally {
      setIsLoadingDevices(false);
    }
  }, [settings, fetchSettings]);
  
  // Initial load
  useEffect(() => {
    if (settings?.devices) {
      setDevices(settings.devices);
    }
  }, [settings]);
  
  return {
    settings,
    isLoading,
    isSaving,
    saveSettings: handleSaveSettings,
    testConnection: handleTestConnection,
    fetchDevices,
    isLoadingDevices,
    devices
  };
}
