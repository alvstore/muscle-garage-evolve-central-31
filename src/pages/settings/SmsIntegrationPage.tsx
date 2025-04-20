
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useIntegrations } from '@/hooks/use-integrations';
import { toast } from 'sonner';
import { IntegrationConfig } from '@/services/integrationService';

const SmsIntegrationPage = () => {
  const { config, updateConfig, test, enable, disable } = useIntegrations('sms');
  const [pendingChanges, setPendingChanges] = useState<Partial<IntegrationConfig>>({});

  // Collect changes without immediately applying them
  const handleUpdateConfig = (changes: Partial<IntegrationConfig>) => {
    setPendingChanges(prev => ({
      ...prev,
      ...changes
    }));
  };

  const handleSave = async () => {
    const success = updateConfig(pendingChanges);
    
    if (success) {
      toast.success("SMS settings saved successfully");
      setPendingChanges({});
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

  // Merge pending changes with current config for UI display
  const displayConfig = {
    ...config,
    ...pendingChanges
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
                    value={displayConfig.provider || 'msg91'}
                    onChange={(e) => handleUpdateConfig({ provider: e.target.value })}
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
                    value={displayConfig.senderId || ''}
                    onChange={(e) => handleUpdateConfig({ senderId: e.target.value })}
                  />
                </div>
                
                {displayConfig.provider === 'msg91' && (
                  <div className="space-y-2">
                    <Label htmlFor="authKey">MSG91 Auth Key</Label>
                    <Input 
                      id="authKey"
                      type="password"
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                      value={displayConfig.authKey || ''}
                      onChange={(e) => handleUpdateConfig({ authKey: e.target.value })}
                    />
                  </div>
                )}
                
                {displayConfig.provider === 'twilio' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="accountSid">Twilio Account SID</Label>
                      <Input 
                        id="accountSid"
                        type="password"
                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxx"
                        value={displayConfig.accountSid || ''}
                        onChange={(e) => handleUpdateConfig({ accountSid: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="authToken">Twilio Auth Token</Label>
                      <Input 
                        id="authToken"
                        type="password"
                        placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                        value={displayConfig.authToken || ''}
                        onChange={(e) => handleUpdateConfig({ authToken: e.target.value })}
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
                    checked={displayConfig.templates?.membershipAlert || false}
                    onCheckedChange={(checked) => {
                      handleUpdateConfig({ 
                        templates: { 
                          ...displayConfig.templates,
                          membershipAlert: checked 
                        } 
                      });
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Renewal Reminders</h3>
                    <p className="text-sm text-muted-foreground">Send reminder before membership expiry</p>
                  </div>
                  <Switch 
                    checked={displayConfig.templates?.renewalReminder || false}
                    onCheckedChange={(checked) => {
                      handleUpdateConfig({ 
                        templates: { 
                          ...displayConfig.templates,
                          renewalReminder: checked 
                        } 
                      });
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">OTP Verification</h3>
                    <p className="text-sm text-muted-foreground">Send OTP for login verification</p>
                  </div>
                  <Switch 
                    checked={displayConfig.templates?.otpVerification || false}
                    onCheckedChange={(checked) => {
                      handleUpdateConfig({ 
                        templates: { 
                          ...displayConfig.templates,
                          otpVerification: checked 
                        } 
                      });
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Attendance Confirmation</h3>
                    <p className="text-sm text-muted-foreground">Send SMS when member checks in</p>
                  </div>
                  <Switch 
                    checked={displayConfig.templates?.attendanceConfirmation || false}
                    onCheckedChange={(checked) => {
                      handleUpdateConfig({ 
                        templates: { 
                          ...displayConfig.templates,
                          attendanceConfirmation: checked 
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
