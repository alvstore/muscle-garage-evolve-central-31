
import React, { useState } from 'react';
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
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Loader2, Cpu, RefreshCw, CheckCircle, XCircle, PlusCircle, Trash2, Edit, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { HikvisionDevice } from '@/types/hikvision';

interface HikvisionDeviceManagerProps {
  siteId?: string;
}

const HikvisionDeviceManager: React.FC<HikvisionDeviceManagerProps> = ({ siteId }) => {
  const [devices, setDevices] = useState<HikvisionDevice[]>([
    // Sample devices for UI display
    {
      deviceId: 'dev001',
      deviceName: 'Main Entrance Controller',
      deviceType: 'access-control',
      deviceAddress: '192.168.1.100',
      devicePort: 8000,
      deviceStatus: 'online',
      serialNumber: 'AC2023001',
    },
    {
      deviceId: 'dev002',
      deviceName: 'Swimming Pool Access',
      deviceType: 'access-control',
      deviceAddress: '192.168.1.101',
      devicePort: 8000,
      deviceStatus: 'offline',
      serialNumber: 'AC2023002',
    },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<HikvisionDevice | null>(null);
  const [newDevice, setNewDevice] = useState<Partial<HikvisionDevice>>({
    deviceName: '',
    deviceAddress: '',
    devicePort: 8000,
    deviceUsername: '',
    devicePassword: '',
    deviceType: 'access-control'
  });
  
  const refreshDevices = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch devices from an API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Devices refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh devices:', error);
      toast.error('Failed to refresh devices. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const testDeviceConnection = async (device: HikvisionDevice) => {
    try {
      setSelectedDevice({...device, deviceStatus: 'unknown'});
      // Simulate API call to test connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 80% chance of success for demo purposes
      const success = Math.random() > 0.2;
      
      if (success) {
        setSelectedDevice({...device, deviceStatus: 'online'});
        toast.success(`Connection to ${device.deviceName} successful`);
        
        // Update devices list
        setDevices(devices.map(d => 
          d.deviceId === device.deviceId ? {...d, deviceStatus: 'online'} : d
        ));
      } else {
        setSelectedDevice({...device, deviceStatus: 'offline'});
        toast.error(`Failed to connect to ${device.deviceName}`);
        
        // Update devices list
        setDevices(devices.map(d => 
          d.deviceId === device.deviceId ? {...d, deviceStatus: 'offline'} : d
        ));
      }
    } catch (error) {
      console.error('Connection test error:', error);
      toast.error(`Error testing connection to ${device.deviceName}`);
      setSelectedDevice({...device, deviceStatus: 'offline'});
    }
  };
  
  const addDevice = () => {
    if (!newDevice.deviceName || !newDevice.deviceAddress) {
      toast.error('Device name and address are required');
      return;
    }
    
    const deviceId = `dev${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
    
    const device: HikvisionDevice = {
      deviceId,
      deviceName: newDevice.deviceName,
      deviceAddress: newDevice.deviceAddress,
      devicePort: newDevice.devicePort || 8000,
      deviceUsername: newDevice.deviceUsername,
      devicePassword: newDevice.devicePassword,
      deviceType: newDevice.deviceType || 'access-control',
      deviceStatus: 'unknown',
      serialNumber: `AC${new Date().getFullYear()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      createdTime: new Date().toISOString()
    };
    
    setDevices([...devices, device]);
    
    // Reset form
    setNewDevice({
      deviceName: '',
      deviceAddress: '',
      devicePort: 8000,
      deviceUsername: '',
      devicePassword: '',
      deviceType: 'access-control'
    });
    
    toast.success(`Device ${device.deviceName} added successfully`);
  };
  
  const deleteDevice = (deviceId: string) => {
    setDevices(devices.filter(d => d.deviceId !== deviceId));
    toast.success('Device deleted successfully');
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Access Control Devices</CardTitle>
            <CardDescription>
              Manage your Hikvision access control devices
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshDevices}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Device</DialogTitle>
                  <DialogDescription>
                    Add a new Hikvision access control device to your system.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="deviceName" className="text-right">
                      Device Name
                    </label>
                    <Input
                      id="deviceName"
                      value={newDevice.deviceName}
                      onChange={(e) => setNewDevice({...newDevice, deviceName: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="deviceAddress" className="text-right">
                      IP Address
                    </label>
                    <Input
                      id="deviceAddress"
                      value={newDevice.deviceAddress}
                      onChange={(e) => setNewDevice({...newDevice, deviceAddress: e.target.value})}
                      className="col-span-3"
                      placeholder="192.168.1.100"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="devicePort" className="text-right">
                      Port
                    </label>
                    <Input
                      id="devicePort"
                      type="number"
                      value={newDevice.devicePort}
                      onChange={(e) => setNewDevice({...newDevice, devicePort: parseInt(e.target.value)})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="deviceUsername" className="text-right">
                      Username
                    </label>
                    <Input
                      id="deviceUsername"
                      value={newDevice.deviceUsername}
                      onChange={(e) => setNewDevice({...newDevice, deviceUsername: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="devicePassword" className="text-right">
                      Password
                    </label>
                    <Input
                      id="devicePassword"
                      type="password"
                      value={newDevice.devicePassword}
                      onChange={(e) => setNewDevice({...newDevice, devicePassword: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={addDevice}>Add Device</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device Name</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.length > 0 ? (
              devices.map((device) => (
                <TableRow key={device.deviceId}>
                  <TableCell className="font-medium">{device.deviceName}</TableCell>
                  <TableCell>{device.deviceAddress}:{device.devicePort}</TableCell>
                  <TableCell>
                    {device.deviceStatus === 'online' ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" /> Online
                      </Badge>
                    ) : device.deviceStatus === 'offline' ? (
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" /> Offline
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">
                        Unknown
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{device.serialNumber}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testDeviceConnection(device)}
                        disabled={selectedDevice?.deviceId === device.deviceId && selectedDevice?.deviceStatus === 'unknown'}
                      >
                        {selectedDevice?.deviceId === device.deviceId && selectedDevice?.deviceStatus === 'unknown' ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RotateCw className="h-4 w-4" />
                        )}
                        <span className="sr-only">Test Connection</span>
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Device</DialogTitle>
                            <DialogDescription>
                              Update device information
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <p>Edit functionality would go here</p>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button>Close</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the device "{device.deviceName}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteDevice(device.deviceId)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Cpu className="h-12 w-12 mb-2" />
                    <h3 className="font-medium">No devices found</h3>
                    <p className="text-sm">Click "Add Device" to add your first device</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {devices.length > 0 ? (
            <>Total: {devices.length} devices | Online: {devices.filter(d => d.deviceStatus === 'online').length}</>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
};

export default HikvisionDeviceManager;
