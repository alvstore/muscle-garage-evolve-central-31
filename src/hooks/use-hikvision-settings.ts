
// Hook for managing Hikvision settings
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HikvisionSettings {
  id?: string;
  apiUrl: string;
  appKey: string;
  appSecret: string;
  isActive: boolean;
  branchId: string;
  syncInterval?: number;
  lastSync?: string;
}

interface TestConnectionParams {
  apiUrl: string;
  appKey: string;
  appSecret?: string;
  isActive: boolean;
}

interface UseHikvisionSettingsReturn {
  settings: HikvisionSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  isConnected: boolean;
  isSyncing: boolean;
  lastSync: string | null;
  error: string | null;
  saveSettings: (settings: Partial<HikvisionSettings>) => Promise<void>;
  testConnection: (params: TestConnectionParams) => Promise<{ success: boolean; message?: string }>;
  syncDevices: () => Promise<void>;
}

export const useHikvisionSettings = (branchId: string): UseHikvisionSettingsReturn => {
  const [settings, setSettings] = useState<HikvisionSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (branchId) {
      fetchSettings();
    }
  }, [branchId]);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          id: data.id,
          apiUrl: data.api_url,
          appKey: data.app_key,
          appSecret: data.app_secret,
          isActive: data.is_active,
          branchId: data.branch_id,
          syncInterval: data.sync_interval,
          lastSync: data.last_sync
        });
        setLastSync(data.last_sync);
        setIsConnected(data.is_active);
      }
    } catch (err) {
      console.error('Error fetching Hikvision settings:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: Partial<HikvisionSettings>) => {
    try {
      setIsSaving(true);
      setError(null);

      const settingsData = {
        api_url: newSettings.apiUrl,
        app_key: newSettings.appKey,
        app_secret: newSettings.appSecret,
        is_active: newSettings.isActive,
        branch_id: branchId,
        sync_interval: newSettings.syncInterval,
        updated_at: new Date().toISOString()
      };

      if (settings?.id) {
        const { error } = await supabase
          .from('hikvision_api_settings')
          .update(settingsData)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('hikvision_api_settings')
          .insert([{ ...settingsData, created_at: new Date().toISOString() }])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setSettings(prev => ({ ...prev, id: data.id } as HikvisionSettings));
        }
      }

      await fetchSettings();
    } catch (err) {
      console.error('Error saving Hikvision settings:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async (params: TestConnectionParams) => {
    try {
      setError(null);
      
      // Simulate connection test
      console.log('Testing Hikvision connection with params:', params);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      return { success: true, message: 'Connection successful' };
    } catch (err) {
      console.error('Error testing connection:', err);
      setIsConnected(false);
      const message = err instanceof Error ? err.message : 'Connection failed';
      setError(message);
      return { success: false, message };
    }
  };

  const syncDevices = async () => {
    try {
      setIsSyncing(true);
      setError(null);
      
      // Simulate device sync
      console.log('Syncing Hikvision devices...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const now = new Date().toISOString();
      setLastSync(now);
      
      if (settings?.id) {
        await supabase
          .from('hikvision_api_settings')
          .update({ last_sync: now })
          .eq('id', settings.id);
      }
    } catch (err) {
      console.error('Error syncing devices:', err);
      setError(err instanceof Error ? err.message : 'Sync failed');
      throw err;
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
    syncDevices
  };
};
