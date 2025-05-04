import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EmailSettings } from '@/types/notification';
import { useBranch } from './use-branch';

interface UseEmailSettingsResult {
  settings: EmailSettings | null;
  isLoading: boolean;
  error: Error | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<EmailSettings>) => Promise<boolean>;
  sendTestEmail: (email: string) => Promise<boolean>;
}

export const useEmailSettings = (): UseEmailSettingsResult => {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!currentBranch?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .eq('branch_id', currentBranch.id)
        .single();

      if (error) {
        throw error;
      }

      setSettings(data || null);
    } catch (err: any) {
      setError(err);
      toast.error(`Failed to fetch email settings: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  const updateSettings = async (newSettings: Partial<EmailSettings>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    if (!currentBranch?.id) {
      setIsLoading(false);
      toast.error('Please select a branch first.');
      return false;
    }

    try {
      const notifications = newSettings.notifications || {}; 
      const settingsToUpdate = {
        ...newSettings,
        notifications: typeof notifications === 'object' ? notifications : {}
      };

      const { data, error } = await supabase
        .from('email_settings')
        .upsert(
          [
            {
              ...settingsToUpdate,
              branch_id: currentBranch.id,
            },
          ],
          { onConflict: 'branch_id' }
        )
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSettings(data);
      toast.success('Email settings updated successfully!');
      return true;
    } catch (err: any) {
      setError(err);
      toast.error(`Failed to update email settings: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestEmail = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.functions.invoke('send-test-email', {
        body: { email },
      });

      if (error) {
        throw error;
      }

      toast.success('Test email sent successfully!');
      return true;
    } catch (err: any) {
      setError(err);
      toast.error(`Failed to send test email: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSettings,
    sendTestEmail,
  };
};
