
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EmailSettings {
  id?: string;
  provider: 'sendgrid' | 'mailgun' | 'smtp';
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
  notifications: {
    sendOnRegistration: boolean;
    sendOnInvoice: boolean;
    sendClassUpdates: boolean;
  };
  branch_id?: string;
}

export const useEmailSettings = (branchId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<EmailSettings | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .eq('branch_id', branchId)
        .maybeSingle();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching email settings:', error);
      toast.error('Failed to load email settings');
    } finally {
      setIsLoading(false);
    }
  }, [branchId]);

  const saveSettings = async (newSettings: Partial<EmailSettings>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('email_settings')
        .upsert({
          ...newSettings,
          branch_id: branchId,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      await fetchSettings();
      toast.success('Email settings saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast.error('Failed to save email settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const testEmailSettings = async (settings: EmailSettings, testEmail: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('test-email', {
        body: { settings, testEmail }
      });

      if (error) throw error;

      toast.success('Test email sent successfully');
      return true;
    } catch (error) {
      console.error('Error testing email settings:', error);
      toast.error('Failed to send test email');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    settings,
    isLoading,
    fetchSettings,
    saveSettings,
    testEmailSettings
  };
};
