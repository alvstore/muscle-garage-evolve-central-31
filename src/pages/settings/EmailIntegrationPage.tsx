
import React from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIntegrations } from '@/hooks/use-integrations';
import { toast } from 'sonner';
import { EmailSettingsHeader } from '@/components/settings/email/EmailSettingsHeader';
import { EmailProviderSettings } from '@/components/settings/email/EmailProviderSettings';
import { NotificationSettings } from '@/components/settings/email/NotificationSettings';

const EmailIntegrationPage = () => {
  const { config, updateConfig, test, enable, disable } = useIntegrations('email');

  const handleSave = async () => {
    // Empty object is replaced with actual config changes when form is implemented
    const configChanges = {};
    
    const success = await updateConfig(configChanges);
    
    if (success) {
      toast.success("Email settings saved successfully");
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
              config={config}
              onUpdateConfig={updateConfig}
              onTest={handleTest}
              onSave={handleSave}
            />
            
            <NotificationSettings 
              config={config}
              onUpdateConfig={updateConfig}
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
