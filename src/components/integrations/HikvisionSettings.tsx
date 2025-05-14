
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { CardFooter } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { hikvisionService } from '@/services/integrations/hikvisionService';
import { hikvisionPartnerService } from '@/services/integrations/hikvision/hikvisionPartnerService';
import { hikvisionPollingService } from '@/services/integrations/hikvisionPollingService';
import { hikvisionWebhookService } from '@/services/integrations/hikvision/hikvisionWebhookService';

export function HikvisionSettings() {
  const [apiUrl, setApiUrl] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isPollingEnabled, setIsPollingEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  
  // Load saved credentials
  useEffect(() => {
    const loadCredentials = async () => {
      const credentials = await hikvisionService.getStoredCredentials();
      if (credentials) {
        setApiUrl(credentials.apiUrl || '');
        setClientId(credentials.clientId || '');
        setClientSecret(credentials.clientSecret || '');
      }
      
      // Check if polling is enabled in localStorage
      const pollingEnabled = localStorage.getItem('hikvision_polling_enabled');
      setIsPollingEnabled(pollingEnabled === 'true');
    };
    
    loadCredentials();
  }, []);
  
  // Toggle polling when the switch changes
  useEffect(() => {
    if (isPollingEnabled) {
      hikvisionPollingService.startPolling();
    } else {
      hikvisionPollingService.stopPolling();
    }
    
    localStorage.setItem('hikvision_polling_enabled', isPollingEnabled.toString());
  }, [isPollingEnabled]);
  
  const handleSaveCredentials = async () => {
    setIsLoading(true);
    try {
      // Save credentials
      localStorage.setItem('hikvision_credentials', JSON.stringify({
        apiUrl,
        clientId,
        clientSecret
      }));
      
      toast.success('Hikvision API credentials saved');
      
      // Subscribe to events
      const subscribed = await hikvisionWebhookService.subscribeToEvents();
      if (subscribed) {
        toast.success('Successfully subscribed to Hikvision events');
      }
    } catch (error) {
      console.error('Failed to save credentials:', error);
      toast.error('Failed to save credentials');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const result = await hikvisionService.testConnection({
        apiUrl,
        clientId,
        clientSecret
      });
      
      if (result) {
        toast.success('Successfully connected to Hikvision API');
      } else {
        toast.error('Failed to connect to Hikvision API');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      toast.error('Connection test failed');
    } finally {
      setIsTestingConnection(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hikvision Access Control</CardTitle>
        <CardDescription>
          Configure your Hikvision Partner Cloud Gateway API credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiUrl">API URL</Label>
          <Input
            id="apiUrl"
            placeholder="https://api.example.com"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientId">Client ID</Label>
          <Input
            id="clientId"
            placeholder="Your client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientSecret">Client Secret</Label>
          <Input
            id="clientSecret"
            type="password"
            placeholder="Your client secret"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="polling"
            checked={isPollingEnabled}
            onCheckedChange={setIsPollingEnabled}
          />
          <Label htmlFor="polling">Enable event polling</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleTestConnection}
          disabled={isTestingConnection || !apiUrl || !clientId || !clientSecret}
        >
          {isTestingConnection ? 'Testing...' : 'Test Connection'}
        </Button>
        <Button
          onClick={handleSaveCredentials}
          disabled={isLoading || !apiUrl || !clientId || !clientSecret}
        >
          {isLoading ? 'Saving...' : 'Save Credentials'}
        </Button>
      </CardFooter>
    </Card>
  );
}
