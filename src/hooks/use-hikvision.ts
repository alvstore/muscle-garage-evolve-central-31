
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { getHikvisionToken } from '@/services/hikvisionTokenService';
import { HikvisionCredentials } from '@/types/integrations';

interface UseHikvisionProps {
  branchId?: string;
}

interface HikvisionSettings {
  apiUrl: string;
  appKey: string;
  appSecret: string;
  devices: any[];
  isActive: boolean;
}

export function useHikvision({ branchId }: UseHikvisionProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [settings, setSettings] = useState<HikvisionSettings | null>(null);

  // Fetch the current settings
  const fetchSettings = useCallback(async (branch?: string): Promise<HikvisionSettings | null> => {
    try {
      setIsLoading(true);
      const targetBranchId = branch || branchId;
      
      if (!targetBranchId) {
        toast({
          title: "Error",
          description: 'No branch specified',
          variant: "destructive",
        });
        return null;
      }
      
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', targetBranchId)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching Hikvision settings:', error);
        toast({
          title: "Error",
          description: 'Failed to load Hikvision settings',
          variant: "destructive",
        });
        return null;
      }
      
      if (!data) {
        return null;
      }
      
      const formattedSettings = {
        apiUrl: data.api_url,
        appKey: data.app_key,
        appSecret: data.app_secret,
        devices: data.devices || [],
        isActive: data.is_active
      };
      
      setSettings(formattedSettings);
      return formattedSettings;
    } catch (error: any) {
      console.error('Error in fetchSettings:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [branchId]);

  // Save settings
  const saveSettings = async (credentials: HikvisionCredentials, branch?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const targetBranchId = branch || branchId;
      
      if (!targetBranchId) {
        toast({
          title: "Error",
          description: 'No branch specified',
          variant: "destructive",
        });
        return false;
      }
      
      const { apiUrl, appKey, secretKey } = credentials;
      
      if (!apiUrl || !appKey || !secretKey) {
        toast({
          title: "Error",
          description: 'Missing required credential fields',
          variant: "destructive",
        });
        return false;
      }
      
      // First check if the settings already exist
      const { data: existingSettings, error: checkError } = await supabase
        .from('hikvision_api_settings')
        .select('id, devices')
        .eq('branch_id', targetBranchId)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking existing Hikvision settings:', checkError);
      }
      
      // First test the connection
      const testResult = await testConnection(credentials, targetBranchId);
      
      if (!testResult.success) {
        toast({
          title: "Error",
          description: `Connection test failed: ${testResult.message}`,
          variant: "destructive",
        });
        return false;
      }
      
      // Prepare the data with any existing devices
      const devices = existingSettings?.devices || [];
      
      if (existingSettings) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('hikvision_api_settings')
          .update({
            api_url: apiUrl,
            app_key: appKey,
            app_secret: secretKey,
            is_active: true,
            devices: devices,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSettings.id);
          
        if (updateError) {
          console.error('Error updating Hikvision settings:', updateError);
          toast({
            title: "Error",
            description: 'Failed to save settings',
            variant: "destructive",
          });
          return false;
        }
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('hikvision_api_settings')
          .insert({
            branch_id: targetBranchId,
            api_url: apiUrl,
            app_key: appKey,
            app_secret: secretKey,
            is_active: true,
            devices: devices,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          });
          
        if (insertError) {
          console.error('Error saving Hikvision settings:', insertError);
          toast({
            title: "Error",
            description: 'Failed to save settings',
            variant: "destructive",
          });
          return false;
        }
      }
      
      toast({
        title: "Success",
        description: 'Hikvision settings saved successfully',
      });
      await fetchSettings(targetBranchId);
      return true;
    } catch (error: any) {
      console.error('Error in saveSettings:', error);
      toast({
        title: "Error",
        description: 'An unexpected error occurred',
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Add or update a device
  const addDevice = async (device: any, branch?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const targetBranchId = branch || branchId;
      
      if (!targetBranchId) {
        toast({
          title: "Error",
          description: 'No branch specified',
          variant: "destructive",
        });
        return false;
      }
      
      // Get current settings
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .select('id, devices')
        .eq('branch_id', targetBranchId)
        .single();
      
      if (error) {
        console.error('Error fetching Hikvision settings:', error);
        toast({
          title: "Error",
          description: 'Failed to load Hikvision settings',
          variant: "destructive",
        });
        return false;
      }
      
      // Update devices array
      const devices = data.devices || [];
      
      // Check if device already exists
      const deviceIndex = devices.findIndex((d: any) => 
        d.deviceId === device.deviceId || d.serialNumber === device.serialNumber
      );
      
      if (deviceIndex >= 0) {
        // Update existing device
        devices[deviceIndex] = { ...devices[deviceIndex], ...device, updatedAt: new Date().toISOString() };
      } else {
        // Add new device
        devices.push({
          ...device,
          id: crypto.randomUUID(),
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      // Save updated devices array
      const { error: updateError } = await supabase
        .from('hikvision_api_settings')
        .update({
          devices: devices,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);
      
      if (updateError) {
        console.error('Error updating devices:', updateError);
        toast({
          title: "Error",
          description: 'Failed to save device',
          variant: "destructive",
        });
        return false;
      }
      
      await fetchSettings(targetBranchId);
      toast({
        title: "Success",
        description: 'Device added successfully',
      });
      return true;
    } catch (error: any) {
      console.error('Error in addDevice:', error);
      toast({
        title: "Error",
        description: `Error adding device: ${error.message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove device
  const removeDevice = async (deviceId: string, branch?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const targetBranchId = branch || branchId;
      
      if (!targetBranchId) {
        toast({
          title: "Error",
          description: 'No branch specified',
          variant: "destructive",
        });
        return false;
      }
      
      // Get current settings
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .select('id, devices')
        .eq('branch_id', targetBranchId)
        .single();
      
      if (error) {
        console.error('Error fetching Hikvision settings:', error);
        toast({
          title: "Error",
          description: 'Failed to load Hikvision settings',
          variant: "destructive",
        });
        return false;
      }
      
      // Filter out the device to remove
      const devices = (data.devices || []).filter((d: any) => 
        d.id !== deviceId && d.deviceId !== deviceId && d.serialNumber !== deviceId
      );
      
      // Save updated devices array
      const { error: updateError } = await supabase
        .from('hikvision_api_settings')
        .update({
          devices: devices,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);
      
      if (updateError) {
        console.error('Error removing device:', updateError);
        toast({
          title: "Error",
          description: 'Failed to remove device',
          variant: "destructive",
        });
        return false;
      }
      
      await fetchSettings(targetBranchId);
      toast({
        title: "Success",
        description: 'Device removed successfully',
      });
      return true;
    } catch (error: any) {
      console.error('Error in removeDevice:', error);
      toast({
        title: "Error",
        description: `Error removing device: ${error.message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Test connection
  const testConnection = async (credentials: HikvisionCredentials, branch?: string): Promise<{ 
    success: boolean; 
    message: string;
  }> => {
    try {
      setIsLoading(true);
      const targetBranchId = branch || branchId;
      
      if (!targetBranchId) {
        return { success: false, message: 'No branch specified' };
      }
      
      const { apiUrl, appKey, secretKey } = credentials;
      
      if (!apiUrl || !appKey || !secretKey) {
        return { success: false, message: 'Missing required credential fields' };
      }
      
      // Call the edge function to test
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'token',
          apiUrl,
          appKey,
          secretKey
        }
      });
      
      if (error) {
        console.error('Error testing Hikvision connection:', error);
        setIsConnected(false);
        return { 
          success: false, 
          message: `Edge function error: ${error.message}` 
        };
      }
      
      console.log('Hikvision test response:', data);
      
      // Check if we received HTML instead of JSON
      if (data && typeof data === 'string' && data.includes('<!DOCTYPE html>')) {
        setIsConnected(false);
        return { 
          success: false, 
          message: 'Received HTML instead of JSON. Please check the API URL and credentials.' 
        };
      }
      
      // Check if the response data is HTML
      if (data && data.responseText && typeof data.responseText === 'string' && 
          data.responseText.includes('<!DOCTYPE html>')) {
        setIsConnected(false);
        return { 
          success: false, 
          message: 'Received HTML instead of JSON. Please check the API URL and credentials.' 
        };
      }
      
      if (!data || (data.code !== '0' && data.errorCode !== '0')) {
        const errorMsg = data?.msg || data?.message || 'Unknown error';
        setIsConnected(false);
        return { 
          success: false, 
          message: `API error: ${errorMsg}` 
        };
      }
      
      setIsConnected(true);
      return { 
        success: true, 
        message: 'Connection successful' 
      };
    } catch (error: any) {
      console.error('Error in testConnection:', error);
      setIsConnected(false);
      return { 
        success: false, 
        message: `Error: ${error.message}` 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Get a token
  const getToken = async (branch?: string): Promise<string | null> => {
    const targetBranchId = branch || branchId;
    if (!targetBranchId) {
      toast({
        title: "Error",
        description: 'No branch specified',
        variant: "destructive",
      });
      return null;
    }
    
    try {
      return await getHikvisionToken(targetBranchId);
    } catch (error) {
      console.error('Error getting Hikvision token:', error);
      return null;
    }
  };

  return {
    isLoading,
    isConnected,
    settings,
    fetchSettings,
    saveSettings,
    testConnection,
    getToken,
    addDevice,
    removeDevice
  };
}
