
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { hikvisionService } from '@/services/classes/integrations/hikvisionService';
import { hikvisionTokenManager } from '@/services/hikvision/tokenManager';
import { toast } from 'sonner';

interface HikvisionSettings {
  apiUrl: string;
  appKey: string;
  appSecret: string;
  isActive: boolean;
  siteId?: string;
  siteName?: string;
  syncInterval?: number;
  lastSync?: string;
}

export const useHikvisionSettings = (branchId: string) => {
  const [settings, setSettings] = useState<HikvisionSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (branchId) {
      loadSettings();
    }
  }, [branchId]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .eq('is_active', true)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data) {
        const settingsData: HikvisionSettings = {
          apiUrl: data.api_url,
          appKey: data.app_key,
          appSecret: data.app_secret,
          isActive: data.is_active,
          siteId: data.site_id,
          siteName: data.site_name,
          syncInterval: data.sync_interval,
          lastSync: data.last_sync
        };
        
        setSettings(settingsData);
        setLastSync(data.last_sync);

        // Check connection status if settings exist
        if (data.is_active) {
          await checkConnectionStatus();
        }
      } else {
        setSettings({
          apiUrl: '',
          appKey: '',
          appSecret: '',
          isActive: false
        });
      }
    } catch (error) {
      console.error('Error loading Hikvision settings:', error);
      setError(error instanceof Error ? error.message : 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      const status = await hikvisionTokenManager.getTokenStatus(branchId);
      setIsConnected(status.isValid);
    } catch (error) {
      console.error('Error checking connection status:', error);
      setIsConnected(false);
    }
  };

  const saveSettings = async (newSettings: Partial<HikvisionSettings>) => {
    try {
      setIsSaving(true);
      setError(null);

      const { error: saveError } = await supabase
        .from('hikvision_api_settings')
        .upsert({
          branch_id: branchId,
          api_url: newSettings.apiUrl || settings?.apiUrl || '',
          app_key: newSettings.appKey || settings?.appKey || '',
          app_secret: newSettings.appSecret || settings?.appSecret || '',
          is_active: newSettings.isActive ?? settings?.isActive ?? false,
          site_id: newSettings.siteId || settings?.siteId,
          site_name: newSettings.siteName || settings?.siteName,
          sync_interval: newSettings.syncInterval || settings?.syncInterval || 60,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'branch_id'
        });

      if (saveError) {
        throw saveError;
      }

      // Update local state
      setSettings(prev => prev ? { ...prev, ...newSettings } : null);

      // Test connection if settings are active
      if (newSettings.isActive) {
        await testConnection(newSettings);
      }

      toast.success('Hikvision settings saved successfully');
    } catch (error) {
      console.error('Error saving Hikvision settings:', error);
      const message = error instanceof Error ? error.message : 'Failed to save settings';
      setError(message);
      throw new Error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async (testSettings?: Partial<HikvisionSettings>) => {
    try {
      setError(null);
      
      // Use test settings if provided, otherwise use current settings
      const settingsToTest = testSettings ? { ...settings, ...testSettings } : settings;
      
      if (!settingsToTest?.apiUrl || !settingsToTest?.appKey || !settingsToTest?.appSecret) {
        throw new Error('API URL, App Key, and App Secret are required');
      }

      const result = await hikvisionService.testConnection(branchId);
      
      if (result.success) {
        setIsConnected(true);
        return { success: true, message: result.message };
      } else {
        setIsConnected(false);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      setIsConnected(false);
      const message = error instanceof Error ? error.message : 'Connection test failed';
      setError(message);
      return { success: false, message };
    }
  };

  const syncDevices = async () => {
    try {
      setIsSyncing(true);
      setError(null);

      const result = await hikvisionService.syncDevices(branchId);
      
      if (result.success) {
        // Update last sync time
        await supabase
          .from('hikvision_api_settings')
          .update({ 
            last_sync: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('branch_id', branchId);

        setLastSync(new Date().toISOString());
        toast.success(result.message || 'Devices synchronized successfully');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error syncing devices:', error);
      const message = error instanceof Error ? error.message : 'Device sync failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    settings,
    isLoading,
    isSaving,
    isConnected,
    isSyncing,
    lastSync,
    error,
    saveSettings,
    testConnection,
    syncDevices,
    loadSettings
  };
};
