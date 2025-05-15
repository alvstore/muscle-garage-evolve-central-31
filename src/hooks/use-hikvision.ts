
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
        toast.error('No branch specified');
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
        toast.error('Failed to load Hikvision settings');
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
        toast.error('No branch specified');
        return false;
      }
      
      const { apiUrl, appKey, secretKey } = credentials;
      
      if (!apiUrl || !appKey || !secretKey) {
        toast.error('Missing required credential fields');
        return false;
      }
      
      // First test the connection
      const testResult = await testConnection(credentials, targetBranchId);
      
      if (!testResult.success) {
        toast.error(`Connection test failed: ${testResult.message}`);
        return false;
      }
      
      // Save to database
      const { error } = await supabase
        .from('hikvision_api_settings')
        .upsert({
          branch_id: targetBranchId,
          api_url: apiUrl,
          app_key: appKey,
          app_secret: secretKey,
          is_active: true,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }, {
          onConflict: 'branch_id'
        });
      
      if (error) {
        console.error('Error saving Hikvision settings:', error);
        toast.error('Failed to save settings');
        return false;
      }
      
      toast.success('Hikvision settings saved successfully');
      await fetchSettings(targetBranchId);
      return true;
    } catch (error: any) {
      console.error('Error in saveSettings:', error);
      toast.error('An unexpected error occurred');
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
      toast.error('No branch specified');
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
    getToken
  };
}
