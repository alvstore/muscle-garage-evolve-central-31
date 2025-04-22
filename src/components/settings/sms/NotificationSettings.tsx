
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'member' | 'admin' | 'system';
}

const NotificationSettings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'membership_expiry',
      name: 'Membership Expiry',
      description: 'Send SMS reminder when membership is about to expire',
      enabled: true,
      type: 'member'
    },
    {
      id: 'payment_due',
      name: 'Payment Due',
      description: 'Send SMS reminder when payment is due',
      enabled: true,
      type: 'member'
    },
    {
      id: 'class_reminder',
      name: 'Class Reminder',
      description: 'Send SMS reminder before scheduled classes',
      enabled: true,
      type: 'member'
    },
    {
      id: 'birthday_wish',
      name: 'Birthday Wish',
      description: 'Send birthday greetings to members',
      enabled: true,
      type: 'member'
    },
    {
      id: 'new_member',
      name: 'New Member Registration',
      description: 'Notify admin when a new member joins',
      enabled: true,
      type: 'admin'
    },
    {
      id: 'payment_received',
      name: 'Payment Received',
      description: 'Notify admin when a payment is received',
      enabled: true,
      type: 'admin'
    },
    {
      id: 'attendance_alert',
      name: 'Attendance Alert',
      description: 'Notify system about attendance status',
      enabled: true,
      type: 'system'
    },
    {
      id: 'error_notifications',
      name: 'Error Notifications',
      description: 'Send system error notifications to administrators',
      enabled: true,
      type: 'system'
    }
  ]);

  const handleToggleNotification = (id: string, enabled: boolean) => {
    setNotificationSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.id === id ? { ...setting, enabled } : setting
      )
    );
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('SMS notification settings saved successfully');
      setIsSaving(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Notification Settings</CardTitle>
        <CardDescription>
          Configure which SMS notifications are sent to members, admins, and for system events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="member">
          <TabsList className="mb-4">
            <TabsTrigger value="member">Member Notifications</TabsTrigger>
            <TabsTrigger value="admin">Admin Notifications</TabsTrigger>
            <TabsTrigger value="system">System Notifications</TabsTrigger>
          </TabsList>

          {['member', 'admin', 'system'].map((type) => (
            <TabsContent key={type} value={type} className="space-y-4">
              {notificationSettings
                .filter(setting => setting.type === type)
                .map(setting => (
                  <div key={setting.id} className="flex items-center justify-between space-x-2 rounded-md border p-4">
                    <div>
                      <h4 className="font-medium">{setting.name}</h4>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`switch-${setting.id}`}
                        checked={setting.enabled}
                        onCheckedChange={(checked) => handleToggleNotification(setting.id, checked)}
                      />
                      <Label htmlFor={`switch-${setting.id}`} className="sr-only">
                        Toggle {setting.name}
                      </Label>
                    </div>
                  </div>
                ))
              }
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
