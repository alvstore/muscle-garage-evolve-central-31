
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heading } from '@/components/ui/heading';
import NotificationSettings from '@/components/settings/communication/sms/NotificationSettings';
import { SmsProviderSettings } from '@/components/settings/communication/sms/SmsProviderSettings';
import { SmsSettingsHeader } from '@/components/settings/sms/SmsSettingsHeader';
import { useIntegrations } from '@/hooks/settings/use-integrations';
import integrationService, { IntegrationConfig } from '@/services/settings/integrationService';
import { SmsProvider } from '@/types/communication/sms';
import { toast } from 'sonner';

const SmsIntegrationPage = () => {
  const { config, updateConfig, test, enable, disable } = useIntegrations('sms');
  const [isEnabled, setIsEnabled] = useState(config?.enabled || false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleEnableChange = (checked: boolean) => {
    setIsEnabled(checked);
    const success = checked ? enable() : disable();
    
    if (success) {
      toast.success(`SMS integration ${checked ? 'enabled' : 'disabled'}`);
    } else {
      toast.error(`Failed to ${checked ? 'enable' : 'disable'} SMS integration`);
      setIsEnabled(!checked); // Revert the UI state
    }
  };
  
  const handleUpdateConfig = async (newConfig: Partial<IntegrationConfig>) => {
    setIsSaving(true);
    try {
      await updateConfig(newConfig);
      toast.success("SMS settings updated successfully");
    } catch (error) {
      console.error("Error updating SMS settings:", error);
      toast.error("Failed to update SMS settings");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveConfig = () => {
    toast.success("SMS settings saved successfully");
  };
  
  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const result = await test();
      if (result.success) {
        toast.success(result.message || "Test successful");
      } else {
        toast.error(result.message || "Test failed");
      }
    } catch (error) {
      toast.error("An error occurred during testing");
      console.error(error);
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <Container>
      <div className="py-10 space-y-8">
        <Heading 
          title="SMS Integration Settings" 
          description="Configure SMS providers, templates, and notification settings"
        />
        
        <SmsSettingsHeader 
          enabled={isEnabled} 
          onEnableChange={handleEnableChange}
        />
        
        <Tabs defaultValue="providers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="providers">SMS Providers</TabsTrigger>
            <TabsTrigger value="notifications">Notification Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="providers" className="space-y-4">
            <SmsProviderSettings 
              provider={{
                id: 'sms',
                name: config?.provider || '',
                apiKey: config?.msg91AuthKey || config?.twilioAccountSid || '',
                senderId: config?.senderId || '',
                isActive: config?.enabled || false
              }}
              onUpdate={async (updates: Partial<SmsProvider>) => {
                const newConfig: Partial<IntegrationConfig> = {
                  ...config,
                  provider: updates.name || config?.provider,
                  senderId: updates.senderId || config?.senderId,
                  msg91AuthKey: updates.apiKey || config?.msg91AuthKey,
                  twilioAccountSid: updates.apiKey || config?.twilioAccountSid,
                  enabled: updates.isActive ?? config?.enabled
                };
                await handleUpdateConfig(newConfig);
              }}
              isSaving={isSaving}
            />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <NotificationSettings 
              templates={{
                membershipAlert: config?.templates?.membershipAlert || false,
                renewalReminder: config?.templates?.renewalReminder || false,
                otpVerification: config?.templates?.otpVerification || false,
                attendanceConfirmation: config?.templates?.attendanceConfirmation || false
              }}
              onChange={(templates) => handleUpdateConfig({ templates })}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default SmsIntegrationPage;
