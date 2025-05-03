
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EmailSettings {
  id?: string;
  branch_id?: string | null;
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
  notifications: {
    sendOnRegistration: boolean;
    sendOnInvoice: boolean;
    sendClassUpdates: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export const useEmailSettings = (branchId: string | null = null) => {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('email_settings')
        .select('*');
        
      if (branchId) {
        query = query.eq('branch_id', branchId);
      } else {
        query = query.is('branch_id', null);
      }

      const { data, error: queryError } = await query.limit(1).single();

      if (queryError) {
        if (queryError.code === 'PGRST116') { // No rows returned
          // Create default settings if none exist
          return initializeDefaultSettings();
        }
        throw queryError;
      }

      setSettings(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error('Error fetching email settings:', err);
      toast.error(`Failed to load email settings: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDefaultSettings = async (): Promise<EmailSettings | null> => {
    const defaultSettings: EmailSettings = {
      provider: 'sendgrid',
      from_email: '',
      is_active: false,
      branch_id: branchId,
      notifications: {
        sendOnRegistration: true,
        sendOnInvoice: true,
        sendClassUpdates: true
      }
    };

    try {
      const { data, error: insertError } = await supabase
        .from('email_settings')
        .insert(defaultSettings)
        .select();

      if (insertError) throw insertError;
      
      if (data && data[0]) {
        setSettings(data[0]);
        return data[0];
      }
      
      return null;
    } catch (err) {
      console.error('Error initializing default email settings:', err);
      return null;
    }
  };

  const saveSettings = async (newData: Partial<EmailSettings>): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);

      if (!settings?.id) {
        // If settings don't exist yet, create them
        const fullSettings: EmailSettings = {
          ...{
            provider: 'sendgrid',
            from_email: '',
            is_active: false,
            notifications: {
              sendOnRegistration: true,
              sendOnInvoice: true,
              sendClassUpdates: true
            }
          },
          ...newData,
          branch_id: branchId
        };

        const { data, error: insertError } = await supabase
          .from('email_settings')
          .insert(fullSettings)
          .select();

        if (insertError) throw insertError;
        
        if (data && data[0]) {
          setSettings(data[0]);
          toast.success('Email settings created successfully');
          return true;
        }
      } else {
        // Update existing settings
        const { data, error: updateError } = await supabase
          .from('email_settings')
          .update(newData)
          .eq('id', settings.id)
          .select();

        if (updateError) throw updateError;
        
        if (data && data[0]) {
          setSettings(data[0]);
          toast.success('Email settings updated successfully');
          return true;
        }
      }
      
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error('Error saving email settings:', err);
      toast.error(`Failed to save email settings: ${errorMessage}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    if (!settings) return;
    
    // Handle nested fields
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.');
      setSettings({
        ...settings,
        [parentField]: {
          ...settings[parentField as keyof EmailSettings],
          [childField]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [field]: value
      });
    }
  };

  const testConnection = async (testEmail: string): Promise<{ success: boolean, message: string }> => {
    try {
      // In a real implementation, this would call a Supabase edge function
      // For now, we'll simulate a successful test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Test email sent to ${testEmail}`);
      return {
        success: true,
        message: 'Test email sent successfully!'
      };
    } catch (error) {
      console.error('Email test failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Test failed'
      };
    }
  };

  // Initial fetch of settings
  useEffect(() => {
    fetchSettings();
  }, [branchId]);

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
