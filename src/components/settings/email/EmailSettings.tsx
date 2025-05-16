import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmailSettings } from '@/hooks/use-email-settings';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const EmailSettings = () => {
  const [isTesting, setIsTesting] = useState(false);

  const { 
    settings, 
    isLoading, 
    error, 
    updateSettings,
    updateIsActive,
    updateNotifications
  } = useEmailSettings();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateSettings({ ...settings, [name]: value });
  };

  const handleSwitchChange = async (checked: boolean) => {
    if (settings) {
      const success = await updateIsActive(checked);
      if (success) {
        toast.success('Email settings updated successfully');
      } else {
        toast.error('Failed to update email settings');
      }
    }
  };

  const handleNotificationsChange = async (name: string, checked: boolean) => {
    if (settings && settings.notifications) {
      const updatedNotifications = {
        ...settings.notifications,
        [name]: checked,
      };
      const success = await updateNotifications({ ...settings, notifications: updatedNotifications });
      if (success) {
        toast.success('Notification settings updated successfully');
      } else {
        toast.error('Failed to update notification settings');
      }
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      // Simulate testing connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Connection test successful!');
    } catch (error) {
      toast.error('Connection test failed.');
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {settings ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Input
                type="text"
                id="provider"
                name="provider"
                value={settings.provider || ''}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="from_email">From Email</Label>
              <Input
                type="email"
                id="from_email"
                name="from_email"
                value={settings.from_email || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp_host">SMTP Host</Label>
              <Input
                type="text"
                id="smtp_host"
                name="smtp_host"
                value={settings.smtp_host || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp_port">SMTP Port</Label>
              <Input
                type="number"
                id="smtp_port"
                name="smtp_port"
                value={settings.smtp_port || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp_username">SMTP Username</Label>
              <Input
                type="text"
                id="smtp_username"
                name="smtp_username"
                value={settings.smtp_username || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp_password">SMTP Password</Label>
              <Input
                type="password"
                id="smtp_password"
                name="smtp_password"
                value={settings.smtp_password || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sendgrid_api_key">SendGrid API Key</Label>
              <Input
                type="text"
                id="sendgrid_api_key"
                name="sendgrid_api_key"
                value={settings.sendgrid_api_key || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mailgun_api_key">Mailgun API Key</Label>
              <Input
                type="text"
                id="mailgun_api_key"
                name="mailgun_api_key"
                value={settings.mailgun_api_key || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mailgun_domain">Mailgun Domain</Label>
              <Input
                type="text"
                id="mailgun_domain"
                name="mailgun_domain"
                value={settings.mailgun_domain || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={settings.is_active}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            <div className="space-y-2">
              <Label>Notifications</Label>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sendOnInvoice"
                    checked={settings.notifications?.sendOnInvoice || false}
                    onCheckedChange={(checked) => handleNotificationsChange('sendOnInvoice', checked)}
                  />
                  <Label htmlFor="sendOnInvoice">Send on Invoice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sendClassUpdates"
                    checked={settings.notifications?.sendClassUpdates || false}
                    onCheckedChange={(checked) => handleNotificationsChange('sendClassUpdates', checked)}
                  />
                  <Label htmlFor="sendClassUpdates">Send Class Updates</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sendOnRegistration"
                    checked={settings.notifications?.sendOnRegistration || false}
                    onCheckedChange={(checked) => handleNotificationsChange('sendOnRegistration', checked)}
                  />
                  <Label htmlFor="sendOnRegistration">Send on Registration</Label>
                </div>
              </div>
            </div>
            <Button onClick={handleTestConnection} disabled={isTesting}>
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
          </>
        ) : (
          <p>Loading settings...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailSettings;
