
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { IntegrationConfig } from "@/services/integrationService";

interface NotificationSettingsProps {
  config: IntegrationConfig;
  onUpdateConfig: (config: Partial<IntegrationConfig>) => void;
  onSave: () => Promise<void>;
}

export const NotificationSettings = ({ 
  config, 
  onUpdateConfig, 
  onSave 
}: NotificationSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Configure which events trigger email notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">New Member Registration</h3>
            <p className="text-sm text-muted-foreground">Send welcome email when a new member registers</p>
          </div>
          <Switch 
            checked={config.notifications?.sendOnRegistration || false}
            onCheckedChange={(checked) => {
              onUpdateConfig({ 
                notifications: { 
                  ...config.notifications,
                  sendOnRegistration: checked 
                } 
              });
            }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Invoice Generated</h3>
            <p className="text-sm text-muted-foreground">Send email notification when invoice is generated</p>
          </div>
          <Switch 
            checked={config.notifications?.sendOnInvoice || false}
            onCheckedChange={(checked) => {
              onUpdateConfig({ 
                notifications: { 
                  ...config.notifications,
                  sendOnInvoice: checked 
                } 
              });
            }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Class Updates</h3>
            <p className="text-sm text-muted-foreground">Send email for class schedule changes</p>
          </div>
          <Switch 
            checked={config.notifications?.sendClassUpdates || false}
            onCheckedChange={(checked) => {
              onUpdateConfig({ 
                notifications: { 
                  ...config.notifications,
                  sendClassUpdates: checked 
                } 
              });
            }}
          />
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onSave}>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};
