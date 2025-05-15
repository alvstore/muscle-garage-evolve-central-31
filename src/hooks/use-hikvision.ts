
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

// Add TokenData interface
export interface TokenData {
  accessToken: string;
  expiresAt: number;
  areaId?: string;
  siteId?: string;
  availableSites?: Array<{siteId: string, siteName: string}>;
  token?: string;
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

  // Add missing methods for HikvisionDevices
  const addDevice = async (deviceInfo: any) => {
    setIsLoading(true);
    try {
      // Mock implementation - in a real app, this would call an API endpoint
      console.log("Adding device:", deviceInfo);
      return { success: true };
    } catch (error) {
      console.error("Error adding device:", error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const removeDevice = async (deviceId: string) => {
    setIsLoading(true);
    try {
      // Mock implementation
      console.log("Removing device:", deviceId);
      return { success: true };
    } catch (error) {
      console.error("Error removing device:", error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const getToken = async () => {
    setIsLoading(true);
    try {
      // Mock implementation
      const token: TokenData = {
        accessToken: "mock-token",
        expiresAt: Date.now() + 3600000, // 1 hour from now
        siteId: "site-1",
        token: "mock-token",
        availableSites: [
          { siteId: "site-1", siteName: "Main Site" },
          { siteId: "site-2", siteName: "Secondary Site" }
        ]
      };
      return { success: true, token };
    } catch (error) {
      console.error("Error getting token:", error);
      return { success: false, error };
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
    fetchAvailableSites,
    addDevice,
    removeDevice,
    getToken
  };
}
