
import { useState, useEffect } from 'react';
import settingsService from '@/services/settingsService';
import { useBranch } from './use-branch';

export interface WhatsAppSettings {
  id?: string;
  api_token: string;
  phone_number_id: string;
  business_account_id: string;
  is_active: boolean;
  branch_id?: string;
  notifications?: {
    sendWelcomeMessages: boolean;
    sendClassReminders: boolean;
    sendRenewalReminders: boolean;
    sendBirthdayGreetings: boolean;
  };
}

export const useWhatsAppSettings = () => {
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { currentBranch } = useBranch();

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await settingsService.getWhatsAppSettings(currentBranch?.id);
      setSettings(data || {
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
      });
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (updatedSettings: WhatsAppSettings) => {
    setIsSaving(true);
    try {
      // Ensure the branch_id is set
      const settingsToSave = {
        ...updatedSettings,
        branch_id: currentBranch?.id
      };
      
      const result = await settingsService.saveWhatsAppSettings(settingsToSave);
      if (result) {
        setSettings(result);
      }
      return !!result;
    } catch (err: any) {
      setError(err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  useEffect(() => {
    if (currentBranch?.id) {
      fetchSettings();
    }
  }, [currentBranch?.id]);

  return {
    settings,
    isLoading,
    error,
    isSaving,
    fetchSettings,
    saveSettings,
    updateField,
  };
};
