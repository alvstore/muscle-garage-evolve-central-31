
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IntegrationConfig } from '@/services/integrationService';

interface NotificationSettingsProps {
  config: Partial<IntegrationConfig>;
  onUpdateConfig: (config: Partial<IntegrationConfig>) => void;
  onSave: () => void;
}

export const NotificationSettings = ({
  config,
  onUpdateConfig,
  onSave
}: NotificationSettingsProps) => {
  const templates = config.templates || {};

  const handleTemplateChange = (key: string, value: boolean) => {
    onUpdateConfig({
      templates: {
        ...templates,
        [key]: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Configure which events trigger SMS notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Membership Alerts</Label>
              <p className="text-sm text-muted-foreground">Send SMS for membership expiry or renewal</p>
            </div>
            <Switch
              checked={templates.membershipAlert || false}
              onCheckedChange={(checked) => handleTemplateChange('membershipAlert', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Renewal Reminders</Label>
              <p className="text-sm text-muted-foreground">Send reminder before membership expiry</p>
            </div>
            <Switch
              checked={templates.renewalReminder || false}
              onCheckedChange={(checked) => handleTemplateChange('renewalReminder', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">OTP Verification</Label>
              <p className="text-sm text-muted-foreground">Send OTP for login verification</p>
            </div>
            <Switch
              checked={templates.otpVerification || false}
              onCheckedChange={(checked) => handleTemplateChange('otpVerification', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Attendance Confirmation</Label>
              <p className="text-sm text-muted-foreground">Send SMS when member checks in</p>
            </div>
            <Switch
              checked={templates.attendanceConfirmation || false}
              onCheckedChange={(checked) => handleTemplateChange('attendanceConfirmation', checked)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};
