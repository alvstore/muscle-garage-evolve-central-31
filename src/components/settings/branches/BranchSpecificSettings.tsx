
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/ui/use-toast";
import { useBranch } from '@/hooks/settings/use-branches';
import { DeviceMapping, BranchDeviceSettings, DeviceMappingFormValues } from '@/types/device-mapping';
import { DeviceMappingForm } from './branch-specific/DeviceMappingForm';
import { DeviceList } from './branch-specific/DeviceList';
import { IntegrationSettings } from './branch-specific/IntegrationSettings';
import { Loader2 } from "lucide-react";

const BranchSpecificSettings = () => {
  const { toast } = useToast();
  const { currentBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(false);
  const [showAddDeviceDialog, setShowAddDeviceDialog] = useState(false);
  const [editingDevice, setEditingDevice] = useState<DeviceMapping | null>(null);
  
  const [branchSettings, setBranchSettings] = useState<BranchDeviceSettings>({
    branchId: currentBranch?.id || "",
    devices: [],
    defaultAccessRules: {
      gymOnlyAccess: true,
      swimmingOnlyAccess: false,
      premiumAccess: true,
    },
    syncFrequency: "hourly",
    integrationEnabled: true,
    useISAPIWhenOpenAPIFails: true,
  });
  
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
                ...data,
                updatedAt: new Date().toISOString()
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
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
          <IntegrationSettings 
            integrationEnabled={branchSettings.integrationEnabled}
            syncFrequency={branchSettings.syncFrequency}
            defaultAccessRules={branchSettings.defaultAccessRules}
            onToggleIntegration={handleToggleIntegration}
            onSyncFrequencyChange={handleSyncFrequencyChange}
            onToggleAccessRule={handleToggleAccessRule}
          />
          
          {branchSettings.integrationEnabled && (
            <Tabs defaultValue="devices" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="devices">Mapped Devices</TabsTrigger>
                <TabsTrigger value="logs">Sync Logs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="devices">
                <Dialog open={showAddDeviceDialog} onOpenChange={setShowAddDeviceDialog}>
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
                    
                    <DeviceMappingForm 
                      onSubmit={handleAddDevice}
                      initialValues={editingDevice || undefined}
                      onCancel={() => setShowAddDeviceDialog(false)}
                    />
                  </DialogContent>
                </Dialog>

                <DeviceList 
                  devices={branchSettings.devices}
                  onEdit={handleEditDevice}
                  onDelete={handleDeleteDevice}
                  onAdd={() => setShowAddDeviceDialog(true)}
                />
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
