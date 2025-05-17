import { useState, useEffect, useCallback } from 'react';
import { HikvisionEvent } from '@/services/integrations/hikvisionService';

// Define types that match the hikvisionService
export interface HikvisionDevice {
  id: string;
  name: string;
  ip_address: string;
  port: number;
  username: string;
  password: string;
  branch_id: string;
  is_active: boolean;
  last_sync?: string;
  created_at: string;
  updated_at: string;
}

export interface HikvisionPerson {
  employeeNo: string;
  name: string;
  userType: string;
  gender: string;
  cardNo?: string;
  phoneNo?: string;
  email?: string;
  address?: string;
  remark?: string;
  faceData?: string;
  fingerPrintData?: string;
  password?: string;
  doorRight?: string;
  rightPlan?: string;
  maxOpenDoorTime?: number;
  valid?: {
    enable: boolean;
    beginTime: string;
    endTime: string;
  };
  personExtension?: Record<string, any>;
}

export interface HikvisionAccessPrivilege {
  doorId: number;
  doorName: string;
  privilege: number;
  schedule: number;
}

export interface HikvisionApiSettings {
  baseUrl: string;
  username: string;
  password: string;
  isActive: boolean;
  syncInterval: number;
  lastSync?: string;
  branchId?: string;
}
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface HikvisionState {
  devices: HikvisionDevice[];
  isLoading: boolean;
  error: string | null;
  settings: HikvisionApiSettings | null;
  isInitialized: boolean;
}

export const useHikvision = () => {
  const [state, setState] = useState<HikvisionState>({
    devices: [],
    isLoading: false,
    error: null,
    settings: null,
    isInitialized: false
  });

  const fetchDevices = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase
        .from('hikvision_devices')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setState(prev => ({
        ...prev,
        devices: data || [],
        isInitialized: true
      }));
      
      return data || [];
    } catch (error) {
      console.error('Error fetching Hikvision devices:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load Hikvision devices',
        isInitialized: true
      }));
      toast.error('Failed to load Hikvision devices');
      return [];
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'hikvision_settings')
        .single();

      if (error) throw error;
      
      const settings = data?.value as HikvisionApiSettings | undefined;
      
      setState(prev => ({
        ...prev,
        settings: settings || null
      }));
      
      return settings;
    } catch (error) {
      console.error('Error fetching Hikvision settings:', error);
      toast.error('Failed to load Hikvision settings');
      return null;
    }
  }, []);

  const initialize = useCallback(async () => {
    await Promise.all([fetchSettings(), fetchDevices()]);
  }, [fetchSettings, fetchDevices]);

  useEffect(() => {
    if (!state.isInitialized) {
      initialize();
    }
  }, [initialize, state.isInitialized]);

  return {
    ...state,
    refreshDevices: fetchDevices,
    refreshSettings: fetchSettings
  };
};

export default useHikvision;
