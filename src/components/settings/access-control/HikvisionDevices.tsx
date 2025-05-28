
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HikvisionDevice } from '@/types/settings/hikvision-types';
import { useHikvisionSettings } from '@/hooks/access/use-hikvision-settings';
import { useForm } from 'react-hook-form';
import { PlusCircle, Edit, Trash2, Check, X, RefreshCw } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';

interface HikvisionDevicesProps {
  branchId: string;
}

const deviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  deviceId: z.string().min(1, 'Device ID is required'),
  serialNumber: z.string().optional(),
  deviceType: z.enum(['entry', 'exit', 'gym', 'swimming', 'special']),
  location: z.string().optional(),
  isActive: z.boolean().default(true),
  isCloudManaged: z.boolean().default(false),
  useIsupFallback: z.boolean().default(false),
  ipAddress: z.string().optional(),
  port: z.number().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  siteId: z.string().optional(),
});

type DeviceFormValues = z.infer<typeof deviceSchema>;

const HikvisionDevices: React.FC<HikvisionDevicesProps> = ({ branchId }) => {
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<HikvisionDevice | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<HikvisionDevice | null>(null);
  
  const {
    devices,
    getDevices,
    isLoading,
    saveDevice,
    deleteDevice,
    testDevice,
    availableSites,
    fetchAvailableSites,
    isConnected,
    settings,
    isSaving
  } = useHikvisionSettings(branchId);

  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      name: '',
      deviceId: '',
      deviceType: 'entry',
      location: '',
      isActive: true,
      isCloudManaged: false,
      useIsupFallback: false,
    }
  });

  useEffect(() => {
    if (branchId) {
      getDevices(branchId);
      if (isConnected) {
        fetchAvailableSites && fetchAvailableSites();
      }
    }
  }, [branchId, getDevices, isConnected, fetchAvailableSites]);

  const handleAddDevice = () => {
    setSelectedDevice({
      id: uuidv4(),
      deviceId: '',
      name: '',
      deviceType: 'entry',
      isActive: true,
      isCloudManaged: false,
      useIsupFallback: false,
      branchId,
      doors: [],
    });
    form.reset({
      id: uuidv4(),
      name: '',
      deviceId: '',
      deviceType: 'entry',
      location: '',
      isActive: true,
      isCloudManaged: false,
      useIsupFallback: false,
      siteId: settings?.siteId || '',
    });
    setIsEditing(false);
    setDeviceDialogOpen(true);
  };

  const handleEditDevice = (device: HikvisionDevice) => {
    setSelectedDevice(device);
    form.reset({
      id: device.id,
      name: device.name,
      deviceId: device.deviceId,
      deviceType: device.deviceType,
      serialNumber: device.serialNumber,
      location: device.location || '',
      isActive: device.isActive,
      isCloudManaged: device.isCloudManaged,
      useIsupFallback: device.useIsupFallback,
      ipAddress: device.ipAddress,
      port: device.port,
      username: device.username,
      password: device.password,
      siteId: device.siteId,
    });
    setIsEditing(true);
    setDeviceDialogOpen(true);
  };

  const confirmDeleteDevice = (device: HikvisionDevice) => {
    setDeviceToDelete(device);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDevice = async () => {
    if (!deviceToDelete) return;
    
    const success = await deleteDevice(deviceToDelete.id);
    if (success) {
      setDeleteDialogOpen(false);
      setDeviceToDelete(null);
    }
  };

  const handleTestDevice = async (device: HikvisionDevice) => {
    await testDevice(device);
  };

  const onSubmit = async (values: DeviceFormValues) => {
    const deviceData: HikvisionDevice = {
      id: values.id || uuidv4(),
      deviceId: values.deviceId,
      name: values.name,
      serialNumber: values.serialNumber,
      deviceType: values.deviceType,
      location: values.location,
      isActive: values.isActive,
      isCloudManaged: values.isCloudManaged,
      useIsupFallback: values.useIsupFallback,
      ipAddress: values.ipAddress,
      port: values.port,
      username: values.username,
      password: values.password,
      branchId,
      siteId: values.siteId || settings?.siteId,
      doors: []
    };
    
    const savedDevice = await saveDevice(deviceData);
    
    if (savedDevice) {
      setDeviceDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Access Control Devices</CardTitle>
          <CardDescription>
            Manage devices that control access to your facilities
          </CardDescription>
        </div>
        <Button onClick={handleAddDevice} disabled={!isConnected}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Device
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">Loading devices...</p>
          </div>
        ) : devices.length === 0 ? (
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium mb-2">No Devices Configured</h3>
            <p className="text-muted-foreground mb-4">
              Add access control devices to start monitoring and controlling access
            </p>
            <Button onClick={handleAddDevice} disabled={!isConnected}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Device
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {device.deviceType.charAt(0).toUpperCase() + device.deviceType.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{device.location || '—'}</TableCell>
                    <TableCell>
                      {device.isActive ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          <Check className="mr-1 h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                          <X className="mr-1 h-3 w-3" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTestDevice(device)}
                        >
                          Test
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDevice(device)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => confirmDeleteDevice(device)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Device Form Dialog */}
        <Dialog open={deviceDialogOpen} onOpenChange={setDeviceDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Device' : 'Add Device'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Tabs defaultValue="basic">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="advanced">Connection</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Main Entrance Control" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deviceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Device Serial Number or ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="entry">Entry Gate</SelectItem>
                              <SelectItem value="exit">Exit Gate</SelectItem>
                              <SelectItem value="gym">Gym Access</SelectItem>
                              <SelectItem value="swimming">Swimming Pool</SelectItem>
                              <SelectItem value="special">Special Area</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Main Entrance" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Active</FormLabel>
                            <FormDescription>
                              Enable this device for access control
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="isCloudManaged"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Cloud Managed</FormLabel>
                            <FormDescription>
                              Device is managed via Hikvision cloud
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {!form.watch('isCloudManaged') && (
                      <>
                        <FormField
                          control={form.control}
                          name="ipAddress"
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
                          control={form.control}
                          name="port"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Port</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="80" 
                                  {...field}
                                  onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="username"
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
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="useIsupFallback"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>ISAPI Fallback</FormLabel>
                                <FormDescription>
                                  Use ISAPI as fallback if OpenAPI fails
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {availableSites && availableSites.length > 0 && (
                      <FormField
                        control={form.control}
                        name="siteId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Site</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select site" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableSites.map((site) => (
                                  <SelectItem key={site.id} value={site.id}>
                                    {site.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDeviceDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : isEditing ? 'Update Device' : 'Add Device'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Device</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete the device "{deviceToDelete?.name}"? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteDevice}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default HikvisionDevices;
