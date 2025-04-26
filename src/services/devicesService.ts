
import { supabase } from '@/integrations/supabase/client';

interface BaseDevice {
  id: string;
  branch_id: string;
  name: string;
  device_serial: string;
  device_type: string;
  ip_address?: string;
  port?: number;
  location?: string;
  is_active: boolean;
  access_zone: string;
}

export interface HikvisionDevice extends BaseDevice {
  username: string;
  password: string;
}

export interface EsslDevice extends BaseDevice {}

export const devicesService = {
  async getHikvisionDevices(branchId?: string) {
    try {
      let query = supabase.from('hikvision_devices').select('*');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching Hikvision devices:', error);
      throw error;
    }
  },

  async getEsslDevices(branchId?: string) {
    try {
      let query = supabase.from('essl_devices').select('*');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching ESSL devices:', error);
      throw error;
    }
  },

  async updateHikvisionDevice(device: Partial<HikvisionDevice>) {
    try {
      const { data, error } = await supabase
        .from('hikvision_devices')
        .upsert(device)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating Hikvision device:', error);
      throw error;
    }
  },

  async updateEsslDevice(device: Partial<EsslDevice>) {
    try {
      const { data, error } = await supabase
        .from('essl_devices')
        .upsert(device)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating ESSL device:', error);
      throw error;
    }
  },

  async deleteDevice(type: 'hikvision' | 'essl', id: string) {
    try {
      const { error } = await supabase
        .from(`${type}_devices`)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting ${type} device:`, error);
      throw error;
    }
  }
};

export default devicesService;
