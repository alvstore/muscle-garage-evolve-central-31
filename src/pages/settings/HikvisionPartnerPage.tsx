import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trash2, RefreshCw, Plus, Search, FolderPlus, Users, Lock, BellRing, Download, Settings } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { hikvisionPartnerService } from '@/services/integrations/hikvisionPartnerService';
import { 
  HikvisionDevice, 
  HikvisionDeviceChannel, 
  HikvisionPerson, 
  HikvisionAuthCredentials,
  HikvisionDeviceRequest 
} from '@/types/hikvision';

// Schema for Hikvision authentication credentials
const authFormSchema = z.object({
  appKey: z.string().min(1, "API Key is required"),
  secretKey: z.string().min(1, "Secret Key is required"),
});

// Schema for adding a device
const deviceFormSchema = z.object({
  deviceName: z.string().min(1, "Device name is required"),
  deviceAddress: z.string().min(1, "Device IP/address is required"),
  devicePort: z.coerce.number().int().positive("Port must be a positive number"),
  deviceUsername: z.string().min(1, "Username is required"),
  devicePassword: z.string().min(1, "Password is required"),
  deviceType: z.string().optional(),
});

const HikvisionPartnerPage = () => {
  const [activeTab, setActiveTab] = useState('authentication');
  const [devices, setDevices] = useState<HikvisionDevice[]>([]);
  const [channels, setChannels] = useState<HikvisionDeviceChannel[]>([]);
  const [persons, setPersons] = useState<HikvisionPerson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [refreshingStatus, setRefreshingStatus] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<HikvisionDevice | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Initialize forms
  const authForm = useForm<HikvisionAuthCredentials>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      appKey: '',
      secretKey: '',
    },
  });

  const deviceForm = useForm<HikvisionDeviceRequest>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues: {
      deviceName: '',
      deviceAddress: '',
      devicePort: 80,
      deviceUsername: '',
      devicePassword: '',
      deviceType: 'IPC',
    },
  });

  // Check connection status on component mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  // Function to check connection with Hikvision API
  const checkConnectionStatus = async () => {
    setRefreshingStatus(true);
    try {
      const result = await hikvisionPartnerService.testConnection();
      setIsConnected(result);
      if (result) {
        toast.success("Successfully connected to Hikvision API");
        loadDevices();
      } else {
        toast.error("Failed to connect to Hikvision API");
      }
    } catch (error: any) {
      toast.error(`Connection error: ${error.message || 'Unknown error'}`);
      setIsConnected(false);
    } finally {
      setRefreshingStatus(false);
    }
  };

  // Load devices from Hikvision API
  const loadDevices = async () => {
    if (!isConnected) return;
    
    setIsLoading(true);
    try {
      const devicesList = await hikvisionPartnerService.listDevices();
      setDevices(devicesList);
    } catch (error: any) {
      toast.error(`Error loading devices: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle authentication form submission
  const handleAuthSubmit = async (data: HikvisionAuthCredentials) => {
    setIsLoading(true);
    try {
      const success = await hikvisionPartnerService.authenticate(data);
      if (success) {
        toast.success("Authentication successful");
        setIsConnected(true);
        setAuthDialogOpen(false);
        loadDevices();
      } else {
        toast.error("Authentication failed");
      }
    } catch (error: any) {
      toast.error(`Authentication error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle device form submission
  const handleDeviceSubmit = async (data: HikvisionDeviceRequest) => {
    setIsLoading(true);
    try {
      const success = await hikvisionPartnerService.addDevice(data);
      if (success) {
        toast.success("Device added successfully");
        setDeviceDialogOpen(false);
        deviceForm.reset();
        loadDevices();
      } else {
        toast.error("Failed to add device");
      }
    } catch (error: any) {
      toast.error(`Error adding device: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Load device channels
  const handleViewDeviceChannels = async (device: HikvisionDevice) => {
    setSelectedDevice(device);
    setIsLoading(true);
    try {
      const deviceChannels = await hikvisionPartnerService.listDeviceChannels(device.deviceId);
      setChannels(deviceChannels);
      setActiveTab('channels');
    } catch (error: any) {
      toast.error(`Error loading channels: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a device
  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm("Are you sure you want to delete this device?")) return;
    
    setIsLoading(true);
    try {
      const success = await hikvisionPartnerService.deleteDevice(deviceId);
      if (success) {
        toast.success("Device deleted successfully");
        loadDevices();
      } else {
        toast.error("Failed to delete device");
      }
    } catch (error: any) {
      toast.error(`Error deleting device: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to toggle alarm subscription
  const handleToggleAlarmSubscription = async (subscribed: boolean) => {
    setIsLoading(true);
    try {
      if (subscribed) {
        // Subscribe to alarms
        const success = await hikvisionPartnerService.subscribeToEvents(['alarm.motion', 'alarm.line', 'alarm.field']);
        if (success) {
          toast.success("Successfully subscribed to alarm events");
        } else {
          toast.error("Failed to subscribe to alarm events");
        }
      } else {
        // Unsubscribe from alarms
        const success = await hikvisionPartnerService.unsubscribeFromEvents();
        if (success) {
          toast.success("Successfully unsubscribed from alarm events");
        } else {
          toast.error("Failed to unsubscribe from alarm events");
        }
      }
    } catch (error: any) {
      toast.error(`Subscription error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Hikvision Partner Pro Integration</h1>
          <p className="text-muted-foreground">
            Manage Hikvision devices, cameras, and attendance integrations
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={checkConnectionStatus} 
            variant="outline" 
            disabled={refreshingStatus}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshingStatus ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
          
          <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
            <DialogTrigger asChild>
              <Button>Configure Connection</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hikvision API Credentials</DialogTitle>
                <DialogDescription>
                  Enter your Hikvision Partner Pro API credentials to establish connection.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...authForm}>
                <form onSubmit={authForm.handleSubmit(handleAuthSubmit)} className="space-y-4">
                  <FormField
                    control={authForm.control}
                    name="appKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key (App Key)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter API Key" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={authForm.control}
                    name="secretKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secret Key</FormLabel>
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter Secret Key" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-password"
                      checked={showPassword}
                      onCheckedChange={setShowPassword}
                    />
                    <Label htmlFor="show-password">Show credentials</Label>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Connecting...' : 'Connect'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="p-4 mb-6 bg-muted rounded-lg flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>
            Status: <strong>{isConnected ? 'Connected' : 'Disconnected'}</strong>
          </span>
        </div>
        
        {isConnected && (
          <div className="flex gap-2">
            <Dialog open={deviceDialogOpen} onOpenChange={setDeviceDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Device
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Hikvision Device</DialogTitle>
                  <DialogDescription>
                    Enter device details to add a new Hikvision device to your system.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...deviceForm}>
                  <form onSubmit={deviceForm.handleSubmit(handleDeviceSubmit)} className="space-y-4">
                    <FormField
                      control={deviceForm.control}
                      name="deviceName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter device name" {...field} />
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
                              <Input placeholder="192.168.1.100" {...field} />
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
                              <Input 
                                type="number" 
                                placeholder="80" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={deviceForm.control}
                      name="deviceUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="admin" {...field} />
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
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Device password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={deviceForm.control}
                      name="deviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device Type</FormLabel>
                          <FormControl>
                            <Input placeholder="IPC, NVR, etc." {...field} />
                          </FormControl>
                          <FormDescription>
                            Examples: IPC (camera), NVR, DVR, etc.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add Device'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="events">Events & Alarms</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Device Management</CardTitle>
              <CardDescription>
                View and manage all connected Hikvision devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : devices.length > 0 ? (
                <Table>
                  <TableCaption>List of connected Hikvision devices</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device Name</TableHead>
                      <TableHead>IP / Address</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {devices.map((device) => (
                      <TableRow key={device.deviceId}>
                        <TableCell className="font-medium">{device.deviceName || device.deviceId}</TableCell>
                        <TableCell>{device.deviceAddress}:{device.devicePort}</TableCell>
                        <TableCell>{device.deviceType || 'Unknown'}</TableCell>
                        <TableCell>
                          <Badge variant={device.deviceStatus === 'online' ? 'success' : 'destructive'}>
                            {device.deviceStatus || 'unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewDeviceChannels(device)}
                            >
                              Channels
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteDevice(device.deviceId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-8">
                  <FolderPlus className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-semibold">No devices found</h3>
                  <p className="text-muted-foreground">
                    {isConnected 
                      ? "Add your first Hikvision device to get started" 
                      : "Connect to Hikvision API first to view devices"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDevice ? (
                  <div className="flex items-center">
                    <span>Channels for {selectedDevice.deviceName || selectedDevice.deviceId}</span>
                  </div>
                ) : 'Device Channels'}
              </CardTitle>
              <CardDescription>
                View cameras and other channels from your devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedDevice ? (
                <div className="text-center p-8">
                  <p>Select a device to view its channels</p>
                </div>
              ) : isLoading ? (
                <div className="flex justify-center p-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : channels.length > 0 ? (
                <Table>
                  <TableCaption>Channels for {selectedDevice.deviceName || selectedDevice.deviceId}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Channel Name</TableHead>
                      <TableHead>Channel Number</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {channels.map((channel) => (
                      <TableRow key={channel.channelId}>
                        <TableCell className="font-medium">{channel.channelName || 'Unnamed Channel'}</TableCell>
                        <TableCell>{channel.channelNo || 'N/A'}</TableCell>
                        <TableCell>{channel.channelType || 'Unknown'}</TableCell>
                        <TableCell>
                          <Badge variant={channel.status === 'online' ? 'success' : 'destructive'}>
                            {channel.status || 'unknown'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-8">
                  <p>No channels found for this device</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Events & Alarms</CardTitle>
              <CardDescription>
                Subscribe to events and alarms from your Hikvision devices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <BellRing className="h-5 w-5" />
                  <span className="font-medium">Alarm Subscription</span>
                </div>
                <Switch
                  onCheckedChange={handleToggleAlarmSubscription}
                  disabled={!isConnected || isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Available Event Types</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 border rounded-md">
                    <span className="font-medium">Motion Detection</span>
                    <p className="text-sm text-muted-foreground">Detects motion in camera view</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <span className="font-medium">Line Crossing</span>
                    <p className="text-sm text-muted-foreground">Detects crossing of virtual lines</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <span className="font-medium">Intrusion Detection</span>
                    <p className="text-sm text-muted-foreground">Detects intrusion in defined areas</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <span className="font-medium">Face Detection</span>
                    <p className="text-sm text-muted-foreground">Detects human faces in view</p>
                  </div>
                </div>
              </div>
              
              <Alert>
                <BellRing className="h-4 w-4" />
                <AlertTitle>Event Configuration</AlertTitle>
                <AlertDescription>
                  Events and alarms must be configured on each device before they can be received here.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance System Integration</CardTitle>
              <CardDescription>
                Manage person recognition and access control for attendance tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <Users className="h-8 w-8 mb-2" />
                  <h3 className="text-lg font-medium">Member Registration</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Register members' faces and credentials for access control and attendance
                  </p>
                  <Button disabled={!isConnected}>Manage Members</Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <Lock className="h-8 w-8 mb-2" />
                  <h3 className="text-lg font-medium">Access Privileges</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure access rules and permissions for members
                  </p>
                  <Button disabled={!isConnected}>Set Privileges</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Integration Status</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center p-3 border rounded-md">
                    <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="font-medium">API Connection</p>
                      <p className="text-sm text-muted-foreground">
                        {isConnected ? 'Connected' : 'Disconnected'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-md">
                    <div className="w-3 h-3 rounded-full mr-2 bg-yellow-500"></div>
                    <div>
                      <p className="font-medium">Attendance Sync</p>
                      <p className="text-sm text-muted-foreground">Not configured</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Alert>
                <Download className="h-4 w-4" />
                <AlertTitle>Attendance Data</AlertTitle>
                <AlertDescription>
                  Attendance data from Hikvision devices can be synchronized with your gym management system.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HikvisionPartnerPage;
