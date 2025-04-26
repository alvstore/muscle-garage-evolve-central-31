
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Setting {
  id: string;
  category: string;
  key: string;
  value: any;
  description?: string;
  branch_id?: string;
}

export interface AccessControlSettings {
  appKey: string;
  secretKey: string;
  siteId: string;
  deviceSerials: {
    entryDevice1: string;
    entryDevice2?: string;
    entryDevice3?: string;
    swimmingDevice?: string;
  };
  planBasedAccess: {
    gymOnlyAccess: boolean;
    swimmingOnlyAccess: boolean;
    bothAccess: boolean;
  };
}

export const settingsService = {
  async getSettings(category?: string) {
    try {
      let query = supabase.from('settings').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  async updateSetting(category: string, key: string, value: any, branchId?: string) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .upsert({
          category,
          key,
          value,
          branch_id: branchId
        }, {
          onConflict: 'category,key,branch_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  },
  
  async getAccessControlSettings(): Promise<AccessControlSettings> {
    try {
      // Fetch all access control related settings
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('category', 'access_control');
      
      if (error) throw error;
      
      // If no settings exist, return default values
      if (!data || data.length === 0) {
        return {
          appKey: '',
          secretKey: '',
          siteId: '',
          deviceSerials: {
            entryDevice1: '',
            entryDevice2: '',
            entryDevice3: '',
            swimmingDevice: '',
          },
          planBasedAccess: {
            gymOnlyAccess: true,
            swimmingOnlyAccess: true,
            bothAccess: true,
          }
        };
      }
      
      // Convert array of settings to structured AccessControlSettings object
      const settings: Record<string, any> = {};
      
      data.forEach((setting) => {
        if (setting.key === 'credentials') {
          const credentials = setting.value;
          settings.appKey = credentials.appKey || '';
          settings.secretKey = credentials.secretKey || '';
          settings.siteId = credentials.siteId || '';
        } else if (setting.key === 'device_serials') {
          settings.deviceSerials = setting.value;
        } else if (setting.key === 'access_rules') {
          settings.planBasedAccess = setting.value;
        }
      });
      
      return {
        appKey: settings.appKey || '',
        secretKey: settings.secretKey || '',
        siteId: settings.siteId || '',
        deviceSerials: settings.deviceSerials || {
          entryDevice1: '',
          entryDevice2: '',
          entryDevice3: '',
          swimmingDevice: '',
        },
        planBasedAccess: settings.planBasedAccess || {
          gymOnlyAccess: true,
          swimmingOnlyAccess: true,
          bothAccess: true,
        }
      };
    } catch (error) {
      console.error('Error fetching access control settings:', error);
      throw error;
    }
  },
  
  async updateAccessControlSettings(settings: AccessControlSettings): Promise<void> {
    try {
      // Split the settings into separate records for better organization
      const credentials = {
        appKey: settings.appKey,
        secretKey: settings.secretKey,
        siteId: settings.siteId,
      };
      
      const deviceSerials = settings.deviceSerials;
      const accessRules = settings.planBasedAccess;
      
      // Batch update all settings
      const { error } = await supabase.rpc('upsert_settings_batch', {
        settings_array: [
          { category: 'access_control', key: 'credentials', value: credentials },
          { category: 'access_control', key: 'device_serials', value: deviceSerials },
          { category: 'access_control', key: 'access_rules', value: accessRules }
        ]
      });
      
      if (error) {
        console.error('Error batch updating settings:', error);
        // Fallback to individual updates if RPC fails
        await this.updateSetting('access_control', 'credentials', credentials);
        await this.updateSetting('access_control', 'device_serials', deviceSerials);
        await this.updateSetting('access_control', 'access_rules', accessRules);
      }
    } catch (error) {
      console.error('Error updating access control settings:', error);
      throw error;
    }
  }
};

export default settingsService;
