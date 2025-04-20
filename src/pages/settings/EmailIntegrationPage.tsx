
import React from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useIntegrations } from '@/hooks/use-integrations';
import { toast } from 'sonner';

const EmailIntegrationPage = () => {
  const { config, updateConfig, test, enable, disable } = useIntegrations('email');

  const handleSave = async () => {
    const success = await updateConfig({
      // Update config properties
    });
    
    if (success) {
      toast.success("Email settings saved successfully");
    } else {
      toast.error("Failed to save email settings");
    }
  };

  const handleTest = async () => {
    const result = await test();
    if (result.success) {
      toast.success("Email connection test successful");
    } else {
      toast.error(`Email test failed: ${result.message}`);
    }
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Email Integration</h1>
            <p className="text-muted-foreground">Configure email notifications and templates</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              checked={config.enabled} 
              onCheckedChange={(checked) => {
                if (checked) {
                  enable();
                  toast.success("Email integration enabled");
                } else {
                  disable();
                  toast.success("Email integration disabled");
                }
              }}
            />
            <Label>{config.enabled ? 'Enabled' : 'Disabled'}</Label>
          </div>
        </div>
        
        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Email History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Provider</CardTitle>
                <CardDescription>Configure your email service provider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Email Provider</Label>
                  <select 
                    id="provider"
                    className="w-full p-2 border rounded-md"
                    value={config.provider || 'sendgrid'}
                    onChange={(e) => updateConfig({ provider: e.target.value })}
                  >
                    <option value="sendgrid">SendGrid</option>
                    <option value="mailgun">Mailgun</option>
                    <option value="smtp">Custom SMTP</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email Address</Label>
                  <Input 
                    id="fromEmail"
                    placeholder="noreply@yourgym.com"
                    value={config.fromEmail || ''}
                    onChange={(e) => updateConfig({ fromEmail: e.target.value })}
                  />
                </div>
                
                {config.provider === 'sendgrid' && (
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">SendGrid API Key</Label>
                    <Input 
                      id="apiKey"
                      type="password"
                      placeholder="SG.xxxxxxxxxxxxxxxxxxxxxxxx"
                      value={config.apiKey || ''}
                      onChange={(e) => updateConfig({ apiKey: e.target.value })}
                    />
                  </div>
                )}
                
                {/* Additional provider-specific settings would go here */}
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleTest}>Test Connection</Button>
                  <Button onClick={handleSave}>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
            
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
                      updateConfig({ 
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
                      updateConfig({ 
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
                      updateConfig({ 
                        notifications: { 
                          ...config.notifications,
                          sendClassUpdates: checked 
                        } 
                      });
                    }}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSave}>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>Manage email templates for different notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 text-center text-gray-500">
                  Email template editor will be implemented here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Email History</CardTitle>
                <CardDescription>View sent email logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 text-center text-gray-500">
                  Email logs will be displayed here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default EmailIntegrationPage;
