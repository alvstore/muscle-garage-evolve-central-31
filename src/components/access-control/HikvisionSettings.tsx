
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Check, X, RefreshCw } from "lucide-react";
import { useHikvision } from '@/hooks/use-hikvision-consolidated';
import { HikvisionApiSettings } from '@/services/hikvisionService';

interface HikvisionSettingsProps {
  branchId?: string;
}

const HikvisionSettings = ({ branchId }: HikvisionSettingsProps) => {
  const hikvision = useHikvision();
  
  // Extract values from the hook
  const settings = hikvision.settings as HikvisionApiSettings | null;
  const isLoading = hikvision.isLoading || false;
  const isSaving = hikvision.isSaving || false;
  const saveSettings = hikvision.saveSettings;
  const testConnection = hikvision.testConnection;
  const fetchDevices = hikvision.fetchDevices;
  const isLoadingDevices = hikvision.isLoadingDevices || false;
  const devices = hikvision.devices || [];
  
  type FormData = Omit<HikvisionApiSettings, 'id' | 'created_at' | 'updated_at'> & { branch_id: string };
  
  const [formData, setFormData] = useState<FormData>(() => ({
    app_key: settings?.app_key || '',
    app_secret: settings?.app_secret || '',
    api_url: settings?.api_url || 'https://api.hikvision.com',
    branch_id: settings?.branch_id || branchId || '',
    is_active: settings?.is_active || false,
    devices: settings?.devices || []
  }));
  const [isTesting, setIsTesting] = useState(false);
  const [isConnectionValid, setIsConnectionValid] = useState<boolean | null>(null);

  // Initialize form data once settings are loaded
  React.useEffect(() => {
    if (settings) {
      setFormData(prev => ({
        ...prev,
        ...settings,
        branch_id: settings.branch_id || branchId || ''
      }));
    }
  }, [settings, branchId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleActive = (active: boolean) => {
    setFormData(prev => ({ ...prev, is_active: active }));
  };

  const handleSave = async () => {
    const success = await saveSettings(formData);
    if (success && formData.is_active) {
      fetchDevices();
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setIsConnectionValid(null);
    
    try {
      const success = await testConnection(formData);
      setIsConnectionValid(success);
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hikvision Access Control Integration</CardTitle>
        <CardDescription>
          Connect your Hik-Partner Pro API to manage access control devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Enable Integration</h4>
              <p className="text-sm text-muted-foreground">
                Activating will sync members with access control devices
              </p>
            </div>
            <Switch 
              checked={formData.is_active}
              onCheckedChange={handleToggleActive}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="api_url">API URL</Label>
              <Input
                id="api_url"
                name="api_url"
                value={formData.api_url}
                onChange={handleInputChange}
                placeholder="https://api.hikvision.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="app_key">App Key</Label>
              <Input
                id="app_key"
                name="app_key"
                value={formData.app_key}
                onChange={handleInputChange}
                placeholder="Enter your Hikvision app key"
                required
              />
            </div>

            <div>
              <Label htmlFor="app_secret">App Secret</Label>
              <Input
                id="app_secret"
                name="app_secret"
                type="password"
                value={formData.app_secret}
                onChange={handleInputChange}
                placeholder="Enter your Hikvision app secret"
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTesting || !formData.app_key || !formData.app_secret}
              className="flex gap-2 items-center"
            >
              {isTesting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>Test Connection</>
              )}
            </Button>
            
            {isConnectionValid !== null && (
              <div className="flex items-center">
                {isConnectionValid ? (
                  <><Check className="h-4 w-4 text-green-500 mr-1" /> Valid connection</>
                ) : (
                  <><X className="h-4 w-4 text-red-500 mr-1" /> Invalid credentials</>
                )}
              </div>
            )}
          </div>

          {formData.is_active && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Connected Devices</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fetchDevices()}
                  disabled={isLoadingDevices}
                  className="flex items-center gap-1"
                >
                  {isLoadingDevices ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh
                </Button>
              </div>
              
              {isLoadingDevices ? (
                <div className="py-4 text-center">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Loading devices...</p>
                </div>
              ) : devices && devices.length > 0 ? (
                <ul className="divide-y">
                  {devices.map((device) => (
                    <li key={device.serialNumber} className="py-2 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-muted-foreground">S/N: {device.serialNumber}</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`flex items-center text-xs px-2 py-1 rounded-full ${
                          device.isOnline ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {device.isOnline ? (
                            <><Check className="h-3 w-3 mr-1" /> Online</>
                          ) : (
                            <><X className="h-3 w-3 mr-1" /> Offline</>
                          )}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground">No devices found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add devices in the device management section
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex gap-2 items-center"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>Save Settings</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default HikvisionSettings;
