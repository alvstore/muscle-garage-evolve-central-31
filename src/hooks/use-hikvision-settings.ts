
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabaseClient';
import { HikvisionSettings, HikvisionDevice, TokenData } from '@/types/access-control';

export type HikvisionApiSettings = HikvisionSettings;

export const useHikvisionSettings = () => {
  const [settings, setSettings] = useState<HikvisionApiSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [devices, setDevices] = useState<HikvisionDevice[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);

  // Load settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('hikvision_api_settings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;
        if (data && data.length > 0) {
          setSettings(data[0] as HikvisionApiSettings);
        }
      } catch (error) {
        console.error('Error loading Hikvision settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const saveSettings = useCallback(async (updatedSettings: HikvisionApiSettings) => {
    setIsSaving(true);
    try {
      if (settings?.id) {
        // Update
        const { error } = await supabase
          .from('hikvision_api_settings')
          .update({
            app_key: updatedSettings.app_key,
            app_secret: updatedSettings.app_secret,
            api_url: updatedSettings.api_url,
            is_active: updatedSettings.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // Insert
        const { data, error } = await supabase
          .from('hikvision_api_settings')
          .insert([{
            app_key: updatedSettings.app_key,
            app_secret: updatedSettings.app_secret,
            api_url: updatedSettings.api_url,
            is_active: updatedSettings.is_active,
            branch_id: updatedSettings.branch_id,
            devices: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select();

        if (error) throw error;
        if (data) setSettings(data[0] as HikvisionApiSettings);
      }
      return true;
    } catch (error) {
      console.error('Error saving Hikvision settings:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [settings]);

  const testConnection = useCallback(async (credentials: {
    api_url: string;
    app_key: string;
    app_secret: string;
  }): Promise<{ success: boolean; message?: string; token?: TokenData }> => {
    try {
      // Implement API call to test connection
      // This is a mock implementation
      return { 
        success: true,
        message: "Connection successful",
        token: {
          accessToken: "mock-token",
          expiresIn: 3600
        }
      };
    } catch (error) {
      return { 
        success: false,
        message: error instanceof Error ? error.message : "Connection failed"
      };
    }
  }, []);

  const fetchDevices = useCallback(async () => {
    if (!settings?.is_active) return;
    
    setIsLoadingDevices(true);
    try {
      // Mock implementation - would typically call an API
      const mockDevices: HikvisionDevice[] = [
        {
          serialNumber: "DS-K1T671M20210428AACH10243990210",
          name: "Main Entrance",
          deviceName: "Face Recognition Terminal",
          deviceType: "DS-K1T671M",
          isOnline: true,
          isCloudManaged: true,
          doorCount: 1,
          doors: [
            { doorNo: 1, doorName: "Main Door", doorStatus: "closed" }
          ]
        },
        {
          serialNumber: "DS-K1T671M20200317BBCJ21874605728",
          name: "Staff Entrance",
          deviceName: "Fingerprint Terminal",
          deviceType: "DS-K1T341AMF",
          isOnline: false,
          isCloudManaged: true,
          doorCount: 1,
          doors: [
            { doorNo: 1, doorName: "Staff Door", doorStatus: "unknown" }
          ]
        }
      ];
      
      setDevices(mockDevices);
      
      // In a real implementation, we'd also update the settings in the database
      if (settings?.id) {
        await supabase
          .from('hikvision_api_settings')
          .update({ devices: mockDevices })
          .eq('id', settings.id);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setIsLoadingDevices(false);
    }
  }, [settings]);

  return {
    settings,
    isLoading,
    isSaving,
    saveSettings,
    testConnection,
    fetchDevices,
    isLoadingDevices,
    devices
  };
};

export default useHikvisionSettings;
