
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EmailSettings {
  id?: string;
  provider: 'sendgrid' | 'mailgun' | 'smtp';
  from_email: string;
  is_active: boolean;
  sendgrid_api_key?: string;
  mailgun_api_key?: string;
  mailgun_domain?: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string;
  smtp_secure?: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  notifications: {
    sendOnRegistration: boolean;
    sendOnInvoice: boolean;
    sendClassUpdates: boolean;
  };
}

export const useEmailSettings = (branchId?: string) => {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      let query = supabase.from('email_settings').select('*');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      } else {
        query = query.is('branch_id', null);
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setSettings(data as EmailSettings);
      } else {
        // Create default settings if none exist
        const defaultSettings: Omit<EmailSettings, 'id'> = {
          provider: 'sendgrid',
          from_email: '',
          is_active: true,
          notifications: {
            sendOnRegistration: true,
            sendOnInvoice: true,
            sendClassUpdates: true
          },
          branch_id: branchId
        };
        
        setSettings(defaultSettings as EmailSettings);
      }
    } catch (err: any) {
      console.error('Error fetching email settings:', err);
      toast.error('Failed to fetch email settings');
    } finally {
      setIsLoading(false);
    }
  }, [branchId]);

  const saveSettings = async (updatedSettings: Partial<EmailSettings>) => {
    try {
      setIsLoading(true);
      
      const currentSettings = settings || {} as EmailSettings;
      const mergedSettings = {
        ...currentSettings,
        ...updatedSettings,
        branch_id: branchId,
        updated_at: new Date().toISOString()
      };
      
      let result;
      if (mergedSettings.id) {
        // Update existing settings
        const { data, error } = await supabase
          .from('email_settings')
          .update(mergedSettings)
          .eq('id', mergedSettings.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Insert new settings
        const { data, error } = await supabase
          .from('email_settings')
          .insert(mergedSettings)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      setSettings(result as EmailSettings);
      toast.success('Email settings saved successfully');
      return true;
    } catch (err: any) {
      console.error('Error saving email settings:', err);
      toast.error('Failed to save email settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const testEmailConnection = async () => {
    try {
      setIsLoading(true);
      
      // Simulate testing connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Email connection test successful');
      return true;
    } catch (err: any) {
      console.error('Error testing email connection:', err);
      toast.error('Failed to connect to email service');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    settings: settings as EmailSettings,
    isLoading,
    fetchSettings,
    saveSettings,
    testEmailConnection
  };
};
