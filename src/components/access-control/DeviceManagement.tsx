import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { HardDriveIcon, Plus, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { useHikvisionSettings } from '@/hooks/access/use-hikvision-settings';
import HikvisionDeviceManager from './HikvisionDeviceManager';

interface Device {
  id: string;
  name: string;
  serialNumber: string;
  ipAddress: string;
  status: 'online' | 'offline';
  lastSeen: string;
  type: string;
}

interface DeviceManagementProps {
  branchId: string;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ branchId }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDevice, setShowAddDevice] = useState(false);
  
  const { settings, isLoading: settingsLoading } = useHikvisionSettings(branchId);

  useEffect(() => {
    if (branchId && settings?.isActive) {
      fetchDevices();
    }
  }, [branchId, settings]);

  const fetchDevices = async () => {
    try {
      setIsLoading(true);
      
      // Mock devices for demonstration
      const mockDevices: Device[] = [
        {
          id: '1',
          name: 'Main Entrance',
          serialNumber: 'DS-K1T331W-001',
          ipAddress: '192.168.1.100',
          status: 'online',
          lastSeen: new Date().toISOString(),
          type: 'Face Recognition Terminal'
        },
        {
          id: '2',
          name: 'Gym Floor Entry',
          serialNumber: 'DS-K1T331W-002',
          ipAddress: '192.168.1.101',
          status: 'offline',
          lastSeen: new Date(Date.now() - 3600000).toISOString(),
          type: 'Card Reader'
        }
      ];
      
      setDevices(mockDevices);
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast.error('Failed to fetch devices');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'online' ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <Wifi className="h-3 w-3 mr-1" />
        Online
      </Badge>
    ) : (
      <Badge variant="destructive">
        <WifiOff className="h-3 w-3 mr-1" />
        Offline
      </Badge>
    );
  };

  if (settingsLoading || !settings?.isActive) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <HardDriveIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Device Management Not Available</h3>
            <p className="text-muted-foreground">
              Please configure and activate Hikvision integration first
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showAddDevice) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add New Device</h2>
          <Button variant="outline" onClick={() => setShowAddDevice(false)}>
            Back to Devices
          </Button>
        </div>
        <HikvisionDeviceManager 
          settings={{
            app_key: settings.appKey || '',
            app_secret: settings.appSecret || ''
          }} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HardDriveIcon className="h-5 w-5" />
                Device Management
              </CardTitle>
              <CardDescription>
                Monitor and manage Hikvision access control devices
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddDevice(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 rounded-full border-4 border-t-accent animate-spin"></div>
            </div>
          ) : devices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device Name</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell>{device.serialNumber}</TableCell>
                    <TableCell>{device.ipAddress}</TableCell>
                    <TableCell>{device.type}</TableCell>
                    <TableCell>{getStatusBadge(device.status)}</TableCell>
                    <TableCell>
                      {new Date(device.lastSeen).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <HardDriveIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Devices Found</h3>
              <p className="text-muted-foreground mb-4">
                Add your first Hikvision device to get started
              </p>
              <Button onClick={() => setShowAddDevice(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceManagement;
