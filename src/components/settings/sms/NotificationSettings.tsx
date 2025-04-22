
import React from "react";
import { FormControl, FormDescription, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface Templates {
  membershipAlert: boolean;
  renewalReminder: boolean;
  otpVerification: boolean;
  attendanceConfirmation: boolean;
}

interface NotificationSettingsProps {
  templates: Templates;
  onChange: (templates: Templates) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  templates,
  onChange,
}) => {
  const handleTemplateChange = (
    key: keyof Templates,
    value: boolean
  ) => {
    onChange({
      ...templates,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">SMS Notification Templates</h3>
        <p className="text-muted-foreground mb-4">
          Enable or disable SMS notifications for different events
        </p>
      </div>

      <div className="space-y-4">
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Membership Alerts</FormLabel>
            <FormDescription>
              Send SMS notifications for membership-related events
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={templates.membershipAlert}
              onCheckedChange={(checked) =>
                handleTemplateChange("membershipAlert", checked)
              }
            />
          </FormControl>
        </FormItem>

        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Renewal Reminders</FormLabel>
            <FormDescription>
              Send reminders when memberships are about to expire
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={templates.renewalReminder}
              onCheckedChange={(checked) =>
                handleTemplateChange("renewalReminder", checked)
              }
            />
          </FormControl>
        </FormItem>

        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">OTP Verification</FormLabel>
            <FormDescription>
              Send one-time passwords for authentication
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={templates.otpVerification}
              onCheckedChange={(checked) =>
                handleTemplateChange("otpVerification", checked)
              }
            />
          </FormControl>
        </FormItem>

        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Attendance Confirmation</FormLabel>
            <FormDescription>
              Send confirmation messages when members check in
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={templates.attendanceConfirmation}
              onCheckedChange={(checked) =>
                handleTemplateChange("attendanceConfirmation", checked)
              }
            />
          </FormControl>
        </FormItem>
      </div>
    </div>
  );
};

export default NotificationSettings;
