
import React from 'react';
import { useEmailSettings } from '@/hooks/use-email-settings';
import { EmailProviderSettings } from './EmailProviderSettings';
import { EmailSettingsHeader } from './EmailSettingsHeader';
import { NotificationSettings } from './NotificationSettings';

interface EmailNotifications {
  sendOnRegistration: boolean;
  sendOnInvoice: boolean;
  sendClassUpdates: boolean;
}

interface EmailSettingsData {
  is_active: boolean;
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
  notifications: EmailNotifications;
}

const EmailSettings = () => {
  const { settings, isLoading, error, isSaving, saveSettings, updateField, fetchSettings, testConnection } = useEmailSettings();

  const handleToggle = (checked: boolean) => {
    if (!settings) return;
    
    saveSettings({
      ...settings,
      is_active: checked
    });
  };

  const handleNotificationSettingsChange = (notificationSettings: EmailNotifications) => {
    if (!settings) return;
    
    saveSettings({
      ...settings,
      notifications: notificationSettings
    });
  };

  const handleConfigUpdate = (newConfig: any) => {
    if (!settings) return;
    
    saveSettings({
      ...settings,
      ...newConfig
    });
  };

  const handleTest = async () => {
    if (!settings) return;
    
    try {
      await testConnection("test@example.com");
    } catch (error) {
      console.error('Test connection failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <EmailSettingsHeader 
        enabled={settings?.is_active || false} 
        onEnableChange={handleToggle}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <EmailProviderSettings 
            config={{
              enabled: settings?.is_active || false,
              provider: settings?.provider || 'sendgrid',
              fromEmail: settings?.from_email || '',
              apiKey: settings?.sendgrid_api_key || '',
              sendgrid_api_key: settings?.sendgrid_api_key,
              mailgun_api_key: settings?.mailgun_api_key,
              mailgun_domain: settings?.mailgun_domain,
              smtp_host: settings?.smtp_host,
              smtp_port: settings?.smtp_port,
              smtp_username: settings?.smtp_username,
              smtp_password: settings?.smtp_password,
              smtp_secure: settings?.smtp_secure,
              notifications: settings?.notifications || {
                sendOnRegistration: true,
                sendOnInvoice: true,
                sendClassUpdates: false
              }
            }}
            isLoading={isLoading}
            isSaving={isSaving}
            onUpdateConfig={handleConfigUpdate}
            onSave={() => {
              if (settings) {
                return Promise.resolve(void saveSettings(settings));
              }
              return Promise.resolve();
            }}
            onTest={handleTest}
          />
        </div>
        
        <div className="md:col-span-2">
          <NotificationSettings 
            config={{
              enabled: settings?.is_active || false,
              provider: settings?.provider || 'sendgrid',
              notifications: settings?.notifications || {
                sendOnRegistration: true,
                sendOnInvoice: true,
                sendClassUpdates: false
              }
            }}
            onUpdateConfig={handleNotificationSettingsChange}
            onSave={() => {
              if (settings) {
                return Promise.resolve(void saveSettings(settings));
              }
              return Promise.resolve();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;
