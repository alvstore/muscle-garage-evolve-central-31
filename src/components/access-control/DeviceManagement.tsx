
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
import { useHikvisionSettings } from '@/hooks/integrations/use-hikvision-settings';
import { hikvisionService, HikvisionDevice, HikvisionDoor } from '@/services/hikvisionService';
import { toast } from 'sonner';
import { supabase } from '@/services/api/supabaseClient';

interface DeviceManagementProps {
  branchId?: string;
}

const DeviceManagement = ({ branchId }: DeviceManagementProps) => {
  const { settings, devices, isLoadingDevices, fetchDevices } = useHikvisionSettings();
  
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [isViewDoorsOpen, setIsViewDoorsOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<HikvisionDevice | null>(null);
  const [doors, setDoors] = useState<HikvisionDoor[]>([]);
  const [isLoadingDoors, setIsLoadingDoors] = useState(false);
  const [newDevice, setNewDevice] = useState({
    deviceName: '',
    deviceSerial: '',
    siteId: ''
  });
  const [sites, setSites] = useState<Array<{id: string, name: string}>>([]);
  const [isLoadingSites, setIsLoadingSites] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localDevices, setLocalDevices] = useState<any[]>([]);
  const [isLoadingLocalDevices, setIsLoadingLocalDevices] = useState(false);

  useEffect(() => {
    if (settings?.is_active) {
      fetchSites();
      fetchLocalDevices();
    }
  }, [settings?.is_active]);

  // Update local state when devices are fetched
  useEffect(() => {
    if (devices) {
      syncDevicesToDatabase(devices);
    }
  }, [devices]);

  const fetchSites = async () => {
    if (!settings) return;
    
    setIsLoadingSites(true);
    try {
      const siteList = await hikvisionService.getSites(settings);
      setSites(siteList.map((site: any) => ({ 
        id: site.id || site.siteId, 
        name: site.name || site.siteName 
      })));
    } catch (error) {
      console.error('Error fetching sites:', error);
      toast.error('Failed to load sites');
    } finally {
      setIsLoadingSites(false);
    }
  };

  const fetchLocalDevices = async () => {
    if (!branchId) return;
    
    setIsLoadingLocalDevices(true);
    try {
      const { data, error } = await supabase
        .from('access_doors')
        .select('*')
        .eq('branch_id', branchId);
        
      if (error) throw error;
      setLocalDevices(data || []);
    } catch (error) {
      console.error('Error fetching local devices:', error);
    } finally {
      setIsLoadingLocalDevices(false);
    }
  };

  const syncDevicesToDatabase = async (devices: HikvisionDevice[]) => {
    if (!settings || !branchId) return;
    
    try {
      // For each device, sync it to the database
      for (const device of devices) {
        // First check if device already exists in local DB
        const { data, error } = await supabase
          .from('access_doors')
          .select('*')
          .eq('hikvision_door_id', device.serialNumber)
          .eq('branch_id', branchId);
          
        if (error) throw error;
        
        if (!data || data.length === 0) {
          // Device doesn't exist, add it
          await supabase.from('access_doors').insert({
            branch_id: branchId,
            door_name: device.name,
            hikvision_door_id: device.serialNumber,
            is_active: device.isOnline,
            description: `${device.name} (${device.model || 'unknown model'})`
          });
        } else {
          // Device exists, update its status
          await supabase
            .from('access_doors')
            .update({
              is_active: device.isOnline,
              door_name: device.name
            })
            .eq('hikvision_door_id', device.serialNumber)
            .eq('branch_id', branchId);
        }
      }
      
      // Refresh local devices
      await fetchLocalDevices();
    } catch (error) {
      console.error('Error syncing devices to database:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDevice(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDevice = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      if (!newDevice.deviceName || !newDevice.deviceSerial || !newDevice.siteId) {
        toast.error('Please fill in all fields');
        return;
      }
      
      await hikvisionService.addDevice(settings, newDevice);
      toast.success('Device added successfully');
      setIsAddDeviceOpen(false);
      setNewDevice({ deviceName: '', deviceSerial: '', siteId: '' });
      
      // Refresh the devices list
      await fetchDevices();
    } catch (error) {
      console.error('Error adding device:', error);
      toast.error('Failed to add device');
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewDoors = async (device: HikvisionDevice) => {
    if (!settings) return;
    
    setSelectedDevice(device);
    setIsViewDoorsOpen(true);
    setIsLoadingDoors(true);
    
    try {
      const doorsList = await hikvisionService.getDoors(settings, device.serialNumber);
      setDoors(doorsList);
    } catch (error) {
      console.error('Error fetching doors:', error);
      toast.error('Failed to load doors');
    } finally {
      setIsLoadingDoors(false);
    }
  };

  if (!settings?.is_active) {
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
                  <TableHead>Device Name</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Doors</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.serialNumber}>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell>{device.serialNumber}</TableCell>
                    <TableCell>
                      <span className={`flex items-center text-xs px-2 py-1 rounded-full w-fit ${
                        device.isOnline ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {device.isOnline ? (
                          <><Check className="h-3 w-3 mr-1" /> Online</>
                        ) : (
                          <><X className="h-3 w-3 mr-1" /> Offline</>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>{device.doorCount || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDoors(device)}
                      >
                        <DoorOpen className="h-4 w-4 mr-1" /> View Doors
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
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="deviceName">Device Name</Label>
              <Input
                id="deviceName"
                name="deviceName"
                value={newDevice.deviceName}
                onChange={handleInputChange}
                placeholder="Main Entrance Controller"
              />
            </div>
            
            <div>
              <Label htmlFor="deviceSerial">Serial Number</Label>
              <Input
                id="deviceSerial"
                name="deviceSerial"
                value={newDevice.deviceSerial}
                onChange={handleInputChange}
                placeholder="DS-K2802"
              />
            </div>
            
            <div>
              <Label htmlFor="siteId">Site</Label>
              {isLoadingSites ? (
                <div className="flex items-center mt-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm">Loading sites...</span>
                </div>
              ) : (
                <select
                  id="siteId"
                  name="siteId"
                  className="w-full h-10 px-3 border border-input bg-background rounded-md"
                  value={newDevice.siteId}
                  onChange={(e) => setNewDevice(prev => ({ ...prev, siteId: e.target.value }))}
                >
                  <option value="">Select a site</option>
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>{site.name}</option>
                  ))}
                </select>
              )}
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
              onClick={handleAddDevice} 
              disabled={isSaving || !newDevice.deviceName || !newDevice.deviceSerial || !newDevice.siteId}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>Add Device</>
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
