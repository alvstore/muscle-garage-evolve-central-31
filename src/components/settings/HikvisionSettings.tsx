
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useBranch } from "@/hooks/use-branch";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import settingsService from "@/services/settingsService";

interface HikvisionDevice {
  id: string;
  name: string;
  serialNumber: string;
}

interface HikvisionSettingsState {
  id?: string;
  api_url: string;
  app_key: string;
  app_secret: string;
  devices: HikvisionDevice[];
  is_active: boolean;
  branch_id?: string;
}

const HikvisionSettings = () => {
  const [settings, setSettings] = useState<HikvisionSettingsState>({
    api_url: "",
    app_key: "",
    app_secret: "",
    devices: [],
    is_active: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { currentBranch } = useBranch();
  const [newDevice, setNewDevice] = useState<HikvisionDevice>({
    id: crypto.randomUUID(),
    name: "",
    serialNumber: "",
  });
  
  useEffect(() => {
    if (currentBranch?.id) {
      loadSettings();
    }
  }, [currentBranch?.id]);
  
  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getHikvisionSettings(currentBranch?.id);
      if (data) {
        setSettings({
          id: data.id,
          api_url: data.api_url || "",
          app_key: data.app_key || "",
          app_secret: data.app_secret || "",
          devices: data.devices || [],
          is_active: data.is_active || false,
        });
      }
    } catch (error) {
      console.error("Error loading Hikvision settings:", error);
      toast.error("Failed to load Hikvision settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!currentBranch?.id) {
      toast.error("Please select a branch first");
      return;
    }
    
    setSaving(true);
    try {
      const updatedSettings = {
        ...settings,
        branch_id: currentBranch.id
      };
      
      const result = await settingsService.saveHikvisionSettings(updatedSettings);
      
      if (result) {
        toast.success("Hikvision settings saved successfully");
        setSettings(prev => ({
          ...prev,
          id: result.id
        }));
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving Hikvision settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };
  
  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.serialNumber) {
      toast.error("Please enter both device name and serial number");
      return;
    }
    
    setSettings(prev => ({
      ...prev,
      devices: [...prev.devices, { ...newDevice }]
    }));
    
    setNewDevice({
      id: crypto.randomUUID(),
      name: "",
      serialNumber: ""
    });
  };
  
  const handleRemoveDevice = (deviceId: string) => {
    setSettings(prev => ({
      ...prev,
      devices: prev.devices.filter(device => device.id !== deviceId)
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hikvision Access Controller</CardTitle>
        <CardDescription>
          Configure your Hikvision access controller integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="hikvision-active">Enable Hikvision Integration</Label>
            <p className="text-sm text-muted-foreground">
              Turn on to enable access control via Hikvision devices
            </p>
          </div>
          <Switch
            id="hikvision-active"
            checked={settings.is_active}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, is_active: checked })
            }
          />
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="api-url">API URL</Label>
            <Input
              id="api-url"
              placeholder="https://api.hikvision.com/v1"
              value={settings.api_url}
              onChange={(e) =>
                setSettings({ ...settings, api_url: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground mt-1">
              The base URL for Hikvision API
            </p>
          </div>

          <div>
            <Label htmlFor="app-key">App Key</Label>
            <Input
              id="app-key"
              placeholder="Your Hikvision App Key"
              value={settings.app_key}
              onChange={(e) =>
                setSettings({ ...settings, app_key: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="app-secret">App Secret</Label>
            <Input
              id="app-secret"
              type="password"
              placeholder="Your Hikvision App Secret"
              value={settings.app_secret}
              onChange={(e) =>
                setSettings({ ...settings, app_secret: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Devices</Label>
          </div>
          
          <div className="space-y-2 border rounded-md p-4">
            {settings.devices.length === 0 ? (
              <p className="text-sm text-center text-muted-foreground py-4">
                No devices configured. Add a device below.
              </p>
            ) : (
              <div className="space-y-3">
                {settings.devices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between border rounded-md p-3"
                  >
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-sm text-muted-foreground">
                        S/N: {device.serialNumber}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveDevice(device.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 border-t pt-4">
              <h4 className="font-medium mb-2">Add New Device</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                <Input
                  placeholder="Device Name"
                  value={newDevice.name}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Serial Number"
                  value={newDevice.serialNumber}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, serialNumber: e.target.value })
                  }
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddDevice}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={loadSettings}>
          Cancel
        </Button>
        <Button onClick={handleSaveSettings} disabled={saving}>
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
      </CardFooter>
    </Card>
  );
};

export default HikvisionSettings;
