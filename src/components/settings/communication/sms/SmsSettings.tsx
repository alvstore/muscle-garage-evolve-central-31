
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotificationSettings from "./sms/NotificationSettings";
import { useSmsSettings } from "@/hooks/communication/use-sms-settings";
import { Loader2 } from "lucide-react";
import { SmsProviderSettings } from "./sms/SmsProviderSettings";

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

  const handleUpdateConfig = (newConfig: any) => {
    const updatedSettings = { ...settings, ...newConfig };
    saveSettings(updatedSettings);
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
        <CardTitle>SMS Integration Settings</CardTitle>
        <CardDescription>
          Configure SMS providers for sending notifications and reminders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="provider">Provider Settings</TabsTrigger>
            <TabsTrigger value="templates">Notification Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="provider" className="space-y-4 py-4">
            <SmsProviderSettings
              config={settings || {}}
              onUpdateConfig={handleUpdateConfig}
              onTest={handleTestConnection}
              onSave={handleSave}
              isSaving={isSaving}
            />
            
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
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
              templates={settings?.templates || {
                membershipAlert: false,
                renewalReminder: false,
                otpVerification: false,
                attendanceConfirmation: false
              }}
              onChange={handleUpdateTemplates}
            />
            
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
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
