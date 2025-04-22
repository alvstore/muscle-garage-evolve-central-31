
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Plus, 
  PencilLine, 
  Trash2, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { DeviceMapping, BranchDeviceSettings, DeviceMappingFormValues, ApiTestResult } from "@/types/device-mapping";
import { Branch } from "@/types/branch";
import { useBranch } from "@/hooks/use-branch";
import { usePermissions } from "@/hooks/use-permissions";

// Mock branches data
const mockBranches: Branch[] = [
  { id: 'branch1', name: 'Main Branch', address: '123 Main St', city: 'Mumbai', state: 'Maharashtra', country: 'India', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'branch2', name: 'Downtown Branch', address: '456 Downtown Ave', city: 'Delhi', state: 'Delhi', country: 'India', created_at: '2024-01-02', updated_at: '2024-01-02' },
  { id: 'branch3', name: 'East Wing', address: '789 East Blvd', city: 'Bangalore', state: 'Karnataka', country: 'India', created_at: '2024-01-03', updated_at: '2024-01-03' },
];

// Mock devices data
const mockDevices: DeviceMapping[] = [
  {
    id: 'device1',
    branchId: 'branch1',
    deviceId: 'HKVS001',
    deviceName: 'Main Entrance',
    deviceType: 'entry',
    deviceSerial: 'DS-K1T671M20210615001',
    deviceLocation: 'Main door',
    isActive: true,
    apiMethod: 'OpenAPI',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    lastSyncTime: '2024-04-20T08:30:00Z',
    syncStatus: 'success'
  },
  {
    id: 'device2',
    branchId: 'branch1',
    deviceId: 'HKVS002',
    deviceName: 'Swimming Pool Gate',
    deviceType: 'swimming',
    deviceSerial: 'DS-K1T671M20210615002',
    deviceLocation: 'Pool entrance',
    isActive: true,
    apiMethod: 'OpenAPI',
    ipAddress: '192.168.1.101',
    port: '8000',
    username: 'admin',
    password: 'admin123',
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-02T10:00:00Z',
    lastSyncTime: '2024-04-20T12:15:00Z',
    syncStatus: 'failed',
    lastFailedSync: '2024-04-20T12:15:00Z',
    useISAPIFallback: true
  },
  {
    id: 'device3',
    branchId: 'branch2',
    deviceId: 'HKVS003',
    deviceName: 'Downtown Main Gate',
    deviceType: 'entry',
    deviceSerial: 'DS-K1T671M20210615003',
    deviceLocation: 'Front entrance',
    isActive: true,
    apiMethod: 'ISAPI',
    ipAddress: '192.168.2.100',
    port: '8000',
    username: 'admin',
    password: 'admin123',
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-03T10:00:00Z',
    lastSyncTime: '2024-04-21T09:45:00Z',
    syncStatus: 'success',
    lastSuccessfulSync: '2024-04-21T09:45:00Z'
  }
];

// Mock branch device settings
const mockBranchSettings: Record<string, BranchDeviceSettings> = {
  'branch1': {
    branchId: 'branch1',
    devices: mockDevices.filter(d => d.branchId === 'branch1'),
    defaultAccessRules: {
      gymOnlyAccess: true,
      swimmingOnlyAccess: true,
      premiumAccess: true
    },
    syncFrequency: 'hourly',
    integrationEnabled: true,
    useISAPIWhenOpenAPIFails: true
  },
  'branch2': {
    branchId: 'branch2',
    devices: mockDevices.filter(d => d.branchId === 'branch2'),
    defaultAccessRules: {
      gymOnlyAccess: true,
      swimmingOnlyAccess: false,
      premiumAccess: true
    },
    syncFrequency: '15min',
    integrationEnabled: true,
    useISAPIWhenOpenAPIFails: false
  },
  'branch3': {
    branchId: 'branch3',
    devices: [],
    defaultAccessRules: {
      gymOnlyAccess: true,
      swimmingOnlyAccess: false,
      premiumAccess: true
    },
    syncFrequency: 'daily',
    integrationEnabled: false,
    useISAPIWhenOpenAPIFails: true
  }
};

// Form schema for device mapping
const deviceFormSchema = z.object({
  deviceName: z.string().min(1, { message: "Device name is required" }),
  deviceType: z.enum(['entry', 'exit', 'swimming', 'gym', 'special']),
  deviceSerial: z.string().min(1, { message: "Device serial number is required" }),
  deviceLocation: z.string().optional(),
  isActive: z.boolean().default(true),
  apiMethod: z.enum(['OpenAPI', 'ISAPI']),
  ipAddress: z.string().optional(),
  port: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  useISAPIFallback: z.boolean().default(true),
});

const BranchDeviceManager = () => {
  const { can } = usePermissions();
  const { currentBranch } = useBranch();
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [devices, setDevices] = useState<DeviceMapping[]>(mockDevices);
  const [branchSettings, setBranchSettings] = useState<Record<string, BranchDeviceSettings>>(mockBranchSettings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<DeviceMapping | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, ApiTestResult>>({});
  const [isTestingApi, setIsTestingApi] = useState<Record<string, boolean>>({});

  // Initialize form
  const form = useForm<z.infer<typeof deviceFormSchema>>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues: {
      deviceName: '',
      deviceType: 'entry',
      deviceSerial: '',
      deviceLocation: '',
      isActive: true,
      apiMethod: 'OpenAPI',
      ipAddress: '',
      port: '8000',
      username: 'admin',
      password: '',
      useISAPIFallback: true,
    },
  });

  // Set active branch when mounted
  useEffect(() => {
    if (currentBranch?.id) {
      setSelectedBranchId(currentBranch.id);
    } else if (branches.length > 0) {
      setSelectedBranchId(branches[0].id);
    }
  }, [currentBranch, branches]);

  // Update form when editing device
  useEffect(() => {
    if (editingDevice) {
      form.reset({
        deviceName: editingDevice.deviceName,
        deviceType: editingDevice.deviceType,
        deviceSerial: editingDevice.deviceSerial,
        deviceLocation: editingDevice.deviceLocation || '',
        isActive: editingDevice.isActive,
        apiMethod: editingDevice.apiMethod,
        ipAddress: editingDevice.ipAddress || '',
        port: editingDevice.port || '8000',
        username: editingDevice.username || 'admin',
        password: editingDevice.password || '',
        useISAPIFallback: editingDevice.useISAPIFallback || true,
      });
    } else {
      form.reset({
        deviceName: '',
        deviceType: 'entry',
        deviceSerial: '',
        deviceLocation: '',
        isActive: true,
        apiMethod: 'OpenAPI',
        ipAddress: '',
        port: '8000',
        username: 'admin',
        password: '',
        useISAPIFallback: true,
      });
    }
  }, [editingDevice, form]);

  const handleAddDevice = () => {
    setEditingDevice(null);
    setIsDialogOpen(true);
  };

  const handleEditDevice = (device: DeviceMapping) => {
    setEditingDevice(device);
    setIsDialogOpen(true);
  };

  const handleDeleteDevice = (deviceId: string) => {
    // In a real application, this would call an API to delete the device
    setDevices(devices.filter(d => d.id !== deviceId));
    
    // Update branch settings
    if (selectedBranchId) {
      const updatedBranchSettings = { ...branchSettings };
      updatedBranchSettings[selectedBranchId] = {
        ...updatedBranchSettings[selectedBranchId],
        devices: updatedBranchSettings[selectedBranchId].devices.filter(d => d.id !== deviceId)
      };
      setBranchSettings(updatedBranchSettings);
    }
    
    toast.success("Device removed successfully");
  };

  const onSubmit = (data: z.infer<typeof deviceFormSchema>) => {
    if (!selectedBranchId) {
      toast.error("Please select a branch first");
      return;
    }

    const timestamp = new Date().toISOString();
    let newDevice: DeviceMapping = {
      id: editingDevice?.id || `device-${Date.now()}`,
      branchId: selectedBranchId,
      deviceId: `HKVS${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      deviceName: data.deviceName,
      deviceType: data.deviceType,
      deviceSerial: data.deviceSerial,
      deviceLocation: data.deviceLocation || '',
      isActive: data.isActive,
      apiMethod: data.apiMethod,
      ipAddress: data.ipAddress,
      port: data.port,
      username: data.username,
      password: data.password,
      useISAPIFallback: data.useISAPIFallback,
      createdAt: editingDevice?.createdAt || timestamp,
      updatedAt: timestamp
    };

    if (editingDevice) {
      // Update existing device
      setDevices(devices.map(d => d.id === editingDevice.id ? newDevice : d));
      toast.success("Device updated successfully");
    } else {
      // Add new device
      setDevices([...devices, newDevice]);
      toast.success("Device added successfully");
    }

    // Update branch settings
    if (selectedBranchId) {
      const updatedBranchSettings = { ...branchSettings };
      const branchDevices = updatedBranchSettings[selectedBranchId]?.devices || [];
      
      if (editingDevice) {
        updatedBranchSettings[selectedBranchId] = {
          ...updatedBranchSettings[selectedBranchId],
          devices: branchDevices.map(d => d.id === editingDevice.id ? newDevice : d)
        };
      } else {
        updatedBranchSettings[selectedBranchId] = {
          ...updatedBranchSettings[selectedBranchId],
          devices: [...branchDevices, newDevice]
        };
      }
      
      setBranchSettings(updatedBranchSettings);
    }

    setIsDialogOpen(false);
  };

  const testDeviceApi = async (device: DeviceMapping, apiMethod: 'OpenAPI' | 'ISAPI') => {
    // Set testing state for this device
    setIsTestingApi(prev => ({ ...prev, [device.id]: true }));
    
    try {
      // In a real application, this would call an API to test the connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success or failure (80% success rate for demo)
      const success = Math.random() > 0.2;
      
      // Create test result
      const result: ApiTestResult = {
        success,
        message: success 
          ? `Successfully connected to device using ${apiMethod}` 
          : `Failed to connect using ${apiMethod}. ${apiMethod === 'OpenAPI' && device.useISAPIFallback ? 'Will try ISAPI fallback.' : 'Please check credentials.'}`,
        apiMethod,
        timestamp: new Date().toISOString()
      };
      
      // Save test result
      setTestResults(prev => ({ ...prev, [device.id]: result }));
      
      // If OpenAPI failed and fallback is enabled, test ISAPI after a short delay
      if (!success && apiMethod === 'OpenAPI' && device.useISAPIFallback) {
        toast.info("OpenAPI connection failed. Trying ISAPI fallback...");
        
        // Wait a moment before trying ISAPI
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate ISAPI fallback (90% success rate for fallback)
        const isapiFallbackSuccess = Math.random() > 0.1;
        
        const fallbackResult: ApiTestResult = {
          success: isapiFallbackSuccess,
          message: isapiFallbackSuccess 
            ? "ISAPI fallback connection successful" 
            : "Both OpenAPI and ISAPI fallback failed. Please check device configuration.",
          apiMethod: 'ISAPI',
          timestamp: new Date().toISOString()
        };
        
        // Save fallback result
        setTestResults(prev => ({ ...prev, [device.id]: fallbackResult }));
        
        if (isapiFallbackSuccess) {
          toast.success("ISAPI fallback connection successful");
        } else {
          toast.error("Both OpenAPI and ISAPI fallback failed");
        }
      } else {
        // Show simple success/failure toast
        if (success) {
          toast.success(`${apiMethod} connection successful`);
        } else {
          toast.error(`${apiMethod} connection failed`);
        }
      }
    } catch (error) {
      console.error("Error testing device:", error);
      toast.error("An error occurred while testing the connection");
      
      // Save error result
      setTestResults(prev => ({ 
        ...prev, 
        [device.id]: {
          success: false,
          message: "Error testing connection",
          apiMethod,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      // Clear testing state
      setIsTestingApi(prev => ({ ...prev, [device.id]: false }));
    }
  };

  const toggleGlobalFallback = (enabled: boolean) => {
    if (!selectedBranchId) return;
    
    const updatedBranchSettings = { ...branchSettings };
    updatedBranchSettings[selectedBranchId] = {
      ...updatedBranchSettings[selectedBranchId],
      useISAPIWhenOpenAPIFails: enabled
    };
    
    setBranchSettings(updatedBranchSettings);
    toast.success(`Global ISAPI fallback ${enabled ? 'enabled' : 'disabled'} for this branch`);
  };

  // Get displayed devices for the selected branch
  const displayedDevices = selectedBranchId 
    ? devices.filter(device => device.branchId === selectedBranchId)
    : [];

  // Get branch settings for the selected branch
  const selectedBranchSettings = selectedBranchId 
    ? branchSettings[selectedBranchId] 
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-xl font-medium">Device Mapping</h3>
          <p className="text-sm text-muted-foreground">
            Map access control devices to branches and configure their settings
          </p>
        </div>
        
        {can('manage_branches') && (
          <Button onClick={handleAddDevice}>
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle>Branch Devices</CardTitle>
            
            <Select
              value={selectedBranchId || ''}
              onValueChange={(value) => setSelectedBranchId(value)}
            >
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          {selectedBranchId && selectedBranchSettings && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="space-y-0.5">
                  <h4 className="font-medium">ISAPI Fallback Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    When enabled, system will automatically try ISAPI if OpenAPI fails
                  </p>
                </div>
                <Switch 
                  checked={selectedBranchSettings.useISAPIWhenOpenAPIFails}
                  onCheckedChange={toggleGlobalFallback}
                />
              </div>
              
              {displayedDevices.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>API Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedDevices.map((device) => (
                        <TableRow key={device.id}>
                          <TableCell className="font-medium">
                            <div>{device.deviceName}</div>
                            <div className="text-xs text-muted-foreground">{device.deviceSerial}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {device.deviceType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={device.apiMethod === 'OpenAPI' ? 'default' : 'secondary'}
                                className="capitalize"
                              >
                                {device.apiMethod}
                              </Badge>
                              {device.useISAPIFallback && device.apiMethod === 'OpenAPI' && (
                                <Badge variant="outline" className="text-xs">
                                  +Fallback
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {device.syncStatus === 'success' ? (
                              <div className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
                                <span className="text-sm">OK</span>
                              </div>
                            ) : device.syncStatus === 'failed' ? (
                              <div className="flex items-center">
                                <XCircle className="h-4 w-4 text-red-500 mr-1.5" />
                                <span className="text-sm">Failed</span>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-muted-foreground mr-1.5" />
                                <span className="text-sm">Pending</span>
                              </div>
                            )}
                            {device.lastSyncTime && (
                              <span className="text-xs text-muted-foreground block mt-0.5">
                                {new Date(device.lastSyncTime).toLocaleString()}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => testDeviceApi(device, device.apiMethod)}
                                disabled={isTestingApi[device.id]}
                              >
                                {isTestingApi[device.id] ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="h-4 w-4" />
                                )}
                                <span className="sr-only">Test</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditDevice(device)}
                              >
                                <PencilLine className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDevice(device.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                            
                            {/* Test result display */}
                            {testResults[device.id] && (
                              <div className={`mt-2 p-2 text-xs rounded ${
                                testResults[device.id].success 
                                  ? 'bg-green-50 text-green-700 border border-green-100' 
                                  : 'bg-red-50 text-red-700 border border-red-100'
                              }`}>
                                <div className="flex items-start gap-1.5">
                                  {testResults[device.id].success 
                                    ? <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" /> 
                                    : <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />}
                                  <div>
                                    <span className="font-medium">{testResults[device.id].apiMethod}:</span>{' '}
                                    {testResults[device.id].message}
                                  </div>
                                </div>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6 border rounded-md bg-muted/10">
                  <p className="text-muted-foreground">No devices mapped to this branch yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={handleAddDevice}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Device
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Device Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingDevice ? 'Edit Device' : 'Add New Device'}</DialogTitle>
            <DialogDescription>
              {editingDevice 
                ? 'Update the device configuration and connection settings.' 
                : 'Configure a new access control device for this branch.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="deviceName"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Device Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Main Entrance" {...field} />
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
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="entry">Entry</SelectItem>
                          <SelectItem value="exit">Exit</SelectItem>
                          <SelectItem value="swimming">Swimming</SelectItem>
                          <SelectItem value="gym">Gym</SelectItem>
                          <SelectItem value="special">Special</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deviceSerial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device Serial</FormLabel>
                      <FormControl>
                        <Input placeholder="DS-K1T671M..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deviceLocation"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Location (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Main entrance, first floor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator className="col-span-2 my-2" />
                
                <div className="col-span-2">
                  <h4 className="text-sm font-medium mb-2">Connection Settings</h4>
                </div>
                
                <FormField
                  control={form.control}
                  name="apiMethod"
                  render={({ field }) => (
                    <FormItem className="col-span-2 space-y-3">
                      <FormLabel>API Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="OpenAPI" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              OpenAPI (Recommended)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="ISAPI" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              ISAPI (Legacy)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
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
                      <div className="flex">
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field} 
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="ml-2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch('apiMethod') === 'OpenAPI' && (
                  <FormField
                    control={form.control}
                    name="useISAPIFallback"
                    render={({ field }) => (
                      <FormItem className="col-span-2 flex items-center space-x-2 space-y-0 rounded-md border p-3">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable ISAPI Fallback</FormLabel>
                          <FormDescription>
                            If OpenAPI fails, automatically try ISAPI method
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="col-span-2 flex items-center space-x-2 space-y-0 rounded-md border p-3">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Device Active</FormLabel>
                        <FormDescription>
                          When disabled, the device will not sync attendance data
                        </FormDescription>
                      </div>
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
                <Button type="submit">
                  {editingDevice ? 'Update Device' : 'Add Device'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BranchDeviceManager;
