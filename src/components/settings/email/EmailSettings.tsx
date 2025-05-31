
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/ui/use-toast";
import { Loader2, Save } from "lucide-react";
import { useBranch } from '@/hooks/settings/use-branches';
import { supabase } from '@/services/api/supabaseClient';
import { integrationsService } from '@/services/settings/integrationsService';
import { EmailSettings as EmailSettingsType } from '@/types/communication/notification';

const EmailSettings = () => {
  const { toast } = useToast();
  const { currentBranch } = useBranch();
  const [settings, setSettings] = useState<EmailSettingsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const fetchSettings = async () => {
      if (!currentBranch?.id) return;
      
      setIsLoading(true);
      try {
        const data = await integrationsService.getEmailSettings(currentBranch.id);
        setSettings(data || createDefaultSettings());
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load email settings",
          variant: "destructive",
        });
        console.error("Error fetching email settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [currentBranch?.id, toast]);

  const createDefaultSettings = (): EmailSettingsType => ({
    id: '',
    provider: 'sendgrid',
    from_email: '',
    is_active: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notifications: {
      sendOnInvoice: true,
      sendClassUpdates: true,
      sendOnRegistration: true,
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleNotificationToggle = (key: string, checked: boolean) => {
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: checked
        }
      };
    });
  };

  const handleProviderChange = (value: string) => {
    setSettings(prev => prev ? { ...prev, provider: value } : null);
    setActiveTab(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !currentBranch?.id) return;

    setIsSaving(true);
    try {
      let response;
      if (settings.id) {
        // Update existing settings
        const { data, error } = await supabase
          .from('email_settings')
          .update({
            provider: settings.provider,
            from_email: settings.from_email,
            sendgrid_api_key: settings.sendgrid_api_key,
            mailgun_api_key: settings.mailgun_api_key,
            mailgun_domain: settings.mailgun_domain,
            smtp_host: settings.smtp_host,
            smtp_port: settings.smtp_port,
            smtp_secure: settings.smtp_secure,
            smtp_username: settings.smtp_username,
            smtp_password: settings.smtp_password,
            is_active: settings.is_active,
            notifications: settings.notifications,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id)
          .select();
          
        if (error) throw error;
        response = data[0];
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('email_settings')
          .insert([{
            provider: settings.provider,
            from_email: settings.from_email,
            sendgrid_api_key: settings.sendgrid_api_key,
            mailgun_api_key: settings.mailgun_api_key,
            mailgun_domain: settings.mailgun_domain,
            smtp_host: settings.smtp_host,
            smtp_port: settings.smtp_port,
            smtp_secure: settings.smtp_secure,
            smtp_username: settings.smtp_username,
            smtp_password: settings.smtp_password,
            is_active: settings.is_active,
            branch_id: currentBranch.id,
            notifications: settings.notifications,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select();
          
        if (error) throw error;
        response = data[0];
      }

      setSettings(response);
      toast({
        title: "Success",
        description: "Email settings saved successfully",
      });
    } catch (error) {
      console.error("Error saving email settings:", error);
      toast({
        title: "Error",
        description: "Failed to save email settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Settings</CardTitle>
        <CardDescription>Configure how emails are sent from your system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from_email">From Email Address</Label>
                <Input
                  id="from_email"
                  name="from_email"
                  placeholder="noreply@yourgym.com"
                  value={settings?.from_email || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  checked={settings?.is_active || false}
                  onCheckedChange={(checked) => {
                    setSettings(prev => prev ? {...prev, is_active: checked} : null);
                  }}
                  id="is_active"
                />
                <Label htmlFor="is_active">Email notifications enabled</Label>
              </div>

              <div className="space-y-4 mt-4">
                <h4 className="font-medium">Notification Types</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings?.notifications?.sendOnInvoice || false}
                      onCheckedChange={(checked) => handleNotificationToggle('sendOnInvoice', checked)}
                      id="sendOnInvoice"
                    />
                    <Label htmlFor="sendOnInvoice">Send invoice notifications</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings?.notifications?.sendClassUpdates || false}
                      onCheckedChange={(checked) => handleNotificationToggle('sendClassUpdates', checked)}
                      id="sendClassUpdates"
                    />
                    <Label htmlFor="sendClassUpdates">Send class update notifications</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings?.notifications?.sendOnRegistration || false}
                      onCheckedChange={(checked) => handleNotificationToggle('sendOnRegistration', checked)}
                      id="sendOnRegistration"
                    />
                    <Label htmlFor="sendOnRegistration">Send registration notifications</Label>
                  </div>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={handleProviderChange}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="sendgrid">SendGrid</TabsTrigger>
                <TabsTrigger value="mailgun">Mailgun</TabsTrigger>
                <TabsTrigger value="smtp">SMTP</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sendgrid">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sendgrid_api_key">SendGrid API Key</Label>
                    <Input
                      id="sendgrid_api_key"
                      name="sendgrid_api_key"
                      type="password"
                      placeholder="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={settings?.sendgrid_api_key || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="mailgun">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mailgun_api_key">Mailgun API Key</Label>
                    <Input
                      id="mailgun_api_key"
                      name="mailgun_api_key"
                      type="password"
                      placeholder="key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={settings?.mailgun_api_key || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mailgun_domain">Mailgun Domain</Label>
                    <Input
                      id="mailgun_domain"
                      name="mailgun_domain"
                      placeholder="mg.yourdomain.com"
                      value={settings?.mailgun_domain || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="smtp">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp_host">SMTP Host</Label>
                      <Input
                        id="smtp_host"
                        name="smtp_host"
                        placeholder="smtp.yourdomain.com"
                        value={settings?.smtp_host || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp_port">SMTP Port</Label>
                      <Input
                        id="smtp_port"
                        name="smtp_port"
                        type="number"
                        placeholder="587"
                        value={settings?.smtp_port || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings?.smtp_secure || false}
                      onCheckedChange={(checked) => {
                        setSettings(prev => prev ? {...prev, smtp_secure: checked} : null);
                      }}
                      id="smtp_secure"
                    />
                    <Label htmlFor="smtp_secure">Use secure connection (SSL/TLS)</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp_username">SMTP Username</Label>
                    <Input
                      id="smtp_username"
                      name="smtp_username"
                      placeholder="username"
                      value={settings?.smtp_username || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp_password">SMTP Password</Label>
                    <Input
                      id="smtp_password"
                      name="smtp_password"
                      type="password"
                      placeholder="password"
                      value={settings?.smtp_password || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailSettings;
