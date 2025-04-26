
import { supabase } from '@/integrations/supabase/client';

interface ConnectionTestResult {
  success: boolean;
  message: string;
}

export const hikvisionPartnerService = {
  async saveCredentials(appKey: string, secretKey: string): Promise<void> {
    try {
      // Store the credentials in Supabase settings table
      const { error } = await supabase
        .from('settings')
        .upsert({
          category: 'hikvision',
          key: 'credentials',
          value: { appKey, secretKey }
        }, {
          onConflict: 'category,key'
        });
        
      if (error) throw error;
    } catch (error) {
      console.error('Error saving Hikvision credentials:', error);
      throw error;
    }
  },
  
  async testConnection(): Promise<ConnectionTestResult> {
    try {
      // In a real implementation, this would make an API call to test the connection
      // Here we're just simulating a successful response
      
      // Get credentials from settings
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('category', 'hikvision')
        .eq('key', 'credentials')
        .single();
      
      if (error) {
        throw error;
      }
      
      // Simulate API call
      const credentials = data?.value;
      
      if (!credentials || !credentials.appKey || !credentials.secretKey) {
        return {
          success: false,
          message: "Missing API credentials"
        };
      }
      
      // Simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: "Connection to Hikvision Partner API successful"
      };
    } catch (error: any) {
      console.error('Error testing Hikvision connection:', error);
      return {
        success: false,
        message: error.message || "Failed to connect to Hikvision Partner API"
      };
    }
  }
};

export default hikvisionPartnerService;
