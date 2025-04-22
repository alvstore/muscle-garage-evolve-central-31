
import React from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heading } from '@/components/ui/heading';
import NotificationSettings from '@/components/settings/sms/NotificationSettings';
import SmsProviderSettings from '@/components/settings/sms/SmsProviderSettings';
import SmsSettingsHeader from '@/components/settings/sms/SmsSettingsHeader';

const SmsIntegrationPage = () => {
  return (
    <Container>
      <div className="py-10 space-y-8">
        <Heading 
          title="SMS Integration Settings" 
          description="Configure SMS providers, templates, and notification settings"
        />
        
        <SmsSettingsHeader />
        
        <Tabs defaultValue="providers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="providers">SMS Providers</TabsTrigger>
            <TabsTrigger value="notifications">Notification Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="providers" className="space-y-4">
            <SmsProviderSettings />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default SmsIntegrationPage;
