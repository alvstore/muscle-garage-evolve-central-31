
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useHikvision, HikvisionDevice } from '@/hooks/use-hikvision';
import { Loader2, Plus, Trash2, RefreshCw, Cloud, Wifi, Server, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HikvisionDevicesProps {
  branchId: string;
}

export default function HikvisionDevices({ branchId }: HikvisionDevicesProps) {
  const { 
    settings, 
    isLoading, 
    fetchSettings, 
    addDevice,
    removeDevice,
    getToken
  } = useHikvision({ branchId });

  const [newDevice, setNewDevice] = useState<Partial<HikvisionDevice>>({
    deviceName: '',
    deviceType: 'door_controller',
    serialNumber: '',
    isCloudManaged: true,
    useIsupFallback: false,
    ipAddress: '',
    port: '80',
    username: '',
    password: '',
    location: '',
    siteId: ''
  });
  
  const [availableSites, setAvailableSites] = useState<{siteId: string, siteName: string}[]>([]);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isTestingDevice, setIsTestingDevice] = useState(false);
  const [deviceTestStatus, setDeviceTestStatus] = useState<{ id: string, status: 'success' | 'error' | 'pending' }[]>([]);

  useEffect(() => {
    if (branchId) {
      fetchSettings(branchId);
      fetchAvailableSites();
    }
  }, [branchId, fetchSettings]);

  const fetchAvailableSites = async () => {
    try {
      // Get token data which includes available sites
      const tokenResult = await getToken();
      
      if (!tokenResult.success || !tokenResult.token) {
        console.error('Error fetching token data');
        return;
      }
      
      if (tokenResult.token.availableSites && Array.isArray(tokenResult.token.availableSites)) {
        setAvailableSites(tokenResult.token.availableSites);
      }
    } catch (error) {
      console.error('Error in fetchAvailableSites:', error);
    }
  };

  const handleAddDevice = async () => {
    setIsAddingDevice(true);
    try {
      // Validate inputs
      if (!newDevice.deviceName || !newDevice.serialNumber) {
        toast.error('Device name and serial number are required');
        return;
      }
      
      // Validate ISUP fallback requirements
      if (newDevice.useIsupFallback && (!newDevice.ipAddress || !newDevice.username || !newDevice.password)) {
        toast.error('IP address, username, and password are required for ISUP fallback');
        return;
      }

      // Create a complete device object
      const deviceData: HikvisionDevice = {
        deviceName: newDevice.deviceName || '',
        deviceType: newDevice.deviceType || 'door_controller',
        serialNumber: newDevice.serialNumber || '',
        location: newDevice.location,
        isCloudManaged: Boolean(newDevice.isCloudManaged),
        useIsupFallback: Boolean(newDevice.useIsupFallback),
        ipAddress: newDevice.ipAddress,
        port: newDevice.port,
        username: newDevice.username,
        password: newDevice.password,
        siteId: newDevice.siteId
      };

      const success = await addDevice(deviceData);

      if (success) {
        setDialogOpen(false);
        setNewDevice({
          deviceName: '',
          deviceType: 'door_controller',
          serialNumber: '',
          ipAddress: '',
          port: '80',
          username: '',
          password: '',
          location: '',
          isCloudManaged: true,
          useIsupFallback: false
        });
      }
    } finally {
      setIsAddingDevice(false);
    }
  };

  const handleDelete = async (deviceId: string) => {
    if (confirm('Are you sure you want to delete this device?')) {
      await removeDevice(deviceId);
    }
  };

  const testDevice = async (device: HikvisionDevice) => {
    try {
      setIsTestingDevice(true);
      setSelectedDevice(device.id || device.serialNumber);
      setDeviceTestStatus(prev => {
        const filtered = prev.filter(item => (device.id && item.id !== device.id) || 
                                             (device.serialNumber && item.id !== device.serialNumber));
        // Add new pending status
        return [...filtered, { id: device.id || device.serialNumber || '', status: 'pending' }];
      });
      
      // Get a token
      const tokenResult = await getToken();
      
      if (!tokenResult.success || !tokenResult.token) {
        throw new Error("Failed to get access token");
      }
      
      const accessToken = tokenResult.token.accessToken;
      const siteId = device.siteId || tokenResult.token.siteId;
      console.log('Testing device connection for device:', device.serialNumber);
      
      // Make sure we have a site ID for cloud-managed devices
      if (device.isCloudManaged && !siteId) {
        throw new Error("No site ID available. Please configure a site first.");
      }
      
      // Call our edge function to test the device
      const { data, error } = await fetch('/api/hikvision-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test-device',
          token: accessToken,
          deviceId: device.serialNumber,
          siteId: siteId,
          branchId: branchId
        })
      }).then(res => res.json());
      
      if (error || !data || !data.success) {
        throw new Error(error?.message || data?.message || "Failed to test device");
      }
      
      if (data.status === 'online') {
        setDeviceTestStatus(prev => {
          const filtered = prev.filter(item => (device.id && item.id !== device.id) || 
                                               (device.serialNumber && item.id !== device.serialNumber));
          return [...filtered, { id: device.id || device.serialNumber || '', status: 'success' }];
        });
        
        toast.success("Device is online and connected");
      } else {
        throw new Error("Device exists but is offline. Check device power and network connection.");
      }
    } catch (error: any) {
      console.error('Error testing device:', error);
      setDeviceTestStatus(prev => {
        const filtered = prev.filter(item => (device.id && item.id !== device.id) || 
                                             (device.serialNumber && item.id !== device.serialNumber));
        return [...filtered, { id: device.id || device.serialNumber || '', status: 'error' }];
      });
      toast.error(error.message || "Failed to test device connection");
    } finally {
      setIsTestingDevice(false);
      setTimeout(() => setSelectedDevice(null), 3000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hikvision Devices</CardTitle>
        <CardDescription>
          Configure access control devices for your gym
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Access Control Device</DialogTitle>
                <DialogDescription>
                  Enter the details for the new Hikvision device
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="device-name">Device Name</Label>
                  <Input 
                    id="device-name" 
                    value={newDevice.deviceName} 
                    onChange={(e) => setNewDevice({...newDevice, deviceName: e.target.value})}
                    placeholder="Main Entrance"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="device-type">Device Type</Label>
                  <Select 
                    value={newDevice.deviceType} 
                    onValueChange={(value) => setNewDevice({...newDevice, deviceType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="door_controller">Door Controller</SelectItem>
                      <SelectItem value="access_control">Access Control Device</SelectItem>
                      <SelectItem value="camera">Camera</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {newDevice.isCloudManaged && availableSites.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="site-id">Site</Label>
                    <Select 
                      value={newDevice.siteId} 
                      onValueChange={(value) => setNewDevice({...newDevice, siteId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a site or leave empty to create new" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Create new site</SelectItem>
                        {availableSites.map((site) => (
                          <SelectItem key={site.siteId} value={site.siteId}>
                            {site.siteName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select an existing site or leave empty to create a new site
                    </p>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 py-2">
                  <Switch
                    id="cloud-managed"
                    checked={newDevice.isCloudManaged}
                    onCheckedChange={(checked) => setNewDevice({...newDevice, isCloudManaged: checked})}
                  />
                  <Label htmlFor="cloud-managed" className="flex items-center gap-2">
                    <Cloud className="h-4 w-4" /> Cloud-Managed Device
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="serial-number">Device ID / Serial Number</Label>
                  <Input 
                    id="serial-number" 
                    value={newDevice.serialNumber} 
                    onChange={(e) => setNewDevice({...newDevice, serialNumber: e.target.value})}
                    placeholder="DS-K1T343EFW"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input 
                    id="location" 
                    value={newDevice.location} 
                    onChange={(e) => setNewDevice({...newDevice, location: e.target.value})}
                    placeholder="Main Floor"
                  />
                </div>
                
                {newDevice.isCloudManaged && (
                  <div className="flex items-center space-x-2 py-2">
                    <Switch
                      id="isup-fallback"
                      checked={newDevice.useIsupFallback}
                      onCheckedChange={(checked) => setNewDevice({...newDevice, useIsupFallback: checked})}
                    />
                    <Label htmlFor="isup-fallback" className="flex items-center gap-2">
                      <Server className="h-4 w-4" /> Enable ISUP Protocol Fallback
                    </Label>
                  </div>
                )}
                
                {(!newDevice.isCloudManaged || newDevice.useIsupFallback) && (
                  <div className="mt-4 border rounded-md p-4 bg-muted/20">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Wifi className="h-4 w-4" /> Direct Connection Details
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="ip-address">IP Address</Label>
                        <Input 
                          id="ip-address" 
                          value={newDevice.ipAddress} 
                          onChange={(e) => setNewDevice({...newDevice, ipAddress: e.target.value})}
                          placeholder="192.168.1.100"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="port">Port</Label>
                          <Input 
                            id="port" 
                            value={newDevice.port} 
                            onChange={(e) => setNewDevice({...newDevice, port: e.target.value})}
                            placeholder="80"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input 
                            id="username" 
                            value={newDevice.username} 
                            onChange={(e) => setNewDevice({...newDevice, username: e.target.value})}
                            placeholder="admin"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password" 
                          type="password"
                          value={newDevice.password} 
                          onChange={(e) => setNewDevice({...newDevice, password: e.target.value})}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleAddDevice} 
                  disabled={isAddingDevice || !newDevice.deviceName || !newDevice.serialNumber}
                >
                  {isAddingDevice ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Device'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : settings?.devices && settings.devices.length > 0 ? (
          <div className="space-y-4">
            <div className="rounded-md border">
              <div className="grid grid-cols-7 gap-4 border-b bg-muted p-3 font-medium">
                <div className="col-span-2">Name</div>
                <div>Type</div>
                <div>Serial Number</div>
                <div>Location</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>
              <div className="divide-y">
                {settings.devices.map((device) => {
                  // Get device test status if available
                  const testStatus = deviceTestStatus.find(status => 
                    status.id === device.id || status.id === device.serialNumber
                  );
                  
                  return (
                    <div key={device.id || device.serialNumber} className="grid grid-cols-7 gap-4 p-3">
                      <div className="col-span-2 flex items-center">
                        <div>
                          <div className="font-medium">{device.deviceName}</div>
                          {device.useIsupFallback && (
                            <div className="text-xs text-muted-foreground mt-1">
                              ISUP Fallback Enabled
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 truncate font-medium">{device.deviceType}</div>
                        <Badge 
                          variant={device.isCloudManaged ? "default" : "outline"} 
                          className="ml-2 flex items-center gap-1"
                        >
                          {device.isCloudManaged ? 
                            <Cloud className="h-3 w-3" /> : 
                            <Wifi className="h-3 w-3" />}
                          {device.isCloudManaged ? 'Cloud' : 'ISUP'}
                        </Badge>
                      </div>
                      <div className="text-sm flex items-center">
                        <span className="truncate">{device.serialNumber}</span>
                      </div>
                      <div className="text-sm flex items-center">
                        <span className="truncate">{device.location || '-'}</span>
                      </div>
                      <div className="flex items-center">
                        {testStatus?.status === 'pending' ? (
                          <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
                            <Loader2 className="h-3 w-3 animate-spin" /> Testing
                          </Badge>
                        ) : testStatus?.status === 'success' ? (
                          <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3" /> Connected
                          </Badge>
                        ) : testStatus?.status === 'error' ? (
                          <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200">
                            <AlertCircle className="h-3 w-3" /> Error
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center gap-1 bg-slate-100 text-slate-700">
                            <AlertCircle className="h-3 w-3" /> Unknown
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => testDevice(device)}
                          disabled={isTestingDevice && selectedDevice === (device.id || device.serialNumber)}
                          className="h-8 w-8"
                          title="Test Connection"
                        >
                          {isTestingDevice && selectedDevice === (device.id || device.serialNumber) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDelete(device.id || device.serialNumber)}
                          className="h-8 w-8"
                          title="Delete Device"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No devices have been added yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add a device to start tracking member attendance automatically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
