
import { useState, useEffect, useCallback } from 'react';
import { HikvisionApiSettings, hikvisionService, TokenResponse } from '@/services/hikvisionService';
import { useBranch } from './use-branch';
import { HikvisionDevice } from '@/types/access-control';
import { toast } from 'sonner';
import { supabase } from '@/services/supabaseClient';

export const useHikvisionSettings = () => {
  const { currentBranch } = useBranch();
  const [settings, setSettings] = useState<HikvisionApiSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [devices, setDevices] = useState<HikvisionDevice[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);

  const fetchSettings = useCallback(async () => {
    if (!currentBranch?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', currentBranch.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
        console.error('Error fetching Hikvision settings:', error);
        toast.error('Failed to load Hikvision settings');
        return;
      }
      
      setSettings(data || {
        app_key: '',
        app_secret: '',
        api_url: 'https://api.hikvision.com',
        is_active: false,
        branch_id: currentBranch.id,
        devices: []
      });
    } catch (error) {
      console.error('Error in fetchSettings:', error);
      toast.error('Failed to load Hikvision settings');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  // Load settings when branch changes
  useEffect(() => {
    if (currentBranch?.id) {
      fetchSettings();
    }
  }, [currentBranch?.id, fetchSettings]);

  const saveSettings = async (settingsData: HikvisionApiSettings): Promise<boolean> => {
    if (!currentBranch?.id) return false;
    
    setIsSaving(true);
    try {
      const settingsToSave = {
        ...settingsData,
        branch_id: currentBranch.id,
        updated_at: new Date().toISOString()
      };
      
      // Check if settings already exist
      const { data: existingSettings } = await supabase
        .from('hikvision_api_settings')
        .select('id')
        .eq('branch_id', currentBranch.id)
        .maybeSingle();
      
      if (existingSettings?.id) {
        // Update existing settings
        const { error } = await supabase
          .from('hikvision_api_settings')
          .update(settingsToSave)
          .eq('id', existingSettings.id);
          
        if (error) throw error;
      } else {
        // Insert new settings
        const { error } = await supabase
          .from('hikvision_api_settings')
          .insert([{
            ...settingsToSave,
            created_at: new Date().toISOString()
          }]);
          
        if (error) throw error;
      }
      
      // Update local state
      setSettings(settingsToSave);
      toast.success('Settings saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving Hikvision settings:', error);
      toast.error('Failed to save settings');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async (credentials: HikvisionApiSettings): Promise<TokenResponse> => {
    try {
      const result = await hikvisionService.getToken({
        api_url: credentials.api_url,
        app_key: credentials.app_key,
        app_secret: credentials.app_secret
      });
      
      if (result.success) {
        toast.success('Connection successful');
      } else {
        toast.error('Connection failed: ' + (result.message || 'Unknown error'));
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error testing connection:', error);
      toast.error('Connection test error: ' + errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const fetchDevices = async () => {
    if (!settings || !settings.is_active) {
      setDevices([]);
      return [];
    }
    
    setIsLoadingDevices(true);
    try {
      const devicesList = await hikvisionService.fetchDevices(settings);
      setDevices(devicesList);
      return devicesList;
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast.error('Failed to load devices');
      return [];
    } finally {
      setIsLoadingDevices(false);
    }
  };

  return {
    settings,
    isLoading,
    isSaving,
    saveSettings,
    testConnection,
    fetchDevices,
    devices,
    isLoadingDevices
  };
};
