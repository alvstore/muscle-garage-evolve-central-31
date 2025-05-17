
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIntegrations } from '@/hooks/integrations/use-integrations';
import { toast } from 'sonner';
import { EmailSettingsHeader } from '@/components/settings/email/EmailSettingsHeader';
import { EmailProviderSettings } from '@/components/settings/email/EmailProviderSettings';
import { NotificationSettings } from '@/components/settings/email/NotificationSettings';
import { IntegrationConfig } from '@/services/integrationService';

const EmailIntegrationPage = () => {
  const { config, updateConfig, test, enable, disable } = useIntegrations('email');
  const [pendingChanges, setPendingChanges] = useState<Partial<IntegrationConfig>>({});

  // Collect changes without immediately applying them
  const handleUpdateConfig = (changes: Partial<IntegrationConfig>) => {
    setPendingChanges(prev => ({
      ...prev,
      ...changes
    }));
  };

  const handleSave = async () => {
    // Make sure to include the required fields
    const updatedConfig: Partial<IntegrationConfig> = {
      ...pendingChanges,
      provider: (pendingChanges.provider || config.provider)
    };
    
    const success = updateConfig(updatedConfig);
    
    if (success) {
      toast.success("Email settings saved successfully");
      setPendingChanges({});
    } else {
      toast.error("Failed to save email settings");
    }
  };

  const handleTest = async () => {
    const result = await test();
    if (result.success) {
      toast.success("Email connection test successful");
    } else {
      toast.error(`Email test failed: ${result.message}`);
    }
  };

  // Merge pending changes with current config for UI display, ensuring provider is always defined
  const displayConfig: IntegrationConfig = {
    ...config,
    ...pendingChanges,
    provider: (pendingChanges.provider || config.provider)
  };

  return (
    <Container>
      <div className="py-6">
        <EmailSettingsHeader 
          enabled={config.enabled}
          onEnableChange={(checked) => {
            if (checked) {
              enable();
            } else {
              disable();
            }
          }}
        />
        
        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Email History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4">
            <EmailProviderSettings 
              config={displayConfig}
              onUpdateConfig={handleUpdateConfig}
              onTest={handleTest}
              onSave={handleSave}
            />
            
            <NotificationSettings 
              config={displayConfig}
              onUpdateConfig={handleUpdateConfig}
              onSave={handleSave}
            />
          </TabsContent>
          
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>Manage email templates for different notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 text-center text-gray-500">
                  Email template editor will be implemented here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Email History</CardTitle>
                <CardDescription>View sent email logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 text-center text-gray-500">
                  Email logs will be displayed here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default EmailIntegrationPage;
