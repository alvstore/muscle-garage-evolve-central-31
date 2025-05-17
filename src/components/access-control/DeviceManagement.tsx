
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Plus, DoorOpen, Check, X, HardDrive } from "lucide-react";
import useHikvision, { HikvisionDevice } from '@/hooks/access/use-hikvision-consolidated';
import { hikvisionService } from '@/services/integrations/hikvisionService';
import { toast } from 'sonner';

// Define HikvisionDoor interface since it's not exported from the service
export interface HikvisionDoor {
  id: string;
  name: string;
  deviceId: string;
  status: 'open' | 'closed' | 'unknown';
  lastUpdated: string;
}

interface DeviceManagementProps {
  branchId?: string;
}

const DeviceManagement = ({ branchId }: DeviceManagementProps) => {
  const { 
    devices, 
    isLoading: isLoadingDevices, 
    refreshDevices,
    settings
  } = useHikvision();
  
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [isViewDoorsOpen, setIsViewDoorsOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<HikvisionDevice | null>(null);
  const [doors, setDoors] = useState<HikvisionDoor[]>([]);
  const [isLoadingDoors, setIsLoadingDoors] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    ip_address: '',
    port: 80,
    username: 'admin',
    password: '',
    branch_id: branchId || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Simplified state for this example - in a real app, you'd fetch this from your API
  const [sites] = useState<Array<{id: string, name: string}>>([
    { id: '1', name: 'Main Entrance' },
    { id: '2', name: 'Back Door' },
    { id: '3', name: 'Parking Lot' },
  ]);
  const [isLoadingSites] = useState(false);

  // Load devices when component mounts or branchId changes
  useEffect(() => {
    const loadDevices = async () => {
      try {
        await refreshDevices();
      } catch (error) {
        console.error('Failed to load devices:', error);
        toast.error('Failed to load devices');
      }
    };
    
    if (branchId) {
      loadDevices();
    }
  }, [branchId, refreshDevices]);

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDevice.name || !newDevice.ip_address || !newDevice.username || !newDevice.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSaving(true);
    try {
      // In a real app, you would call your API to add the device
      // For now, we'll just update the local state
      const newDeviceData: HikvisionDevice = {
        id: `device-${Date.now()}`,
        name: newDevice.name,
        ip_address: newDevice.ip_address,
        port: newDevice.port,
        username: newDevice.username,
        password: newDevice.password,
        branch_id: newDevice.branch_id,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // In a real app, you would call: 
      // await hikvisionService.addDevice(newDeviceData);
      
      // For now, just show a success message
      toast.success(`Device ${newDevice.name} added successfully`);
      setNewDevice({
        name: '',
        ip_address: '',
        port: 80,
        username: 'admin',
        password: '',
        branch_id: branchId || ''
      });
      setIsAddDeviceOpen(false);
      
      // Refresh devices
      await fetchDevices();
    } catch (error) {
      console.error('Failed to add device:', error);
      toast.error('Failed to add device');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleViewDoors = async (device: HikvisionDevice) => {
    setSelectedDevice(device);
    setIsLoadingDoors(true);
    
    try {
      // In a real app, you would call your API to get doors
      // For now, we'll use mock data
      const mockDoors: HikvisionDoor[] = [
        { id: 'door-1', name: 'Main Door', deviceId: device.id, status: 'closed', lastUpdated: new Date().toISOString() },
        { id: 'door-2', name: 'Back Door', deviceId: device.id, status: 'open', lastUpdated: new Date().toISOString() },
      ];
      
      setDoors(mockDoors);
      setIsViewDoorsOpen(true);
    } catch (error) {
      console.error('Failed to load doors:', error);
      toast.error('Failed to load doors');
    } finally {
      setIsLoadingDoors(false);
    }
  };

  const getDeviceStatus = (device: HikvisionDevice) => {
    return device.is_active ? 'Online' : 'Offline';
  };

  const formatLastSync = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  // Handle input changes for the add device form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDevice(prev => ({
      ...prev,
      [name]: name === 'port' ? parseInt(value, 10) || 80 : value
    }));
  };

  if (!devices) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <HardDrive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Control Not Configured</h3>
            <p className="text-muted-foreground">
              Please configure and enable Hikvision integration in the settings tab
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingDevices || isLoadingLocalDevices) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading devices...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Access Control Devices</CardTitle>
            <CardDescription>Manage your access control devices and doors</CardDescription>
          </div>
          <Button onClick={() => setIsAddDeviceOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Device
          </Button>
        </CardHeader>
        <CardContent>
          {devices.length === 0 ? (
            <div className="text-center py-10">
              <HardDrive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No devices found</h3>
              <p className="text-muted-foreground mb-4">
                Add your first access control device to get started
              </p>
              <Button onClick={() => setIsAddDeviceOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add Device
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Port</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>{device.name}</TableCell>
                    <TableCell>{device.ip_address}</TableCell>
                    <TableCell>{device.port}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${
                          device.is_active ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        {getDeviceStatus(device)}
                      </div>
                    </TableCell>
                    <TableCell>{formatLastSync(device.last_sync)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewDoors(device)}
                        disabled={!device.is_active}
                      >
                        <DoorOpen className="h-4 w-4 mr-2" />
                        View Doors
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Total Devices: {devices.length}
          </p>
          <Button variant="outline" onClick={fetchDevices}>
            <Loader2 className={`h-4 w-4 mr-2 ${isLoadingDevices ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </CardFooter>
      </Card>

      {/* Add Device Dialog */}
      <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogDescription>
              Add a new access control device to your Hikvision system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Device Name
              </Label>
              <Input
                id="name"
                name="name"
                value={newDevice.name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="e.g., Front Door"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ip_address" className="text-right">
                IP Address
              </Label>
              <Input
                id="ip_address"
                name="ip_address"
                type="text"
                value={newDevice.ip_address}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="e.g., 192.168.1.100"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="port" className="text-right">
                Port
              </Label>
              <Input
                id="port"
                name="port"
                type="number"
                value={newDevice.port}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="e.g., 80"
                min="1"
                max="65535"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={newDevice.username}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="e.g., admin"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={newDevice.password}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Enter password"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDeviceOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSaving || !newDevice.name || !newDevice.ip_address || !newDevice.username || !newDevice.password}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Device
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Doors Dialog */}
      <Dialog open={isViewDoorsOpen} onOpenChange={setIsViewDoorsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDevice?.name} - Doors
            </DialogTitle>
            <DialogDescription>
              List of doors managed by this access controller
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {isLoadingDoors ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading doors...</span>
              </div>
            ) : doors.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Door Name</TableHead>
                    <TableHead>Door ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doors.map((door) => (
                    <TableRow key={door.doorId}>
                      <TableCell className="font-medium">{door.doorName}</TableCell>
                      <TableCell>{door.doorId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6">
                <DoorOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No doors found</h3>
                <p className="text-muted-foreground">
                  This device doesn't have any configured doors
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setIsViewDoorsOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeviceManagement;
