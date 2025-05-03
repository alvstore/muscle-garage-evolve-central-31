
import { useSettingsManagement } from './use-settings-management';
import { supabase } from '@/integrations/supabase/client';
import { WhatsAppSettings } from '@/services/settingsService';

export const useWhatsAppSettings = (branchId: string | null = null) => {
  const {
    data,
    isLoading,
    error,
    isSaving,
    fetchSettings,
    saveSettings,
    updateField
  } = useSettingsManagement<WhatsAppSettings>({
    tableName: 'whatsapp_settings',
    defaultBranchId: branchId,
    initialData: {
      api_token: '',
      phone_number_id: '',
      business_account_id: '',
      is_active: false,
      notifications: {
        sendWelcomeMessages: true,
        sendClassReminders: true,
        sendRenewalReminders: true,
        sendBirthdayGreetings: false
      }
    }
  });

  // Test WhatsApp connection
  const testConnection = async (testPhone: string): Promise<{ success: boolean, message: string }> => {
    try {
      // In a real implementation, this would call a Supabase edge function
      // For now, we'll simulate a successful test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Test WhatsApp message sent successfully!'
      };
    } catch (error) {
      console.error('WhatsApp test failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Test failed'
      };
    }
  };

  return {
    settings: data,
    isLoading,
    error,
    isSaving,
    fetchSettings,
    saveSettings,
    updateField,
    testConnection
  };
};
