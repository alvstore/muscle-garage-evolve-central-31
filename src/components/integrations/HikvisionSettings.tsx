
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import integrationsService from '@/services/integrationsService';

const HikvisionSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    apiKey: '',
    secretKey: '',
    apiUrl: 'https://api.hikvision.com/api',
    enabled: false,
    autoSync: true
  });

  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const hikvisionSettings = await integrationsService.getIntegrationById('hikvision');
        if (hikvisionSettings) {
          setSettings(hikvisionSettings);
        }
      } catch (error) {
        console.error('Failed to load Hikvision settings:', error);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await integrationsService.saveSettings({
        id: 'hikvision',
        ...settings
      });
      toast.success('Hikvision settings saved successfully');
    } catch (error) {
      console.error('Failed to save Hikvision settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setTestResult(null);
    try {
      const result = await integrationsService.testConnection({
        type: 'hikvision',
        apiKey: settings.apiKey,
        secretKey: settings.secretKey,
        apiUrl: settings.apiUrl
      });

      if (result.success) {
        setTestResult({ success: true, message: 'Connection successful!' });
        toast.success('Connection successful!');
      } else {
        setTestResult({ success: false, message: 'Connection failed. Please check your credentials.' });
        toast.error('Connection failed');
      }
    } catch (error) {
      console.error('Failed to test Hikvision connection:', error);
      setTestResult({ success: false, message: 'Connection failed. Please check your credentials.' });
      toast.error('Connection test failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hikvision Integration</CardTitle>
        <CardDescription>Connect to Hikvision access control system for automatic attendance tracking and door access control.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enabled" className="text-base">Enable Integration</Label>
              <p className="text-sm text-muted-foreground">
                Turn on to use Hikvision devices with this system
              </p>
            </div>
            <Switch 
              id="enabled" 
              checked={settings.enabled} 
              onCheckedChange={(checked) => setSettings({...settings, enabled: checked})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input 
              id="apiKey" 
              placeholder="Enter Hikvision API Key" 
              value={settings.apiKey}
              onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secretKey">Secret Key</Label>
            <Input 
              id="secretKey" 
              type="password"
              placeholder="Enter Hikvision Secret Key" 
              value={settings.secretKey}
              onChange={(e) => setSettings({...settings, secretKey: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiUrl">API URL</Label>
            <Input 
              id="apiUrl" 
              placeholder="https://api.hikvision.com/api" 
              value={settings.apiUrl}
              onChange={(e) => setSettings({...settings, apiUrl: e.target.value})}
            />
            <p className="text-xs text-muted-foreground">Default: https://api.hikvision.com/api</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoSync" className="text-base">Auto Sync</Label>
              <p className="text-sm text-muted-foreground">
                Automatically synchronize member data with Hikvision
              </p>
            </div>
            <Switch 
              id="autoSync" 
              checked={settings.autoSync} 
              onCheckedChange={(checked) => setSettings({...settings, autoSync: checked})}
            />
          </div>
        </div>
        
        {testResult && (
          <div className={`p-4 rounded-md ${testResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className={`${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {testResult.message}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleTestConnection}
          disabled={isLoading || !settings.apiKey || !settings.secretKey}
        >
          Test Connection
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HikvisionSettings;
