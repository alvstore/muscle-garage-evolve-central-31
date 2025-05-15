
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useHikvision } from '@/hooks/use-hikvision';
import { Loader2, Plus, Trash2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HikvisionDevicesProps {
  branchId: string;
}

export default function HikvisionDevices({ branchId }: HikvisionDevicesProps) {
  const { 
    isLoading, 
    settings, 
    fetchSettings, 
    addDevice,
    removeDevice,
    getToken
  } = useHikvision({ branchId });

  const [newDevice, setNewDevice] = useState({
    deviceName: '',
    deviceType: 'entry',
    serialNumber: '',
    ipAddress: '',
    location: ''
  });
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isTestingDevice, setIsTestingDevice] = useState(false);
  const [deviceTestStatus, setDeviceTestStatus] = useState<{ id: string, status: 'success' | 'error' | 'pending' }[]>([]);

  useEffect(() => {
    if (branchId) {
      fetchSettings(branchId);
    }
  }, [branchId, fetchSettings]);

  const handleAddDevice = async () => {
    setIsAddingDevice(true);
    try {
      // Validate inputs
      if (!newDevice.deviceName || !newDevice.serialNumber) {
        toast({
          title: "Error",
          description: 'Device name and serial number are required',
          variant: "destructive",
        });
        return;
      }

      const success = await addDevice({
        deviceName: newDevice.deviceName,
        deviceType: newDevice.deviceType,
        serialNumber: newDevice.serialNumber,
        ipAddress: newDevice.ipAddress || undefined,
        location: newDevice.location || undefined
      }, branchId);

      if (success) {
        setDialogOpen(false);
        setNewDevice({
          deviceName: '',
          deviceType: 'entry',
          serialNumber: '',
          ipAddress: '',
          location: ''
        });
      }
    } finally {
      setIsAddingDevice(false);
    }
  };

  const handleDelete = async (deviceId: string) => {
    if (confirm('Are you sure you want to delete this device?')) {
      await removeDevice(deviceId, branchId);
    }
  };

  const testDevice = async (device: any) => {
    try {
      setIsTestingDevice(true);
      setDeviceTestStatus(prev => [...prev, { id: device.id, status: 'pending' }]);
      
      // Get a token
      const token = await getToken(branchId);
      if (!token) {
        toast({
          title: "Error",
          description: "Failed to get access token",
          variant: "destructive",
        });
        setDeviceTestStatus(prev => 
          prev.map(item => item.id === device.id ? { ...item, status: 'error' } : item)
        );
        return;
      }
      
      // Test device connection
      const response = await fetch(`${device.ipAddress}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.log('Device test failed:', response.status);
        setDeviceTestStatus(prev => 
          prev.map(item => item.id === device.id ? { ...item, status: 'error' } : item)
        );
        return;
      }
      
      setDeviceTestStatus(prev => 
        prev.map(item => item.id === device.id ? { ...item, status: 'success' } : item)
      );
      toast({
        title: "Success",
        description: "Device connection successful",
      });
    } catch (error) {
      console.error('Error testing device:', error);
      setDeviceTestStatus(prev => 
        prev.map(item => item.id === device.id ? { ...item, status: 'error' } : item)
      );
      toast({
        title: "Error",
        description: "Failed to test device connection",
        variant: "destructive",
      });
    } finally {
      setIsTestingDevice(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hikvision Devices</CardTitle>
        <CardDescription>
          Configure access control devices for your gym
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Access Control Device</DialogTitle>
                <DialogDescription>
                  Enter the details for the new Hikvision device
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="device-name">Device Name</Label>
                  <Input 
                    id="device-name" 
                    value={newDevice.deviceName} 
                    onChange={(e) => setNewDevice({...newDevice, deviceName: e.target.value})}
                    placeholder="Main Entrance"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="device-type">Device Type</Label>
                  <Select 
                    value={newDevice.deviceType} 
                    onValueChange={(value) => setNewDevice({...newDevice, deviceType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Gate</SelectItem>
                      <SelectItem value="exit">Exit Gate</SelectItem>
                      <SelectItem value="gym">Gym Access</SelectItem>
                      <SelectItem value="swimming">Swimming Pool</SelectItem>
                      <SelectItem value="special">Special Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="serial-number">Serial Number</Label>
                  <Input 
                    id="serial-number" 
                    value={newDevice.serialNumber} 
                    onChange={(e) => setNewDevice({...newDevice, serialNumber: e.target.value})}
                    placeholder="DS-K1T341AMFX202201X012345"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ip-address">IP Address (Optional)</Label>
                  <Input 
                    id="ip-address" 
                    value={newDevice.ipAddress} 
                    onChange={(e) => setNewDevice({...newDevice, ipAddress: e.target.value})}
                    placeholder="192.168.1.100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input 
                    id="location" 
                    value={newDevice.location} 
                    onChange={(e) => setNewDevice({...newDevice, location: e.target.value})}
                    placeholder="Front door"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleAddDevice} 
                  disabled={isAddingDevice || !newDevice.deviceName || !newDevice.serialNumber}
                >
                  {isAddingDevice ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Device'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : settings?.devices && settings.devices.length > 0 ? (
          <div className="space-y-4">
            <div className="rounded-md border">
              <div className="grid grid-cols-6 gap-4 border-b bg-muted p-3 font-medium">
                <div className="col-span-2">Name</div>
                <div>Type</div>
                <div>Serial Number</div>
                <div>Location</div>
                <div className="text-right">Actions</div>
              </div>
              <div className="divide-y">
                {settings.devices.map((device: any) => (
                  <div key={device.id || device.serialNumber} className="grid grid-cols-6 gap-4 p-3">
                    <div className="col-span-2 flex items-center">
                      {device.deviceName}
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline">
                        {device.deviceType || 'Unknown'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm">
                      {device.serialNumber}
                    </div>
                    <div className="flex items-center">
                      {device.location || '--'}
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => testDevice(device)}
                        disabled={isTestingDevice}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleDelete(device.id || device.serialNumber)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No devices have been added yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add a device to start tracking member attendance automatically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
