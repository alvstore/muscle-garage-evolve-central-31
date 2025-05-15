
import { useState } from 'react';
import settingsService from '@/services/settingsService';

// Define the types we need
export interface HikvisionSettings {
  apiUrl: string;
  appKey: string;
  appSecret: string; 
  isActive: boolean;
  devices?: any[];
}

export interface HikvisionCredentials {
  apiUrl: string;
  appKey: string;
  secretKey: string;
}

export function useHikvision({ branchId }: { branchId?: string }) {
  const [settings, setSettings] = useState<HikvisionSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const fetchSettings = async (branch?: string) => {
    setIsLoading(true);
    try {
      const result = await settingsService.getHikvisionSettings(branch || branchId);
      if (result.data) {
        setSettings(result.data);
        return result.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching Hikvision settings:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (credentials: HikvisionCredentials, branch?: string, selectedSiteId?: string) => {
    setIsLoading(true);
    try {
      const result = await settingsService.saveHikvisionSettings({
        ...credentials,
        siteId: selectedSiteId || '',
        branchId: branch || branchId
      });
      
      if (result.success) {
        await fetchSettings(branch || branchId);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving Hikvision settings:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async (credentials: HikvisionCredentials) => {
    setIsLoading(true);
    try {
      const result = await settingsService.testHikvisionConnection(credentials);
      setIsConnected(result.success);
      return result;
    } catch (error) {
      console.error("Error testing Hikvision connection:", error);
      setIsConnected(false);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Connection test failed" 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableSites = async (branchId: string) => {
    setIsLoading(true);
    try {
      const result = await settingsService.getHikvisionSites(branchId);
      return result;
    } catch (error) {
      console.error("Error fetching available sites:", error);
      return { data: [], error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    settings,
    isLoading,
    isConnected,
    fetchSettings,
    saveSettings,
    testConnection,
    fetchAvailableSites
  };
}
