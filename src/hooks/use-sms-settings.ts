
import { useState, useEffect } from 'react';
import settingsService from '@/services/settingsService';
import { useBranch } from './use-branch';

export interface SmsSettings {
  id?: string;
  provider: string;
  sender_id: string;
  msg91_auth_key?: string;
  twilio_account_sid?: string;
  twilio_auth_token?: string;
  custom_api_url?: string;
  custom_api_headers?: string;
  custom_api_params?: string;
  is_active: boolean;
  branch_id?: string;
  templates?: {
    membershipAlert: boolean;
    renewalReminder: boolean;
    otpVerification: boolean;
    attendanceConfirmation: boolean;
  };
}

export const useSmsSettings = () => {
  const [settings, setSettings] = useState<SmsSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { currentBranch } = useBranch();

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await settingsService.getSmsSettings(currentBranch?.id);
      setSettings(data || {
        provider: 'msg91',
        sender_id: 'GYMAPP',
        is_active: false,
        templates: {
          membershipAlert: false,
          renewalReminder: false,
          otpVerification: false,
          attendanceConfirmation: false
        }
      });
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
