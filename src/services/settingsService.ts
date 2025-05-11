
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

interface HikvisionSettings {
  id?: string;
  api_url: string;
  app_key: string;
  app_secret: string;
  devices: {
    id: string;
    name: string;
    serialNumber: string;
  }[];
  is_active: boolean;
  branch_id?: string;
}

interface EsslSettings {
  id?: string;
  api_url: string;
  api_username: string;
  api_password: string;
  push_url: string;
  device_name: string;
  device_serial: string;
  devices: {
    id: string;
    name: string;
    serialNumber: string;
  }[];
  is_active: boolean;
  branch_id?: string;
}

const settingsService = {
  async getHikvisionSettings(branchId?: string): Promise<HikvisionSettings | null> {
    try {
      if (!branchId) return null;

      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          console.error('Error fetching Hikvision settings:', error);
          toast.error('Failed to load Hikvision settings');
        }
        return null;
      }

      return data as HikvisionSettings;
    } catch (error) {
      console.error('Error in getHikvisionSettings:', error);
      toast.error('Error loading Hikvision settings');
      return null;
    }
  },

  async saveHikvisionSettings(settings: HikvisionSettings): Promise<HikvisionSettings | null> {
    try {
      if (!settings.branch_id) {
        toast.error('Branch ID is required');
        return null;
      }

      let result;

      if (settings.id) {
        // Update existing settings
        const { data, error } = await supabase
          .from('hikvision_api_settings')
          .update({
            api_url: settings.api_url,
            app_key: settings.app_key,
            app_secret: settings.app_secret,
            devices: settings.devices,
            is_active: settings.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('hikvision_api_settings')
          .insert({
            api_url: settings.api_url,
            app_key: settings.app_key,
            app_secret: settings.app_secret,
            devices: settings.devices,
            is_active: settings.is_active,
            branch_id: settings.branch_id
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      toast.success('Hikvision settings saved successfully');
      return result as HikvisionSettings;
    } catch (error) {
      console.error('Error saving Hikvision settings:', error);
      toast.error('Failed to save Hikvision settings');
      return null;
    }
  },

  async getEsslSettings(branchId?: string): Promise<EsslSettings | null> {
    try {
      if (!branchId) return null;

      const { data, error } = await supabase
        .from('essl_device_settings')
        .select('*')
        .eq('branch_id', branchId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          console.error('Error fetching ESSL settings:', error);
          toast.error('Failed to load ESSL settings');
        }
        return null;
      }

      return data as EsslSettings;
    } catch (error) {
      console.error('Error in getEsslSettings:', error);
      toast.error('Error loading ESSL settings');
      return null;
    }
  },

  async saveEsslSettings(settings: EsslSettings): Promise<EsslSettings | null> {
    try {
      if (!settings.branch_id) {
        toast.error('Branch ID is required');
        return null;
      }

      let result;

      if (settings.id) {
        // Update existing settings
        const { data, error } = await supabase
          .from('essl_device_settings')
          .update({
            api_url: settings.api_url,
            api_username: settings.api_username,
            api_password: settings.api_password,
            push_url: settings.push_url,
            device_name: settings.device_name,
            device_serial: settings.device_serial,
            devices: settings.devices,
            is_active: settings.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('essl_device_settings')
          .insert({
            api_url: settings.api_url,
            api_username: settings.api_username,
            api_password: settings.api_password,
            push_url: settings.push_url,
            device_name: settings.device_name,
            device_serial: settings.device_serial,
            devices: settings.devices,
            is_active: settings.is_active,
            branch_id: settings.branch_id
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      toast.success('ESSL settings saved successfully');
      return result as EsslSettings;
    } catch (error) {
      console.error('Error saving ESSL settings:', error);
      toast.error('Failed to save ESSL settings');
      return null;
    }
  },

  async registerMemberWithDevice(
    memberId: string, 
    deviceType: 'hikvision' | 'essl', 
    branchId: string
  ): Promise<boolean> {
    try {
      // Log the registration request
      const { error } = await supabase
        .from('biometric_logs')
        .insert({
          member_id: memberId,
          branch_id: branchId,
          device_type: deviceType,
          action: 'register',
          status: 'pending',
          details: { registered_at: new Date().toISOString() }
        });

      if (error) throw error;
      toast.success(`Member registration with ${deviceType} device queued successfully`);
      return true;
    } catch (error) {
      console.error(`Error registering member with ${deviceType} device:`, error);
      toast.error(`Failed to register member with ${deviceType} device`);
      return false;
    }
  }
};

export default settingsService;
