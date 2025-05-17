import { useState, useEffect } from 'react';
import settingsService from '@/services/settings/settingsService';
import { useBranches } from '@/hooks/use-branches';
import { SmsSettings, SmsProvider, SmsTemplates } from '@/types/communication/sms';

export const useSmsSettings = () => {
  const [settings, setSettings] = useState<SmsSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { currentBranch } = useBranches();

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await settingsService.getSmsSettings(currentBranch?.id);
      
      // Default settings
      const defaultProvider: SmsProvider = {
        id: '',
        name: '',
        apiKey: '',
        senderId: '',
        isActive: false
      };

      const defaultTemplates: SmsTemplates = {
        membershipAlert: false,
        renewalReminder: false,
        otpVerification: false,
        attendanceConfirmation: false,
      };

      setSettings({
        ...(data || {}),
        provider: data?.provider || defaultProvider,
        templates: data?.templates || defaultTemplates,
      } as SmsSettings);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (updatedSettings: SmsSettings) => {
    setIsSaving(true);
    try {
      // Ensure the branch_id is set
      const settingsToSave = {
        ...updatedSettings,
        branch_id: currentBranch?.id
      };
      
      const result = await settingsService.saveSmsSettings(settingsToSave);
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

  const testConnection = async (phoneNumber: string) => {
    // In a real implementation, this would call an API endpoint
    // For now, just simulate a successful test
    return new Promise<boolean>(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
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
    testConnection
  };
};
