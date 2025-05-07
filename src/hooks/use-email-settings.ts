
import { useState, useEffect } from 'react';
import settingsService from '@/services/settingsService';
import { useBranch } from './use-branch';

export interface EmailSettings {
  id?: string;
  provider: string;
  from_email: string;
  sendgrid_api_key?: string;
  mailgun_api_key?: string;
  mailgun_domain?: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string;
  smtp_secure?: boolean;
  is_active: boolean;
  branch_id?: string;
  notifications?: {
    sendOnRegistration: boolean;
    sendOnInvoice: boolean;
    sendClassUpdates: boolean;
  };
  // For backward compatibility
  fromEmail?: string;
  apiKey?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
}

export const useEmailSettings = () => {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { currentBranch } = useBranch();

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await settingsService.getEmailSettings(currentBranch?.id);
      setSettings(data || {
        provider: 'sendgrid',
        from_email: '',
        is_active: false,
        notifications: {
          sendOnRegistration: true,
          sendOnInvoice: true,
          sendClassUpdates: false
        }
      });
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (updatedSettings: EmailSettings) => {
    setIsSaving(true);
    try {
      // Ensure the branch_id is set
      const settingsToSave = {
        ...updatedSettings,
        branch_id: currentBranch?.id
      };
      
      const result = await settingsService.saveEmailSettings(settingsToSave);
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

  const testConnection = async (email: string) => {
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
