
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useBranch } from "@/hooks/use-branch";
import { useToast } from "@/components/ui/use-toast";
import { settingsService } from "@/services/settingsService";
import { getHikvisionToken } from "@/services/hikvisionTokenService";
import { startPolling, stopPolling, isPollingActive } from "@/services/integrations/hikvision/hikvisionPollingService";
import { hikvisionWebhookService } from "@/services/webhooks/hikvisionWebhookService";
import { hikvisionService } from "@/services/integrations/hikvisionService";
import { supabase } from '@/integrations/supabase/client';

interface HikvisionDevice {
  id: string;
  deviceName: string;
  deviceType: string;
  serialNumber: string;
  ipAddress?: string;
  port?: string;
  username?: string;
  password?: string;
  status?: 'online' | 'offline' | 'unknown';
  lastSync?: string;
}

const HikvisionSettings: React.FC = () => {
  const { currentBranch } = useBranch();
  const { toast } = useToast();
  const branchId = currentBranch?.id || '';
  
  // Settings state
  const [settings, setSettings] = useState<any>({
    id: null,
    api_url: '',
    app_key: '',
    app_secret: '',
    branch_id: '',
    devices: [],
    is_active: false
  });
  
  // Device state for the selected device in form
  const [selectedDevice, setSelectedDevice] = useState<HikvisionDevice | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    timestamp?: string;
  } | null>(null);
  
  // Webhook state
  const [webhookActive, setWebhookActive] = useState(false);
  const [isWebhookUpdating, setIsWebhookUpdating] = useState(false);
  
  // Polling state
  const [isEventPollingActive, setIsEventPollingActive] = useState(false);
  
  // Load settings and status on mount
  useEffect(() => {
    if (branchId) {
      loadSettings();
      checkWebhookStatus();
      setIsEventPollingActive(isPollingActive());
    }
  }, [branchId]);
  
  // Load settings from database
  const loadSettings = async () => {
    if (!branchId) return;
    
    setIsLoading(true);
    try {
      const hikvisionSettings = await settingsService.getHikvisionSettings(branchId);
      setSettings({
        ...hikvisionSettings,
        branch_id: branchId
      });
    } catch (error) {
      console.error('Failed to load Hikvision settings:', error);
      toast({
        title: "Error",
        description: "Failed to load Hikvision settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check webhook subscription status
  const checkWebhookStatus = async () => {
    if (!branchId) return;
    
    try {
      const status = await hikvisionWebhookService.getSubscriptionStatus(branchId);
      setWebhookActive(status.isActive);
    } catch (error) {
      console.error('Failed to check webhook status:', error);
    }
  };
  
  // Save settings to database
  const handleSave = async () => {
    if (!branchId) return;
    
    setIsSaving(true);
    try {
      const updatedSettings = {
        ...settings,
        branch_id: branchId
      };
      
      const result = await settingsService.saveHikvisionSettings(updatedSettings);
      if (result) {
        // Update local credential storage
        hikvisionWebhookService.setCredentials(
          settings.api_url,
          settings.app_key,
          settings.app_secret
        );
        
        toast({
          title: "Success",
          description: "Hikvision settings saved successfully",
        });
      }
    } catch (error) {
      console.error('Failed to save Hikvision settings:', error);
      toast({
        title: "Error",
        description: "Failed to save Hikvision settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Test connection to Hikvision API
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // Save current settings first
      await handleSave();
      
      // Test connection
      const result = await hikvisionService.testConnection(branchId);
      
      setTestResult({
        success: result.success,
        message: result.message,
        timestamp: new Date().toISOString()
      });
      
      if (result.success) {
        toast({
          title: "Connection Successful",
          description: result.message,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to test connection:', error);
      
      setTestResult({
        success: false,
        message: `Error testing connection: ${error.message}`,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Error",
        description: `Failed to test connection: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  // Add/update device in settings
  const handleSaveDevice = () => {
    if (!selectedDevice) return;
    
    const updatedDevices = [...settings.devices];
    const index = updatedDevices.findIndex(d => d.id === selectedDevice.id);
    
    if (index >= 0) {
      updatedDevices[index] = selectedDevice;
    } else {
      updatedDevices.push({
        ...selectedDevice,
        id: selectedDevice.id || `device-${Date.now()}`
      });
    }
    
    setSettings({
      ...settings,
      devices: updatedDevices
    });
    
    setSelectedDevice(null);
  };
  
  // Remove device from settings
  const handleRemoveDevice = (deviceId: string) => {
    const updatedDevices = settings.devices.filter((d: any) => d.id !== deviceId);
    setSettings({
      ...settings,
      devices: updatedDevices
    });
  };
  
  // Toggle webhook subscription
  const handleToggleWebhook = async () => {
    if (!branchId) return;
    
    setIsWebhookUpdating(true);
    try {
      let result;
      
      if (webhookActive) {
        result = await hikvisionWebhookService.unsubscribeFromEvents(branchId);
      } else {
        result = await hikvisionWebhookService.subscribeToEvents(branchId);
      }
      
      if (result) {
        setWebhookActive(!webhookActive);
      }
    } catch (error) {
      console.error('Failed to toggle webhook:', error);
    } finally {
      setIsWebhookUpdating(false);
    }
  };
  
  // Toggle event polling
  const handleTogglePolling = () => {
    if (isEventPollingActive) {
      stopPolling();
      setIsEventPollingActive(false);
    } else {
      startPolling();
      setIsEventPollingActive(true);
    }
  };
  
  // Register a test user
  const handleTestRegister = async () => {
    if (!branchId) return;
    
    try {
      // Create temporary test member in database
      const { data: member, error: memberError } = await supabase
        .from('members')
        .upsert({
          id: `test-${Date.now()}`,
          name: 'Test User',
          phone: '1234567890',
          email: 'test@example.com',
          branch_id: branchId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          membership_status: 'active'
        })
        .select()
        .single();
      
      if (memberError || !member) {
        throw new Error(`Failed to create test member: ${memberError?.message}`);
      }
      
      // Register test member with Hikvision
      const result = await hikvisionService.registerMember(member.id, branchId);
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Test registration successful: ${result.message}`,
        });
      } else {
        toast({
          title: "Registration Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to test registration:', error);
      toast({
        title: "Error",
        description: `Failed to test registration: ${error.message}`,
        variant: "destructive",
      });
    }
  };
  
  if (!branchId) {
    return (
      <div className="p-6 text-center">
        <p>Please select a branch to configure Hikvision settings.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Hikvision Access Control</CardTitle>
            <CardDescription>Configure Hikvision access control devices</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={settings.is_active ? "default" : "outline"}>
              {settings.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <Switch 
              checked={settings.is_active} 
              onCheckedChange={(checked) => setSettings({ ...settings, is_active: checked })}
              disabled={isSaving}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="api">
            <TabsList className="mb-4">
              <TabsTrigger value="api">API Configuration</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks & Sync</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="api" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="api_url">API URL</Label>
                  <Input 
                    id="api_url"
                    value={settings.api_url || ''}
                    onChange={(e) => setSettings({ ...settings, api_url: e.target.value })}
                    placeholder="https://api.hik-partner.com"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    The base URL for Hik-Partner Pro OpenAPI
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="app_key">App Key</Label>
                  <Input 
                    id="app_key"
                    value={settings.app_key || ''}
                    onChange={(e) => setSettings({ ...settings, app_key: e.target.value })}
                    placeholder="Enter app key"
                  />
                </div>
                
                <div>
                  <Label htmlFor="app_secret">Secret Key</Label>
                  <Input 
                    id="app_secret"
                    type="password"
                    value={settings.app_secret || ''}
                    onChange={(e) => setSettings({ ...settings, app_secret: e.target.value })}
                    placeholder="Enter secret key"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Save Configuration
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleTestConnection} 
                    disabled={isTesting || !settings.api_url || !settings.app_key || !settings.app_secret}
                  >
                    {isTesting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Test Connection
                  </Button>
                </div>
                
                {testResult && (
                  <div className={`p-4 mt-4 rounded border ${testResult.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    <div className="flex gap-2 items-center">
                      {testResult.success ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span className="font-medium">
                        {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                      </span>
                    </div>
                    <p className="mt-1">{testResult.message}</p>
                    {testResult.timestamp && (
                      <p className="text-xs mt-2">
                        Tested at: {new Date(testResult.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="devices" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Configured Devices</h3>
                
                {settings.devices && settings.devices.length > 0 ? (
                  <div className="space-y-2">
                    {settings.devices.map((device: HikvisionDevice) => (
                      <div key={device.id} className="flex justify-between items-center p-4 border rounded">
                        <div>
                          <h4 className="font-medium">{device.deviceName || device.serialNumber}</h4>
                          <p className="text-sm text-muted-foreground">
                            SN: {device.serialNumber}
                            {device.ipAddress && ` • IP: ${device.ipAddress}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedDevice({...device})}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemoveDevice(device.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No devices configured yet.</p>
                )}
                
                <div className="pt-4">
                  <Button onClick={() => setSelectedDevice({
                    id: '',
                    deviceName: '',
                    deviceType: 'access_controller',
                    serialNumber: '',
                    ipAddress: '',
                    port: '80',
                    username: 'admin',
                    password: '',
                    status: 'unknown'
                  })}>
                    Add Device
                  </Button>
                </div>
                
                {selectedDevice && (
                  <div className="p-4 border rounded bg-muted/20 mt-4 space-y-4">
                    <h3 className="font-medium">{selectedDevice.id ? 'Edit Device' : 'Add New Device'}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deviceName">Device Name</Label>
                        <Input 
                          id="deviceName"
                          value={selectedDevice.deviceName}
                          onChange={(e) => setSelectedDevice({...selectedDevice, deviceName: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="serialNumber">Serial Number</Label>
                        <Input 
                          id="serialNumber"
                          value={selectedDevice.serialNumber}
                          onChange={(e) => setSelectedDevice({...selectedDevice, serialNumber: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="ipAddress">IP Address</Label>
                        <Input 
                          id="ipAddress"
                          value={selectedDevice.ipAddress || ''}
                          onChange={(e) => setSelectedDevice({...selectedDevice, ipAddress: e.target.value})}
                          placeholder="Optional for direct connection"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="port">Port</Label>
                        <Input 
                          id="port"
                          value={selectedDevice.port || ''}
                          onChange={(e) => setSelectedDevice({...selectedDevice, port: e.target.value})}
                          placeholder="80"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username"
                          value={selectedDevice.username || ''}
                          onChange={(e) => setSelectedDevice({...selectedDevice, username: e.target.value})}
                          placeholder="admin"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password"
                          type="password"
                          value={selectedDevice.password || ''}
                          onChange={(e) => setSelectedDevice({...selectedDevice, password: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setSelectedDevice(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveDevice} disabled={!selectedDevice.deviceName || !selectedDevice.serialNumber}>
                        Save Device
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="webhooks" className="space-y-4">
              <div className="space-y-6">
                <div className="border rounded p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Webhook Integration</h3>
                      <p className="text-sm text-muted-foreground">
                        Subscribe to events via webhook
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={webhookActive ? "default" : "outline"}>
                        {webhookActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Switch 
                        checked={webhookActive} 
                        onCheckedChange={handleToggleWebhook}
                        disabled={isWebhookUpdating}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-muted/20 p-3 rounded text-sm">
                    <p>To use webhooks, configure the following URL in your Hikvision system:</p>
                    <code className="bg-muted p-2 mt-2 block rounded text-xs">
                      {window.location.origin}/api/hikvision-webhook
                    </code>
                  </div>
                </div>
                
                <div className="border rounded p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Event Polling</h3>
                      <p className="text-sm text-muted-foreground">
                        Poll for events every 30 seconds
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={isEventPollingActive ? "default" : "outline"}>
                        {isEventPollingActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Switch 
                        checked={isEventPollingActive} 
                        onCheckedChange={handleTogglePolling}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="testing" className="space-y-4">
              <div className="space-y-4">
                <Button onClick={handleTestRegister}>
                  Register Test Member
                </Button>
                
                <div className="p-4 border rounded bg-muted/20">
                  <h3 className="font-medium">Testing Notes</h3>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                    <li>Make sure your API configuration is correct</li>
                    <li>At least one device must be configured</li>
                    <li>Test registration creates a temporary member</li>
                    <li>Check system logs for detailed results</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Last updated: {settings.updated_at ? new Date(settings.updated_at).toLocaleString() : 'Never'}
          </p>
          <Button onClick={loadSettings} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default HikvisionSettings;
