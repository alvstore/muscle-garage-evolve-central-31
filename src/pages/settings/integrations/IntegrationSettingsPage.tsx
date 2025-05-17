
import React, { useEffect, useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBranch } from '@/hooks/use-branches';
import { Loader2 } from 'lucide-react';

interface IntegrationStatus {
  id: string;
  name: string;
  icon: string;
  status: 'active' | 'not-configured' | 'error';
  integration_key: string;
  description: string;
  config: any;
  branch_id: string | null;
}

const IntegrationSettingsPage = () => {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('payment');
  const { currentBranch } = useBranch();
  
  useEffect(() => {
    if (currentBranch?.id) {
      fetchIntegrations();
    }
  }, [currentBranch?.id]);
  
  const fetchIntegrations = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('integration_statuses')
        .select('*');
      
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast.error('Failed to load integration settings');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'not-configured':
        return <Badge className="bg-gray-100 text-gray-800">Not Configured</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Filter integrations by category
  const paymentIntegrations = integrations.filter(i => 
    ['razorpay', 'stripe', 'paypal', 'custom_payment'].includes(i.integration_key)
  );
  
  const communicationIntegrations = integrations.filter(i => 
    ['twilio', 'msg91', 'sendgrid', 'custom_sms', 'mailgun', 'whatsapp'].includes(i.integration_key)
  );
  
  const deviceIntegrations = integrations.filter(i => 
    ['hikvision', 'essl', 'custom_device'].includes(i.integration_key)
  );
  
  const marketingIntegrations = integrations.filter(i => 
    ['mailchimp', 'klaviyo', 'meta', 'google_analytics'].includes(i.integration_key)
  );

  return (
    <Container>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Integration Settings</h1>
          <p className="text-muted-foreground">Manage all third-party integrations</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="payment">Payment Gateways</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="devices">Access Devices</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Gateway Integrations</CardTitle>
                <CardDescription>
                  Configure payment processors for accepting online payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : paymentIntegrations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No payment integrations found
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {paymentIntegrations.map(integration => (
                      <Card key={integration.id} className="overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                {integration.icon ? (
                                  <img 
                                    src={integration.icon} 
                                    alt={integration.name} 
                                    className="h-6 w-6" 
                                  />
                                ) : (
                                  <div className="h-6 w-6 bg-primary/20 rounded-full" />
                                )}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">{integration.name}</h3>
                                {getStatusBadge(integration.status)}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mt-4">
                            {integration.description}
                          </p>
                          
                          <Button className="w-full mt-4">
                            {integration.status === 'active' ? 'Manage' : 'Configure'}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="communication">
            <Card>
              <CardHeader>
                <CardTitle>Communication Integrations</CardTitle>
                <CardDescription>
                  Configure SMS, Email, and WhatsApp communication channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : communicationIntegrations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No communication integrations found
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {communicationIntegrations.map(integration => (
                      <Card key={integration.id} className="overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                {integration.icon ? (
                                  <img 
                                    src={integration.icon} 
                                    alt={integration.name} 
                                    className="h-6 w-6" 
                                  />
                                ) : (
                                  <div className="h-6 w-6 bg-primary/20 rounded-full" />
                                )}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">{integration.name}</h3>
                                {getStatusBadge(integration.status)}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mt-4">
                            {integration.description}
                          </p>
                          
                          <Button className="w-full mt-4">
                            {integration.status === 'active' ? 'Manage' : 'Configure'}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <CardTitle>Access Control Devices</CardTitle>
                <CardDescription>
                  Configure Hikvision and eSSL attendance devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : deviceIntegrations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No device integrations found
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {deviceIntegrations.map(integration => (
                      <Card key={integration.id} className="overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                {integration.icon ? (
                                  <img 
                                    src={integration.icon} 
                                    alt={integration.name} 
                                    className="h-6 w-6" 
                                  />
                                ) : (
                                  <div className="h-6 w-6 bg-primary/20 rounded-full" />
                                )}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">{integration.name}</h3>
                                {getStatusBadge(integration.status)}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mt-4">
                            {integration.description}
                          </p>
                          
                          <Button className="w-full mt-4">
                            {integration.status === 'active' ? 'Manage' : 'Configure'}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="marketing">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Integrations</CardTitle>
                <CardDescription>
                  Configure email marketing and analytics platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : marketingIntegrations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No marketing integrations found
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {marketingIntegrations.map(integration => (
                      <Card key={integration.id} className="overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                {integration.icon ? (
                                  <img 
                                    src={integration.icon} 
                                    alt={integration.name} 
                                    className="h-6 w-6" 
                                  />
                                ) : (
                                  <div className="h-6 w-6 bg-primary/20 rounded-full" />
                                )}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">{integration.name}</h3>
                                {getStatusBadge(integration.status)}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mt-4">
                            {integration.description}
                          </p>
                          
                          <Button className="w-full mt-4">
                            {integration.status === 'active' ? 'Manage' : 'Configure'}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default IntegrationSettingsPage;
