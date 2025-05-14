import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { setupHikvisionApiSettings, getHikvisionApiSettings } from '@/services/biometricService';
import Icon from '@/components/icon';

interface HikvisionDevice {
  name: string;
  device_type: 'cloud' | 'local';
  serial_number?: string;
  ip_address?: string;
  port?: number;
  username?: string;
  password?: string;
  is_active?: boolean;
}

interface HikvisionSettings {
  api_url: string;
  app_key: string;
  app_secret: string;
  devices: HikvisionDevice[];
  is_active: boolean;
}

const HikvisionSetup = ({ branchId }: { branchId: string }) => {
  const [settings, setSettings] = useState<HikvisionSettings>({
    api_url: '',
    app_key: '',
    app_secret: '',
    devices: [],
    is_active: true
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getHikvisionApiSettings(branchId);
        if (data) {
          setSettings(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [branchId]);
  
  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await setupHikvisionApiSettings(branchId, settings);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(`Error saving settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };
  
  const addDevice = () => {
    setSettings({
      ...settings,
      devices: [
        ...settings.devices,
        {
          name: `Device ${settings.devices.length + 1}`,
          device_type: 'cloud',
          is_active: true
        }
      ]
    });
  };
  
  const updateDevice = (index: number, device: HikvisionDevice) => {
    const updatedDevices = [...settings.devices];
    updatedDevices[index] = device;
    setSettings({
      ...settings,
      devices: updatedDevices
    });
  };
  
  const removeDevice = (index: number) => {
    const updatedDevices = [...settings.devices];
    updatedDevices.splice(index, 1);
    setSettings({
      ...settings,
      devices: updatedDevices
    });
  };
  
  const testConnection = async () => {
    setTestResult(null);
    try {
      // Test the API connection
      const testUrl = `${settings.api_url}/api/hpcgw/v1/person/count`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      if (settings.app_key) {
        headers['Authorization'] = `Bearer ${settings.app_key}`;
      } else if (settings.app_secret) {
        headers['Authorization'] = `Basic ${btoa(`${settings.app_key}:${settings.app_secret}`)}`;
      }
      
      // Log the request details
      console.log('Testing connection to:', testUrl);
      console.log('Headers:', headers);
      
      // Make a direct request for testing
      try {
        const response = await fetch(testUrl, {
          method: 'GET',
          headers
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API response:', data);
        
        setTestResult({
          success: true,
          message: `Connection successful! Response: ${JSON.stringify(data)}`
        });
      } catch (fetchError: any) {
        console.error('Fetch error:', fetchError);
        
        // If direct request fails (likely due to CORS), show instructions
        setTestResult({
          success: false,
          message: `Direct API call failed: ${fetchError.message}. You may need to set up a server-side proxy.`
        });
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `Error testing connection: ${error.message}`
      });
    }
  };
  
  if (loading) {
    return <div>Loading settings...</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hikvision API Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="api_url">API URL</Label>
                <Input
                  id="api_url"
                  value={settings.api_url}
                  onChange={(e) => setSettings({...settings, api_url: e.target.value})}
                  placeholder="https://api.hikvision.com"
                />
              </div>
              <div>
                <Label htmlFor="app_key">App Key</Label>
                <Input
                  id="app_key"
                  value={settings.app_key}
                  onChange={(e) => setSettings({...settings, app_key: e.target.value})}
                  placeholder="Your Hikvision App Key"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="app_secret">App Secret</Label>
              <Input
                id="app_secret"
                type="password"
                value={settings.app_secret}
                onChange={(e) => setSettings({...settings, app_secret: e.target.value})}
                placeholder="Your Hikvision App Secret"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={settings.is_active}
                onCheckedChange={(checked) => setSettings({...settings, is_active: checked})}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Devices</h3>
              <Button onClick={addDevice} variant="outline" size="sm">Add Device</Button>
            </div>
            
            {settings.devices.length === 0 ? (
              <Alert>
                <Icon icon="alert-circle" className="h-4 w-4" />
                <AlertTitle>No devices configured</AlertTitle>
                <AlertDescription>
                  Add at least one device to enable biometric registration.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {settings.devices.map((device, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`device_name_${index}`}>Device Name</Label>
                          <Input
                            id={`device_name_${index}`}
                            value={device.name}
                            onChange={(e) => updateDevice(index, {...device, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`device_type_${index}`}>Device Type</Label>
                          <select
                            id={`device_type_${index}`}
                            value={device.device_type}
                            onChange={(e) => updateDevice(index, {
                              ...device, 
                              device_type: e.target.value as 'cloud' | 'local'
                            })}
                            className="w-full p-2 border rounded"
                          >
                            <option value="cloud">Cloud</option>
                            <option value="local">Local</option>
                          </select>
                        </div>
                      </div>
                      
                      {device.device_type === 'cloud' ? (
                        <div>
                          <Label htmlFor={`serial_number_${index}`}>Serial Number</Label>
                          <Input
                            id={`serial_number_${index}`}
                            value={device.serial_number || ''}
                            onChange={(e) => updateDevice(index, {...device, serial_number: e.target.value})}
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`ip_address_${index}`}>IP Address</Label>
                            <Input
                              id={`ip_address_${index}`}
                              value={device.ip_address || ''}
                              onChange={(e) => updateDevice(index, {...device, ip_address: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`port_${index}`}>Port</Label>
                            <Input
                              id={`port_${index}`}
                              type="number"
                              value={device.port || 80}
                              onChange={(e) => updateDevice(index, {
                                ...device, 
                                port: parseInt(e.target.value) || 80
                              })}
                            />
                          </div>
                        </div>
                      )}
                      
                      {device.device_type === 'local' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`username_${index}`}>Username</Label>
                            <Input
                              id={`username_${index}`}
                              value={device.username || ''}
                              onChange={(e) => updateDevice(index, {...device, username: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`password_${index}`}>Password</Label>
                            <Input
                              id={`password_${index}`}
                              type="password"
                              value={device.password || ''}
                              onChange={(e) => updateDevice(index, {...device, password: e.target.value})}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`device_active_${index}`}
                            checked={device.is_active !== false}
                            onCheckedChange={(checked) => updateDevice(index, {...device, is_active: checked})}
                          />
                          <Label htmlFor={`device_active_${index}`}>Active</Label>
                        </div>
                        <Button 
                          onClick={() => removeDevice(index)} 
                          variant="destructive" 
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {testResult && (
            <Alert variant={testResult.success ? "default" : "destructive"}>
              <Icon icon={testResult.success ? "info-circle" : "alert-circle"} className="h-4 w-4" />
              <AlertTitle>{testResult.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>
                {testResult.message}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-end space-x-4">
            <Button onClick={testConnection} variant="outline" disabled={saving}>
              Test Connection
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HikvisionSetup;
