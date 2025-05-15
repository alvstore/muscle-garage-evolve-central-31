import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Branch } from '@/types';

interface Device {
  id: string;
  name: string;
  type: string;
  branch_id: string;
  is_active: boolean;
}

export function BranchDeviceManager() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceType, setNewDeviceType] = useState('access_control');
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isDeviceActive, setIsDeviceActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('devices')
          .select('*')
          .eq('branch_id', selectedBranchId);

        if (error) {
          console.error('Error fetching devices:', error);
          toast.error('Failed to load devices');
        } else {
          setDevices(data || []);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
        toast.error('Failed to load devices');
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedBranchId) {
      fetchDevices();
    }
  }, [selectedBranchId]);

  useEffect(() => {
    const storedBranchId = localStorage.getItem('selected_branch_id');
    if (storedBranchId) {
      setSelectedBranchId(storedBranchId);
    }
  }, []);

  useEffect(() => {
    if (selectedDeviceId) {
      const device = devices.find(d => d.id === selectedDeviceId);
      setIsDeviceActive(device?.is_active || false);
    }
  }, [selectedDeviceId, devices]);

  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);
    localStorage.setItem('selected_branch_id', branchId);
    setDevices([]);
  };

  const handleCreateDevice = async () => {
    if (!newDeviceName || !selectedBranchId) {
      toast.error('Device name and branch are required');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('devices')
        .insert([{
          name: newDeviceName,
          type: newDeviceType,
          branch_id: selectedBranchId,
          is_active: isDeviceActive,
        }])
        .select('*')
        .single();

      if (error) {
        console.error('Error creating device:', error);
        toast.error('Failed to create device');
      } else {
        setDevices([...devices, data]);
        setNewDeviceName('');
        toast.success('Device created successfully');
      }
    } catch (error) {
      console.error('Error creating device:', error);
      toast.error('Failed to create device');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeviceSelection = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
  };

  const handleDeviceStatusChange = async (checked: boolean) => {
    setIsDeviceActive(checked);

    if (!selectedDeviceId) {
      toast.error('No device selected');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('devices')
        .update({ is_active: checked })
        .eq('id', selectedDeviceId);

      if (error) {
        console.error('Error updating device status:', error);
        toast.error('Failed to update device status');
      } else {
        setDevices(devices.map(device =>
          device.id === selectedDeviceId ? { ...device, is_active: checked } : device
        ));
        toast.success('Device status updated successfully');
      }
    } catch (error) {
      console.error('Error updating device status:', error);
      toast.error('Failed to update device status');
    } finally {
      setIsLoading(false);
    }
  };

  const deviceTypes = [
    { value: 'access_control', label: 'Access Control' },
    { value: 'camera', label: 'Camera' },
    { value: 'sensor', label: 'Sensor' },
  ];

  // First define the variable before using it
  const branches = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      // Fetch branches logic
      return []; // Mock return for now
    }
  }).data || [];

  // Then use the branches variable
  const selectedBranch = branches.find(branch => branch.id === selectedBranchId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branch Device Management</CardTitle>
        <CardDescription>
          Manage devices associated with each branch
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="branch">Select Branch</Label>
          <Select onValueChange={handleBranchChange} value={selectedBranchId || ""}>
            <SelectTrigger id="branch">
              <SelectValue placeholder="Select a branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map(branch => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedBranch && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              Devices in {selectedBranch.name}
            </h3>
            <ul className="list-none pl-0">
              {devices.map(device => (
                <li
                  key={device.id}
                  className={`p-2 rounded-md cursor-pointer hover:bg-accent ${selectedDeviceId === device.id ? 'bg-accent' : ''}`}
                  onClick={() => handleDeviceSelection(device.id)}
                >
                  {device.name} ({device.type})
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="new-device-name">New Device Name</Label>
          <Input
            id="new-device-name"
            placeholder="Enter device name"
            value={newDeviceName}
            onChange={(e) => setNewDeviceName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-device-type">Device Type</Label>
          <Select onValueChange={setNewDeviceType} value={newDeviceType}>
            <SelectTrigger id="new-device-type">
              <SelectValue placeholder="Select device type" />
            </SelectTrigger>
            <SelectContent>
              {deviceTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleCreateDevice} disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Device'}
        </Button>

        {selectedDeviceId && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Device Settings</h3>
            <div className="flex items-center space-x-2">
              <Label htmlFor="device-status">Device Active</Label>
              <Switch
                id="device-status"
                checked={isDeviceActive}
                onCheckedChange={handleDeviceStatusChange}
                disabled={isLoading}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
