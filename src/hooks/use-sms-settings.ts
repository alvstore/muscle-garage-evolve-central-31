
import { useSettingsManagement } from './use-settings-management';
import { supabase } from '@/integrations/supabase/client';
import { SmsSettings } from '@/services/settingsService';

export const useSmsSettings = (branchId: string | null = null) => {
  const {
    data,
    isLoading,
    error,
    isSaving,
    fetchSettings,
    saveSettings,
    updateField
  } = useSettingsManagement<SmsSettings>({
    tableName: 'sms_settings',
    defaultBranchId: branchId,
    initialData: {
      provider: 'msg91',
      sender_id: '',
      is_active: false,
      templates: {
        membershipAlert: false,
        renewalReminder: false,
        otpVerification: false,
        attendanceConfirmation: false
      }
    }
  });

  // Test SMS connection
  const testConnection = async (testPhone: string): Promise<{ success: boolean, message: string }> => {
    try {
      // In a real implementation, this would call a Supabase edge function
      // For now, we'll simulate a successful test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Test SMS sent successfully!'
      };
    } catch (error) {
      console.error('SMS test failed:', error);
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
