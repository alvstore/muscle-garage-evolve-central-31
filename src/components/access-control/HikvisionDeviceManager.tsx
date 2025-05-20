import React, { useState, useEffect, FC } from 'react';
import { useHikvisionSettings } from '@/hooks/use-hikvision-settings';
import { HikvisionDevice } from '@/types/settings/hikvision-types';
import { useBranch } from '@/hooks/settings/use-branches';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
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
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Loader2, Wifi, WifiOff, Trash2, Plus, TestTube2 } from 'lucide-react';

// Types
interface TestConnectionResult {
  success: boolean;
  message?: string;
  error?: string;
}

interface HikvisionDeviceManagerProps {
  siteId?: string;
  currentBranch?: {
    id: string;
    name: string;
  };
}

const HikvisionDeviceManager: React.FC<HikvisionDeviceManagerProps> = ({ siteId = '', currentBranch }) => {
  const { currentBranch: activeBranch } = useBranch();
  const branch = currentBranch || activeBranch;
  
  const { 
    devices = [], 
    fetchDevices, 
    testConnection, 
    isLoading: isDevicesLoading, 
    error: devicesError 
  } = useHikvisionSettings(branch?.id);
  
  const [selectedDevice, setSelectedDevice] = useState<HikvisionDevice | null>(null);
  const [newDevice, setNewDevice] = useState<Partial<HikvisionDevice>>({
    name: '',
    ipAddress: '',
    port: 8000,
    username: '',
    password: '',
    deviceType: 'entry',
    isActive: true,
    isCloudManaged: false,
    useIsupFallback: false,
    doors: []
  });
  
  const [isLoading, setLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestConnectionResult | null>(null);
  const [siteIdState, setSiteIdState] = useState<string>(siteId || '');
  const [devicesState, setDevicesState] = useState<HikvisionDevice[]>(devices);

  // Sync devices from props to local state
  useEffect(() => {
    if (devices) {
      setDevicesState(devices);
    }
  }, [devices]);
  
  // Fetch devices when branch changes
  useEffect(() => {
    if (branch?.id) {
      fetchDevices();
    }
  }, [branch?.id, fetchDevices]);

  // Handle branch changes
  useEffect(() => {
    if (branch?.id) {
      setSiteIdState(branch.id);
    }
  }, [branch]);
  
  // Handle device input changes
  const handleDeviceInputChange = (field: keyof HikvisionDevice, value: any) => {
    setNewDevice(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle device type change
  const handleDeviceTypeChange = (type: HikvisionDevice['deviceType']) => {
    setNewDevice(prev => ({
      ...prev,
      deviceType: type
    }));
  };
  
  // Handle test connection
  const handleTestConnection = async () => {
    if (!newDevice.ipAddress || !newDevice.username || !newDevice.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await testConnection({
        ipAddress: newDevice.ipAddress,
        username: newDevice.username,
        password: newDevice.password,
        port: newDevice.port
      });
      
      setTestResult(result);
      if (result.success) {
        toast.success('Connection successful!');
      } else {
        toast.error(`Connection failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast.error('Failed to test connection');
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const refreshDevices = async () => {
    try {
      await syncDevices();
    } catch (error) {
      console.error('Failed to refresh devices:', error);
      toast.error('Failed to refresh devices. Please try again.');
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDevice(prev => ({
      ...prev,
      [name]: name === 'port' ? parseInt(value, 10) : value
    }));
  };

  const handleDeviceTypeChange = (value: string) => {
    setNewDevice(prev => ({
      ...prev,
      deviceType: value as 'entry' | 'exit' | 'gym' | 'swimming' | 'special'
    }));
  };

  const testDeviceConnection = async (device: HikvisionDevice) => {
    try {
      setSelectedDevice(device);
      setIsTesting(true);
      
      const result: TestConnectionResult = await testConnection({
        apiUrl: device.ipAddress || '',
        appKey: device.username || '',
        appSecret: device.password || ''
      });
      
      if (result.success) {
        setSelectedDevice(device);
        toast.success(`Connection to ${device.name} successful`);
        
        // Update devices list
        await fetchDevices();
      } else {
        setSelectedDevice(device);
        toast.error(`Connection to ${device.name} failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setSelectedDevice(device);
      toast.error(`Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTesting(false);
    }
  };
  
  const handleAddDevice = async () => {
    if (!newDevice.name || !newDevice.ipAddress || !newDevice.port || !newDevice.username || !newDevice.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Test connection first
      const testResult: TestConnectionResult = await testConnection({

      setDevicesState(prevDevices => [...prevDevices, device]);
      setNewDevice({
        name: '',
        ipAddress: '',
        port: 8000,
        username: '',
        password: '',
        deviceType: 'entry',
        isActive: true,
        isCloudManaged: false,
        useIsupFallback: false,
        doors: []
      });
      toast.success('Device added successfully');
    } catch (error) {
      console.error('Error adding device:', error);
      toast.error('Failed to add device');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm('Are you sure you want to delete this device?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/hikvision/devices/${deviceId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete device');
      }
      
      // Refresh devices list
      await fetchDevices();
      toast.success('Device deleted successfully');
    } catch (error) {
      console.error('Error deleting device:', error);
      toast.error(`Failed to delete device: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteDevice = (deviceId: string) => {
    setDevices(devices.filter(d => d.id !== deviceId));
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
