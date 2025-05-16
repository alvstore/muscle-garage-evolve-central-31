import { supabase } from '@/integrations/supabase/client';

interface HikvisionSettings {
  apiUrl: string;
  appKey: string;
  appSecret: string;
  isActive: boolean;
  devices?: any[];
  siteId?: string;
}

interface HikvisionSettingsResponse {
  success: boolean;
  data?: HikvisionSettings;
  error?: string;
}

const settingsService = {
  getHikvisionSettings: async (branchId?: string): Promise<HikvisionSettingsResponse> => {
    try {
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId || '')
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data ? {
          apiUrl: data.api_url,
          appKey: data.app_key,
          appSecret: data.app_secret,
          isActive: data.is_active,
          devices: data.devices || [],
          siteId: data.site_id
        } : undefined
      };
    } catch (error) {
      console.error("Error fetching Hikvision settings:", error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  saveHikvisionSettings: async (settings: any): Promise<HikvisionSettingsResponse> => {
    try {
      const { branchId, apiUrl, appKey, secretKey, siteId } = settings;
      
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .upsert({
          branch_id: branchId,
          api_url: apiUrl,
          app_key: appKey,
          app_secret: secretKey,
          site_id: siteId,
          updated_at: new Date().toISOString()
        }, { onConflict: 'branch_id' })
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        success: true,
        data: data ? {
          apiUrl: data.api_url,
          appKey: data.app_key,
          appSecret: data.app_secret,
          isActive: data.is_active,
          devices: data.devices || [],
          siteId: data.site_id
        } : undefined
      };
    } catch (error) {
      console.error("Error saving Hikvision settings:", error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  testHikvisionConnection: async (credentials: any): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      // In a real implementation, this would make an API call to test the connection
      // Mock implementation for now
      return {
        success: true,
        message: "Successfully connected to Hikvision API"
      };
    } catch (error) {
      console.error("Error testing Hikvision connection:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  getHikvisionSites: async (credentials: any): Promise<{ success: boolean; sites?: any[]; error?: string }> => {
    try {
      // In a real implementation, this would make an API call to get available sites
      // Mock implementation for now
      return {
        success: true,
        sites: [
          { siteId: 'site1', siteName: 'Main Gym' },
          { siteId: 'site2', siteName: 'Branch Office' }
        ]
      };
    } catch (error) {
      console.error("Error fetching Hikvision sites:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

export default settingsService;
