
import { useState, useEffect } from 'react';
import { useBranch } from './use-branch';
import { hikvisionService, HikvisionApiSettings, HikvisionDevice } from '@/services/hikvisionService';
import { toast } from 'sonner';

export const useHikvisionSettings = () => {
  const [settings, setSettings] = useState<HikvisionApiSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [devices, setDevices] = useState<HikvisionDevice[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const { currentBranch } = useBranch();

  const fetchSettings = async () => {
    if (!currentBranch?.id) return;
    
    setIsLoading(true);
    try {
      const data = await hikvisionService.getSettings(currentBranch.id);
      setSettings(data);
    } catch (err: any) {
      setError(err);
      toast.error('Failed to load Hikvision settings');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (updatedSettings: HikvisionApiSettings): Promise<boolean> => {
    setIsSaving(true);
    try {
      // Make sure branch_id is set
      const settingsToSave = {
        ...updatedSettings,
        branch_id: currentBranch?.id as string
      };
      
      const result = await hikvisionService.saveSettings(settingsToSave);
      if (result) {
        setSettings(result);
        toast.success('Hikvision settings saved successfully');
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err);
      toast.error('Failed to save Hikvision settings');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async (settingsToTest?: HikvisionApiSettings): Promise<boolean> => {
    try {
      const settingsData = settingsToTest || settings;
      if (!settingsData) return false;
      
      const success = await hikvisionService.testConnection(settingsData);
      if (success) {
        toast.success('Successfully connected to Hikvision API');
      } else {
        toast.error('Failed to connect to Hikvision API');
      }
      return success;
    } catch (error) {
      toast.error('Connection test failed');
      return false;
    }
  };

  const fetchDevices = async () => {
    if (!settings || !settings.is_active) return;
    
    setIsLoadingDevices(true);
    try {
      const devicesList = await hikvisionService.getDevices(settings);
      setDevices(devicesList);
    } catch (err) {
      console.error('Error fetching devices:', err);
      toast.error('Failed to load devices');
    } finally {
      setIsLoadingDevices(false);
    }
  };

  // Add a device to the Hikvision system
  const addDevice = async (deviceName: string, deviceSerial: string, siteId: string): Promise<boolean> => {
    if (!settings) return false;
    
    try {
      await hikvisionService.addDevice(settings, {
        deviceName,
        deviceSerial,
        siteId
      });
      
      // Refresh devices list after adding
      await fetchDevices();
      toast.success('Device added successfully');
      return true;
    } catch (error) {
      console.error('Error adding device:', error);
      toast.error('Failed to add device');
      return false;
    }
  };

  useEffect(() => {
    if (currentBranch?.id) {
      fetchSettings();
    }
  }, [currentBranch?.id]);

  useEffect(() => {
    if (settings?.is_active) {
      fetchDevices();
    }
  }, [settings?.is_active]);

  return {
    settings,
    isLoading,
    error,
    isSaving,
    devices,
    isLoadingDevices,
    fetchSettings,
    saveSettings,
    testConnection,
    fetchDevices,
    addDevice
  };
};
