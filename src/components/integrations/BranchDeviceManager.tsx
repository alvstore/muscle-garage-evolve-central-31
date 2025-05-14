import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreVertical, Pencil, Trash2, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Branch } from '@/types/branch';

interface Device {
  id: string;
  name: string;
  type: string;
  ipAddress: string;
  branchId: string;
  status: 'online' | 'offline';
}

const mockDevices: Device[] = [
  {
    id: "1",
    name: "Main Entrance Scanner",
    type: "Access Control",
    ipAddress: "192.168.1.100",
    branchId: "1",
    status: "online",
  },
  {
    id: "2",
    name: "Gym Floor Camera",
    type: "Surveillance",
    ipAddress: "192.168.1.101",
    branchId: "1",
    status: "offline",
  },
  {
    id: "3",
    name: "Pool Area Scanner",
    type: "Access Control",
    ipAddress: "192.168.1.102",
    branchId: "2",
    status: "online",
  },
];

const MockBranches = [
  {
    id: 'br1',
    name: 'Main Branch',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    email: 'main@example.com',
    phone: '+1234567890',
    isActive: true,
    branch_code: 'NYC001'
  },
  {
    id: 'br2',
    name: 'Downtown Branch',
    address: '456 Market Street',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    email: 'downtown@example.com',
    phone: '+1987654321',
    isActive: true,
    branch_code: 'SFO002'
  },
  {
    id: 'br3',
    name: 'Suburban Branch',
    address: '789 Park Avenue',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    email: 'suburban@example.com',
    phone: '+1456789123',
    isActive: false,
    branch_code: 'CHI003'
  }
];

const BranchDeviceManager = () => {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [branches, setBranches] = useState<Branch[]>(MockBranches);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [newDevice, setNewDevice] = useState<{ name: string; type: string; ipAddress: string }>({
    name: "",
    type: "",
    ipAddress: "",
  });
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  useEffect(() => {
    // Simulate fetching branches from an API
    setTimeout(() => {
      setBranches(MockBranches);
    }, 500);
  }, []);

  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDevice(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDevice = () => {
    if (!selectedBranch) {
      toast.error("Please select a branch first.");
      return;
    }

    const newDeviceToAdd: Device = {
      id: `device-${Date.now()}`,
      name: newDevice.name,
      type: newDevice.type,
      ipAddress: newDevice.ipAddress,
      branchId: selectedBranch,
      status: "online",
    };

    setDevices([...devices, newDeviceToAdd]);
    setNewDevice({ name: "", type: "", ipAddress: "" });
    toast.success("Device added successfully!");
  };

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device);
    setNewDevice({ name: device.name, type: device.type, ipAddress: device.ipAddress });
    setSelectedBranch(device.branchId);
  };

  const handleUpdateDevice = () => {
    if (!editingDevice) return;

    const updatedDevices = devices.map(device =>
      device.id === editingDevice.id
        ? { ...device, name: newDevice.name, type: newDevice.type, ipAddress: newDevice.ipAddress }
        : device
    );

    setDevices(updatedDevices);
    setEditingDevice(null);
    setNewDevice({ name: "", type: "", ipAddress: "" });
    toast.success("Device updated successfully!");
  };

  const handleDeleteDevice = (id: string) => {
    setDevices(devices.filter(device => device.id !== id));
    toast.success("Device deleted successfully!");
  };

  const filteredDevices = selectedBranch
    ? devices.filter(device => device.branchId === selectedBranch)
    : devices;

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Branch Device Management</CardTitle>
          <CardDescription>
            Manage devices associated with each branch
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="branch">Select Branch</Label>
              <Select onValueChange={handleBranchChange}>
                <SelectTrigger className="w-full">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="deviceName">Device Name</Label>
              <Input
                type="text"
                id="deviceName"
                name="name"
                value={newDevice.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="deviceType">Device Type</Label>
              <Input
                type="text"
                id="deviceType"
                name="type"
                value={newDevice.type}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="ipAddress">IP Address</Label>
              <Input
                type="text"
                id="ipAddress"
                name="ipAddress"
                value={newDevice.ipAddress}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end">
            {editingDevice ? (
              <Button onClick={handleUpdateDevice}>Update Device</Button>
            ) : (
              <Button onClick={handleAddDevice}>Add Device</Button>
            )}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Device List</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDevices.map(device => (
                      <TableRow key={device.id}>
                        <TableCell>{device.name}</TableCell>
                        <TableCell>{device.type}</TableCell>
                        <TableCell>{device.ipAddress}</TableCell>
                        <TableCell>{device.status}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditDevice(device)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteDevice(device.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchDeviceManager;
