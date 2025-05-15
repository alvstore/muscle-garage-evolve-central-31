
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { getHikvisionToken } from '@/services/hikvisionTokenService';
import { HikvisionCredentials } from '@/types/integrations';

interface UseHikvisionProps {
  branchId?: string;
}

export interface TokenData {
  token: string;
  siteId: string;
  availableSites: Array<{siteId: string, siteName: string}>;
}

interface HikvisionSettings {
  id?: string;
  branchId?: string;
  apiUrl: string;
  appKey: string;
  appSecret: string;
  devices: any[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
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
      
      // First check if we have a valid token for this branch
      const { data: tokenData, error: tokenError } = await supabase
        .from('hikvision_tokens')
        .select('*')
        .eq('branch_id', targetBranchId)
        .maybeSingle();
      
      if (!tokenError && tokenData) {
        const now = Date.now();
        // Check if token is valid (not expired)
        if (tokenData.expire_time > now) {
          console.log('Valid token found, expires in:', 
            Math.round((tokenData.expire_time - now) / (1000 * 60 * 60 * 24)), 'days');
          setIsConnected(true);
        } else {
          console.log('Token expired, connection status set to disconnected');
          setIsConnected(false);
        }
      } else {
        console.log('No token found, connection status set to disconnected');
        setIsConnected(false);
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
      
      if (data) {
        setSettings({
          id: data.id,
          branchId: data.branch_id,
          apiUrl: data.api_url,
          appKey: data.app_key,
          appSecret: data.app_secret,
          isActive: data.is_active,
          devices: data.devices || [],
          createdAt: data.created_at,
          updatedAt: data.updated_at
        });
        return {
          id: data.id,
          branchId: data.branch_id,
          apiUrl: data.api_url,
          appKey: data.app_key,
          appSecret: data.app_secret,
          isActive: data.is_active,
          devices: data.devices || [],
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
      }
      
      setSettings(null);
      return null;
    } catch (error: any) {
      console.error('Error in fetchSettings:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [branchId]);

  // Save settings
  const saveSettings = async (credentials: HikvisionCredentials, branch?: string, selectedSiteId?: string) => {
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
      
      // Get a token for the Hikvision API
      const getToken = async (branchId: string, forceRefresh: boolean = false): Promise<TokenData | null> => {
        try {
          // Check if we have a valid token in the database
          const { data: tokenData, error: tokenError } = await supabase
            .from('hikvision_tokens')
            .select('*')
            .eq('branch_id', branchId)
            .single();
          
          if (tokenError) {
            console.error('Error fetching token:', tokenError);
          }
          
          // If we have a valid token that hasn't expired and we're not forcing a refresh, return it
          if (!forceRefresh && tokenData && tokenData.expire_time) {
            const expireTime = new Date(tokenData.expire_time);
            const now = new Date();
            
            // Add a buffer of 1 hour to be safe
            const buffer = 60 * 60 * 1000; // 1 hour in milliseconds
            if (expireTime.getTime() - buffer > now.getTime()) {
              console.log('Using cached token');
              return {
                token: tokenData.access_token,
                siteId: tokenData.site_id || '',
                availableSites: tokenData.available_sites || []
              };
            } else {
              console.log('Token expired, getting new token');
            }
          } else if (forceRefresh) {
            console.log('Force refreshing token');
          }
          
          // If we don't have a valid token, get a new one
          const { data: settings, error: settingsError } = await supabase
            .from('hikvision_api_settings')
            .select('*')
            .eq('branch_id', branchId)
            .single();
          
          if (settingsError || !settings) {
            console.error('Error fetching settings:', settingsError);
            return null;
          }
          
          // Get a new token from the Hikvision API via Edge Function
          const { data: tokenResponse, error: tokenResponseError } = await supabase.functions.invoke('hikvision-proxy', {
            body: {
              action: 'get-token',
              appKey: settings.app_key,
              appSecret: settings.app_secret,
              branchId: branchId
            }
          });
          
          if (tokenResponseError || !tokenResponse || !tokenResponse.data?.accessToken) {
            console.error('Error getting token:', tokenResponseError || 'No token returned');
            return null;
          }
          
          // Get the token data from the response
          const accessToken = tokenResponse.data.accessToken;
          const expireTime = tokenResponse.data.expireTime;
          const areaDomain = tokenResponse.data.areaDomain;
          const availableSites = tokenResponse.availableSites || [];
          
          // Get the default site ID (first site in the list or empty string)
          const defaultSiteId = availableSites.length > 0 ? availableSites[0].siteId : '';
          
          // The token should already be saved in the database by the Edge Function
          // But we can check if we need to update the site_id
          if (!defaultSiteId) {
            const { data: tokenData } = await supabase
              .from('hikvision_tokens')
              .select('site_id')
              .eq('branch_id', branchId)
              .single();
            
            if (tokenData?.site_id) {
              return {
                token: accessToken,
                siteId: tokenData.site_id,
                availableSites
              };
            }
          }
          
          return {
            token: accessToken,
            siteId: defaultSiteId,
            availableSites
          };
        } catch (error) {
          console.error('Error in getToken:', error);
          return null;
        }
      };
      
      // Check if a site exists for the branch, create one if it doesn't
      const ensureSiteExists = async (branchId: string, siteName?: string) => {
        try {
          // Get the token
          const tokenResult = await getToken(branchId);
          if (!tokenResult || !tokenResult.token) {
            throw new Error("Failed to get access token");
          }
          
          const token = tokenResult.token;
          
          // Get the API settings
          const { data: apiSettings, error: settingsError } = await supabase
            .from('hikvision_api_settings')
            .select('*')
            .eq('branch_id', branchId)
            .single();
            
          if (settingsError) {
            console.error('Error fetching API settings:', settingsError);
            throw new Error("Failed to get API settings");
          }
          
          const settings = {
            apiUrl: apiSettings.api_url,
            appKey: apiSettings.app_key,
            appSecret: apiSettings.app_secret
          };
          
          // First check if we already have a site ID stored
          const { data: storedToken, error: tokenError } = await supabase
            .from('hikvision_tokens')
            .select('site_id')
            .eq('branch_id', branchId)
            .single();
          
          if (!tokenError && storedToken?.site_id) {
            return storedToken.site_id;
          }
          
          // Get branch name from branches table
          const { data: branchData, error: branchError } = await supabase
            .from('branches')
            .select('name')
            .eq('id', branchId)
            .single();
          
          let branchName = '';
          if (!branchError && branchData) {
            branchName = branchData.name || '';
          }
          
          // We need to create a site
          const siteNameToUse = siteName || branchName || `Branch ${branchId}`;
          
          // Create a site using the Edge Function
          const { data: siteResponse, error: siteError } = await supabase.functions.invoke('hikvision-proxy', {
            body: {
              action: 'create-site',
              apiUrl: settings.apiUrl || 'https://api.hik-partner.com',
              token,
              siteName: siteNameToUse
            }
          });
          
          if (siteError) {
            console.error('Error creating site:', siteError);
            throw new Error(`Failed to create site: ${siteError.message || 'Unknown error'}`);
          }
          
          if (!siteResponse || !siteResponse.success) {
            console.error('Site creation failed:', siteResponse);
            
            // Check if it's a token expiration error
            if (siteResponse?.errorCode === 'TOKEN_EXPIRED' || 
                (siteResponse?.rawResponse?.errorCode === 'LAP500004')) {
              console.log('Detected token expiration error:', siteResponse?.rawResponse);
              console.log('Token expired, refreshing and retrying...');
              
              // Force a new token by invalidating the cache
              console.log('Forcing token refresh for branch:', branchId);
              
              // First, clear the existing token from the database
              try {
                const { error: deleteError } = await supabase
                  .from('hikvision_tokens')
                  .delete()
                  .eq('branch_id', branchId);
                
                if (deleteError) {
                  console.error('Error deleting old token:', deleteError);
                }
              } catch (deleteError) {
                console.error('Exception deleting old token:', deleteError);
              }
              
              // Get the API settings directly
              const { data: apiSettings, error: settingsError } = await supabase
                .from('hikvision_api_settings')
                .select('*')
                .eq('branch_id', branchId)
                .single();
                
              if (settingsError || !apiSettings) {
                console.error('Error fetching API settings for token refresh:', settingsError);
                throw new Error('Failed to get API settings for token refresh');
              }
              
              // Get a new token directly from the API via Edge Function
              console.log('Getting fresh token from API');
              const { data: tokenResponse, error: tokenResponseError } = await supabase.functions.invoke('hikvision-proxy', {
                body: {
                  action: 'get-token',
                  appKey: apiSettings.app_key,
                  appSecret: apiSettings.app_secret,
                  branchId: branchId,
                  apiUrl: apiSettings.api_url
                }
              });
              
              if (tokenResponseError || !tokenResponse || !tokenResponse.data?.accessToken) {
                console.error('Error getting fresh token:', tokenResponseError || 'No token returned');
                throw new Error('Failed to get fresh token from API');
              }
              
              // Get the token data
              const accessToken = tokenResponse.data.accessToken;
              
              // Construct a TokenData object
              const newToken = {
                token: accessToken,
                siteId: '',
                availableSites: tokenResponse.availableSites || []
              };
              
              if (!newToken.token) {
                throw new Error('Failed to refresh token');
              }
              
              console.log('Successfully refreshed token');
              
              // Retry site creation with new token
              console.log('Retrying site creation with new token');
              
              // Make sure we're using the token string, not the TokenData object
              const tokenString = newToken.token;
              
              // Log the token being used (first few characters only for security)
              console.log('Using token for retry:', tokenString.substring(0, 10) + '...');
              
              const { data: retrySiteResponse, error: retrySiteError } = await supabase.functions.invoke('hikvision-proxy', {
                body: {
                  action: 'create-site',
                  apiUrl: apiSettings.api_url || 'https://api.hik-partner.com',
                  token: tokenString,
                  siteName: siteNameToUse
                }
              });
              
              console.log('Retry response:', retrySiteResponse);
              
              if (retrySiteError || !retrySiteResponse?.success) {
                console.error('Site creation retry failed:', retrySiteResponse || retrySiteError);
                throw new Error(retrySiteResponse?.message || retrySiteError?.message || 'Failed to create site after token refresh');
              }
              
              if (retrySiteResponse.success && retrySiteResponse.siteId) {
                return retrySiteResponse.siteId;
              }
            }
            
            throw new Error(siteResponse?.message || 'Failed to create site');
          }
          
          if (!siteResponse.siteId) {
            console.error('No site ID returned:', siteResponse);
            throw new Error('No site ID returned from site creation');
          }
          
          // Save the site ID to the settings
          const { error: updateError } = await supabase
            .from('hikvision_api_settings')
            .update({ site_id: siteResponse.siteId })
            .eq('branch_id', branchId);
          
          if (updateError) {
            console.error('Error saving site ID:', updateError);
          }
          
          return siteResponse.siteId;
        } catch (error) {
          console.error('Error in ensureSiteExists:', error);
          return null;
        }
      };
      
      // Check if a device is already added to the site
      const checkDeviceExists = async (branchId: string, deviceId: string) => {
        try {
          const token = await getToken(branchId);
          if (!token) {
            throw new Error("Failed to get access token");
          }
          
          // Get the site ID
          const siteId = await ensureSiteExists(branchId);
          if (!siteId) {
            throw new Error("Failed to get or create site");
          }
          
          // Check if the device exists in the site
          const { data: deviceResponse, error: deviceError } = await supabase.functions.invoke('hikvision-proxy', {
            body: {
              action: 'check-device',
              token,
              siteId,
              deviceId
            }
          });
          
          if (deviceError) {
            console.error('Error checking device:', deviceError);
            return false;
          }
          
          return deviceResponse?.exists || false;
        } catch (error) {
          console.error('Error in checkDeviceExists:', error);
          return false;
        }
      };
      
      // Get a token for the Hikvision API
      const token = await getToken(targetBranchId);
      
      if (!token) {
        console.error('Failed to get token');
        return false;
      }
      
      // If a site ID was selected, use it directly
      let siteId: string | null = null;
      
      if (selectedSiteId) {
        console.log('Using selected site ID:', selectedSiteId);
        siteId = selectedSiteId;
        
        // Save the selected site ID to the hikvision_tokens table
        const { error: updateTokenError } = await supabase
          .from('hikvision_tokens')
          .update({ site_id: selectedSiteId })
          .eq('branch_id', targetBranchId);
        
        if (updateTokenError) {
          console.error('Error updating site ID in tokens table:', updateTokenError);
          // Continue anyway since we have the site ID
        }
      } else {
        // No site ID was selected, so ensure one exists or create a new one
        siteId = await ensureSiteExists(targetBranchId);
        
        if (!siteId) {
          console.error('Failed to get or create site');
          return false;
        }
      }
      
      // Prepare the data with any existing devices
      const devices = existingSettings?.devices || [];
      
      if (existingSettings) {
        try {
          // Update existing record
          const { error: updateError } = await supabase
            .from('hikvision_api_settings')
            .update({
              api_url: credentials.apiUrl,
              app_key: credentials.appKey,
              app_secret: credentials.secretKey,
              is_active: true,
              devices: existingSettings.devices || [],
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
            setIsLoading(false);
            return false;
          }
        } catch (updateError: any) {
          console.error('Error updating Hikvision settings:', updateError);
          toast({
            title: "Error",
            description: `Failed to save settings: ${updateError.message || 'Unknown error'}`,
            variant: "destructive",
          });
          setIsLoading(false);
          return false;
        }
      } else {
        // Create new record
        try {
        const { error: insertError } = await supabase
          .from('hikvision_api_settings')
          .insert({
            branch_id: targetBranchId,
            api_url: credentials.apiUrl,
            app_key: credentials.appKey,
            app_secret: credentials.secretKey,
            is_active: true,
            devices: [],
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
            setIsLoading(false);
            return false;
          }
        } catch (insertError: any) {
          console.error('Error saving Hikvision settings:', insertError);
          toast({
            title: "Error",
            description: `Failed to save settings: ${insertError.message || 'Unknown error'}`,
            variant: "destructive",
          });
          setIsLoading(false);
          return false;
        }
      }
      
      toast({
        title: "Success",
        description: 'Hikvision settings saved successfully',
      });
      await fetchSettings(targetBranchId);
      setIsLoading(false);
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
      
      // Normalize device properties to ensure consistent naming
      const normalizedDevice = {
        // Required fields
        device_id: device.deviceId || device.serialNumber,
        device_name: device.deviceName,
        device_type: device.deviceType,
        
        // Protocol information (standardized naming)
        is_cloud_managed: device.isCloudManaged === true,
        use_isup_fallback: device.useIsupFallback === true,
        
        // Optional fields
        location: device.location,
        ip_address: device.ipAddress,
        port: device.port,
        username: device.username,
        password: device.password,
        
        // Status fields
        is_active: true,
        sync_status: 'pending',
      };
      
      // Check if device already exists
      const deviceIndex = devices.findIndex((d: any) => 
        d.device_id === normalizedDevice.device_id || 
        d.serialNumber === device.serialNumber
      );
      
      if (deviceIndex >= 0) {
        // Update existing device
        devices[deviceIndex] = { 
          ...devices[deviceIndex], 
          ...normalizedDevice, 
          updated_at: new Date().toISOString() 
        };
      } else {
        // Add new device
        devices.push({
          ...normalizedDevice,
          id: crypto.randomUUID(),
          added_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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
      
      console.log('Testing connection with credentials:', {
        apiUrl,
        appKeyLength: appKey?.length || 0,
        secretKeyLength: secretKey?.length || 0
      });
      
      // Call the edge function to test
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'token',
          apiUrl: apiUrl || 'https://api.hik-partner.com',
          appKey,
          secretKey,
          branchId: targetBranchId,
          isTestConnection: true // Flag to indicate this is a test connection
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
      
      // Save the token to the database when testing connection
      if (data && data.data && (data.code === '0' || data.errorCode === '0')) {
        const { accessToken, expireTime, areaDomain } = data.data;
        
        // First check if a token exists for this branch
        const { data: existingToken, error: checkError } = await supabase
          .from('hikvision_tokens')
          .select('id')
          .eq('branch_id', targetBranchId)
          .maybeSingle();
        
        let saveTokenError;
        
        if (existingToken) {
          // Update existing token
          const { error } = await supabase
            .from('hikvision_tokens')
            .update({
              access_token: accessToken,
              expire_time: expireTime,
              area_domain: areaDomain,
              created_at: new Date().toISOString()
            })
            .eq('id', existingToken.id);
          
          saveTokenError = error;
        } else {
          // Insert new token
          const { error } = await supabase
            .from('hikvision_tokens')
            .insert({
              branch_id: targetBranchId,
              access_token: accessToken,
              expire_time: expireTime,
              area_domain: areaDomain,
              created_at: new Date().toISOString()
            });
          
          saveTokenError = error;
        }
        
        if (saveTokenError) {
          console.error('Error saving token to database during test:', saveTokenError);
          // We still consider the test successful even if token saving fails
        } else {
          console.log('Token successfully saved to database during test');
        }
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

  // Fetch available sites from Hikvision API
  const fetchAvailableSites = async (branchId: string): Promise<Array<{siteId: string, siteName: string}>> => {
    try {
      // Get the API settings
      const { data: apiSettings, error: settingsError } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .single();
        
      if (settingsError) {
        console.error('Error fetching API settings:', settingsError);
        return [];
      }
      
      // Get a new token from the Hikvision API via Edge Function
      const { data: tokenResponse, error: tokenResponseError } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'get-token',
          appKey: apiSettings.app_key,
          appSecret: apiSettings.app_secret,
          branchId: branchId
        }
      });
      
      if (tokenResponseError || !tokenResponse) {
        console.error('Error getting token for sites:', tokenResponseError || 'No token returned');
        return [];
      }
      
      // Return available sites from token response
      return tokenResponse.availableSites || [];
    } catch (error) {
      console.error('Error fetching available sites:', error);
      return [];
    }
  };

  return {
    settings,
    isLoading,
    fetchSettings,
    saveSettings,
    testConnection,
    getToken,
    addDevice,
    removeDevice,
    fetchAvailableSites
  };
}
