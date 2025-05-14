import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, AlertTriangle, Plus, RefreshCw, Trash, Settings2, User, Clock, Link, CameraOff, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { hikvisionPartnerService, HikvisionDeviceWithStatus } from '@/services/integrations/hikvision/hikvisionPartnerService';
import { usePermissions } from '@/hooks/use-permissions';

const HikvisionPartnerPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [appKey, setAppKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isKeyConfigured, setIsKeyConfigured] = useState(false);
  const [devices, setDevices] = useState<HikvisionDeviceWithStatus[]>([]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [newDevice, setNewDevice] = useState({
    deviceSerial: '',
    deviceName: '',
    deviceCode: '',
    userName: 'admin',
    password: '',
    channelNos: '1',
    isVideoSupported: true
  });
  const { can } = usePermissions();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const credentials = await hikvisionPartnerService.getCredentials();
        if (credentials) {
          // Update to use the correct property names
          setAppKey(credentials.clientId || credentials.appKey || '');
          setSecretKey(credentials.clientSecret || credentials.secretKey || '');
        }
      } catch (error) {
        console.error("Error loading Hikvision settings:", error);
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      const devicesList = await hikvisionPartnerService.listDevices();
      setDevices(devicesList || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast.error('Failed to fetch devices');
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiCredentials = async () => {
    if (!appKey || !secretKey) {
      toast.error('API Key and Secret Key are required');
      return;
    }

    setIsLoading(true);
    try {
      await hikvisionPartnerService.saveCredentials(appKey, secretKey);
      setIsKeyConfigured(true);
      toast.success('API credentials saved successfully', {
        description: 'Your Hikvision Partner API credentials have been saved securely.',
      });
      fetchDevices();
    } catch (error) {
      console.error('Error saving API credentials:', error);
      toast.error('Failed to save API credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const result = await hikvisionPartnerService.testConnection();
      if (result.success) {
        toast.success('Connection successful', {
          description: 'Successfully connected to Hikvision Partner API.',
        });
      } else {
        toast.error('Connection failed', {
          description: result.message || 'Failed to connect to Hikvision Partner API.',
        });
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast.error('Connection test failed');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const addDevice = async () => {
    if (!newDevice.deviceSerial || !newDevice.deviceName) {
      toast.error('Missing required fields', {
        description: 'Device serial and name are required.',
      });
      return;
    }

    setIsAddingDevice(true);
    try {
      const result = await hikvisionPartnerService.addDevice(newDevice);
      if (result.success) {
        toast.success('Device added successfully', {
          description: `Device ${newDevice.deviceName} has been added.`,
        });
        fetchDevices();
        setNewDevice({
          deviceSerial: '',
          deviceName: '',
          deviceCode: '',
          userName: 'admin',
          password: '',
          channelNos: '1',
          isVideoSupported: true
        });
      } else {
        toast.error('Failed to add device', {
          description: result.message || 'An error occurred while adding the device.',
        });
      }
    } catch (error) {
      console.error('Error adding device:', error);
      toast.error('Failed to add device');
    } finally {
      setIsAddingDevice(false);
    }
  };

  const deleteDevice = async (deviceSerial: string, deviceName: string) => {
    if (!confirm(`Are you sure you want to delete device ${deviceName}?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await hikvisionPartnerService.deleteDevice(deviceSerial);
      if (result.success) {
        setDevices(devices.filter(device => device.deviceSerial !== deviceSerial));
        toast.success('Device deleted successfully', {
          description: `Device ${deviceName} has been removed.`,
        });
      } else {
        toast.error('Failed to delete device', {
          description: result.message || 'An error occurred while deleting the device.',
        });
      }
    } catch (error) {
      console.error('Error deleting device:', error);
      toast.error('Failed to delete device');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDeviceStatus = async (deviceSerial: string) => {
    try {
      const updatedDevice = await hikvisionPartnerService.getDeviceStatus(deviceSerial);
      if (updatedDevice) {
        setDevices(devices.map(device => 
          device.deviceSerial === deviceSerial ? { ...device, ...updatedDevice } : device
        ));
        toast.success('Device status refreshed', {
          description: 'Device status has been updated.',
        });
      } else {
        toast.error('Failed to refresh device status', {
          description: 'Could not get the latest device status.',
        });
      }
    } catch (error) {
      console.error('Error refreshing device status:', error);
      toast.error('Failed to refresh device status');
    }
  };

  const deviceStatusBadge = (status?: 'online' | 'offline' | 'unknown') => {
    switch(status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!can('manage_integrations')) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-2 text-lg font-semibold">Access Denied</h3>
          <p className="text-sm text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hikvision Partner Integration</h1>
          <p className="text-muted-foreground">
            Connect and manage your Hikvision devices using the Partner Pro OpenAPI.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="settings">API Settings</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Connected Devices</CardTitle>
                <CardDescription>Total Hikvision devices registered</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{devices.length}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {devices.filter(d => d.status === 'online').length} online
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('devices')}>
                  Manage Devices
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>API Status</CardTitle>
                <CardDescription>Hikvision Partner API connection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {isKeyConfigured ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  )}
                  <span className="font-medium">
                    {isKeyConfigured ? "Connected" : "Not Configured"}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={isKeyConfigured ? testConnection : () => setActiveTab('settings')}
                  disabled={isTestingConnection}
                >
                  {isTestingConnection ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : isKeyConfigured ? (
                    "Test Connection"
                  ) : (
                    "Configure API"
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common integration tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('devices')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Device
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => fetchDevices()}
                  disabled={isLoading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Device Status
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('events')}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  View Recent Events
                </Button>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading devices...</span>
            </div>
          ) : devices.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Device Overview</CardTitle>
                <CardDescription>
                  Status overview of your connected Hikvision devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {devices.slice(0, 6).map((device) => (
                    <div key={device.deviceSerial} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{device.deviceName}</h3>
                          <p className="text-xs text-muted-foreground">SN: {device.deviceSerial}</p>
                        </div>
                        {deviceStatusBadge(device.status)}
                      </div>
                      <div className="mt-4 space-y-1 text-sm">
                        <div className="flex items-center">
                          <Link className="h-4 w-4 mr-2 opacity-70" />
                          <span>Channels: {device.channelNos || '1'}</span>
                        </div>
                        <div className="flex items-center">
                          {device.isVideoSupported ? (
                            <Camera className="h-4 w-4 mr-2 opacity-70" />
                          ) : (
                            <CameraOff className="h-4 w-4 mr-2 opacity-70" />
                          )}
                          <span>{device.isVideoSupported ? 'Video Supported' : 'No Video Support'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {devices.length > 6 && (
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('devices')}
                    >
                      View All {devices.length} Devices
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Devices Connected</h3>
                <p className="text-center text-muted-foreground mb-6">
                  You haven't added any Hikvision devices yet. Add your first device to start monitoring.
                </p>
                <Button onClick={() => setActiveTab('devices')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Device
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Device</CardTitle>
              <CardDescription>
                Register a Hikvision device with your Partner API account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deviceSerial">Device Serial Number *</Label>
                  <Input 
                    id="deviceSerial" 
                    value={newDevice.deviceSerial}
                    onChange={(e) => setNewDevice({...newDevice, deviceSerial: e.target.value})}
                    placeholder="Enter device serial number"
                    disabled={isAddingDevice}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceName">Device Name *</Label>
                  <Input 
                    id="deviceName" 
                    value={newDevice.deviceName}
                    onChange={(e) => setNewDevice({...newDevice, deviceName: e.target.value})}
                    placeholder="Enter a friendly name for the device"
                    disabled={isAddingDevice}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceCode">Device Code (Optional)</Label>
                  <Input 
                    id="deviceCode" 
                    value={newDevice.deviceCode}
                    onChange={(e) => setNewDevice({...newDevice, deviceCode: e.target.value})}
                    placeholder="Enter device code if available"
                    disabled={isAddingDevice}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userName">Username</Label>
                  <Input 
                    id="userName" 
                    value={newDevice.userName}
                    onChange={(e) => setNewDevice({...newDevice, userName: e.target.value})}
                    placeholder="Default: admin"
                    disabled={isAddingDevice}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={newDevice.password}
                    onChange={(e) => setNewDevice({...newDevice, password: e.target.value})}
                    placeholder="Enter device password"
                    disabled={isAddingDevice}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channelNos">Channel Numbers</Label>
                  <Input 
                    id="channelNos" 
                    value={newDevice.channelNos}
                    onChange={(e) => setNewDevice({...newDevice, channelNos: e.target.value})}
                    placeholder="Default: 1"
                    disabled={isAddingDevice}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch 
                    id="isVideoSupported" 
                    checked={newDevice.isVideoSupported}
                    onCheckedChange={(checked) => setNewDevice({...newDevice, isVideoSupported: checked})}
                    disabled={isAddingDevice}
                  />
                  <Label htmlFor="isVideoSupported">Device supports video streaming</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={addDevice} 
                disabled={!isKeyConfigured || isAddingDevice || !newDevice.deviceSerial || !newDevice.deviceName}
              >
                {isAddingDevice ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Device...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Device
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Registered Devices</CardTitle>
                <CardDescription>
                  All Hikvision devices connected to your account
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchDevices}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-2 hidden md:inline">Refresh</span>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading devices...</span>
                </div>
              ) : devices.length > 0 ? (
                <ScrollArea className="h-[500px] rounded-md">
                  <div className="space-y-4">
                    {devices.map((device) => (
                      <div key={device.deviceSerial} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{device.deviceName}</h3>
                            <p className="text-xs text-muted-foreground">SN: {device.deviceSerial}</p>
                          </div>
                          {deviceStatusBadge(device.status)}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Device Code:</span>{' '}
                            {device.deviceCode || 'N/A'}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Channels:</span>{' '}
                            {device.channelNos || '1'}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Username:</span>{' '}
                            {device.userName || 'admin'}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Video Support:</span>{' '}
                            {device.isVideoSupported ? 'Yes' : 'No'}
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => refreshDeviceStatus(device.deviceSerial)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh Status
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            <Settings2 className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteDevice(device.deviceSerial, device.deviceName)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No devices found. Add your first device above.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hikvision Partner API Credentials</CardTitle>
              <CardDescription>
                Enter your Hikvision Partner Pro OpenAPI credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key (appKey)</Label>
                <Input 
                  id="apiKey" 
                  value={appKey}
                  onChange={(e) => setAppKey(e.target.value)}
                  placeholder="Enter your Hikvision Partner API Key"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secretKey">Secret Key</Label>
                <Input 
                  id="secretKey" 
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter your Hikvision Partner Secret Key"
                  disabled={isLoading}
                />
              </div>
              <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md text-sm">
                <h4 className="font-medium text-amber-800 dark:text-amber-300 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Important Security Note
                </h4>
                <p className="mt-1 text-amber-700 dark:text-amber-400">
                  These API credentials are stored securely and are used to authenticate with the Hikvision Partner Pro OpenAPI. 
                  Never share these credentials with unauthorized individuals.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={testConnection}
                disabled={!isKeyConfigured || isTestingConnection}
              >
                {isTestingConnection ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>
              <Button 
                onClick={saveApiCredentials}
                disabled={isLoading || !appKey || !secretKey}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Credentials"
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>
                Configure how the Hikvision integration works with your gym management system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="automateAttendance" />
                <div>
                  <Label htmlFor="automateAttendance">Automate Attendance Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically record attendance when members are detected by cameras
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center space-x-2">
                <Switch id="syncMembers" />
                <div>
                  <Label htmlFor="syncMembers">Sync Members with Hikvision</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync member data with Hikvision Cloud Attendance
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center space-x-2">
                <Switch id="eventNotifications" />
                <div>
                  <Label htmlFor="eventNotifications">Event Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for device events and alarms
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Monitoring</CardTitle>
              <CardDescription>
                This feature will be available in a future update
              </CardDescription>
            </CardHeader>
            <CardContent className="py-10 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Event monitoring functionality is under development. This will allow you to subscribe to and view device events and alarms from your Hikvision devices.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cloud Attendance Integration</CardTitle>
              <CardDescription>
                This feature will be available in a future update
              </CardDescription>
            </CardHeader>
            <CardContent className="py-10 text-center">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Cloud Attendance integration is under development. This will allow you to synchronize member data with Hikvision's attendance system and manage access privileges.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HikvisionPartnerPage;
