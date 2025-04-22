import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useBranch } from '@/hooks/use-branch';
import { DeviceMapping, BranchDeviceSettings, DeviceMappingFormValues } from '@/types/device-mapping';
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const deviceSchema = z.object({
  deviceId: z.string().min(1, "Device ID is required"),
  deviceName: z.string().min(1, "Device name is required"),
  deviceType: z.enum(["entry", "exit", "swimming", "gym", "special"]),
  deviceSerial: z.string().min(1, "Serial number is required"),
  deviceLocation: z.string().min(1, "Location is required"),
  isActive: z.boolean().default(true),
});

const BranchSpecificSettings = () => {
  const { toast } = useToast();
  const { currentBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(false);
  const [showAddDeviceDialog, setShowAddDeviceDialog] = useState(false);
  const [editingDevice, setEditingDevice] = useState<DeviceMapping | null>(null);
  
  const [branchSettings, setBranchSettings] = useState<BranchDeviceSettings>({
    branchId: currentBranch?.id || "",
    devices: [
      {
        id: "device1",
        branchId: currentBranch?.id || "",
        deviceId: "HK-001",
        deviceName: "Main Entrance Gate",
        deviceType: "entry",
        deviceSerial: "SN12345678",
        deviceLocation: "Front Lobby",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        apiMethod: "OpenAPI",
      },
      {
        id: "device2",
        branchId: currentBranch?.id || "",
        deviceId: "HK-002",
        deviceName: "Swimming Pool Gate",
        deviceType: "swimming",
        deviceSerial: "SN87654321",
        deviceLocation: "Pool Area",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        apiMethod: "ISAPI",
      }
    ],
    defaultAccessRules: {
      gymOnlyAccess: true,
      swimmingOnlyAccess: false,
      premiumAccess: true,
    },
    syncFrequency: "hourly",
    integrationEnabled: true,
  });
  
  const form = useForm<DeviceMappingFormValues>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      deviceId: "",
      deviceName: "",
      deviceType: "entry",
      deviceSerial: "",
      deviceLocation: "",
      isActive: true,
    },
  });
  
  useEffect(() => {
    if (editingDevice) {
      form.reset({
        deviceId: editingDevice.deviceId,
        deviceName: editingDevice.deviceName,
        deviceType: editingDevice.deviceType,
        deviceSerial: editingDevice.deviceSerial,
        deviceLocation: editingDevice.deviceLocation,
        isActive: editingDevice.isActive,
      });
    } else {
      form.reset({
        deviceId: "",
        deviceName: "",
        deviceType: "entry",
        deviceSerial: "",
        deviceLocation: "",
        isActive: true,
      });
    }
  }, [editingDevice, form]);
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings saved",
        description: "Branch device settings have been updated successfully.",
      });
    }, 1000);
  };
  
  const handleToggleIntegration = (enabled: boolean) => {
    setBranchSettings(prev => ({
      ...prev,
      integrationEnabled: enabled
    }));
  };
  
  const handleSyncFrequencyChange = (value: string) => {
    setBranchSettings(prev => ({
      ...prev,
      syncFrequency: value as "realtime" | "15min" | "hourly" | "daily"
    }));
  };
  
  const handleToggleAccessRule = (rule: keyof typeof branchSettings.defaultAccessRules, value: boolean) => {
    setBranchSettings(prev => ({
      ...prev,
      defaultAccessRules: {
        ...prev.defaultAccessRules,
        [rule]: value
      }
    }));
  };
  
  const handleAddDevice = (data: DeviceMappingFormValues) => {
    if (editingDevice) {
      setBranchSettings(prev => ({
        ...prev,
        devices: prev.devices.map(device => 
          device.id === editingDevice.id 
            ? { 
                ...device, 
                deviceId: data.deviceId,
                deviceName: data.deviceName,
                deviceType: data.deviceType,
                deviceSerial: data.deviceSerial,
                deviceLocation: data.deviceLocation,
                isActive: data.isActive,
                updatedAt: new Date().toISOString(),
                apiMethod: data.apiMethod
              } 
            : device
        )
      }));
      
      toast({
        title: "Device updated",
        description: `${data.deviceName} has been updated successfully.`,
      });
    } else {
      const newDevice: DeviceMapping = {
        id: `device${Date.now()}`,
        branchId: currentBranch?.id || "",
        deviceId: data.deviceId,
        deviceName: data.deviceName,
        deviceType: data.deviceType,
        deviceSerial: data.deviceSerial,
        deviceLocation: data.deviceLocation,
        isActive: data.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        apiMethod: data.apiMethod
      };
      
      setBranchSettings(prev => ({
        ...prev,
        devices: [...prev.devices, newDevice]
      }));
      
      toast({
        title: "Device added",
        description: `${data.deviceName} has been added successfully.`,
      });
    }
    
    setShowAddDeviceDialog(false);
    setEditingDevice(null);
    form.reset();
  };
  
  const handleDeleteDevice = (deviceId: string) => {
    setBranchSettings(prev => ({
      ...prev,
      devices: prev.devices.filter(device => device.id !== deviceId)
    }));
    
    toast({
      title: "Device removed",
      description: "The device has been removed from this branch.",
    });
  };
  
  const handleEditDevice = (device: DeviceMapping) => {
    setEditingDevice(device);
    setShowAddDeviceDialog(true);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Branch Integration Settings</CardTitle>
          <CardDescription>
            Configure device integration settings for {currentBranch?.name || "this branch"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <h3 className="text-lg font-medium">Enable Device Integration</h3>
              <p className="text-sm text-muted-foreground">
                Allow this branch to connect with access control devices
              </p>
            </div>
            <Switch 
              checked={branchSettings.integrationEnabled}
              onCheckedChange={handleToggleIntegration}
            />
          </div>
          
          {branchSettings.integrationEnabled && (
            <>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="syncFrequency">Synchronization Frequency</Label>
                  <Select 
                    value={branchSettings.syncFrequency} 
                    onValueChange={handleSyncFrequencyChange}
                  >
                    <SelectTrigger id="syncFrequency" className="w-full">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="15min">Every 15 minutes</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    How often should member data sync with devices
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Default Access Rules</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="gymOnlyAccess" className="flex-1">
                        Gym-only Access
                      </Label>
                      <Switch 
                        id="gymOnlyAccess"
                        checked={branchSettings.defaultAccessRules.gymOnlyAccess}
                        onCheckedChange={(value) => handleToggleAccessRule("gymOnlyAccess", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="swimmingOnlyAccess" className="flex-1">
                        Swimming-only Access
                      </Label>
                      <Switch 
                        id="swimmingOnlyAccess"
                        checked={branchSettings.defaultAccessRules.swimmingOnlyAccess}
                        onCheckedChange={(value) => handleToggleAccessRule("swimmingOnlyAccess", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="premiumAccess" className="flex-1">
                        Premium Access (All Areas)
                      </Label>
                      <Switch 
                        id="premiumAccess"
                        checked={branchSettings.defaultAccessRules.premiumAccess}
                        onCheckedChange={(value) => handleToggleAccessRule("premiumAccess", value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="devices" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="devices">Mapped Devices</TabsTrigger>
                  <TabsTrigger value="logs">Sync Logs</TabsTrigger>
                </TabsList>
                <TabsContent value="devices" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Connected Devices</h3>
                    <Dialog open={showAddDeviceDialog} onOpenChange={setShowAddDeviceDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Device
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {editingDevice ? "Edit Device" : "Add New Device"}
                          </DialogTitle>
                          <DialogDescription>
                            {editingDevice 
                              ? "Update the device information below" 
                              : "Enter the details of the device to connect to this branch"}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleAddDevice)} className="space-y-4">
                            <FormField
                              control={form.control}
                              name="deviceId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Device ID</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., HK-001" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="deviceName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Device Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Main Entrance Gate" {...field} />
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
                                        <SelectValue placeholder="Select device type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="entry">Entry Gate</SelectItem>
                                      <SelectItem value="exit">Exit Gate</SelectItem>
                                      <SelectItem value="swimming">Swimming Area</SelectItem>
                                      <SelectItem value="gym">Gym Area</SelectItem>
                                      <SelectItem value="special">Special Area</SelectItem>
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
                                  <FormLabel>Serial Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., SN12345678" {...field} />
                                  </FormControl>
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
                                    <Input placeholder="e.g., Front Lobby" {...field} />
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
                                    <FormLabel>Active Status</FormLabel>
                                    <FormDescription>
                                      Enable or disable this device
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
                              name="apiMethod"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>API Method</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select API method" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="OpenAPI">OpenAPI</SelectItem>
                                      <SelectItem value="ISAPI">ISAPI</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <DialogFooter>
                              <Button type="submit">
                                {editingDevice ? "Update Device" : "Add Device"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {branchSettings.devices.length === 0 ? (
                    <div className="text-center py-8 border rounded-md">
                      <p className="text-muted-foreground">No devices connected yet</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setShowAddDeviceDialog(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Device
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {branchSettings.devices.map((device) => (
                        <div 
                          key={device.id} 
                          className="flex items-center justify-between p-3 border rounded-md"
                        >
                          <div>
                            <h4 className="font-medium">{device.deviceName}</h4>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span className="mr-2">ID: {device.deviceId}</span>
                              <span>Type: {device.deviceType}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Location: {device.deviceLocation}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditDevice(device)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteDevice(device.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="logs">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Synchronization Logs</h3>
                    <div className="border rounded-md p-4">
                      <p className="text-center text-muted-foreground">
                        No recent sync logs available
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveSettings}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchSpecificSettings;
