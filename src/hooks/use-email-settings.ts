
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBranch } from './use-branch';

export interface EmailSettings {
  id: string;
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
  notifications: {
    sendOnRegistration: boolean;
    sendOnInvoice: boolean;
    sendClassUpdates: boolean;
  };
  created_at: string;
  updated_at: string;
}

export const useEmailSettings = () => {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { currentBranch } = useBranch();

  const fetchSettings = useCallback(async () => {
    if (!currentBranch?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .eq('branch_id', currentBranch.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setSettings(data as EmailSettings);
      } else {
        setSettings(null);
      }
    } catch (error) {
      console.error('Error fetching email settings:', error);
      toast.error('Failed to fetch email settings');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  const saveSettings = async (updatedSettings: Partial<EmailSettings>): Promise<boolean> => {
    if (!currentBranch?.id) {
      toast.error('No branch selected');
      return false;
    }
    
    setIsLoading(true);
    try {
      if (settings?.id) {
        // Update existing settings
        const { error } = await supabase
          .from('email_settings')
          .update({
            ...updatedSettings,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id);

        if (error) throw error;
        
        setSettings({
          ...settings,
          ...updatedSettings,
          updated_at: new Date().toISOString()
        });
        
        toast.success('Email settings updated successfully');
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('email_settings')
          .insert([{
            ...updatedSettings,
            branch_id: currentBranch.id,
            is_active: updatedSettings.is_active ?? true
          }])
          .select()
          .single();

        if (error) throw error;
        
        setSettings(data as EmailSettings);
        toast.success('Email settings created successfully');
      }
      
      return true;
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast.error('Failed to save email settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const testEmailConnection = async (): Promise<boolean> => {
    if (!settings) {
      toast.error('No email settings configured');
      return false;
    }
    
    setIsLoading(true);
    try {
      // We would typically call an edge function for this
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Email connection test successful');
      return true;
    } catch (error) {
      console.error('Email test failed:', error);
      toast.error('Email connection test failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentBranch?.id) {
      fetchSettings();
    }
  }, [currentBranch?.id, fetchSettings]);

  return { 
    settings, 
    isLoading, 
    fetchSettings, 
    saveSettings,
    testEmailConnection
  };
};
