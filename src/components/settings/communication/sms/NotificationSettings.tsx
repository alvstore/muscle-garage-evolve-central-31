import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { SmsTemplates } from '@/types/communication/sms';

interface NotificationSettingsProps {
  templates: SmsTemplates;
  onChange: (templates: SmsTemplates) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  templates,
  onChange,
}) => {
  const { toast } = useToast();
  const [localTemplates, setLocalTemplates] = React.useState(templates);

  React.useEffect(() => {
    setLocalTemplates(templates);
  }, [templates]);

  const handleToggle = (key: keyof SmsTemplates, value: boolean) => {
    const updatedTemplates = {
      ...localTemplates,
      [key]: value
    };
    setLocalTemplates(updatedTemplates);
    onChange(updatedTemplates);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure which notifications should be sent via SMS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="membership-alert">Membership Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Send SMS for membership-related alerts
              </p>
            </div>
            <Switch
              id="membership-alert"
              checked={localTemplates.membershipAlert}
              onCheckedChange={(checked) => handleToggle('membershipAlert', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="renewal-reminder">Renewal Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Send SMS reminders for membership renewals
              </p>
            </div>
            <Switch
              id="renewal-reminder"
              checked={localTemplates.renewalReminder}
              onCheckedChange={(checked) => handleToggle('renewalReminder', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="otp-verification">OTP Verification</Label>
              <p className="text-sm text-muted-foreground">
                Send OTP for verification
              </p>
            </div>
            <Switch
              id="otp-verification"
              checked={localTemplates.otpVerification}
              onCheckedChange={(checked) => handleToggle('otpVerification', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="attendance-confirmation">Attendance Confirmation</Label>
              <p className="text-sm text-muted-foreground">
                Send SMS for attendance confirmation
              </p>
            </div>
            <Switch
              id="attendance-confirmation"
              checked={localTemplates.attendanceConfirmation}
              onCheckedChange={(checked) => handleToggle('attendanceConfirmation', checked)}
            />
          </div>
        </div>


      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
