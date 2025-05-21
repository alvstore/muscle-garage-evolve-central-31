import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/settings/use-branches';
import { hikvisionService } from '@/services/access-control/hikvisionService';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from 'lucide-react';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Define the form validation schema
const deviceFormSchema = z.object({
  name: z.string().min(2, {
    message: "Device name must be at least 2 characters.",
  }),
  serialNumber: z.string().min(5, {
    message: "Serial number must be at least 5 characters.",
  }),
  ipAddress: z.string().ip({ message: "Invalid IP address." }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

// Define the type for the form values
type DeviceFormValues = z.infer<typeof deviceFormSchema>

// Define the type for the device data
type Device = {
  id: string;
  device_id: string;
  name: string;
  ip_address: string;
  username: string;
  password?: string;
  status: 'active' | 'inactive';
  branch_id?: string;
  created_at?: string;
}

interface HikvisionDeviceManagerProps {
  settings: {
    app_key: string;
    app_secret: string;
  } | null;
}

const HikvisionDeviceManager: React.FC<HikvisionDeviceManagerProps> = ({ settings }) => {
  const [addDeviceOpen, setAddDeviceOpen] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentBranch } = useBranch();

  // Initialize the form using useForm hook
  const deviceForm = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues: {
      name: "",
      serialNumber: "",
      ipAddress: "",
      username: "",
      password: "",
    },
  })

  useEffect(() => {
    fetchDevices();
  }, [currentBranch?.id]);

  const fetchDevices = async () => {
    try {
      if (!currentBranch?.id) {
        setDevices([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('hikvision_devices')
        .select('*')
        .eq('branch_id', currentBranch.id);
      
      if (error) throw error;
      setDevices(data || []);
    } catch (error: any) {
      console.error("Error fetching devices:", error);
      toast.error(error.message || "Failed to fetch devices");
    }
  };

  const handleDeviceAdd = async (values: DeviceFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Check if API settings are configured
      if (!settings || !settings.app_key || !settings.app_secret) {
        toast.error("API settings must be configured first");
        setIsSubmitting(false);
        return;
      }
      
      // Add device to Hikvision system
      const result = await hikvisionService.addDevice({
        name: values.name,
        serialNumber: values.serialNumber,
        ipAddress: values.ipAddress,
        password: values.password,
        username: values.username
      });
      
      if (result.error) {
        toast.error(`Failed to add device: ${result.error}`);
        setIsSubmitting(false);
        return;
      }
      
      // Save device to database
      const { data, error } = await supabase
        .from('hikvision_devices')
        .insert({
          device_id: values.serialNumber,
          name: values.name,
          ip_address: values.ipAddress,
          username: values.username,
          password: values.password,
          status: 'active',
          branch_id: currentBranch?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success("Device added successfully");
      fetchDevices();
      setAddDeviceOpen(false);
    } catch (error: any) {
      console.error("Error adding device:", error);
      toast.error(error.message || "Failed to add device");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeviceDelete = async (deviceId: string) => {
    if (!window.confirm("Are you sure you want to delete this device?")) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Delete device from Hikvision system
      const result = await hikvisionService.deleteDevice(deviceId);
      if (result.error) {
        toast.error(`Failed to delete device: ${result.error}`);
        setIsSubmitting(false);
        return;
      }
      
      // Delete device from database
      const { error } = await supabase
        .from('hikvision_devices')
        .delete()
        .eq('device_id', deviceId);
      
      if (error) throw error;
      
      toast.success("Device deleted successfully");
      fetchDevices();
    } catch (error: any) {
      console.error("Error deleting device:", error);
      toast.error(error.message || "Failed to delete device");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeviceStatusChange = async (deviceId: string, status: 'active' | 'inactive') => {
    try {
      setIsSubmitting(true);
      
      // Update device status in Hikvision system
      const result = await hikvisionService.updateDeviceStatus(deviceId, status);
      if (result.error) {
        toast.error(`Failed to update device status: ${result.error}`);
        setIsSubmitting(false);
        return;
      }
      
      // Update device status in database
      const { error } = await supabase
        .from('hikvision_devices')
        .update({ status })
        .eq('device_id', deviceId);
      
      if (error) throw error;
      
      toast.success("Device status updated successfully");
      fetchDevices();
    } catch (error: any) {
      console.error("Error updating device status:", error);
      toast.error(error.message || "Failed to update device status");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Hikvision Device Management</h2>
        <Button onClick={() => setAddDeviceOpen(true)}>Add Device</Button>
      </div>

      <Table>
        <TableCaption>A list of your devices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Device ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.map((device) => (
            <TableRow key={device.device_id}>
              <TableCell className="font-medium">{device.device_id}</TableCell>
              <TableCell>{device.name}</TableCell>
              <TableCell>{device.ip_address}</TableCell>
              <TableCell>{device.username}</TableCell>
              <TableCell>
                <Badge variant={device.status === 'active' ? 'default' : 'secondary'}>
                  {device.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleDeviceDelete(device.device_id)}>
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <div className="flex items-center space-x-2">
                        <span>Set Status:</span>
                        <Switch
                          checked={device.status === 'active'}
                          onCheckedChange={(checked) => {
                            const newStatus = checked ? 'active' : 'inactive';
                            handleDeviceStatusChange(device.device_id, newStatus);
                          }}
                        />
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>
              {devices.length} device(s)
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Dialog open={addDeviceOpen} onOpenChange={setAddDeviceOpen}>
        <DialogTrigger asChild>
          <Button>Add Device</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Hikvision Device</DialogTitle>
            <DialogDescription>
              Add a new Hikvision device to the system.
            </DialogDescription>
          </DialogHeader>
          <Form {...deviceForm}>
            <form onSubmit={deviceForm.handleSubmit(handleDeviceAdd)} className="space-y-4">
              <FormField
                control={deviceForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Device Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={deviceForm.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Serial Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={deviceForm.control}
                name="ipAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Address</FormLabel>
                    <FormControl>
                      <Input placeholder="IP Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={deviceForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={deviceForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Device"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HikvisionDeviceManager;
