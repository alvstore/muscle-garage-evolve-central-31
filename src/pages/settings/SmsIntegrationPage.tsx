
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heading } from '@/components/ui/heading';
import NotificationSettings from '@/components/settings/sms/NotificationSettings';
import { SmsProviderSettings } from '@/components/settings/sms/SmsProviderSettings';
import { SmsSettingsHeader } from '@/components/settings/sms/SmsSettingsHeader';
import { useIntegrations } from '@/hooks/use-integrations';
import { IntegrationConfig } from '@/services/integrationService';
import { toast } from 'sonner';

const SmsIntegrationPage = () => {
  const { config, updateConfig, test, enable, disable } = useIntegrations('sms');
  const [isEnabled, setIsEnabled] = useState(config?.enabled || false);
  const [isTesting, setIsTesting] = useState(false);
  
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
  
  const handleUpdateConfig = (newConfig: Partial<IntegrationConfig>) => {
    updateConfig(newConfig);
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
              config={config || {}}
              onUpdateConfig={handleUpdateConfig}
              onTest={handleTestConnection}
              onSave={handleSaveConfig}
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
