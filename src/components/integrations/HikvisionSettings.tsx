import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Save, RefreshCw, Video, Key } from "lucide-react";
import settingsService from "@/services/settingsService";
import { useBranch } from '@/hooks/use-branch';

const HikvisionSettings = () => {
  const { currentBranch } = useBranch();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [settings, setSettings] = useState({
    enabled: false,
    apiUrl: '',
    username: '',
    password: '',
    deviceId: '',
    syncInterval: 5,
    autoSync: true,
    lastSync: null,
  });

  useEffect(() => {
    if (currentBranch?.id) {
      fetchSettings();
    }
  }, [currentBranch?.id]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsService.getIntegrationSettings('hikvision', currentBranch?.id);
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch Hikvision settings:', error);
      toast.error('Failed to load integration settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.saveIntegrationSettings('hikvision', settings, currentBranch?.id);
      toast.success('Hikvision settings saved successfully');
    } catch (error) {
      console.error('Failed to save Hikvision settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const response = await settingsService.testIntegrationConnection('hikvision', settings);
      if (response.success) {
        toast.success('Connection successful! Device is reachable.');
      } else {
        toast.error('Connection failed: ' + response.message);
      }
    } catch (error) {
      console.error('Test connection failed:', error);
      toast.error('Connection test failed');
    } finally {
      setTesting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Video className="mr-2 h-5 w-5" />
              Hikvision Integration
            </CardTitle>
            <CardDescription>
              Connect to Hikvision cameras for automated attendance tracking
            </CardDescription>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) => handleChange('enabled', checked)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="connection">
          <TabsList className="mb-4">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="sync">Sync Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connection">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiUrl">API URL</Label>
                  <Input
                    id="apiUrl"
                    placeholder="https://192.168.1.100"
                    value={settings.apiUrl}
                    onChange={(e) => handleChange('apiUrl', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceId">Device ID</Label>
                  <Input
                    id="deviceId"
                    placeholder="Device ID or Serial Number"
                    value={settings.deviceId}
                    onChange={(e) => handleChange('deviceId', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Admin username"
                    value={settings.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={settings.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={testing || !settings.apiUrl || !settings.username || !settings.password}
                >
                  {testing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-4 w-4" />
                      Test Connection
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sync">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Automatic Synchronization</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync attendance data from Hikvision devices
                  </p>
                </div>
                <Switch
                  checked={settings.autoSync}
                  onCheckedChange={(checked) => handleChange('autoSync', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="syncInterval">Sync Interval (minutes)</Label>
                <Input
                  id="syncInterval"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.syncInterval}
                  onChange={(e) => handleChange('syncInterval', parseInt(e.target.value))}
                  disabled={!settings.autoSync}
                />
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Last Synchronization</h3>
                    <p className="text-sm text-muted-foreground">
                      {settings.lastSync 
                        ? new Date(settings.lastSync).toLocaleString() 
                        : 'Never synchronized'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Now
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Device Configuration</Label>
                <div className="rounded-md bg-muted p-4">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(settings, null, 2)}
                  </pre>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <Button variant="destructive" size="sm">
                  Reset Configuration
                </Button>
                <Button variant="outline" size="sm">
                  Export Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HikvisionSettings;
