import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';

// Import Shadcn UI components
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DoorManagementProps {
  branchId: string | null;
}

interface Door {
  id: string;
  door_name: string;
  zone_id: string;
  device_id: string;
  hikvision_door_id: string;
  door_index?: number; // Door index in the Hikvision system
  door_channel?: number; // Door channel in the Hikvision system
  door_type?: 'access_control' | 'entrance' | 'exit' | 'emergency' | 'other';
  door_lock_type?: 'electromagnetic' | 'electric_strike' | 'electric_bolt' | 'other';
  open_duration?: number; // Door open duration in seconds
  is_active: boolean;
  branch_id: string;
  created_at: string;
  description?: string;
  access_zones?: {
    id: string;
    name: string;
  } | null;
}

interface Zone {
  id: string;
  name: string;
}

const DoorManagement = ({ branchId }: DoorManagementProps) => {
  const [doors, setDoors] = useState<Door[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDoor, setEditingDoor] = useState<Door | null>(null);
  const [doorName, setDoorName] = useState('');
  const [doorDescription, setDoorDescription] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [hikvisionDoorId, setHikvisionDoorId] = useState('');
  const [doorIndex, setDoorIndex] = useState<number | undefined>(undefined);
  const [doorChannel, setDoorChannel] = useState<number | undefined>(undefined);
  const [doorType, setDoorType] = useState<'access_control' | 'entrance' | 'exit' | 'emergency' | 'other'>('access_control');
  const [doorLockType, setDoorLockType] = useState<'electromagnetic' | 'electric_strike' | 'electric_bolt' | 'other'>('electromagnetic');
  const [openDuration, setOpenDuration] = useState<number>(5); // Default 5 seconds
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doorToDelete, setDoorToDelete] = useState<Door | null>(null);

  const fetchDoors = async () => {
    if (!branchId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('access_doors')
        .select(`
          id,
          door_name,
          zone_id,
          device_id,
          hikvision_door_id,
          is_active,
          branch_id,
          created_at,
          access_zones (
            id,
            name
          )
        `)
        .eq('branch_id', branchId)
        .order('door_name');
        
      if (error) {
        throw error;
      }
      
      // Process the data to ensure it matches our Door interface
      const processedData = (data || []).map(door => ({
        ...door,
        hikvision_door_id: door.hikvision_door_id || '',
        access_zones: door.access_zones?.[0] || null
      }));
      
      setDoors(processedData as Door[]);
    } catch (err) {
      console.error('Error fetching doors:', err);
      setError('Failed to load access doors. Please try again later.');
      toast.error('Failed to load access doors');
    } finally {
      setLoading(false);
    }
  };

  const fetchZones = async () => {
    if (!branchId) return;
    
    try {
      const { data, error } = await supabase
        .from('access_zones')
        .select('id, name')
        .eq('branch_id', branchId)
        .order('name');
        
      if (error) {
        throw error;
      }
      
      setZones(data || []);
    } catch (err) {
      console.error('Error fetching zones:', err);
      toast.error('Failed to load access zones');
    }
  };

  useEffect(() => {
    if (branchId) {
      fetchDoors();
      fetchZones();
    }
  }, [branchId]);

  const handleOpenDialog = (door?: Door) => {
    if (door) {
      setEditingDoor(door);
      setDoorName(door.door_name);
      setDoorDescription(door.description || '');
      setZoneId(door.zone_id);
      setDeviceId(door.device_id || '');
      setHikvisionDoorId(door.hikvision_door_id || '');
      setDoorIndex(door.door_index);
      setDoorChannel(door.door_channel);
      setDoorType(door.door_type || 'access_control');
      setDoorLockType(door.door_lock_type || 'electromagnetic');
      setOpenDuration(door.open_duration || 5);
      setIsActive(door.is_active);
    } else {
      setEditingDoor(null);
      setDoorName('');
      setDoorDescription('');
      setZoneId(zones.length > 0 ? zones[0].id : '');
      setDeviceId('');
      setHikvisionDoorId('');
      setDoorIndex(undefined);
      setDoorChannel(undefined);
      setDoorType('access_control');
      setDoorLockType('electromagnetic');
      setOpenDuration(5);
      setIsActive(true);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDoor(null);
    setDoorName('');
    setDoorDescription('');
    setZoneId('');
    setDeviceId('');
    setHikvisionDoorId('');
    setDoorIndex(undefined);
    setDoorChannel(undefined);
    setDoorType('access_control');
    setDoorLockType('electromagnetic');
    setOpenDuration(5);
    setIsActive(true);
  };

  const handleSaveDoor = async () => {
    if (!branchId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (!doorName.trim()) {
        toast.error('Door name is required');
        return;
      }
      
      if (!zoneId) {
        toast.error('Zone is required');
        return;
      }
      
      if (!hikvisionDoorId) {
        toast.error('Hikvision Door ID is required');
        return;
      }
      
      if (editingDoor) {
        // Update existing door
        const { error } = await supabase
          .from('access_doors')
          .update({
            door_name: doorName,
            description: doorDescription,
            zone_id: zoneId,
            device_id: deviceId,
            hikvision_door_id: hikvisionDoorId,
            door_index: doorIndex,
            door_channel: doorChannel,
            // Removing fields that don't exist in the database schema
            // door_type: doorType,
            // door_lock_type: doorLockType,
            // open_duration: openDuration,
            is_active: isActive,
          })
          .eq('id', editingDoor.id);
          
        if (error) {
          throw error;
        }
        
        toast.success('Door updated successfully');
      } else {
        // Create new door
        const { error } = await supabase
          .from('access_doors')
          .insert({
            door_name: doorName,
            description: doorDescription,
            zone_id: zoneId,
            device_id: deviceId,
            hikvision_door_id: hikvisionDoorId,
            door_index: doorIndex,
            door_channel: doorChannel,
            // Removing fields that don't exist in the database schema
            // door_type: doorType,
            // door_lock_type: doorLockType,
            // open_duration: openDuration,
            is_active: isActive,
            branch_id: branchId,
          });
          
        if (error) {
          throw error;
        }
        
        toast.success('Door created successfully');
      }
      
      handleCloseDialog();
      fetchDoors();
    } catch (err) {
      console.error('Error saving door:', err);
      toast.error('Failed to save door');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (door: Door) => {
    setDoorToDelete(door);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDoor = async () => {
    if (!doorToDelete) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('access_doors')
        .delete()
        .eq('id', doorToDelete.id);
        
      if (error) {
        throw error;
      }
      
      toast.success('Door deleted successfully');
      setDeleteDialogOpen(false);
      setDoorToDelete(null);
      fetchDoors();
    } catch (err) {
      console.error('Error deleting door:', err);
      toast.error('Failed to delete door');
    } finally {
      setLoading(false);
    }
  };

  const getZoneName = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone ? zone.name : 'Unknown Zone';
  };

  if (!branchId) {
    return (
      <div className="text-center p-4">
        Please select a branch to manage doors
      </div>
    );
  }

  if (zones.length === 0) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertDescription>
            Please create at least one access zone before adding doors.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Access Doors</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Door
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {doors.length === 0 ? (
        <Card>
          <CardContent className="text-center p-6">
            <p className="text-muted-foreground">No access doors found. Create your first door to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Door Name</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Device ID</TableHead>
                  <TableHead>Hikvision ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doors.map((door) => (
                  <TableRow key={door.id}>
                    <TableCell className="font-medium">{door.door_name}</TableCell>
                    <TableCell>{getZoneName(door.zone_id)}</TableCell>
                    <TableCell>{door.device_id || '-'}</TableCell>
                    <TableCell>{door.hikvision_door_id || '-'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${door.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {door.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenDialog(door)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteClick(door)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDoor ? 'Edit Door' : 'Add New Door'}</DialogTitle>
            <DialogDescription>
              {editingDoor 
                ? 'Update the details for this access door' 
                : 'Create a new access door for your facility'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="doorName">Door Name</Label>
              <Input
                id="doorName"
                value={doorName}
                onChange={(e) => setDoorName(e.target.value)}
                placeholder="e.g., Main Entrance, Pool Gate"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="doorZone">Zone</Label>
              <Select value={zoneId} onValueChange={setZoneId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deviceId">Device ID</Label>
                <Input
                  id="deviceId"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  placeholder="Enter device ID from Hikvision"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hikvisionDoorId">Hikvision Door ID</Label>
                <Input
                  id="hikvisionDoorId"
                  value={hikvisionDoorId}
                  onChange={(e) => setHikvisionDoorId(e.target.value)}
                  placeholder="Enter Hikvision Door ID"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doorIndex">Door Index</Label>
                <Input
                  id="doorIndex"
                  type="number"
                  value={doorIndex !== undefined ? doorIndex.toString() : ''}
                  onChange={(e) => setDoorIndex(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Door index in Hikvision system"
                />
                <p className="text-xs text-muted-foreground">The index of the door in the Hikvision system</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doorChannel">Door Channel</Label>
                <Input
                  id="doorChannel"
                  type="number"
                  value={doorChannel !== undefined ? doorChannel.toString() : ''}
                  onChange={(e) => setDoorChannel(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Door channel in Hikvision system"
                />
                <p className="text-xs text-muted-foreground">The channel of the door in the Hikvision system</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doorType">Door Type</Label>
                <Select value={doorType} onValueChange={(value) => setDoorType(value as any)}>
                  <SelectTrigger id="doorType">
                    <SelectValue placeholder="Select door type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="access_control">Access Control</SelectItem>
                    <SelectItem value="entrance">Entrance</SelectItem>
                    <SelectItem value="exit">Exit</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doorLockType">Lock Type</Label>
                <Select value={doorLockType} onValueChange={(value) => setDoorLockType(value as any)}>
                  <SelectTrigger id="doorLockType">
                    <SelectValue placeholder="Select lock type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electromagnetic">Electromagnetic</SelectItem>
                    <SelectItem value="electric_strike">Electric Strike</SelectItem>
                    <SelectItem value="electric_bolt">Electric Bolt</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="openDuration">Open Duration (seconds)</Label>
              <Input
                id="openDuration"
                type="number"
                min="1"
                max="60"
                value={openDuration.toString()}
                onChange={(e) => setOpenDuration(parseInt(e.target.value) || 5)}
                placeholder="Door open duration in seconds"
              />
              <p className="text-xs text-muted-foreground">How long the door should remain unlocked after access is granted</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="doorDescription">Description</Label>
              <Textarea
                id="doorDescription"
                value={doorDescription}
                onChange={(e) => setDoorDescription(e.target.value)}
                placeholder="Describe this access door"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveDoor} disabled={loading}>
              {editingDoor ? 'Update Door' : 'Create Door'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the door "{doorToDelete?.door_name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDoor}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DoorManagement;
