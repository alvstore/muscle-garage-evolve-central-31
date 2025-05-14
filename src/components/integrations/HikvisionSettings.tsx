
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
import { Select } from '@/components/ui/select';
import { SelectContent } from '@/components/ui/select';
import { SelectItem } from '@/components/ui/select';
import { SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { hikvisionService } from '@/services/integrations/hikvision/hikvisionService';
import { hikvisionPartnerService } from '@/services/integrations/hikvision/hikvisionPartnerService';
import { hikvisionPollingService } from '@/services/integrations/hikvision/hikvisionPollingService';
import { hikvisionWebhookService } from '@/services/webhooks/hikvisionWebhookService';
import axios from 'axios';

export function HikvisionSettings() {
  const [areaDomain, setAreaDomain] = useState('https://api.hik-partner.com');
  const [appKey, setAppKey] = useState('');
  const [appSecret, setAppSecret] = useState('');
  const [isPollingEnabled, setIsPollingEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  
  // Available area domains based on Hikvision documentation
  const areaDomains = [
    { value: 'https://api.hik-partner.com', label: 'Global (api.hik-partner.com)' },
    { value: 'https://api.hik-partnerru.com', label: 'Russia (api.hik-partnerru.com)' },
    { value: 'https://hcsa.hik-partner.com', label: 'Europe (hcsa.hik-partner.com)' },
    { value: 'https://hcsa2.hik-partner.com', label: 'North America (hcsa2.hik-partner.com)' },
    { value: 'https://hcsa3.hik-partner.com', label: 'South America (hcsa3.hik-partner.com)' },
    { value: 'https://hcsa4.hik-partner.com', label: 'Asia Pacific (hcsa4.hik-partner.com)' }
  ];
  
  // Load saved credentials
  useEffect(() => {
    const loadCredentials = async () => {
      // Try to load from database first
      const branchId = localStorage.getItem('selected_branch_id');
      if (branchId) {
        try {
          const { data: settings, error } = await supabase
            .from('hikvision_api_settings')
            .select('*')
            .eq('branch_id', branchId)
            .single();
            
          if (settings && !error) {
            // Use settings from database
            setAreaDomain(settings.api_url);
            setAppKey(settings.app_key);
            setAppSecret(settings.app_secret);
            setIsPollingEnabled(settings.is_active);
            
            // Update localStorage for backward compatibility
            localStorage.setItem('hikvision_credentials', JSON.stringify({
              apiUrl: settings.api_url,
              appKey: settings.app_key,
              secretKey: settings.app_secret,
              clientId: settings.app_key,
              clientSecret: settings.app_secret
            }));
            
            localStorage.setItem('hikvision_polling_enabled', settings.is_active.toString());
            
            console.log('Loaded Hikvision settings from database');
            return;
          }
        } catch (dbError) {
          console.error('Error loading settings from database:', dbError);
          // Continue to load from localStorage
        }
      }
      
      // Fall back to localStorage if database load fails
      const credentials = await hikvisionService.getStoredCredentials();
      if (credentials) {
        // Use appKey/secretKey for compatibility with the Hikvision API
        setAppKey(credentials.appKey || credentials.clientId || '');
        setAppSecret(credentials.secretKey || credentials.clientSecret || '');
        
        // Set area domain if available
        if (credentials.apiUrl) {
          setAreaDomain(credentials.apiUrl);
        }
        
        console.log('Loaded Hikvision settings from localStorage');
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
      // Save credentials to localStorage for backward compatibility
      localStorage.setItem('hikvision_credentials', JSON.stringify({
        apiUrl: areaDomain,
        appKey,  // Use appKey for Hikvision API compatibility
        secretKey: appSecret,  // Use secretKey for Hikvision API compatibility
        clientId: appKey,  // Keep clientId for backward compatibility
        clientSecret: appSecret  // Keep clientSecret for backward compatibility
      }));
      
      // Save to database if a branch is selected
      const branchId = localStorage.getItem('selected_branch_id');
      if (branchId) {
        try {
          // Check if settings already exist for this branch
          const { data: existingSettings } = await supabase
            .from('hikvision_api_settings')
            .select('id')
            .eq('branch_id', branchId)
            .single();
            
          if (existingSettings) {
            // Update existing settings
            await supabase
              .from('hikvision_api_settings')
              .update({
                api_url: areaDomain,
                app_key: appKey,
                app_secret: appSecret,
                is_active: true,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingSettings.id);
          } else {
            // Create new settings
            await supabase
              .from('hikvision_api_settings')
              .insert({
                branch_id: branchId,
                api_url: areaDomain,
                app_key: appKey,
                app_secret: appSecret,
                is_active: true
              });
          }
          
          toast.success('Hikvision API credentials saved to database');
        } catch (dbError) {
          console.error('Error saving API settings to database:', dbError);
          toast.error('Failed to save credentials to database');
        }
      } else {
        toast.success('Hikvision API credentials saved locally');
        toast.warning('Select a branch to save credentials to the database');
      }
      
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
      // First, test the connection directly to the Hikvision API
      try {
        // Try to get a token from the Hikvision API
        const response = await axios.post(`${areaDomain}/api/hpcgw/v1/token/get`, {
          appKey,
          secretKey: appSecret
        });
        
        if (response.data && response.data.accessToken) {
          toast.success('Successfully connected to Hikvision API');
          
          // Save successful API settings to database if a branch is selected
          const branchId = localStorage.getItem('selected_branch_id');
          if (branchId) {
            try {
              // Check if settings already exist for this branch
              const { data: existingSettings } = await supabase
                .from('hikvision_api_settings')
                .select('id')
                .eq('branch_id', branchId)
                .single();
                
              if (existingSettings) {
                // Update existing settings
                await supabase
                  .from('hikvision_api_settings')
                  .update({
                    api_url: areaDomain,
                    app_key: appKey,
                    app_secret: appSecret,
                    is_active: true,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', existingSettings.id);
              } else {
                // Create new settings
                await supabase
                  .from('hikvision_api_settings')
                  .insert({
                    branch_id: branchId,
                    api_url: areaDomain,
                    app_key: appKey,
                    app_secret: appSecret,
                    is_active: true
                  });
              }
            } catch (dbError) {
              console.error('Error saving API settings to database:', dbError);
              // Don't show error to user since the API connection was successful
            }
          }
          
          return;
        }
      } catch (directError) {
        console.error('Direct API connection test failed:', directError);
        // Continue to backend test if direct test fails
      }
      
      // Fallback to backend test
      const result = await hikvisionService.testConnection({
        apiUrl: areaDomain,
        appKey,
        secretKey: appSecret,
        clientId: appKey,  // For backward compatibility
        clientSecret: appSecret  // For backward compatibility
      });
      
      if (result) {
        toast.success('Successfully connected to Hikvision API via backend');
      } else {
        toast.error('Failed to connect to Hikvision API');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      toast.error(`Connection test failed: ${error.message || 'Unknown error'}`);
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
          <Label htmlFor="areaDomain">Area Domain</Label>
          <Select 
            value={areaDomain} 
            onValueChange={setAreaDomain}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your region" />
            </SelectTrigger>
            <SelectContent>
              {areaDomains.map(domain => (
                <SelectItem key={domain.value} value={domain.value}>
                  {domain.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Select the appropriate domain for your region. The API URL will be automatically configured.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="appKey">App Key</Label>
          <Input
            id="appKey"
            placeholder="Your Hikvision App Key"
            value={appKey}
            onChange={(e) => setAppKey(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="appSecret">App Secret</Label>
          <Input
            id="appSecret"
            type="password"
            placeholder="Your Hikvision App Secret"
            value={appSecret}
            onChange={(e) => setAppSecret(e.target.value)}
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
          disabled={isTestingConnection || !areaDomain || !appKey || !appSecret}
        >
          {isTestingConnection ? 'Testing...' : 'Test Connection'}
        </Button>
        <Button
          onClick={handleSaveCredentials}
          disabled={isLoading || !areaDomain || !appKey || !appSecret}
        >
          {isLoading ? 'Saving...' : 'Save Credentials'}
        </Button>
      </CardFooter>
    </Card>
  );
}
