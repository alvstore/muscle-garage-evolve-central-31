
import React from 'react';
import { useEmailSettings } from '@/hooks/use-email-settings';
import { EmailProviderSettings } from './EmailProviderSettings';
import { EmailSettingsHeader } from './EmailSettingsHeader';
import { NotificationSettings } from './NotificationSettings';

const EmailSettings = () => {
  const { settings, isLoading, error, isSaving, saveSettings, updateField, fetchSettings, testConnection } = useEmailSettings();

  const handleToggle = (checked: boolean) => {
    saveSettings({
      ...settings!,
      is_active: checked
    });
  };

  const handleNotificationSettingsChange = (notificationSettings: {
    sendOnRegistration: boolean;
    sendOnInvoice: boolean;
    sendClassUpdates: boolean;
  }) => {
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
      return;
    } catch (error) {
      return;
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
              notifications: settings?.notifications
            }}
            isLoading={isLoading}
            isSaving={isSaving}
            onUpdateConfig={handleConfigUpdate}
            onSave={() => { saveSettings(settings!); }}
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
            onUpdateConfig={handleConfigUpdate}
            onSave={() => { saveSettings(settings!); }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;
