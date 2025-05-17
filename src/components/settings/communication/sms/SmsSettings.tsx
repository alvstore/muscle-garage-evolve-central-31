import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotificationSettings from "./NotificationSettings";
import { useSmsSettings } from '@/hooks/settings/use-sms-settings';
import { Loader2 } from 'lucide-react';
import { SmsProviderSettings } from './SmsProviderSettings';
import { SmsProvider, SmsTemplates } from '@/types/communication/sms';

interface SmsSettingsType {
  provider?: SmsProvider | string;
  templates?: SmsTemplates;
}

export interface SmsSettingsProps {
  onClose?: () => void;
}

const SmsSettings: React.FC<SmsSettingsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = React.useState("provider");
  const { 
    settings, 
    isLoading, 
    isSaving,
    saveSettings,
    updateField,
    testConnection
  } = useSmsSettings();
  
  const defaultProvider: SmsProvider = {
    id: '',
    name: '',
    apiKey: '',
    senderId: '',
    isActive: false
  };
  
  const defaultTemplates: SmsTemplates = {
    membershipAlert: false,
    renewalReminder: false,
    otpVerification: false,
    attendanceConfirmation: false
  };
  
  const currentProvider = typeof settings?.provider === 'string' 
    ? defaultProvider 
    : settings?.provider || defaultProvider;
    
  const currentTemplates = settings?.templates || defaultTemplates;

  const handleUpdateConfig = async (newConfig: any) => {
    const updatedSettings = { ...settings, ...newConfig };
    await saveSettings(updatedSettings);
  };
  
  const handleSave = async () => {
    await saveSettings(settings);
    if (onClose) {
      onClose();
    }
  };
  
  const handleTestConnection = async () => {
    const testPhone = "+1234567890"; // In a real app, we would ask for this
    await testConnection(testPhone);
  };

  // Templates update function for the notifications tab
  const handleUpdateTemplates = (templates: any) => {
    updateField('templates', templates);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading settings...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Settings</CardTitle>
        <CardDescription>
          Configure your SMS provider and notification templates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="provider">Provider</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="provider" className="space-y-4 py-4">
            <SmsProviderSettings 
              provider={currentProvider}
              onUpdate={handleUpdateConfig}
              isSaving={isSaving}
            />
            
            <div className="flex justify-end pt-4 space-x-2">
              <Button 
                variant="outline" 
                onClick={handleTestConnection} 
                disabled={isSaving}
              >
                Test Connection
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Settings"
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4 py-4">
            <NotificationSettings 
              templates={currentTemplates}
              onChange={handleUpdateTemplates}
            />
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Settings"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SmsSettings;
