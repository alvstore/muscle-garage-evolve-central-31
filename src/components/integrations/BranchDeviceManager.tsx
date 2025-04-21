
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Pencil, Trash2, ServerOff, Server, Link, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useBranch } from '@/hooks/use-branch';
import { DeviceMapping, DeviceMappingFormValues } from '@/types/device-mapping';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

// Form schema
const deviceSchema = z.object({
  deviceId: z.string().optional(),
  deviceName: z.string().min(3, { message: "Device name must be at least 3 characters" }),
  deviceType: z.enum(['entry', 'exit', 'swimming', 'gym', 'special']),
  deviceSerial: z.string().min(5, { message: "Serial number must be at least 5 characters" }),
  deviceLocation: z.string().min(3, { message: "Location must be at least 3 characters" }),
  isActive: z.boolean().default(true),
});

const BranchDeviceManager = () => {
  const { currentBranch } = useBranch();
  const [devices, setDevices] = useState<DeviceMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceMapping | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const form = useForm<DeviceMappingFormValues>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      deviceId: '',
      deviceName: '',
      deviceType: 'entry',
      deviceSerial: '',
      deviceLocation: '',
      isActive: true,
    },
  });

  // Mock data for demonstration
  useEffect(() => {
    if (currentBranch) {
      fetchDevices();
    }
  }, [currentBranch]);

  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Example of branch-specific device data
      if (currentBranch?.id === 'branch1') {
        setDevices([
          {
            id: 'dev1',
            branchId: 'branch1',
            deviceId: 'hvk001',
            deviceName: 'Main Entrance North',
            deviceType: 'entry',
            deviceSerial: 'HVK-AC-001',
            deviceLocation: 'North Wing',
            isActive: true,
            lastSyncTime: '2023-10-15T13:45:22Z',
            createdAt: '2023-08-10T10:00:00Z',
            updatedAt: '2023-10-15T13:45:22Z',
          },
          {
            id: 'dev2',
            branchId: 'branch1',
            deviceId: 'hvk002',
            deviceName: 'Swimming Pool Gate',
            deviceType: 'swimming',
            deviceSerial: 'HVK-AC-002',
            deviceLocation: 'Aquatic Center',
            isActive: true,
            lastSyncTime: '2023-10-15T14:20:15Z',
            createdAt: '2023-08-10T10:05:00Z',
            updatedAt: '2023-10-15T14:20:15Z',
          }
        ]);
      } else if (currentBranch?.id === 'branch2') {
        setDevices([
          {
            id: 'dev3',
            branchId: 'branch2',
            deviceId: 'hvk003',
            deviceName: 'Main Entrance',
            deviceType: 'entry',
            deviceSerial: 'HVK-AC-003',
            deviceLocation: 'Front Lobby',
            isActive: true,
            lastSyncTime: '2023-10-15T15:10:33Z',
            createdAt: '2023-08-12T09:00:00Z',
            updatedAt: '2023-10-15T15:10:33Z',
          }
        ]);
      } else {
        setDevices([]);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast.error('Failed to load devices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDevice = () => {
    setIsEditing(false);
    setSelectedDevice(null);
    form.reset({
      deviceId: '',
      deviceName: '',
      deviceType: 'entry',
      deviceSerial: '',
      deviceLocation: '',
      isActive: true,
    });
  };

  const handleEditDevice = (device: DeviceMapping) => {
    setIsEditing(true);
    setSelectedDevice(device);
    form.reset({
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      deviceType: device.deviceType,
      deviceSerial: device.deviceSerial,
      deviceLocation: device.deviceLocation,
      isActive: device.isActive,
    });
  };

  const handleDeleteClick = (device: DeviceMapping) => {
    setSelectedDevice(device);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDevice = async () => {
    if (!selectedDevice) return;
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setDevices(devices.filter(d => d.id !== selectedDevice.id));
      toast.success('Device deleted successfully');
    } catch (error) {
      console.error('Error deleting device:', error);
      toast.error('Failed to delete device');
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedDevice(null);
    }
  };

  const onSubmit = async (data: DeviceMappingFormValues) => {
    if (!currentBranch) {
      toast.error('No branch selected');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (isEditing && selectedDevice) {
        // Update existing device
        const updatedDevices = devices.map(d => 
          d.id === selectedDevice.id 
            ? { 
                ...d, 
                deviceName: data.deviceName,
                deviceType: data.deviceType,
                deviceSerial: data.deviceSerial,
                deviceLocation: data.deviceLocation,
                isActive: data.isActive,
                updatedAt: new Date().toISOString()
              } 
            : d
        );
        setDevices(updatedDevices);
        toast.success('Device updated successfully');
      } else {
        // Add new device
        const newDevice: DeviceMapping = {
          id: `dev${Date.now()}`,
          branchId: currentBranch.id,
          deviceId: data.deviceId || `hvk${Date.now()}`,
          deviceName: data.deviceName,
          deviceType: data.deviceType,
          deviceSerial: data.deviceSerial,
          deviceLocation: data.deviceLocation,
          isActive: data.isActive,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setDevices([...devices, newDevice]);
        toast.success('Device added successfully');
      }
      form.reset();
    } catch (error) {
      console.error('Error saving device:', error);
      toast.error(isEditing ? 'Failed to update device' : 'Failed to add device');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestConnection = async (deviceId: string) => {
    toast.success('Testing connection...', { duration: 1000 });
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    toast.success('Connection successful');
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Branch Devices</CardTitle>
              <CardDescription>
                Manage access control devices for {currentBranch?.name || 'this branch'}
              </CardDescription>
            </div>
            <Button onClick={handleAddDevice}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Device
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : devices.length === 0 ? (
            <div className="text-center py-10">
              <ServerOff className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No devices configured</h3>
              <p className="text-muted-foreground mb-4">
                Add devices to enable access control for this branch
              </p>
              <Button onClick={handleAddDevice}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add First Device
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Serial</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.deviceName}</TableCell>
                    <TableCell>
                      <Badge variant={device.deviceType === 'entry' ? 'default' : 
                        device.deviceType === 'swimming' ? 'secondary' : 'outline'}
                      >
                        {device.deviceType.charAt(0).toUpperCase() + device.deviceType.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{device.deviceSerial}</TableCell>
                    <TableCell>{device.deviceLocation}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {device.isActive ? (
                          <Badge variant="success" className="bg-green-500 hover:bg-green-600">Active</Badge>
                        ) : (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleTestConnection(device.deviceId)}
                        >
                          <Link className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleEditDevice(device)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDeleteClick(device)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {(form.formState.isDirty || isEditing) && (
            <>
              <Separator className="my-6" />
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="deviceName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter device name" {...field} />
                          </FormControl>
                          <FormDescription>
                            A descriptive name for this device
                          </FormDescription>
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
                                <SelectValue placeholder="Select device type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="entry">Entry</SelectItem>
                              <SelectItem value="exit">Exit</SelectItem>
                              <SelectItem value="swimming">Swimming Pool</SelectItem>
                              <SelectItem value="gym">Gym Area</SelectItem>
                              <SelectItem value="special">Special Area</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The type of access this device controls
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="deviceSerial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Serial Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter device serial" {...field} />
                          </FormControl>
                          <FormDescription>
                            The unique serial number of the device
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="deviceLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Where is this device located?" {...field} />
                          </FormControl>
                          <FormDescription>
                            Physical location within the branch
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Device Status</FormLabel>
                          <FormDescription>
                            Active devices will be used for access control
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
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        form.reset();
                        if (isEditing) {
                          setIsEditing(false);
                          setSelectedDevice(null);
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isEditing ? 'Updating...' : 'Adding...'}
                        </>
                      ) : (
                        <>{isEditing ? 'Update Device' : 'Add Device'}</>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the device "{selectedDevice?.deviceName}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDevice} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BranchDeviceManager;
