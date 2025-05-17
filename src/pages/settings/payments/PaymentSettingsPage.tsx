
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { ChevronRight, CreditCard, IndianRupee, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaymentGatewayConfig {
  id?: string;
  gateway_name: string;
  is_enabled: boolean;
  config: {
    api_key?: string;
    api_secret?: string;
    webhook_url?: string;
    merchant_id?: string;
  };
}

const PaymentSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("razorpay");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [razorpayConfig, setRazorpayConfig] = useState<PaymentGatewayConfig>({
    gateway_name: 'razorpay',
    is_enabled: false,
    config: {
      api_key: '',
      api_secret: '',
      webhook_url: ''
    }
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('payment_settings')
          .select('*')
          .eq('gateway_name', 'razorpay')
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          throw error;
        }

        if (data) {
          setRazorpayConfig(data);
        }
      } catch (error: any) {
        console.error('Error fetching payment settings:', error);
        toast({
          title: 'Error fetching payment settings',
          description: error.message || 'Failed to load payment settings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentSettings();
  }, [toast]);

  const handleSaveSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .upsert({
          ...razorpayConfig,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Settings saved',
        description: 'Payment gateway settings have been saved successfully.',
      });

      if (data) {
        setRazorpayConfig(data);
      }
    } catch (error: any) {
      console.error('Error saving payment settings:', error);
      toast({
        title: 'Error saving settings',
        description: error.message || 'Failed to save payment settings',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setRazorpayConfig(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value
      }
    }));
  };

  const handleToggleGateway = (enabled: boolean) => {
    setRazorpayConfig(prev => ({
      ...prev,
      is_enabled: enabled
    }));
  };

  return (
    <Container>
      <div className="py-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/payment" isCurrentPage>Payment</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Payment Settings</h1>
            <p className="text-muted-foreground">Configure payment gateway integrations</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/settings')}>
            Back to Settings
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Gateway Configuration</CardTitle>
            <CardDescription>
              Set up your payment gateway details to enable online payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="razorpay" className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  Razorpay
                </TabsTrigger>
                <TabsTrigger value="stripe" disabled className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Stripe (Coming Soon)
                </TabsTrigger>
              </TabsList>

              <TabsContent value="razorpay" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Enable Razorpay</h3>
                    <p className="text-sm text-muted-foreground">
                      Use Razorpay to accept online payments
                    </p>
                  </div>
                  <Switch 
                    checked={razorpayConfig.is_enabled} 
                    onCheckedChange={handleToggleGateway}
                  />
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="razorpay-key">Razorpay API Key</Label>
                    <Input
                      id="razorpay-key"
                      placeholder="rzp_test_123456789"
                      value={razorpayConfig.config.api_key || ''}
                      onChange={(e) => handleInputChange('api_key', e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="razorpay-secret">Secret Key</Label>
                    <Input
                      id="razorpay-secret"
                      type="password"
                      placeholder="Enter your secret key"
                      value={razorpayConfig.config.api_secret || ''}
                      onChange={(e) => handleInputChange('api_secret', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      This key is stored securely and never exposed to clients.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://yourdomain.com/api/webhooks/razorpay"
                      value={razorpayConfig.config.webhook_url || ''}
                      onChange={(e) => handleInputChange('webhook_url', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your Razorpay webhook endpoint for payment notifications.
                    </p>
                  </div>

                  <div className="flex gap-4 justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('razorpay')}
                      disabled={isLoading}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                    <Button 
                      onClick={handleSaveSettings}
                      disabled={isLoading}
                    >
                      Save Settings
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default PaymentSettingsPage;
