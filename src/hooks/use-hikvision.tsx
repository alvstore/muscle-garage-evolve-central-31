
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/toast-manager';

interface HikvisionSettings {
  apiUrl: string;
  appKey: string;
  appSecret: string;
  isActive: boolean;
  devices?: any[];
}

interface HikvisionCredentials {
  apiUrl: string;
  appKey: string;
  secretKey: string;
}

interface ConnectionTestResult {
  success: boolean;
  message: string;
  errorCode?: string;
}

export function useHikvision({ branchId }: { branchId?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [settings, setSettings] = useState<HikvisionSettings | null>(null);
  const [availableSites, setAvailableSites] = useState<any[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!branchId) return null;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching Hikvision settings:', error);
        toast.error(`Error fetching settings: ${error.message}`);
        return null;
      }
      
      if (data) {
        setSettings({
          apiUrl: data.api_url,
          appKey: data.app_key,
          appSecret: data.app_secret,
          isActive: data.is_active,
          devices: data.devices
        });
        
        // Check if there's a token
        const { data: tokenData } = await supabase
          .from('hikvision_tokens')
          .select('*')
          .eq('branch_id', branchId)
          .maybeSingle();
        
        if (tokenData && tokenData.expire_time > Date.now()) {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
        
        return {
          apiUrl: data.api_url,
          appKey: data.app_key,
          appSecret: data.app_secret
        };
      }
      
      setSettings(null);
      setIsConnected(false);
      return null;
    } catch (error: any) {
      console.error('Error in fetchSettings:', error);
      toast.error(`Error: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [branchId]);
  
  useEffect(() => {
    if (branchId) {
      fetchSettings();
    }
  }, [branchId, fetchSettings]);
  
  const saveSettings = async (
    credentials: HikvisionCredentials, 
    branch: string = branchId || ''
  ) => {
    if (!branch) {
      toast.error('No branch selected');
      return false;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('hikvision_api_settings')
        .upsert({
          branch_id: branch,
          api_url: credentials.apiUrl,
          app_key: credentials.appKey,
          app_secret: credentials.secretKey,
          is_active: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'branch_id'
        });
      
      if (error) {
        console.error('Error saving Hikvision settings:', error);
        toast.error(`Error saving settings: ${error.message}`);
        return false;
      }
      
      // Test the connection with the new credentials
      const testResult = await testConnection(credentials);
      setIsConnected(testResult.success);
      
      setSettings({
        apiUrl: credentials.apiUrl,
        appKey: credentials.appKey,
        appSecret: credentials.secretKey,
        isActive: true
      });
      
      toast.success('Settings saved successfully');
      return true;
    } catch (error: any) {
      console.error('Error in saveSettings:', error);
      toast.error(`Error: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async (credentials: HikvisionCredentials): Promise<ConnectionTestResult> => {
    try {
      setIsLoading(true);
      
      // First, get a token
      const { data: response, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'token',
          apiUrl: credentials.apiUrl,
          appKey: credentials.appKey,
          secretKey: credentials.secretKey
        }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        setIsConnected(false);
        return { 
          success: false, 
          message: `Edge function error: ${error.message}` 
        };
      }
      
      if (response && (response.code === '0' || response.errorCode === '0') && response.data) {
        const { accessToken, expireTime, areaDomain } = response.data;
        
        if (branchId) {
          // Save token to database
          await supabase
            .from('hikvision_tokens')
            .upsert({
              branch_id: branchId,
              access_token: accessToken,
              expire_time: expireTime,
              area_domain: areaDomain,
              created_at: new Date().toISOString()
            }, {
              onConflict: 'branch_id'
            });
        }
        
        // Fetch available sites
        await fetchAvailableSites(credentials.apiUrl, accessToken);
        
        setIsConnected(true);
        return { 
          success: true, 
          message: 'Connected successfully' 
        };
      }
      
      setIsConnected(false);
      return { 
        success: false, 
        message: `API error: ${response?.msg || 'Failed to get token'}`,
        errorCode: response?.code || response?.errorCode
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

  const fetchAvailableSites = async (apiUrl: string, accessToken: string) => {
    try {
      const { data: response, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'site-search',
          apiUrl,
          accessToken
        }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        return;
      }
      
      if (response && response.success && response.sites) {
        setAvailableSites(response.sites);
        
        // Update the token record with available sites
        if (branchId) {
          await supabase
            .from('hikvision_tokens')
            .update({
              available_sites: response.sites
            })
            .eq('branch_id', branchId);
        }
      }
    } catch (error) {
      console.error('Error fetching available sites:', error);
    }
  };

  const registerMember = async (memberId: string, personData: any) => {
    if (!settings || !isConnected || !branchId) {
      toast.error('Hikvision not configured or connected');
      return { success: false, message: 'Not configured' };
    }
    
    try {
      setIsLoading(true);
      
      // Get the token
      const { data: tokenData, error: tokenError } = await supabase
        .from('hikvision_tokens')
        .select('access_token, expire_time')
        .eq('branch_id', branchId)
        .maybeSingle();
      
      if (tokenError || !tokenData || !tokenData.access_token || tokenData.expire_time < Date.now()) {
        console.error('Invalid or expired token');
        return { success: false, message: 'Invalid or expired token' };
      }
      
      // Register the person
      const { data: response, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'register-person',
          apiUrl: settings.apiUrl,
          accessToken: tokenData.access_token,
          personData,
          branchId
        }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        return { success: false, message: `Edge function error: ${error.message}` };
      }
      
      if (!response.success) {
        return { 
          success: false, 
          message: response.message || 'Failed to register member' 
        };
      }
      
      return {
        success: true,
        message: 'Member registered successfully',
        personId: response.personId
      };
    } catch (error: any) {
      console.error('Error registering member:', error);
      return { success: false, message: `Error: ${error.message}` };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isConnected,
    settings,
    fetchSettings,
    saveSettings,
    testConnection,
    registerMember,
    availableSites,
    selectedSiteId,
    setSelectedSiteId
  };
}
