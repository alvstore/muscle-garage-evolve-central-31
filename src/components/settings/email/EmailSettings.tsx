
import React from 'react';
import { useEmailSettings } from '@/hooks/use-email-settings';
import EmailProviderSettings from './EmailProviderSettings';
import EmailSettingsHeader from './EmailSettingsHeader';
import NotificationSettings from './NotificationSettings';

const EmailSettings = () => {
  const { settings, isLoading, error, isSaving, saveSettings, updateField, fetchSettings, testConnection } = useEmailSettings();

  const handleToggle = (checked: boolean) => {
    saveSettings({
      ...settings!,
      is_active: checked
    });
  };

  const handleNotificationSettingsChange = (notificationSettings: Record<string, boolean>) => {
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
    if (!settings) return false;
    
    try {
      const result = await testConnection("test@example.com");
      return result;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <EmailSettingsHeader 
        enabled={settings?.is_active || false} 
        onEnableChange={handleToggle}
        isLoading={isLoading}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <EmailProviderSettings 
            config={settings || {}}
            isLoading={isLoading}
            isSaving={isSaving}
            onUpdateConfig={handleConfigUpdate}
            onSave={() => saveSettings(settings!)}
            onTest={handleTest}
          />
        </div>
        
        <div className="md:col-span-2">
          <NotificationSettings 
            templates={settings?.notifications || {
              sendOnRegistration: true,
              sendOnInvoice: true,
              sendClassUpdates: false
            }}
            onChange={handleNotificationSettingsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;
