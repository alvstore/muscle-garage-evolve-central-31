import { supabase } from '@/integrations/supabase/client';
import { HikvisionDevice, DeviceStatus, DeviceIntegrationStatus, EsslDeviceSettings } from '@/types/integrations';
import { toast } from 'sonner';

/**
 * Service for managing device integrations (Hikvision, ESSL, etc.)
 */
export const deviceService = {
  /**
   * Get all Hikvision devices for a branch
   */
  getHikvisionDevices: async (branchId: string): Promise<HikvisionDevice[]> => {
    try {
      const { data, error } = await supabase
        .from('hikvision_devices')
        .select('*')
        .eq('branch_id', branchId);

      if (error) {
        console.error('Error fetching Hikvision devices:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getHikvisionDevices:', error);
      toast.error('Failed to fetch Hikvision devices');
      return [];
    }
  },

  /**
   * Get ESSL device settings for a branch
   */
  getEsslSettings: async (branchId: string): Promise<EsslDeviceSettings | null> => {
    try {
      const { data, error } = await supabase
        .from('essl_device_settings')
        .select('*')
        .eq('branch_id', branchId)
        .single();

      if (error) {
        console.error('Error fetching ESSL settings:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getEsslSettings:', error);
      toast.error('Failed to fetch ESSL settings');
      return null;
    }
  },

  /**
   * Get integration status for a specific device type and branch
   */
  getIntegrationStatus: async (branchId: string, integrationKey: string): Promise<DeviceIntegrationStatus | null> => {
    try {
      const { data, error } = await supabase
        .from('integration_statuses')
        .select('*')
        .eq('branch_id', branchId)
        .eq('integration_key', integrationKey)
        .single();

      if (error) {
        // If no status exists yet, return default
        if (error.code === 'PGRST116') { // No rows returned
          return {
            deviceId: '',
            deviceType: integrationKey as 'hikvision' | 'essl',
            status: 'offline',
            lastSync: null,
            error: 'Not configured'
          };
        }
        throw error;
      }

      return {
        deviceId: data.id,
        deviceType: integrationKey as 'hikvision' | 'essl',
        status: this.mapStatus(data.status),
        lastSync: data.updated_at,
        error: null
      };
    } catch (error) {
      console.error(`Error getting ${integrationKey} status:`, error);
      return {
        deviceId: '',
        deviceType: integrationKey as 'hikvision' | 'essl',
        status: 'error',
        lastSync: null,
        error: 'Failed to fetch status'
      };
    }
  },

  /**
   * Map database status to DeviceStatus
   */
  private mapStatus(status: string): DeviceStatus {
    switch (status?.toLowerCase()) {
      case 'online':
      case 'connected':
        return 'online';
      case 'offline':
      case 'disconnected':
        return 'offline';
      case 'syncing':
      case 'processing':
        return 'syncing';
      case 'error':
      case 'failed':
        return 'error';
      default:
        return 'offline';
    }
  },

  /**
   * Check if a device mapping exists for a branch and device type
   */
  checkDeviceMapping: async (branchId: string, deviceType: 'hikvision' | 'essl'): Promise<boolean> => {
    try {
      // Check if the device type is Hikvision
      if (deviceType === 'hikvision') {
        const { data: hikvisionData } = await supabase
          .from('hikvision_devices')
          .select('id', { count: 'exact', head: true })
          .eq('branch_id', branchId);
        
        return (hikvisionData?.length || 0) > 0;
      }
      
      // Check if the device type is ESSL
      if (deviceType === 'essl') {
        const { data: esslData } = await supabase
          .from('essl_device_settings')
          .select('id', { count: 'exact', head: true })
          .eq('branch_id', branchId);
        
        return (esslData?.length || 0) > 0;
      }
      
      return false;
    } catch (error) {
      console.error(`Error checking ${deviceType} device mapping:`, error);
      return false;
    }
  }
};
