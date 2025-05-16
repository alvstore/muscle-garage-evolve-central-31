import { useState, useEffect } from 'react';
import { integrationsService } from '@/services';
import { EmailSettings } from '@/types';

export const useEmailSettings = (branchId?: string) => {
  const [settings, setSettings] = useState<EmailSettings>({
    provider: '',
    from_email: '',
    is_active: false,
    notifications: {
      sendOnInvoice: true,
      sendClassUpdates: true,
      sendOnRegistration: true
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const fetchedSettings = await integrationsService.getEmailSettings(branchId);
        if (fetchedSettings) {
          setSettings(fetchedSettings);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load email settings');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [branchId]);
  
  const updateSettings = async (newSettings: EmailSettings): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await integrationsService.updateEmailSettings(newSettings, branchId);
      if (result) {
        setSettings(newSettings);
        return true;
      } else {
        setError('Failed to update email settings');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update email settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateIsActive = async (isActive: boolean): Promise<boolean> => {
    try {
      // Create a new settings object with updated is_active property
      const updatedSettings: EmailSettings = {
        ...settings,
        is_active: isActive
      };
      
      // Update the state with the new settings object
      setSettings(updatedSettings);
      
      // Call the API to update the settings
      const result = await integrationsService.updateEmailSettings(
        updatedSettings,
        branchId
      );
      
      return result;
    } catch (error) {
      console.error('Failed to update email active status:', error);
      return false;
    }
  };
  
  const updateNotifications = async (notifications: EmailSettings['notifications']): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedSettings: EmailSettings = {
        ...settings,
        notifications: notifications
      };
      
      const result = await integrationsService.updateEmailSettings(updatedSettings, branchId);
      if (result) {
        setSettings(updatedSettings);
        return true;
      } else {
        setError('Failed to update notification settings');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update notification settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    settings,
    isLoading,
    error,
    updateSettings,
    updateIsActive,
    updateNotifications
  };
};
