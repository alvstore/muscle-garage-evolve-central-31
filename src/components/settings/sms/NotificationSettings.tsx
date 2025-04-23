
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface NotificationTemplatesProps {
  membershipAlert: boolean;
  renewalReminder: boolean;
  otpVerification: boolean;
  attendanceConfirmation: boolean;
}

export interface NotificationSettingsProps {
  templates: NotificationTemplatesProps;
  onChange: (templates: NotificationTemplatesProps) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  templates, 
  onChange 
}) => {
  const handleToggle = (key: keyof NotificationTemplatesProps, value: boolean) => {
    onChange({
      ...templates,
      [key]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Membership Alerts</Label>
              <p className="text-sm text-muted-foreground">Notifications for membership status changes</p>
            </div>
            <Switch 
              checked={templates.membershipAlert}
              onCheckedChange={(value) => handleToggle('membershipAlert', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Renewal Reminders</Label>
              <p className="text-sm text-muted-foreground">Scheduled reminders before membership expires</p>
            </div>
            <Switch 
              checked={templates.renewalReminder}
              onCheckedChange={(value) => handleToggle('renewalReminder', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">OTP Verification</Label>
              <p className="text-sm text-muted-foreground">One-time password for account verification</p>
            </div>
            <Switch 
              checked={templates.otpVerification}
              onCheckedChange={(value) => handleToggle('otpVerification', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Attendance Confirmation</Label>
              <p className="text-sm text-muted-foreground">Confirmation messages for class attendance</p>
            </div>
            <Switch 
              checked={templates.attendanceConfirmation}
              onCheckedChange={(value) => handleToggle('attendanceConfirmation', value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
