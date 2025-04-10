
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  PlusCircle,
  Trash2,
  Edit,
  Server,
  Landmark,
  Video,
  Users,
  Bell,
  Loader2,
  Shield
} from 'lucide-react';
import { 
  hikvisionPartnerService,
  HikvisionDevice,
  HikvisionDeviceChannel,
  HikvisionPerson,
  HikvisionAuthCredentials,
  HikvisionDeviceRequest
} from '@/services/integrations/hikvisionPartnerService';
import { usePermissions } from '@/hooks/use-permissions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// Schema for Hikvision Partner API credentials
const hikvisionCredentialsSchema = z.object({
  appKey: z.string().min(1, { message: "API Key is required" }),
  secretKey: z.string().min(1, { message: "Secret Key is required" }),
});

// Schema for device form
const deviceFormSchema = z.object({
  deviceName: z.string().min(1, { message: "Device name is required" }),
  deviceAddress: z.string().min(1, { message: "Device address is required" }),
  devicePort: z.coerce.number().int().positive({ message: "Port must be a positive number" }),
  deviceUsername: z.string().min(1, { message: "Username is required" }),
  devicePassword: z.string().min(1, { message: "Password is required" }),
  deviceType: z.string().optional(),
});

// Schema for person form
const personFormSchema = z.object({
  personId: z.string().optional(),
  personName: z.string().min(1, { message: "Name is required" }),
  gender: z.enum(["male", "female", "other"]).optional(),
  phoneNo: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  certificateNo: z.string().optional(),
});

const HikvisionPartnerPage = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');
  const [activeTab, setActiveTab] = useState('settings');
  const [devices, setDevices] = useState<HikvisionDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<HikvisionDevice | null>(null);
  const [deviceChannels, setDeviceChannels] = useState<HikvisionDeviceChannel[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<HikvisionDeviceRequest | null>(null);
  const [persons, setPersons] = useState<HikvisionPerson[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<HikvisionPerson | null>(null);
  const [isLoadingPersons, setIsLoadingPersons] = useState(false);
  const [personDialogOpen, setPersonDialogOpen] = useState(false);
  const [isEventPolling, setIsEventPolling] = useState(false);
  const [eventMessages, setEventMessages] = useState<any[]>([]);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const { can } = usePermissions();

  // Initialize credentials form
  const credentialsForm = useForm<HikvisionAuthCredentials>({
    resolver: zodResolver(hikvisionCredentialsSchema),
    defaultValues: {
      appKey: '',
      secretKey: '',
    },
  });

  // Initialize device form
  const deviceForm = useForm<HikvisionDeviceRequest>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues: {
      deviceName: '',
      deviceAddress: '',
      devicePort: 80,
      deviceUsername: '',
      devicePassword: '',
      deviceType: '',
    },
  });

  // Initialize person form
  const personForm = useForm<HikvisionPerson>({
    resolver: zodResolver(personFormSchema),
    defaultValues: {
      personName: '',
      gender: 'other',
      phoneNo: '',
      email: '',
      certificateNo: '',
    },
  });

  // Check connection status on component mount
  useEffect(() => {
    checkConnectionStatus();
    
    // Load credentials from localStorage if available
    const savedCredentials = localStorage.getItem('hikvision_partner_credentials');
    if (savedCredentials) {
      try {
        const parsed = JSON.parse(savedCredentials);
        credentialsForm.reset(parsed);
      } catch (error) {
        console.error('Failed to parse saved credentials:', error);
      }
    }
  }, []);

  // Load devices when connection is established or tab changes
  useEffect(() => {
    if (connectionStatus === 'connected' && activeTab === 'devices') {
      loadDevices();
    }
  }, [connectionStatus, activeTab]);

  // Clean up event polling on unmount
  useEffect(() => {
    return () => {
      setIsEventPolling(false);
    };
  }, []);

  // Check Hikvision API connection status
  const checkConnectionStatus = async () => {
    const isAuthenticated = hikvisionPartnerService.isAuthenticated();
    setConnectionStatus(isAuthenticated ? 'connected' : 'disconnected');
    return isAuthenticated;
  };

  // Test the Hikvision API connection
  const testConnection = async (credentials: HikvisionAuthCredentials) => {
    setConnectionStatus('testing');
    try {
      hikvisionPartnerService.setCredentials(credentials);
      const success = await hikvisionPartnerService.authenticate();
      setConnectionStatus(success ? 'connected' : 'disconnected');
      
      if (success) {
        toast.success('Successfully connected to Hikvision Partner API');
      } else {
        toast.error('Failed to connect to Hikvision Partner API');
      }
      
      return success;
    } catch (error) {
      console.error('Connection test error:', error);
      setConnectionStatus('disconnected');
      toast.error('Error testing connection to Hikvision Partner API');
      return false;
    }
  };

  // Handle credentials form submission
  const onCredentialsSubmit = async (data: HikvisionAuthCredentials) => {
    await testConnection(data);
  };

  // Load devices from API
  const loadDevices = async () => {
    if (!await checkConnectionStatus()) {
      toast.error('Not connected to Hikvision API. Please check your credentials.');
      return;
    }

    setIsLoadingDevices(true);
    try {
      const devicesList = await hikvisionPartnerService.listDevices();
      setDevices(devicesList);
    } catch (error) {
      console.error('Error loading devices:', error);
      toast.error('Failed to load devices');
    } finally {
      setIsLoadingDevices(false);
    }
  };

  // Load device channels
  const loadDeviceChannels = async (deviceId: string) => {
    if (!await checkConnectionStatus()) return;

    setIsLoadingChannels(true);
    try {
      const channels = await hikvisionPartnerService.getDeviceChannels(deviceId);
      setDeviceChannels(channels);
    } catch (error) {
      console.error('Error loading device channels:', error);
      toast.error('Failed to load device channels');
    } finally {
      setIsLoadingChannels(false);
    }
  };

  // Select a device to view details
  const handleSelectDevice = (device: HikvisionDevice) => {
    setSelectedDevice(device);
    loadDeviceChannels(device.deviceId);
  };

  // Handle device form submission (add/update)
  const onDeviceSubmit = async (data: HikvisionDeviceRequest) => {
    if (!await checkConnectionStatus()) return;

    try {
      let success = false;
      
      if (editingDevice?.deviceId) {
        // Update existing device
        data.deviceId = editingDevice.deviceId;
        success = await hikvisionPartnerService.updateDevice(data);
      } else {
        // Add new device
        const deviceId = await hikvisionPartnerService.addDevice(data);
        success = !!deviceId;
      }
      
      if (success) {
        setDeviceDialogOpen(false);
        loadDevices();
        deviceForm.reset();
        setEditingDevice(null);
      }
    } catch (error) {
      console.error('Error saving device:', error);
      toast.error('Failed to save device');
    }
  };

  // Open device dialog for editing
  const handleEditDevice = (device: HikvisionDevice) => {
    setEditingDevice(device);
    deviceForm.reset({
      deviceName: device.deviceName || '',
      deviceAddress: device.deviceAddress || '',
      devicePort: device.devicePort || 80,
      deviceUsername: '', // For security, don't pre-fill credentials
      devicePassword: '',
      deviceType: device.deviceType || '',
    });
    setDeviceDialogOpen(true);
  };

  // Open device dialog for adding new device
  const handleAddDevice = () => {
    setEditingDevice(null);
    deviceForm.reset({
      deviceName: '',
      deviceAddress: '',
      devicePort: 80,
      deviceUsername: '',
      devicePassword: '',
      deviceType: '',
    });
    setDeviceDialogOpen(true);
  };

  // Delete a device
  const handleDeleteDevice = async (deviceId: string) => {
    if (!await checkConnectionStatus()) return;
    
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        const success = await hikvisionPartnerService.deleteDevice(deviceId);
        if (success) {
          if (selectedDevice?.deviceId === deviceId) {
            setSelectedDevice(null);
            setDeviceChannels([]);
          }
          loadDevices();
        }
      } catch (error) {
        console.error('Error deleting device:', error);
        toast.error('Failed to delete device');
      }
    }
  };

  // Subscribe to device events
  const handleSubscribeToEvents = async () => {
    if (!await checkConnectionStatus()) return;
    
    try {
      const response = await hikvisionPartnerService.subscribeToEvents({
        topics: ['alarm', 'event'],
        subscriptionDuration: 3600 // 1 hour
      });
      
      if (response.code === '0' && response.data?.subscriptionId) {
        setSubscriptionId(response.data.subscriptionId);
        toast.success('Subscribed to device events');
        // Start polling for events
        startEventPolling(response.data.subscriptionId);
      } else {
        toast.error(`Failed to subscribe: ${response.msg}`);
      }
    } catch (error) {
      console.error('Error subscribing to events:', error);
      toast.error('Failed to subscribe to events');
    }
  };

  // Poll for event messages
  const startEventPolling = (subId: string) => {
    setIsEventPolling(true);
    
    const pollEvents = async () => {
      if (!isEventPolling) return;
      
      try {
        const response = await hikvisionPartnerService.getEventMessages(subId);
        
        if (response.code === '0' && response.data?.messages?.length) {
          // Add new messages to the list
          setEventMessages(prev => [...response.data!.messages, ...prev].slice(0, 100));
          
          // Acknowledge messages
          if (response.data.lastOffset) {
            await hikvisionPartnerService.acknowledgeMessageOffset({
              subscriptionId: subId,
              topic: 'alarm',
              offset: response.data.lastOffset
            });
          }
        }
      } catch (error) {
        console.error('Error polling events:', error);
      }
      
      // Continue polling if still active
      if (isEventPolling) {
        setTimeout(pollEvents, 5000);
      }
    };
    
    pollEvents();
  };

  // Stop event polling
  const stopEventPolling = () => {
    setIsEventPolling(false);
    setSubscriptionId(null);
    toast.info('Event subscription stopped');
  };

  return (
    <div className="container mx-auto py-6">
      {!can('manage_integrations') ? (
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
          <p className="text-muted-foreground">
            You don't have permission to access Hikvision integration settings.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Hikvision Partner Pro Integration</h1>
            <p className="text-muted-foreground mt-2">
              Connect to Hikvision devices using the Partner Pro OpenAPI for enhanced access control and attendance tracking.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="settings">API Settings</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="events">Events & Alarms</TabsTrigger>
              <TabsTrigger value="attendance">Cloud Attendance</TabsTrigger>
            </TabsList>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Hikvision Partner Pro API Connection</CardTitle>
                  <CardDescription>
                    Configure connection to the Hikvision Partner Pro API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex items-center space-x-2">
                    <div className="font-medium">Connection Status:</div>
                    {connectionStatus === 'connected' ? (
                      <Badge className="flex items-center gap-1 bg-green-100 text-green-800">
                        <CheckCircle className="h-4 w-4" /> Connected
                      </Badge>
                    ) : connectionStatus === 'testing' ? (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <RefreshCw className="h-4 w-4 animate-spin" /> Testing Connection
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <XCircle className="h-4 w-4" /> Disconnected
                      </Badge>
                    )}
                  </div>

                  <Form {...credentialsForm}>
                    <form onSubmit={credentialsForm.handleSubmit(onCredentialsSubmit)} className="space-y-6">
                      <FormField
                        control={credentialsForm.control}
                        name="appKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Key</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Your Hikvision Partner Pro API key (App Key)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={credentialsForm.control}
                        name="secretKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secret Key</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your Hikvision Partner Pro Secret Key
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center space-x-2">
                        <Button type="submit" disabled={connectionStatus === 'testing'}>
                          {connectionStatus === 'connected' ? 'Update Connection' : 'Connect to Hikvision'}
                        </Button>
                        
                        {connectionStatus === 'connected' && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => testConnection(credentialsForm.getValues())}
                          >
                            Test Connection
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>API Configuration</CardTitle>
                  <CardDescription>
                    Advanced settings for the Hikvision Partner API integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">API Base URL</h3>
                        <Input value="/hikvision-proxy" disabled />
                        <p className="text-xs text-muted-foreground mt-1">
                          Base URL for API requests (configured in server proxy)
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">API Version</h3>
                        <Input value="v1/v2" disabled />
                        <p className="text-xs text-muted-foreground mt-1">
                          API version supported by this integration
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium mb-2">Token Management</h3>
                      <div className="text-sm text-muted-foreground">
                        <p>Tokens are automatically managed and refreshed when needed.</p>
                        <p className="mt-1">Token validity period: 7 days</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium mb-2">Security Settings</h3>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          Secure credential storage
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" /> Enabled
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Reset API Cache
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="devices">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1">
                  <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Devices</CardTitle>
                      <Button 
                        size="sm" 
                        disabled={connectionStatus !== 'connected'}
                        onClick={handleAddDevice}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {isLoadingDevices ? (
                        <div className="py-8 flex justify-center">
                          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : devices.length === 0 ? (
                        <div className="py-8 text-center">
                          <Server className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No devices found</p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={loadDevices}
                            disabled={connectionStatus !== 'connected'}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                          </Button>
                        </div>
                      ) : (
                        <ScrollArea className="h-[500px]">
                          <div className="space-y-2">
                            {devices.map((device) => (
                              <div 
                                key={device.deviceId}
                                className={`p-3 border rounded-md cursor-pointer flex justify-between items-center ${
                                  selectedDevice?.deviceId === device.deviceId ? 'bg-muted border-primary' : ''
                                }`}
                                onClick={() => handleSelectDevice(device)}
                              >
                                <div>
                                  <div className="font-medium">{device.deviceName || device.deviceId}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {device.deviceAddress || 'No address'} • {device.deviceType || 'Unknown type'}
                                  </div>
                                </div>
                                <Badge variant={
                                  device.deviceStatus === 'online' ? 'outline' : 
                                  device.deviceStatus === 'offline' ? 'destructive' : 
                                  'secondary'
                                } className={
                                  device.deviceStatus === 'online' ? 'bg-green-100 text-green-800' : ''
                                }>
                                  {device.deviceStatus || 'Unknown'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={loadDevices}
                        disabled={connectionStatus !== 'connected' || isLoadingDevices}
                      >
                        {isLoadingDevices ? (
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-1" />
                        )}
                        Refresh Devices
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <div className="col-span-2">
                  {selectedDevice ? (
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>{selectedDevice.deviceName || selectedDevice.deviceId}</CardTitle>
                          <CardDescription>
                            {selectedDevice.deviceType} • {selectedDevice.serialNumber || 'No S/N'}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditDevice(selectedDevice)}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteDevice(selectedDevice.deviceId)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium mb-1">IP Address</h3>
                              <p>{selectedDevice.deviceAddress || 'Not available'}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium mb-1">Port</h3>
                              <p>{selectedDevice.devicePort || 'Not available'}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium mb-1">Last Online</h3>
                              <p>{selectedDevice.lastOnlineTime || 'Not available'}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium mb-1">Created</h3>
                              <p>{selectedDevice.createdTime || 'Not available'}</p>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="text-sm font-medium mb-3">Device Channels</h3>
                            {isLoadingChannels ? (
                              <div className="py-6 flex justify-center">
                                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                              </div>
                            ) : deviceChannels.length === 0 ? (
                              <div className="py-6 text-center">
                                <Video className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                                <p className="text-muted-foreground">No channels found for this device</p>
                              </div>
                            ) : (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Channel ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {deviceChannels.map((channel) => (
                                    <TableRow key={channel.channelId}>
                                      <TableCell>{channel.channelId}</TableCell>
                                      <TableCell>{channel.channelName || 'Unnamed'}</TableCell>
                                      <TableCell>{channel.channelType || 'Unknown'}</TableCell>
                                      <TableCell>
                                        <Badge variant={
                                          channel.status === 'online' ? 'outline' : 
                                          channel.status === 'offline' ? 'destructive' : 
                                          'secondary'
                                        } className={
                                          channel.status === 'online' ? 'bg-green-100 text-green-800' : ''
                                        }>
                                          {channel.status || 'Unknown'}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-4"
                              onClick={() => loadDeviceChannels(selectedDevice.deviceId)}
                              disabled={isLoadingChannels}
                            >
                              {isLoadingChannels ? (
                                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4 mr-1" />
                              )}
                              Refresh Channels
                            </Button>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="text-sm font-medium mb-3">Device Actions</h3>
                            <div className="grid grid-cols-3 gap-3">
                              <Button variant="outline" size="sm" disabled={!selectedDevice}>
                                Reboot Device
                              </Button>
                              <Button variant="outline" size="sm" disabled={!selectedDevice}>
                                Get Properties
                              </Button>
                              <Button variant="outline" size="sm" disabled={!selectedDevice}>
                                Set Properties
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="h-full flex items-center justify-center">
                      <CardContent className="py-12 text-center">
                        <Landmark className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No Device Selected</h3>
                        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                          Select a device from the list to view its details, channels, and available actions.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Device Add/Edit Dialog */}
              <Dialog open={deviceDialogOpen} onOpenChange={setDeviceDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingDevice?.deviceId ? 'Edit Device' : 'Add New Device'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingDevice?.deviceId 
                        ? 'Update the device information in the Hikvision system.'
                        : 'Add a new device to the Hikvision system.'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...deviceForm}>
                    <form onSubmit={deviceForm.handleSubmit(onDeviceSubmit)} className="space-y-4">
                      <FormField
                        control={deviceForm.control}
                        name="deviceName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Device Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={deviceForm.control}
                          name="deviceAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>IP Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={deviceForm.control}
                          name="devicePort"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Port</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={deviceForm.control}
                          name="deviceUsername"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={deviceForm.control}
                          name="devicePassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={deviceForm.control}
                        name="deviceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Device Type (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              e.g., NVR, DVR, Camera, Access Control
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setDeviceDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingDevice?.deviceId ? 'Update Device' : 'Add Device'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="events">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Events & Alarms</CardTitle>
                    <CardDescription>
                      Subscribe to and monitor device events in real-time
                    </CardDescription>
                  </div>
                  <div>
                    {isEventPolling ? (
                      <Button 
                        variant="destructive"
                        onClick={stopEventPolling}
                      >
                        <Bell className="h-4 w-4 mr-2" /> Stop Monitoring
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleSubscribeToEvents}
                        disabled={connectionStatus !== 'connected'}
                      >
                        <Bell className="h-4 w-4 mr-2" /> Start Monitoring
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {subscriptionId ? (
                    <div className="mb-4 text-sm">
                      <span className="font-medium">Active Subscription ID:</span> {subscriptionId}
                    </div>
                  ) : null}
                  
                  {isEventPolling && eventMessages.length === 0 ? (
                    <div className="py-12 text-center">
                      <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Waiting for Events...</h3>
                      <p className="text-muted-foreground mt-2">
                        The system is monitoring for events from all connected devices.
                      </p>
                    </div>
                  ) : !isEventPolling && eventMessages.length === 0 ? (
                    <div className="py-12 text-center">
                      <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Events Monitored</h3>
                      <p className="text-muted-foreground mt-2">
                        Click "Start Monitoring" to begin receiving events from devices.
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px] rounded-md border">
                      <div className="p-4 space-y-4">
                        {eventMessages.map((event, index) => (
                          <div key={index} className="p-3 border rounded-md">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">
                                {event.topic} - {event.data?.eventType || 'Unknown Event'}
                              </h4>
                              <Badge variant="outline">
                                {new Date(event.timestamp).toLocaleString()}
                              </Badge>
                            </div>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                              {JSON.stringify(event.data, null, 2)}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    {isEventPolling ? 'Polling for events every 5 seconds' : 'Event monitoring is inactive'}
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => setEventMessages([])}
                    disabled={eventMessages.length === 0}
                  >
                    Clear Events
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="attendance">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Cloud Attendance</CardTitle>
                    <CardDescription>
                      Manage person records for cloud attendance tracking
                    </CardDescription>
                  </div>
                  <Button disabled={connectionStatus !== 'connected'}>
                    <Users className="h-4 w-4 mr-2" /> Sync with Members
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Attendance Management</h3>
                    <p className="text-muted-foreground">
                      Use this section to configure cloud attendance tracking for gym members.
                      Add members to the attendance system and configure access privileges for devices.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Member Registration</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Register gym members in the Hikvision cloud attendance system.
                      </p>
                      <Button className="w-full" disabled={connectionStatus !== 'connected'}>
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Person
                      </Button>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Batch Actions</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Perform bulk operations on attendance records.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" disabled={connectionStatus !== 'connected'}>
                          Import CSV
                        </Button>
                        <Button variant="outline" disabled={connectionStatus !== 'connected'}>
                          Export Data
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Access Privileges</h3>
                    <p className="text-muted-foreground mb-4">
                      Configure which members have access to specific devices or areas.
                    </p>
                    
                    <Button className="w-full" disabled={connectionStatus !== 'connected'}>
                      Configure Access Rules
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default HikvisionPartnerPage;
