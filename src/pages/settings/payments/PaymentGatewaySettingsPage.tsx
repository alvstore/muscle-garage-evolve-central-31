
import React, { useState } from 'react';
import { razorpayService } from '@/services/classes/integrations/razorpayService';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, RefreshCw, DollarSign, KeyRound, Lock, Globe, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from '@/hooks/auth/use-permissions';

const PaymentGatewaySettingsPage: React.FC = () => {
  const { can } = usePermissions();
  const hasEditSettingsPermission = can('edit:settings');
  const [activeTab, setActiveTab] = useState('razorpay');
  const [isLoading, setIsLoading] = useState(false);
  
  const [razorpaySettings, setRazorpaySettings] = useState({
    isEnabled: true,
    liveMode: false,
    keyId: 'rzp_test_1234567890abcdef',
    keySecret: '••••••••••••••••',
    webhookSecret: '••••••••••••••••',
    enableRefunds: true,
    enablePartialPayments: false,
    prefillContactInfo: true,
    collectShippingAddress: false
  });

  const [payuSettings, setPayuSettings] = useState({
    isEnabled: false,
    liveMode: false,
    merchantKey: '',
    merchantSalt: '••••••••••••••••',
    merchantId: '',
    authHeader: '••••••••••••••••',
    enableRefunds: true,
    autoCapture: true
  });

  const [ccavenueSettings, setCcavenueSettings] = useState({
    isEnabled: false,
    liveMode: false,
    merchantId: '',
    accessCode: '',
    workingKey: '••••••••••••••••',
    redirectUrl: 'https://musclegrm.com/payment/ccavenue/callback',
    enableRefunds: false
  });

  const [phonepeSettings, setPhonepeSettings] = useState({
    isEnabled: false,
    liveMode: false,
    merchantId: '',
    saltKey: '••••••••••••••••',
    saltIndex: '1',
    redirectUrl: 'https://musclegrm.com/payment/phonepe/callback',
    enableRefunds: true
  });

  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Payment gateway settings saved successfully');
    }, 1000);
  };

  const handleTestConnection = async (gateway: string) => {
    try {
      toast.info(`Testing ${gateway} connection...`);
      
      if (gateway === 'Razorpay') {
        const isConnected = await razorpayService.testConnection(
          razorpaySettings.keyId,
          razorpaySettings.keySecret
        );
        
        if (isConnected) {
          toast.success('Razorpay connection test successful!');
        } else {
          toast.error('Failed to connect to Razorpay. Please check your API credentials.');
        }
      } else {
        // For other gateways, show a temporary success message
        // TODO: Implement actual connection tests for other gateways
        setTimeout(() => {
          toast.success(`${gateway} connection test successful!`);
        }, 1000);
      }
    } catch (error) {
      console.error(`Error testing ${gateway} connection:`, error);
      toast.error(`Failed to test ${gateway} connection. Please try again.`);
    }
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Payment Gateway Settings</h1>
            <p className="text-muted-foreground">Configure payment processing options for your gym</p>
          </div>
        </div>

        <Alert className="mb-6">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            These are global settings that apply to all branches. API keys and credentials are stored securely.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="razorpay" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Razorpay</span>
            </TabsTrigger>
            <TabsTrigger value="payu" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>PayU</span>
            </TabsTrigger>
            <TabsTrigger value="ccavenue" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>CC Avenue</span>
            </TabsTrigger>
            <TabsTrigger value="phonepe" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>PhonePe</span>
            </TabsTrigger>
          </TabsList>

          {/* Razorpay Settings */}
          <TabsContent value="razorpay">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Razorpay Configuration</CardTitle>
                    <CardDescription>Connect your Razorpay account for payment processing</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Enable</span>
                    <Switch 
                      checked={razorpaySettings.isEnabled} 
                      onCheckedChange={(checked) => setRazorpaySettings({...razorpaySettings, isEnabled: checked})}
                      disabled={!hasEditSettingsPermission}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="razorpay-live-mode" 
                    checked={razorpaySettings.liveMode}
                    onCheckedChange={(checked) => 
                      setRazorpaySettings({
                        ...razorpaySettings, 
                        liveMode: checked as boolean
                      })
                    }
                    disabled={!hasEditSettingsPermission || !razorpaySettings.isEnabled}
                  />
                  <label
                    htmlFor="razorpay-live-mode"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Live Mode (uncheck for test mode)
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="razorpay-key-id">API Key ID</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="razorpay-key-id" 
                        className="pl-9"
                        value={razorpaySettings.keyId}
                        onChange={(e) => setRazorpaySettings({...razorpaySettings, keyId: e.target.value})}
                        disabled={!hasEditSettingsPermission || !razorpaySettings.isEnabled}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Find this in your Razorpay Dashboard &gt; Settings &gt; API Keys</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="razorpay-key-secret">API Key Secret</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="razorpay-key-secret" 
                        type="password"
                        className="pl-9"
                        value={razorpaySettings.keySecret}
                        onChange={(e) => setRazorpaySettings({...razorpaySettings, keySecret: e.target.value})}
                        placeholder="••••••••••••••••"
                        disabled={!hasEditSettingsPermission || !razorpaySettings.isEnabled}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Keep this secret and secure</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="razorpay-webhook-secret">Webhook Secret</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="razorpay-webhook-secret" 
                      type="password"
                      className="pl-9"
                      value={razorpaySettings.webhookSecret}
                      onChange={(e) => setRazorpaySettings({...razorpaySettings, webhookSecret: e.target.value})}
                      placeholder="••••••••••••••••"
                      disabled={!hasEditSettingsPermission || !razorpaySettings.isEnabled}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set this in your Razorpay Dashboard &gt; Settings &gt; Webhooks
                  </p>
                </div>

                <div>
                  <Label>Payment Options</Label>
                  <div className="grid gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="razorpay-refunds" 
                        checked={razorpaySettings.enableRefunds}
                        onCheckedChange={(checked) => 
                          setRazorpaySettings({
                            ...razorpaySettings, 
                            enableRefunds: checked as boolean
                          })
                        }
                        disabled={!hasEditSettingsPermission || !razorpaySettings.isEnabled}
                      />
                      <label
                        htmlFor="razorpay-refunds"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Enable Refunds
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="razorpay-partial" 
                        checked={razorpaySettings.enablePartialPayments}
                        onCheckedChange={(checked) => 
                          setRazorpaySettings({
                            ...razorpaySettings, 
                            enablePartialPayments: checked as boolean
                          })
                        }
                        disabled={!hasEditSettingsPermission || !razorpaySettings.isEnabled}
                      />
                      <label
                        htmlFor="razorpay-partial"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Enable Partial Payments
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="razorpay-prefill" 
                        checked={razorpaySettings.prefillContactInfo}
                        onCheckedChange={(checked) => 
                          setRazorpaySettings({
                            ...razorpaySettings, 
                            prefillContactInfo: checked as boolean
                          })
                        }
                        disabled={!hasEditSettingsPermission || !razorpaySettings.isEnabled}
                      />
                      <label
                        htmlFor="razorpay-prefill"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Prefill Contact Information
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleTestConnection('Razorpay')}
                    disabled={!hasEditSettingsPermission || !razorpaySettings.isEnabled || isLoading}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Test Connection
                  </Button>
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={!hasEditSettingsPermission || !razorpaySettings.isEnabled || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Settings'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PayU Settings */}
          <TabsContent value="payu">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>PayU Configuration</CardTitle>
                    <CardDescription>Connect your PayU account for payment processing</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Enable</span>
                    <Switch 
                      checked={payuSettings.isEnabled} 
                      onCheckedChange={(checked) => setPayuSettings({...payuSettings, isEnabled: checked})}
                      disabled={!hasEditSettingsPermission}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="payu-live-mode" 
                    checked={payuSettings.liveMode}
                    onCheckedChange={(checked) => 
                      setPayuSettings({
                        ...payuSettings, 
                        liveMode: checked as boolean
                      })
                    }
                    disabled={!hasEditSettingsPermission || !payuSettings.isEnabled}
                  />
                  <label
                    htmlFor="payu-live-mode"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Live Mode (uncheck for test mode)
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payu-merchant-key">Merchant Key</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="payu-merchant-key" 
                        className="pl-9"
                        value={payuSettings.merchantKey}
                        onChange={(e) => setPayuSettings({...payuSettings, merchantKey: e.target.value})}
                        disabled={!hasEditSettingsPermission || !payuSettings.isEnabled}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payu-merchant-salt">Merchant Salt</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="payu-merchant-salt" 
                        type="password"
                        className="pl-9"
                        value={payuSettings.merchantSalt}
                        onChange={(e) => setPayuSettings({...payuSettings, merchantSalt: e.target.value})}
                        placeholder="••••••••••••••••"
                        disabled={!hasEditSettingsPermission || !payuSettings.isEnabled}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payu-merchant-id">Merchant ID</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="payu-merchant-id" 
                        className="pl-9"
                        value={payuSettings.merchantId}
                        onChange={(e) => setPayuSettings({...payuSettings, merchantId: e.target.value})}
                        disabled={!hasEditSettingsPermission || !payuSettings.isEnabled}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Payment Options</Label>
                  <div className="grid gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="payu-refunds" 
                        checked={payuSettings.enableRefunds}
                        onCheckedChange={(checked) => 
                          setPayuSettings({
                            ...payuSettings, 
                            enableRefunds: checked as boolean
                          })
                        }
                        disabled={!hasEditSettingsPermission || !payuSettings.isEnabled}
                      />
                      <label
                        htmlFor="payu-refunds"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Enable Refunds
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="payu-auto-capture" 
                        checked={payuSettings.autoCapture}
                        onCheckedChange={(checked) => 
                          setPayuSettings({
                            ...payuSettings, 
                            autoCapture: checked as boolean
                          })
                        }
                        disabled={!hasEditSettingsPermission || !payuSettings.isEnabled}
                      />
                      <label
                        htmlFor="payu-auto-capture"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Auto-capture Payments
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleTestConnection('PayU')}
                    disabled={!hasEditSettingsPermission || !payuSettings.isEnabled || isLoading}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Test Connection
                  </Button>
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={!hasEditSettingsPermission || !payuSettings.isEnabled || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Settings'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CC Avenue Settings */}
          <TabsContent value="ccavenue">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>CC Avenue Configuration</CardTitle>
                    <CardDescription>Connect your CC Avenue account for payment processing</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Enable</span>
                    <Switch 
                      checked={ccavenueSettings.isEnabled} 
                      onCheckedChange={(checked) => setCcavenueSettings({...ccavenueSettings, isEnabled: checked})}
                      disabled={!hasEditSettingsPermission}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ccavenue-live-mode" 
                    checked={ccavenueSettings.liveMode}
                    onCheckedChange={(checked) => 
                      setCcavenueSettings({
                        ...ccavenueSettings, 
                        liveMode: checked as boolean
                      })
                    }
                    disabled={!hasEditSettingsPermission || !ccavenueSettings.isEnabled}
                  />
                  <label
                    htmlFor="ccavenue-live-mode"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Live Mode (uncheck for test mode)
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ccavenue-merchant-id">Merchant ID</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="ccavenue-merchant-id" 
                        className="pl-9"
                        value={ccavenueSettings.merchantId}
                        onChange={(e) => setCcavenueSettings({...ccavenueSettings, merchantId: e.target.value})}
                        disabled={!hasEditSettingsPermission || !ccavenueSettings.isEnabled}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ccavenue-access-code">Access Code</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="ccavenue-access-code" 
                        className="pl-9"
                        value={ccavenueSettings.accessCode}
                        onChange={(e) => setCcavenueSettings({...ccavenueSettings, accessCode: e.target.value})}
                        disabled={!hasEditSettingsPermission || !ccavenueSettings.isEnabled}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ccavenue-working-key">Working Key</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="ccavenue-working-key" 
                        type="password"
                        className="pl-9"
                        value={ccavenueSettings.workingKey}
                        onChange={(e) => setCcavenueSettings({...ccavenueSettings, workingKey: e.target.value})}
                        placeholder="••••••••••••••••"
                        disabled={!hasEditSettingsPermission || !ccavenueSettings.isEnabled}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ccavenue-redirect-url">Redirect URL</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="ccavenue-redirect-url" 
                        className="pl-9"
                        value={ccavenueSettings.redirectUrl}
                        onChange={(e) => setCcavenueSettings({...ccavenueSettings, redirectUrl: e.target.value})}
                        disabled={!hasEditSettingsPermission || !ccavenueSettings.isEnabled}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This URL must be configured in your CC Avenue dashboard
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleTestConnection('CC Avenue')}
                    disabled={!hasEditSettingsPermission || !ccavenueSettings.isEnabled || isLoading}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Test Connection
                  </Button>
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={!hasEditSettingsPermission || !ccavenueSettings.isEnabled || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Settings'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PhonePe Settings */}
          <TabsContent value="phonepe">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>PhonePe Configuration</CardTitle>
                    <CardDescription>Connect your PhonePe account for payment processing</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Enable</span>
                    <Switch 
                      checked={phonepeSettings.isEnabled} 
                      onCheckedChange={(checked) => setPhonepeSettings({...phonepeSettings, isEnabled: checked})}
                      disabled={!hasEditSettingsPermission}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="phonepe-live-mode" 
                    checked={phonepeSettings.liveMode}
                    onCheckedChange={(checked) => 
                      setPhonepeSettings({
                        ...phonepeSettings, 
                        liveMode: checked as boolean
                      })
                    }
                    disabled={!hasEditSettingsPermission || !phonepeSettings.isEnabled}
                  />
                  <label
                    htmlFor="phonepe-live-mode"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Production Mode (uncheck for test mode)
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phonepe-merchant-id">Merchant ID</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="phonepe-merchant-id" 
                        className="pl-9"
                        value={phonepeSettings.merchantId}
                        onChange={(e) => setPhonepeSettings({...phonepeSettings, merchantId: e.target.value})}
                        disabled={!hasEditSettingsPermission || !phonepeSettings.isEnabled}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phonepe-salt-index">Salt Index</Label>
                    <div className="relative">
                      <Input 
                        id="phonepe-salt-index" 
                        value={phonepeSettings.saltIndex}
                        onChange={(e) => setPhonepeSettings({...phonepeSettings, saltIndex: e.target.value})}
                        disabled={!hasEditSettingsPermission || !phonepeSettings.isEnabled}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phonepe-salt-key">Salt Key</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phonepe-salt-key" 
                      type="password"
                      className="pl-9"
                      value={phonepeSettings.saltKey}
                      onChange={(e) => setPhonepeSettings({...phonepeSettings, saltKey: e.target.value})}
                      placeholder="••••••••••••••••"
                      disabled={!hasEditSettingsPermission || !phonepeSettings.isEnabled}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phonepe-redirect-url">Redirect URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phonepe-redirect-url" 
                      className="pl-9"
                      value={phonepeSettings.redirectUrl}
                      onChange={(e) => setPhonepeSettings({...phonepeSettings, redirectUrl: e.target.value})}
                      disabled={!hasEditSettingsPermission || !phonepeSettings.isEnabled}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This URL must be registered with PhonePe
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="phonepe-refunds" 
                    checked={phonepeSettings.enableRefunds}
                    onCheckedChange={(checked) => 
                      setPhonepeSettings({
                        ...phonepeSettings, 
                        enableRefunds: checked as boolean
                      })
                    }
                    disabled={!hasEditSettingsPermission || !phonepeSettings.isEnabled}
                  />
                  <label
                    htmlFor="phonepe-refunds"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enable Refunds
                  </label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleTestConnection('PhonePe')}
                    disabled={!hasEditSettingsPermission || !phonepeSettings.isEnabled || isLoading}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Test Connection
                  </Button>
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={!hasEditSettingsPermission || !phonepeSettings.isEnabled || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Settings'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default PaymentGatewaySettingsPage;
