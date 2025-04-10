import { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { usePermissions } from '@/hooks/use-permissions';
import HikvisionWebhookHandler from '@/components/integrations/HikvisionWebhookHandler';
import PushNotificationManager from '@/components/integrations/PushNotificationManager';
import RazorpayWebhookConfig from '@/components/integrations/RazorpayWebhookConfig';

const IntegrationsPage = () => {
  const { can } = usePermissions();
  const [activeTab, setActiveTab] = useState('access-control');
  
  // Hikvision settings
  const [hikvisionSettings, setHikvisionSettings] = useState({
    apiUrl: '',
    username: '',
    password: '',
    enabled: false
  });
  
  // Razorpay settings
  const [razorpaySettings, setRazorpaySettings] = useState({
    apiKey: '',
    secretKey: '',
    enabled: true
  });
  
  // Messaging settings
  const [messagingSettings, setMessagingSettings] = useState({
    whatsappEnabled: true,
    smsEnabled: true,
    emailEnabled: true,
    pushEnabled: true,
    whatsappApiKey: '',
    smsApiKey: '',
    emailApiKey: ''
  });
  
  const handleSaveHikvisionSettings = () => {
    // In a real app, this would save settings to backend
    toast.success('Hikvision settings saved successfully');
  };
  
  const handleSaveRazorpaySettings = () => {
    // In a real app, this would save settings to backend
    toast.success('Razorpay settings saved successfully');
  };
  
  const handleSaveMessagingSettings = () => {
    // In a real app, this would save settings to backend
    toast.success('Messaging settings saved successfully');
  };
  
  if (!can('manage_branches')) {
    return (
      <Container>
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
          <p className="text-muted-foreground">
            You don't have permission to access integration settings.
          </p>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Integration Settings</h1>
        
        <Tabs defaultValue="access-control" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="access-control">Access Control</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="webhooks">Payment Webhooks</TabsTrigger>
            <TabsTrigger value="messaging">Messaging</TabsTrigger>
            <TabsTrigger value="notifications">Push Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="access-control">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hikvision Access Control Settings</CardTitle>
                  <CardDescription>
                    Configure your Hikvision access control system integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hikvision-enabled">Enable Hikvision Integration</Label>
                      <Switch
                        id="hikvision-enabled"
                        checked={hikvisionSettings.enabled}
                        onCheckedChange={(checked) => 
                          setHikvisionSettings({...hikvisionSettings, enabled: checked})
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hikvision-api-url">API URL</Label>
                      <Input
                        id="hikvision-api-url"
                        placeholder="https://your-hikvision-controller-ip"
                        value={hikvisionSettings.apiUrl}
                        onChange={(e) => 
                          setHikvisionSettings({...hikvisionSettings, apiUrl: e.target.value})
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hikvision-username">Username</Label>
                      <Input
                        id="hikvision-username"
                        value={hikvisionSettings.username}
                        onChange={(e) => 
                          setHikvisionSettings({...hikvisionSettings, username: e.target.value})
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hikvision-password">Password</Label>
                      <Input
                        id="hikvision-password"
                        type="password"
                        value={hikvisionSettings.password}
                        onChange={(e) => 
                          setHikvisionSettings({...hikvisionSettings, password: e.target.value})
                        }
                      />
                    </div>
                    
                    <Button onClick={handleSaveHikvisionSettings}>
                      Save Hikvision Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <HikvisionWebhookHandler />
            </div>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Razorpay Payment Gateway Settings</CardTitle>
                <CardDescription>
                  Configure your Razorpay payment gateway integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="razorpay-enabled">Enable Razorpay Integration</Label>
                    <Switch
                      id="razorpay-enabled"
                      checked={razorpaySettings.enabled}
                      onCheckedChange={(checked) => 
                        setRazorpaySettings({...razorpaySettings, enabled: checked})
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="razorpay-api-key">API Key (Public Key)</Label>
                    <Input
                      id="razorpay-api-key"
                      value={razorpaySettings.apiKey}
                      onChange={(e) => 
                        setRazorpaySettings({...razorpaySettings, apiKey: e.target.value})
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Your Razorpay API key (starts with 'rzp_test_' or 'rzp_live_')
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="razorpay-secret-key">Secret Key</Label>
                    <Input
                      id="razorpay-secret-key"
                      type="password"
                      value={razorpaySettings.secretKey}
                      onChange={(e) => 
                        setRazorpaySettings({...razorpaySettings, secretKey: e.target.value})
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be securely stored and only used on the server
                    </p>
                  </div>
                  
                  <Button onClick={handleSaveRazorpaySettings}>
                    Save Razorpay Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="webhooks">
            <RazorpayWebhookConfig />
          </TabsContent>
          
          <TabsContent value="messaging">
            <Card>
              <CardHeader>
                <CardTitle>Messaging Integration Settings</CardTitle>
                <CardDescription>
                  Configure WhatsApp, SMS, and Email notification settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-4">WhatsApp Cloud API</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="whatsapp-enabled">Enable WhatsApp Integration</Label>
                        <Switch
                          id="whatsapp-enabled"
                          checked={messagingSettings.whatsappEnabled}
                          onCheckedChange={(checked) => 
                            setMessagingSettings({...messagingSettings, whatsappEnabled: checked})
                          }
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp-api-key">WhatsApp API Key</Label>
                        <Input
                          id="whatsapp-api-key"
                          value={messagingSettings.whatsappApiKey}
                          onChange={(e) => 
                            setMessagingSettings({...messagingSettings, whatsappApiKey: e.target.value})
                          }
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-4">SMS Integration (Twilio/MSG91)</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sms-enabled">Enable SMS Integration</Label>
                        <Switch
                          id="sms-enabled"
                          checked={messagingSettings.smsEnabled}
                          onCheckedChange={(checked) => 
                            setMessagingSettings({...messagingSettings, smsEnabled: checked})
                          }
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sms-api-key">SMS API Key</Label>
                        <Input
                          id="sms-api-key"
                          value={messagingSettings.smsApiKey}
                          onChange={(e) => 
                            setMessagingSettings({...messagingSettings, smsApiKey: e.target.value})
                          }
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pb-4">
                    <h3 className="text-lg font-medium mb-4">Email Integration (SendGrid/Mailgun)</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-enabled">Enable Email Integration</Label>
                        <Switch
                          id="email-enabled"
                          checked={messagingSettings.emailEnabled}
                          onCheckedChange={(checked) => 
                            setMessagingSettings({...messagingSettings, emailEnabled: checked})
                          }
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email-api-key">Email API Key</Label>
                        <Input
                          id="email-api-key"
                          value={messagingSettings.emailApiKey}
                          onChange={(e) => 
                            setMessagingSettings({...messagingSettings, emailApiKey: e.target.value})
                          }
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveMessagingSettings}>
                    Save Messaging Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <PushNotificationManager />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default IntegrationsPage;
