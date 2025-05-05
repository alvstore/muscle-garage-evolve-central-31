
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const PaymentSettingsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('razorpay');
  const { toast } = useToast();
  
  const [razorpaySettings, setRazorpaySettings] = useState({
    apiKey: '',
    apiSecret: '',
    webhookSecret: '',
    isLive: false,
    currency: 'INR',
  });
  
  const [offlineSettings, setOfflineSettings] = useState({
    cashEnabled: true,
    cardEnabled: true,
    upiEnabled: true,
    bankTransferEnabled: true,
    defaultMethod: 'cash',
  });
  
  // Simulate loading settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // In a real app, you would fetch from your settings table in Supabase
        setRazorpaySettings({
          apiKey: 'rzp_test_1234567890abcdef',
          apiSecret: '••••••••••••••••',
          webhookSecret: '••••••••••••••••',
          isLive: false,
          currency: 'INR',
        });
        
        setOfflineSettings({
          cashEnabled: true,
          cardEnabled: true,
          upiEnabled: true,
          bankTransferEnabled: true,
          defaultMethod: 'cash',
        });
        
      } catch (error) {
        console.error('Error fetching payment settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load payment settings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [toast]);
  
  const saveRazorpaySettings = async () => {
    setIsSaving(true);
    // In a real app, you would save to your Supabase settings table
    setTimeout(() => {
      toast({
        title: 'Success',
        description: 'Razorpay settings saved successfully',
      });
      setIsSaving(false);
    }, 1000);
  };
  
  const saveOfflineSettings = async () => {
    setIsSaving(true);
    // In a real app, you would save to your Supabase settings table
    setTimeout(() => {
      toast({
        title: 'Success',
        description: 'Offline payment settings saved successfully',
      });
      setIsSaving(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <Container>
        <div className="py-10 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Payment Settings</h1>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="razorpay">Razorpay</TabsTrigger>
            <TabsTrigger value="offline">Offline Payments</TabsTrigger>
            <TabsTrigger value="tax">Tax Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="razorpay">
            <Card>
              <CardHeader>
                <CardTitle>Razorpay Configuration</CardTitle>
                <CardDescription>
                  Configure your Razorpay integration for online payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Environment</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose between test and live mode
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="live-mode" className={!razorpaySettings.isLive ? "text-primary" : "text-muted-foreground"}>Test</Label>
                    <Switch
                      id="live-mode"
                      checked={razorpaySettings.isLive}
                      onCheckedChange={(checked) => setRazorpaySettings({...razorpaySettings, isLive: checked})}
                    />
                    <Label htmlFor="live-mode" className={razorpaySettings.isLive ? "text-primary" : "text-muted-foreground"}>Live</Label>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input
                      id="api-key"
                      value={razorpaySettings.apiKey}
                      onChange={(e) => setRazorpaySettings({...razorpaySettings, apiKey: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="api-secret">API Secret</Label>
                    <Input
                      id="api-secret"
                      type="password"
                      value={razorpaySettings.apiSecret}
                      onChange={(e) => setRazorpaySettings({...razorpaySettings, apiSecret: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="webhook-secret">Webhook Secret</Label>
                    <Input
                      id="webhook-secret"
                      type="password"
                      value={razorpaySettings.webhookSecret}
                      onChange={(e) => setRazorpaySettings({...razorpaySettings, webhookSecret: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select
                      value={razorpaySettings.currency}
                      onValueChange={(value) => setRazorpaySettings({...razorpaySettings, currency: value})}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={saveRazorpaySettings} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="offline">
            <Card>
              <CardHeader>
                <CardTitle>Offline Payment Methods</CardTitle>
                <CardDescription>
                  Configure which offline payment methods are accepted
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Cash</h3>
                      <p className="text-sm text-muted-foreground">Accept cash payments</p>
                    </div>
                    <Switch
                      checked={offlineSettings.cashEnabled}
                      onCheckedChange={(checked) => setOfflineSettings({...offlineSettings, cashEnabled: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Card</h3>
                      <p className="text-sm text-muted-foreground">Accept credit/debit card payments</p>
                    </div>
                    <Switch
                      checked={offlineSettings.cardEnabled}
                      onCheckedChange={(checked) => setOfflineSettings({...offlineSettings, cardEnabled: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">UPI</h3>
                      <p className="text-sm text-muted-foreground">Accept UPI payments</p>
                    </div>
                    <Switch
                      checked={offlineSettings.upiEnabled}
                      onCheckedChange={(checked) => setOfflineSettings({...offlineSettings, upiEnabled: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Bank Transfer</h3>
                      <p className="text-sm text-muted-foreground">Accept bank transfer payments</p>
                    </div>
                    <Switch
                      checked={offlineSettings.bankTransferEnabled}
                      onCheckedChange={(checked) => setOfflineSettings({...offlineSettings, bankTransferEnabled: checked})}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2 pt-4">
                  <Label htmlFor="default-method">Default Payment Method</Label>
                  <Select
                    value={offlineSettings.defaultMethod}
                    onValueChange={(value) => setOfflineSettings({...offlineSettings, defaultMethod: value})}
                  >
                    <SelectTrigger id="default-method">
                      <SelectValue placeholder="Select default method" />
                    </SelectTrigger>
                    <SelectContent>
                      {offlineSettings.cashEnabled && <SelectItem value="cash">Cash</SelectItem>}
                      {offlineSettings.cardEnabled && <SelectItem value="card">Card</SelectItem>}
                      {offlineSettings.upiEnabled && <SelectItem value="upi">UPI</SelectItem>}
                      {offlineSettings.bankTransferEnabled && <SelectItem value="bank">Bank Transfer</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={saveOfflineSettings} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tax">
            <Card>
              <CardHeader>
                <CardTitle>Tax Settings</CardTitle>
                <CardDescription>
                  Configure GST and other tax settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Tax settings configuration coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default PaymentSettingsPage;
