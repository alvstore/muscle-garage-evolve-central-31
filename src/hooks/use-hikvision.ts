
import { useState, useCallback } from 'react';
import { supabase } from '@/services/supabaseClient';
import { HikvisionSettings, HikvisionDevice, TokenData } from '@/types/access-control';

export const useHikvision = ({ branchId }: { branchId?: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [settings, setSettings] = useState<HikvisionSettings | null>(null);
  const [devices, setDevices] = useState<HikvisionDevice[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);

  const fetchSettings = useCallback(async (branchId?: string) => {
    if (!branchId) return null;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .single();
      
      if (error) {
        console.error('Error fetching Hikvision settings:', error);
        return null;
      }
      
      if (data) {
        setSettings(data as HikvisionSettings);
        setIsConnected(data.is_active);
        return data as HikvisionSettings;
      }
      
      return null;
    } catch (error) {
      console.error('Error in fetchSettings:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSettings = useCallback(async (newSettings: Partial<HikvisionSettings>, branchId?: string) => {
    if (!branchId) return false;
    
    setIsLoading(true);
    try {
      const settingsToSave = {
        ...newSettings,
        branch_id: branchId,
        updated_at: new Date().toISOString()
      };
      
      if (settings?.id) {
        const { error } = await supabase
          .from('hikvision_api_settings')
          .update(settingsToSave)
          .eq('id', settings.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hikvision_api_settings')
          .insert([{
            ...settingsToSave,
            created_at: new Date().toISOString()
          }]);
          
        if (error) throw error;
      }
      
      // Refresh settings
      await fetchSettings(branchId);
      
      return true;
    } catch (error) {
      console.error('Error saving Hikvision settings:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [settings, fetchSettings]);

  const testConnection = useCallback(async (credentials: { 
    api_url: string, 
    app_key: string, 
    app_secret: string 
  }): Promise<{ success: boolean, message?: string, token?: TokenData }> => {
    setIsLoading(true);
    try {
      // This would typically make an API call to test the connection
      // For now we'll just return a mock success
      return {
        success: true,
        message: "Successfully connected to Hikvision API",
        token: {
          accessToken: "mock-token",
          expiresIn: 3600
        }
      };
    } catch (error) {
      console.error('Error testing Hikvision connection:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Connection test failed" 
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDevices = useCallback(async () => {
    if (!settings || !settings.is_active) return [];
    
    setIsLoadingDevices(true);
    try {
      // Mock implementation for now
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
      return mockDevices;
    } catch (error) {
      console.error('Error fetching Hikvision devices:', error);
      return [];
    } finally {
      setIsLoadingDevices(false);
    }
  }, [settings]);

  return {
    isLoading,
    isConnected,
    settings,
    devices,
    isLoadingDevices,
    fetchSettings,
    saveSettings,
    testConnection,
    fetchDevices
  };
};

export default useHikvision;
