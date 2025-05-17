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
import { hikvisionService, HikvisionDevice as BaseHikvisionDevice, HikvisionApiSettings } from '@/services/hikvisionService';

// Extended interface to include all possible device properties
interface HikvisionDevice extends Omit<BaseHikvisionDevice, 'name' | 'isOnline'> {
  id: string;
  name: string;
  device_name?: string;
  deviceName?: string;
  device_id?: string;
  deviceId?: string;
  device_type?: string;
  deviceType?: string;
  location?: string;
  ip_address?: string;
  ipAddress?: string;
  port?: string;
  username?: string;
  password?: string;
  is_active?: boolean;
  isActive?: boolean;
  is_cloud_managed?: boolean;
  isCloudManaged?: boolean;
  use_isup_fallback?: boolean;
  useIsupFallback?: boolean;
  sync_status?: 'success' | 'failed' | 'pending';
  syncStatus?: 'success' | 'failed' | 'pending';
  last_sync?: string;
  lastSync?: string;
  status?: 'online' | 'offline' | 'unknown';
  siteId?: string;
  serialNumber: string;
  isOnline: boolean;
}

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
    settings,
    devices,
    getDevices: fetchDevices,
    testConnection: testDeviceConnection,
  } = useHikvision();

  // State for available sites
  const [availableSites, setAvailableSites] = useState<Array<{id: string, name: string, siteId?: string}>>([]);

  // Add a new device using the hikvisionService directly
  const addDeviceToHook = async (deviceData: any) => {
    if (!settings) return false;

    try {
      await hikvisionService.addDevice(settings as HikvisionApiSettings, {
        deviceName: deviceData.name,
        deviceSerial: deviceData.serialNumber,
        siteId: deviceData.siteId || ''
      });
      return true;
    } catch (error) {
      console.error('Error adding device:', error);
      return false;
    }
  };

  // Remove a device using the hikvisionService directly
  const removeDeviceFromHook = async (deviceId: string) => {
    if (!settings) return false;

    try {
      // Note: The actual implementation of removeDevice would need to be added to hikvisionService
      // This is a placeholder for the actual implementation
      console.log('Removing device:', deviceId);
      return true;
    } catch (error) {
      console.error('Error removing device:', error);
      return false;
    }
  };

  const [localDevices, setLocalDevices] = useState<HikvisionDevice[]>([]);
  const [isTestingDevice, setIsTestingDevice] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [deviceTestStatus, setDeviceTestStatus] = useState<{id: string, status: 'success' | 'error' | 'pending'}[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isAddingDevice, setIsAddingDevice] = useState(false);

  const [newDevice, setNewDevice] = useState<Partial<HikvisionDevice> & { id: string }>({
    id: '',
    name: '',
    deviceName: '',
    deviceType: 'door_controller',
    deviceId: '',
    isCloudManaged: true,
    useIsupFallback: false,
    ipAddress: '',
    port: '80',
    username: '',
    password: '',
    siteId: '',
    isOnline: false,
    serialNumber: '',
    status: 'unknown'
  });

  // Helper to safely access settings
  const getSetting = <T,>(key: string, defaultValue: T): T => {
    if (settings && typeof settings === 'object' && key in settings) {
      return (settings as any)[key] as T;
    }
    return defaultValue;
  };

  // Get token data from the service
  const getTokenData = async () => {
    if (!settings) return { success: false, token: null };
    
    try {
      // Test connection to get token
      const isConnected = await testDeviceConnection();
      return { 
        success: isConnected, 
        token: {
          accessToken: isConnected ? 'dummy-token' : null,
          availableSites: availableSites
        } 
      };
    } catch (error) {
      console.error('Error getting token:', error);
      return { 
        success: false, 
        token: { 
          accessToken: null, 
          availableSites: [] 
        } 
      };
    }
  };

  // Helper function to get a device property with fallbacks
  const getDeviceProp = (device: HikvisionDevice, prop: string): any => {
    const camelProp = prop.replace(/_(\w)/g, (_, c) => c.toUpperCase());
    return (device as any)[prop] || (device as any)[camelProp];
  };

  // Helper function to set a device property with fallbacks
  const setDeviceProp = (device: HikvisionDevice, prop: string, value: any): HikvisionDevice => {
    const camelProp = prop.replace(/_(\w)/g, (_, c) => c.toUpperCase());
    return {
      ...device,
      [prop]: value,
      [camelProp]: value
    };
  };

  // Fetch devices on component mount
  useEffect(() => {
    const loadDevices = async () => {
      try {
        const deviceList = await fetchDevices(branchId);
        // Map the device list to ensure all required fields are present
        const mappedDevices = (deviceList || []).map(device => {
          // Safely access device properties with fallbacks
          const deviceData = device as any;
          return {
            id: deviceData.id || crypto.randomUUID(),
            name: deviceData.name || deviceData.deviceName || `Device ${deviceData.serialNumber || ''}`.trim(),
            deviceName: deviceData.deviceName || deviceData.name || `Device ${deviceData.serialNumber || ''}`.trim(),
            deviceId: deviceData.deviceId || deviceData.serialNumber || '',
            deviceType: deviceData.deviceType || 'door_controller',
            isCloudManaged: deviceData.isCloudManaged ?? true,
            useIsupFallback: deviceData.useIsupFallback ?? false,
            siteId: deviceData.siteId || '',
            ipAddress: deviceData.ipAddress || '',
            port: deviceData.port || '80',
            username: deviceData.username || '',
            password: deviceData.password || '',
            isOnline: deviceData.isOnline ?? false,
            serialNumber: deviceData.serialNumber || '',
            status: deviceData.status || 'unknown'
          };
        });

        setLocalDevices(mappedDevices);
      } catch (error) {
        console.error('Error fetching devices:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch devices',
          variant: 'destructive'
        });
      }
    };

    if (branchId) {
      loadDevices();
    }
  }, [branchId, fetchDevices]);

  useEffect(() => {
    if (branchId) {
      const loadSettings = async () => {
        try {
          const settings = await hikvisionService.getSettings(branchId);
          if (settings) {
            // Update any necessary state with the loaded settings
          }
        } catch (error) {
          console.error('Error loading settings:', error);
        }
      };
      loadSettings();
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

      if (tokenData.token.availableSites && Array.isArray(tokenData.token.availableSites)) {
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

  const handleAddDevice = async () => {
    setIsAddingDevice(true);
    try {
      // Validate required fields
      if (!newDevice.deviceName || !newDevice.serialNumber) {
        toast({
          title: 'Error',
          description: 'Device name and serial number are required',
          variant: 'destructive',
        });
        return;
      }

      // If cloud managed but no site ID is provided, get the default site ID
      if (newDevice.isCloudManaged && !newDevice.siteId) {
        const tokenData = await getTokenData();
        if (tokenData?.token?.siteId) {
          newDevice.siteId = tokenData.token.siteId;
        }
      }

      // Prepare device data for the API
      const deviceData: HikvisionDevice = {
        id: newDevice.id || crypto.randomUUID(),
        name: newDevice.deviceName,
        deviceName: newDevice.deviceName,
        deviceId: newDevice.deviceId || newDevice.serialNumber || '',
        serialNumber: newDevice.serialNumber || '',
        isCloudManaged: newDevice.isCloudManaged || false,
        useIsupFallback: newDevice.useIsupFallback || false,
        siteId: newDevice.siteId || '',
        ipAddress: newDevice.ipAddress || '',
        port: newDevice.port || '80',
        username: newDevice.username || '',
        password: newDevice.password || '',
        isOnline: false, // Will be updated after testing
        status: 'unknown'
      };

      // Add the device using the hook
      const success = await addDeviceToHook(deviceData);

      if (success) {
        // Update local state
        setLocalDevices(prev => [...prev, deviceData]);

        // Reset form
        setNewDevice({
          id: '',
          name: '',
          deviceName: '',
          deviceType: 'door_controller',
          deviceId: '',
          isCloudManaged: true,
          useIsupFallback: false,
          ipAddress: '',
          port: '80',
          username: '',
          password: '',
          siteId: '',
          isOnline: false,
          serialNumber: ''
        });
        setDialogOpen(false);

        toast({
          title: 'Success',
          description: 'Device added successfully',
        });
      }
    } catch (error) {
      console.error('Error adding device:', error);
      toast({
        title: 'Error',
        description: 'Failed to add device. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAddingDevice(false);
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    if (!confirm('Are you sure you want to remove this device?')) {
      return;
    }

    try {
      // Use the hook's isSaving state instead of local state
      const success = await removeDeviceFromHook(deviceId);

      if (success) {
        // Update local state
        setLocalDevices(prev => prev.filter(device => device.id !== deviceId));
        
        toast({
          title: 'Success',
          description: 'Device removed successfully',
        });
      }
    } catch (error) {
      console.error('Error removing device:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove device. Please try again.',
        variant: 'destructive',
      });
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
          const accessToken = tokenData.token.accessToken;
          const siteId = tokenData.token.siteId;
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

  // Handle site selection
  useEffect(() => {
    const loadSites = async () => {
      if (!settings) return;
      
      try {
        // Try to fetch sites from the Hikvision API
        const sites = await hikvisionService.getSites(settings as HikvisionApiSettings);
        const formattedSites = sites.map((site: any) => ({
          id: site.id || '',
          name: site.name || 'Unnamed Site',
          siteId: site.id || ''
        }));
        setAvailableSites(formattedSites);
      } catch (error) {
        console.error('Error loading sites:', error);
        // Fallback to empty array if API call fails
        setAvailableSites([]);
      }
    };
    
    loadSites();
  }, [settings]);
  
  // Handle device deletion
  const handleDelete = (deviceId: string) => {
    if (confirm('Are you sure you want to delete this device?')) {
      handleRemoveDevice(deviceId);
    }
  };

  // Render site options
  const renderSiteOptions = () => {
    if (!availableSites || availableSites.length === 0) {
      return <option value="">No sites available</option>;
    }
    
    return availableSites.map(site => (
      <option key={site.id} value={site.siteId || site.id}>
        {site.name || `Site ${site.id}`}
      </option>
    ));
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
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
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
                        {renderSiteOptions()}
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
                {settings.devices.map((device: any) => {
                  // Get device test status if available
                  const testStatus = deviceTestStatus.find(status => status.id === device.id);
                  const deviceName = device.deviceName || device.device_name || device.name || 'Unnamed Device';
                  const deviceId = device.device_id || device.deviceId || device.serialNumber || 'Unknown ID';
                  const deviceType = device.deviceType || device.device_type || 'Unknown Type';
                  const isCloudManaged = device.isCloudManaged || device.is_cloud_managed || false;
                  const useIsupFallback = device.useIsupFallback || device.use_isup_fallback || false;
                  const location = device.location || 'Not specified';
                  
                  return (
                    <div key={device.id || deviceId} className="grid grid-cols-7 gap-4 p-3">
                      <div className="col-span-2 flex items-center">
                        <div>
                          <div className="font-medium">{deviceName}</div>
                          {useIsupFallback && (
                            <div className="text-xs text-muted-foreground mt-1">
                              ISUP Fallback Enabled
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 truncate font-medium">{deviceType}</div>
                        <Badge 
                          variant={isCloudManaged ? "default" : "outline"} 
                          className="ml-2 flex items-center gap-1"
                        >
                          {isCloudManaged ? 
                            <Cloud className="h-3 w-3" /> : 
                            <Wifi className="h-3 w-3" />}
                          {isCloudManaged ? 'Cloud' : 'ISUP'}
                        </Badge>
                      </div>
                      <div className="text-sm flex items-center">
                        <span className="truncate">{deviceId}</span>
                      </div>
                      <div className="text-sm flex items-center">
                        <span className="truncate">{location}</span>
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
                          disabled={isTestingDevice && selectedDevice === device.id}
                          className="h-8 w-8"
                          title="Test Connection"
                        >
                          {isTestingDevice && selectedDevice === device.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDelete(device.id || deviceId)}
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
