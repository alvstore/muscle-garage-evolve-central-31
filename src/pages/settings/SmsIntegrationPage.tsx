
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

const SmsIntegrationPage = () => {
  const { config, updateConfig, test, enable, disable } = useIntegrations('sms');

  const handleSave = async () => {
    const success = await updateConfig({
      // Update config properties
    }, 'sms');
    
    if (success) {
      toast.success("SMS settings saved successfully");
    } else {
      toast.error("Failed to save SMS settings");
    }
  };

  const handleTest = async () => {
    const result = await test();
    if (result.success) {
      toast.success("SMS connection test successful");
    } else {
      toast.error(`SMS test failed: ${result.message}`);
    }
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">SMS Integration</h1>
            <p className="text-muted-foreground">Configure SMS notifications and templates</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              checked={config.enabled} 
              onCheckedChange={(checked) => {
                if (checked) {
                  enable();
                  toast.success("SMS integration enabled");
                } else {
                  disable();
                  toast.success("SMS integration disabled");
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
            <TabsTrigger value="history">SMS History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SMS Provider</CardTitle>
                <CardDescription>Configure your SMS service provider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">SMS Provider</Label>
                  <select 
                    id="provider"
                    className="w-full p-2 border rounded-md"
                    value={config.provider || 'msg91'}
                    onChange={(e) => updateConfig({ provider: e.target.value }, 'sms')}
                  >
                    <option value="msg91">MSG91</option>
                    <option value="twilio">Twilio</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderId">Sender ID</Label>
                  <Input 
                    id="senderId"
                    placeholder="GYMAPP"
                    value={config.senderId || ''}
                    onChange={(e) => updateConfig({ senderId: e.target.value }, 'sms')}
                  />
                </div>
                
                {config.provider === 'msg91' && (
                  <div className="space-y-2">
                    <Label htmlFor="authKey">MSG91 Auth Key</Label>
                    <Input 
                      id="authKey"
                      type="password"
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                      value={config.authKey || ''}
                      onChange={(e) => updateConfig({ authKey: e.target.value }, 'sms')}
                    />
                  </div>
                )}
                
                {config.provider === 'twilio' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="accountSid">Twilio Account SID</Label>
                      <Input 
                        id="accountSid"
                        type="password"
                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxx"
                        value={config.accountSid || ''}
                        onChange={(e) => updateConfig({ accountSid: e.target.value }, 'sms')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="authToken">Twilio Auth Token</Label>
                      <Input 
                        id="authToken"
                        type="password"
                        placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                        value={config.authToken || ''}
                        onChange={(e) => updateConfig({ authToken: e.target.value }, 'sms')}
                      />
                    </div>
                  </>
                )}
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleTest}>Test Connection</Button>
                  <Button onClick={handleSave}>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure which events trigger SMS notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Membership Alerts</h3>
                    <p className="text-sm text-muted-foreground">Send SMS for membership expiry or renewal</p>
                  </div>
                  <Switch 
                    checked={config.templates?.membershipAlert || false}
                    onCheckedChange={(checked) => {
                      updateConfig({ 
                        templates: { 
                          ...config.templates,
                          membershipAlert: checked 
                        } 
                      }, 'sms');
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Renewal Reminders</h3>
                    <p className="text-sm text-muted-foreground">Send reminder before membership expiry</p>
                  </div>
                  <Switch 
                    checked={config.templates?.renewalReminder || false}
                    onCheckedChange={(checked) => {
                      updateConfig({ 
                        templates: { 
                          ...config.templates,
                          renewalReminder: checked 
                        } 
                      }, 'sms');
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">OTP Verification</h3>
                    <p className="text-sm text-muted-foreground">Send OTP for login verification</p>
                  </div>
                  <Switch 
                    checked={config.templates?.otpVerification || false}
                    onCheckedChange={(checked) => {
                      updateConfig({ 
                        templates: { 
                          ...config.templates,
                          otpVerification: checked 
                        } 
                      }, 'sms');
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Attendance Confirmation</h3>
                    <p className="text-sm text-muted-foreground">Send SMS when member checks in</p>
                  </div>
                  <Switch 
                    checked={config.templates?.attendanceConfirmation || false}
                    onCheckedChange={(checked) => {
                      updateConfig({ 
                        templates: { 
                          ...config.templates,
                          attendanceConfirmation: checked 
                        } 
                      }, 'sms');
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
                <CardTitle>SMS Templates</CardTitle>
                <CardDescription>Manage SMS templates for different notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 text-center text-gray-500">
                  SMS template editor will be implemented here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>SMS History</CardTitle>
                <CardDescription>View sent SMS logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 text-center text-gray-500">
                  SMS logs will be displayed here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default SmsIntegrationPage;
