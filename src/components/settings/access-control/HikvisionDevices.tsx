import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useHikvision } from '@/hooks/use-hikvision-consolidated';
import type { HikvisionDevice } from '@/services/hikvisionService';
import { Loader2, Plus, Trash2, RefreshCw, Cloud, Wifi, Server, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';

interface HikvisionDevicesProps {
  branchId: string;
}

// Using HikvisionDevice from use-hikvision-consolidated

export default function HikvisionDevices({ branchId }: HikvisionDevicesProps) {
  const { 
    isLoading, 
    isSaving, 
    error, 
    devices, 
    getDevices,
    saveSettings,
    testConnection
  } = useHikvision();

  // Get token data from the service
  const getTokenData = async () => {
    try {
      const response = await testConnection();
      return { success: true, token: response };
    } catch (error) {
      console.error('Error getting token:', error);
      return { success: false, token: null };
    }
  };

  const [localDevices, setLocalDevices] = useState<HikvisionDevice[]>([]);
  
  const [newDevice, setNewDevice] = useState<HikvisionDevice>({
    deviceName: '',
    deviceType: '',
    deviceId: '',
    isCloudManaged: true,
    useIsupFallback: false,
    ipAddress: '',
    port: '80',
    username: '',
    password: '',
    siteId: ''
  });
  
  // Using TokenData interface imported from use-hikvision.ts
  
  const [availableSites, setAvailableSites] = useState<{siteId: string, siteName: string}[]>([]);
  
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isTestingDevice, setIsTestingDevice] = useState(false);
  const [deviceTestStatus, setDeviceTestStatus] = useState<{ id: string, status: 'success' | 'error' | 'pending' }[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        await getDevices();
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };
    
    fetchDevices();
  }, [getDevices]);

  useEffect(() => {
    if (branchId) {
      fetchSettings(branchId);
      fetchAvailableSites();
    }
  }, [branchId]);

  const fetchAvailableSites = async () => {
    try {
      // Get token data directly from the hook which includes available sites
      const tokenData = await getTokenData();
      
      if (!tokenData) {
        console.error('Error fetching token data');
        return;
      }
      
      if (tokenData.token?.availableSites && Array.isArray(tokenData.token.availableSites)) {
        // Convert to component format if needed
        const sites = tokenData.token.availableSites;
        setAvailableSites(sites);
      } else {
        // Fallback to database query if not available in token data
        const { data: dbTokenData, error } = await supabase
          .from('hikvision_tokens')
          .select('available_sites')
          .eq('branch_id', branchId)
          .single();
        
        if (error) {
          console.error('Error fetching available sites:', error);
          return;
        }
        
        if (dbTokenData?.available_sites && Array.isArray(dbTokenData.available_sites)) {
          const sites = dbTokenData.available_sites.map((site: any) => ({
            siteId: site.siteId || site.site_id,
            siteName: site.siteName || site.site_name
          }));
          setAvailableSites(sites);
        }
      }
    } catch (error) {
      console.error('Error in fetchAvailableSites:', error);
    }
  };

  // This function had the error - fixed by reorganizing the code
  const handleAddDevice = async () => {
    setIsAddingDevice(true);
    
    try {
      // First, check if we need to get a site ID from token data
      const tokenData = await getTokenData();
      
      if (tokenData?.success && tokenData.token?.siteId) {
        setNewDevice(prevDevice => ({
          ...prevDevice,
          siteId: tokenData.token.siteId
        }));
      }
      
      // Validate ISUP fallback requirements
      if (newDevice.useIsupFallback && (!newDevice.ipAddress || !newDevice.username || !newDevice.password)) {
        toast({
          title: "Error",
          description: 'IP address, username, and password are required for ISUP fallback',
          variant: "destructive",
        });
        return;
      }

      const deviceData: any = {
        deviceName: newDevice.deviceName,
        deviceType: newDevice.deviceType,
        serialNumber: newDevice.serialNumber,
        location: newDevice.location || undefined,
        isCloudManaged: newDevice.isCloudManaged,
        useIsupFallback: newDevice.useIsupFallback,
        siteId: newDevice.siteId || ''
      };
      
      // Add ISUP connection details if needed
      if (newDevice.useIsupFallback || !newDevice.isCloudManaged) {
        deviceData.ipAddress = newDevice.ipAddress;
        deviceData.port = newDevice.port;
        deviceData.username = newDevice.username;
        deviceData.password = newDevice.password;
      }

      // Assuming addDevice is a function that will be defined
      const addDevice = async (deviceData: any) => {
        // Add device to local state
        setLocalDevices(prev => [...prev, deviceData]);
        toast({
          title: 'Device added',
          description: 'The device has been added successfully.',
        });
        return true;
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
          useIsupFallback: false,
          siteId: ''
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add device. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAddingDevice(false);
    }
  };

  // This function is referenced but missing implementation
  const fetchSettings = async (branchId: string) => {
    // Implementation would be added here in a real scenario
    console.log("Fetching settings for branch:", branchId);
  };

  const handleDelete = async (deviceId: string) => {
    if (confirm('Are you sure you want to delete this device?')) {
      // Placeholder for removeDevice function
      const removeDevice = async (deviceId: string) => {
        setLocalDevices(prev => prev.filter(device => device.deviceId !== deviceId));
        toast({
          title: 'Device removed',
          description: 'The device has been removed successfully.',
        });
        return true;
      };
      
      await removeDevice(deviceId);
    }
  };

  const testDevice = async (device: HikvisionDevice) => {
    try {
      setIsTestingDevice(true);
      setSelectedDevice(device.id);
      setDeviceTestStatus(prev => {
        const filtered = prev.filter(item => item.id !== device.id);
        // Add new pending status
        return [...filtered, { id: device.id, status: 'pending' }];
      });
      
      // Extract device properties with fallbacks
      const deviceId = device.device_id || device.deviceId || '';
      const isCloudManaged = device.is_cloud_managed || device.isCloudManaged || false;
      const useIsupFallback = device.use_isup_fallback || device.useIsupFallback || false;
      const ipAddress = device.ip_address || device.ipAddress || '';
      const port = device.port || '80';
      const username = device.username || '';
      const password = device.password || '';
      
      // First try cloud API if device is cloud-managed
      if (isCloudManaged) {
        try {
          // Get a token with site information
          const tokenData = await getTokenData();
          if (!tokenData) {
            throw new Error("Failed to get access token");
          }
          
          // Now tokenData is properly typed as TokenData
          const accessToken = tokenData.token?.accessToken;
          const siteId = tokenData.token?.siteId;
          console.log('Testing cloud device connection for device:', deviceId);
          
          // Make sure we have a site ID
          if (!siteId) {
            throw new Error("No site ID available. Please configure a site first.");
          }
          
          // Step 1: Check if device is already added to the site
          const { data: deviceData, error: deviceError } = await supabase.functions.invoke('hikvision-proxy', {
            body: {
              action: 'check-device-exists',
              token: accessToken,
              siteId,
              deviceId
            }
          });
          
          if (deviceError) {
            throw new Error(deviceError.message || "Failed to check device");
          }
          
          // Step 2: Test device connection
          const { data: testData, error: testError } = await supabase.functions.invoke('hikvision-proxy', {
            body: {
              action: 'test-device',
              token: accessToken,
              deviceId,
              siteId
            }
          });
          
          if (testError) {
            throw new Error(testError.message || "Failed to test device connection");
          }
          
          if (testData?.status === 'online') {
            setDeviceTestStatus(prev => {
              const filtered = prev.filter(item => item.id !== device.id);
              return [...filtered, { id: device.id, status: 'success' }];
            });
            
            toast({
              title: "Success",
              description: deviceData?.exists 
                ? "Device is online and connected" 
                : "Device is online but not yet added to site",
            });
            return;
          } else {
            // Device exists but is offline
            if (useIsupFallback && ipAddress) {
              console.log('Device is offline, trying ISUP fallback');
              // Continue to ISUP testing below
            } else {
              throw new Error("Device exists but is offline. Check device power and network connection.");
            }
          }
        } catch (cloudError: any) {
          console.log('Cloud connection failed:', cloudError);
          
          // Only proceed with ISUP fallback if enabled and IP address is available
          if (!useIsupFallback || !ipAddress) {
            throw cloudError;
          }
          // Otherwise continue to ISUP testing below
        }
      }
      
      // Try ISUP protocol for direct device connection
      if (ipAddress && username && password) {
        try {
          console.log('Testing ISUP direct connection for device:', deviceId);
          
          // Test ISUP connection via Edge Function
          const { data: isupData, error: isupError } = await supabase.functions.invoke('hikvision-proxy', {
            body: {
              action: 'test-isup-device',
              ipAddress,
              port,
              username,
              password
            }
          });
          
          if (isupError) {
            throw new Error(isupError.message || "ISUP connection failed");
          }
          
          if (isupData?.success) {
            setDeviceTestStatus(prev => {
              const filtered = prev.filter(item => item.id !== device.id);
              return [...filtered, { id: device.id, status: 'success' }];
            });
            
            toast({
              title: "Success",
              description: "ISUP connection successful",
            });
            return;
          } else {
            throw new Error(isupData?.message || "ISUP connection failed");
          }
        } catch (isupError: any) {
          console.error('ISUP connection failed:', isupError);
          setDeviceTestStatus(prev => {
            const filtered = prev.filter(item => item.id !== device.id);
            return [...filtered, { id: device.id, status: 'error' }];
          });
          throw isupError;
        }
      } else if (!isCloudManaged) {
        throw new Error("Missing required ISUP connection details (IP address, username, password)");
      }
    } catch (error: any) {
      console.error('Error testing device:', error);
      setDeviceTestStatus(prev => {
        const filtered = prev.filter(item => item.id !== device.id);
        return [...filtered, { id: device.id, status: 'error' }];
      });
      toast({
        title: "Error",
        description: error.message || "Failed to test device connection",
        variant: "destructive",
      });
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
                
                <div className="flex items-center space-x-2 py-2">
                  <Switch
                    id="isup-fallback"
                    checked={newDevice.useIsupFallback}
                    onCheckedChange={(checked) => setNewDevice({...newDevice, useIsupFallback: checked})}
                  />
                  <Label htmlFor="isup-fallback" className="flex items-center gap-2">
                    <Server className="h-4 w-4" /> Enable ISUP Fallback
                  </Label>
                </div>
                
                {/* Show these fields if ISUP is enabled or device is not cloud-managed */}
                {(newDevice.useIsupFallback || !newDevice.isCloudManaged) && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="ip-address">IP Address</Label>
                      <Input 
                        id="ip-address" 
                        value={newDevice.ipAddress} 
                        onChange={(e) => setNewDevice({...newDevice, ipAddress: e.target.value})}
                        placeholder="192.168.1.100"
                      />
                    </div>
                    
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
                  </>
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
                  ) : "Add Device"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Device List */}
        {devices && devices.length > 0 ? (
          <div className="space-y-4">
            {devices.map((device: HikvisionDevice) => (
              <div key={device.id || device.deviceId} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-medium">{device.deviceName || device.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ID: {device.serialNumber || device.deviceId}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={device.isOnline ? "success" : "destructive"}>
                      {device.isOnline ? "Online" : "Offline"}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={isTestingDevice}
                      onClick={() => testDevice(device)}
                    >
                      {selectedDevice === device.id ? (
                        deviceTestStatus.find(s => s.id === device.id)?.status === 'pending' ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : deviceTestStatus.find(s => s.id === device.id)?.status === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )
                      ) : (
                        <>Test</>
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(device.id || device.deviceId || '')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type: </span>
                    {device.deviceType || "Unknown"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location: </span>
                    {device.location || "Not specified"}
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Connection: </span>
                    {device.isCloudManaged ? (
                      <span className="flex items-center gap-1">
                        <Cloud className="h-3 w-3" /> Cloud
                        {device.useIsupFallback && " (ISUP Fallback)"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Wifi className="h-3 w-3" /> Direct ISUP
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isLoading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <div className="py-12 text-center">
            <Server className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No devices found</h3>
            <p className="text-muted-foreground mb-4">
              Add your first device to get started with access control
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add First Device
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {devices ? `${devices.length} devices configured` : '0 devices configured'}
        </p>
        <Button variant="outline" size="sm" onClick={() => getDevices()} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
}
