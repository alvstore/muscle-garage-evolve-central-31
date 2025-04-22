import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, PlusCircle, Edit, Trash, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useBranch } from '@/hooks/use-branch';
import { DeviceMapping, DeviceMappingFormValues, ApiMethod, DeviceType, SyncStatus, ApiTestResult } from '@/types/device-mapping';
import { Branch } from '@/types/branch';

// Mock branches data
const mockBranches: Branch[] = [
  { id: "1", name: "Main Branch", address: "123 Main St", isActive: true },
  { id: "2", name: "Downtown Branch", address: "456 MG Road", isActive: true },
  { id: "3", name: "West Side", address: "789 West Avenue", isActive: true }
];

// Mock device mappings data
const mockDeviceMappings: DeviceMapping[] = [
  {
    id: "1",
    branchId: "1",
    deviceId: "device1",
    deviceName: "Main Entrance",
    deviceType: "entry",
    deviceSerial: "HK-1234567",
    deviceLocation: "Front Door",
    isActive: true,
    createdAt: "2023-01-15T09:30:00Z",
    updatedAt: "2023-01-15T09:30:00Z",
    apiMethod: "OpenAPI",
    ipAddress: "192.168.1.100",
    port: "8000",
    username: "admin",
    password: "password123",
    useISAPIFallback: true,
    lastSuccessfulSync: "2023-01-15T10:30:00Z"
  },
  {
    id: "2",
    branchId: "1",
    deviceId: "device2",
    deviceName: "Gym Area",
    deviceType: "gym",
    deviceSerial: "HK-7654321",
    deviceLocation: "Gym Entrance",
    isActive: true,
    createdAt: "2023-01-15T09:35:00Z",
    updatedAt: "2023-01-15T09:35:00Z",
    apiMethod: "ISAPI",
    ipAddress: "192.168.1.101",
    port: "8000",
    username: "admin",
    password: "password456",
    syncStatus: "success"
  },
  {
    id: "3",
    branchId: "2",
    deviceId: "device3",
    deviceName: "Swimming Pool",
    deviceType: "swimming",
    deviceSerial: "HK-9876543",
    deviceLocation: "Pool Entrance",
    isActive: true,
    createdAt: "2023-01-16T10:00:00Z",
    updatedAt: "2023-01-16T10:00:00Z",
    apiMethod: "OpenAPI",
    ipAddress: "192.168.2.100",
    port: "8000",
    username: "admin",
    password: "password789",
    useISAPIFallback: false,
    syncStatus: "failed",
    lastFailedSync: "2023-01-16T12:30:00Z"
  }
];

// Form schema for device mapping
const deviceSchema = z.object({
  deviceName: z.string().min(1, "Device name is required"),
  deviceType: z.enum(["entry", "exit", "swimming", "gym", "special"]),
  deviceSerial: z.string().min(1, "Serial number is required"),
  deviceLocation: z.string().min(1, "Location is required"),
  isActive: z.boolean().default(true),
  apiMethod: z.enum(["OpenAPI", "ISAPI"]),
  ipAddress: z.string().min(1, "IP address is required"),
  port: z.string().min(1, "Port is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  useISAPIFallback: z.boolean().default(false)
});

const BranchDeviceManager = () => {
  const [devices, setDevices] = useState<DeviceMapping[]>(mockDeviceMappings);
  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<DeviceMapping | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, ApiTestResult>>({});
  const { currentBranch } = useBranch();

  const form = useForm<z.infer<typeof deviceSchema>>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      deviceName: "",
      deviceType: "entry",
      deviceSerial: "",
      deviceLocation: "",
      isActive: true,
      apiMethod: "OpenAPI",
      ipAddress: "",
      port: "8000",
      username: "admin",
      password: "",
      useISAPIFallback: false
    }
  });

  const filteredDevices = selectedBranchId === "all" 
    ? devices 
    : devices.filter(device => device.branchId === selectedBranchId);

  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);
  };

  const handleAddDevice = () => {
    setEditingDevice(null);
    form.reset({
      deviceName: "",
      deviceType: "entry",
      deviceSerial: "",
      deviceLocation: "",
      isActive: true,
      apiMethod: "OpenAPI",
      ipAddress: "",
      port: "8000",
      username: "admin",
      password: "",
      useISAPIFallback: false
    });
    setIsDialogOpen(true);
  };

  const handleEditDevice = (device: DeviceMapping) => {
    setEditingDevice(device);
    form.reset({
      deviceName: device.deviceName,
      deviceType: device.deviceType,
      deviceSerial: device.deviceSerial,
      deviceLocation: device.deviceLocation,
      isActive: device.isActive,
      apiMethod: device.apiMethod,
      ipAddress: device.ipAddress || "",
      port: device.port || "8000",
      username: device.username || "admin",
      password: device.password || "",
      useISAPIFallback: device.useISAPIFallback || false
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof deviceSchema>) => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (editingDevice) {
        const updatedDevices = devices.map(device => 
          device.id === editingDevice.id 
            ? { 
                ...device, 
                deviceName: data.deviceName,
                deviceType: data.deviceType,
                deviceSerial: data.deviceSerial,
                deviceLocation: data.deviceLocation,
                isActive: data.isActive,
                apiMethod: data.apiMethod,
                ipAddress: data.ipAddress,
                port: data.port,
                username: data.username,
                password: data.password,
                useISAPIFallback: data.useISAPIFallback,
                updatedAt: new Date().toISOString() 
              } 
            : device
        );
        setDevices(updatedDevices);
        toast.success("Device updated successfully");
      } else {
        const newDevice: DeviceMapping = {
          id: `device-${Date.now()}`,
          branchId: selectedBranchId !== "all" ? selectedBranchId : (currentBranch?.id || "1"),
          deviceId: `device-${Date.now()}`,
          deviceName: data.deviceName,
          deviceType: data.deviceType,
          deviceSerial: data.deviceSerial,
          deviceLocation: data.deviceLocation,
          isActive: data.isActive,
          apiMethod: data.apiMethod,
          ipAddress: data.ipAddress,
          port: data.port,
          username: data.username,
          password: data.password,
          useISAPIFallback: data.useISAPIFallback,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setDevices([...devices, newDevice]);
        toast.success("Device added successfully");
      }
      
      setIsLoading(false);
      setIsDialogOpen(false);
    }, 1000);
  };

  const handleDeleteDevice = (id: string) => {
    setDeleteId(id);
    setIsDeleting(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      const filteredDevices = devices.filter(device => device.id !== deleteId);
      setDevices(filteredDevices);
      toast.success("Device deleted successfully");
      setDeleteId(null);
      setIsDeleting(false);
    }
  };

  const testApiConnection = async (device: DeviceMapping) => {
    if (isTesting) return;
    
    setIsTesting(true);
    
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% success rate for demo
      const isOpenApiMethod = device.apiMethod === "OpenAPI";
      
      if (isSuccess) {
        const updatedDevices = devices.map(d => 
          d.id === device.id 
            ? { 
                ...d, 
                lastSuccessfulSync: new Date().toISOString(),
                syncStatus: "success" as SyncStatus
              } 
            : d
        );
        
        setDevices(updatedDevices);
        
        setTestResults(prev => ({
          ...prev,
          [device.id]: {
            success: true,
            message: `Successfully connected to ${device.deviceName} using ${device.apiMethod}`,
            apiMethod: device.apiMethod,
            timestamp: new Date().toISOString()
          }
        }));
        
        toast.success(`Successfully connected to ${device.deviceName}`);
      } else {
        if (isOpenApiMethod && device.useISAPIFallback) {
          setTimeout(() => {
            const fallbackSuccess = Math.random() > 0.2; // 80% success rate for fallback
            
            if (fallbackSuccess) {
              const updatedDevices = devices.map(d => 
                d.id === device.id 
                  ? { 
                      ...d, 
                      lastSuccessfulSync: new Date().toISOString(),
                      syncStatus: "success" as SyncStatus
                    } 
                  : d
              );
              
              setDevices(updatedDevices);
              
              setTestResults(prev => ({
                ...prev,
                [device.id]: {
                  success: true,
                  message: `OpenAPI failed, successfully connected using ISAPI fallback`,
                  apiMethod: "ISAPI",
                  timestamp: new Date().toISOString()
                }
              }));
              
              toast.success(`OpenAPI failed but ISAPI fallback succeeded for ${device.deviceName}`);
            } else {
              const updatedDevices = devices.map(d => 
                d.id === device.id 
                  ? { 
                      ...d, 
                      lastFailedSync: new Date().toISOString(),
                      syncStatus: "failed" as SyncStatus
                    } 
                  : d
              );
              
              setDevices(updatedDevices);
              
              setTestResults(prev => ({
                ...prev,
                [device.id]: {
                  success: false,
                  message: `Both OpenAPI and ISAPI fallback failed to connect`,
                  apiMethod: device.apiMethod,
                  timestamp: new Date().toISOString()
                }
              }));
              
              toast.error(`Both OpenAPI and ISAPI failed for ${device.deviceName}`);
            }
            
            setIsTesting(false);
          }, 1500);
        } else {
          const updatedDevices = devices.map(d => 
            d.id === device.id 
              ? { 
                  ...d, 
                  lastFailedSync: new Date().toISOString(),
                  syncStatus: "failed" as SyncStatus
                } 
              : d
          );
          
          setDevices(updatedDevices);
          
          setTestResults(prev => ({
            ...prev,
            [device.id]: {
              success: false,
              message: `Failed to connect to ${device.deviceName} using ${device.apiMethod}`,
              apiMethod: device.apiMethod,
              timestamp: new Date().toISOString()
            }
          }));
          
          toast.error(`Failed to connect to ${device.deviceName}`);
          setIsTesting(false);
        }
      }
      
      if (!isOpenApiMethod) {
        setIsTesting(false);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <Label htmlFor="branch-selector">Filter by Branch</Label>
          <Select
            value={selectedBranchId}
            onValueChange={handleBranchChange}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleAddDevice} className="self-end">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Device
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedBranchId === "all" 
              ? "All Branch Devices" 
              : `${branches.find(b => b.id === selectedBranchId)?.name || "Branch"} Devices`}
          </CardTitle>
          <CardDescription>
            Manage access control devices mapped to branches
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredDevices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No devices found for this branch.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={handleAddDevice}
              >
                Add a device
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>API Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">
                      {device.deviceName}
                      <div className="text-xs text-muted-foreground">
                        {device.deviceSerial}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {device.deviceType.charAt(0).toUpperCase() + device.deviceType.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={device.apiMethod === "OpenAPI" ? "default" : "secondary"}
                          className="font-normal"
                        >
                          {device.apiMethod}
                        </Badge>
                        {device.useISAPIFallback && (
                          <Badge variant="outline" className="text-xs font-normal">
                            Fallback Enabled
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {device.ipAddress}:{device.port}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {device.isActive ? (
                          <Badge variant="outline" className="text-green-600 bg-green-50 font-normal">Active</Badge>
                        ) : (
                          <Badge variant="destructive" className="font-normal">Inactive</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {device.syncStatus === "success" && device.lastSuccessfulSync && (
                          <span className="text-green-600">Last sync successful</span>
                        )}
                        {device.syncStatus === "failed" && device.lastFailedSync && (
                          <span className="text-red-600">Last sync failed</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {branches.find(b => b.id === device.branchId)?.name || "Unknown Branch"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => testApiConnection(device)}
                          disabled={isTesting}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditDevice(device)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteDevice(device.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingDevice ? "Edit Device" : "Add New Device"}</DialogTitle>
            <DialogDescription>
              {editingDevice 
                ? "Update the device configuration settings." 
                : "Configure a new access control device for a branch."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedBranchId === "all" && (
                  <div className="col-span-2">
                    <FormLabel>Branch</FormLabel>
                    <Select
                      value={editingDevice?.branchId || (currentBranch?.id || "1")}
                      onValueChange={() => {}}
                      disabled={!!editingDevice}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      The branch this device belongs to
                    </p>
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="deviceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Main Entrance" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for the device
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
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select device type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Gate</SelectItem>
                          <SelectItem value="exit">Exit Gate</SelectItem>
                          <SelectItem value="gym">Gym Area</SelectItem>
                          <SelectItem value="swimming">Swimming Pool</SelectItem>
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
                        <Input placeholder="HK-1234567" {...field} />
                      </FormControl>
                      <FormDescription>
                        The device serial number
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
                        <Input placeholder="Main Door" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="apiMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Method</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select API method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OpenAPI">OpenAPI (Recommended)</SelectItem>
                          <SelectItem value="ISAPI">ISAPI (Legacy)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The API method to communicate with the device
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                        <Input placeholder="8000" {...field} />
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
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-1 md:col-span-2">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Device Active
                        </FormLabel>
                        <FormDescription>
                          Activate or deactivate this device
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
                
                <FormField
                  control={form.control}
                  name="useISAPIFallback"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-1 md:col-span-2">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable ISAPI Fallback
                        </FormLabel>
                        <FormDescription>
                          If OpenAPI fails, try using ISAPI as a fallback method
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={form.watch("apiMethod") === "ISAPI"}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingDevice ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    editingDevice ? "Update Device" : "Add Device"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this device? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BranchDeviceManager;
