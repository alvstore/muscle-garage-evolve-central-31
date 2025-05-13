import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';

// Import Shadcn UI components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  DialogTrigger,
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ZoneManagementProps {
  branchId: string | null;
}

interface Zone {
  id: string;
  name: string;
  description: string;
  branch_id: string;
  created_at: string;
}

const ZoneManagement = ({ branchId }: ZoneManagementProps) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [zoneName, setZoneName] = useState('');
  const [zoneDescription, setZoneDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState<Zone | null>(null);

  const fetchZones = async () => {
    if (!branchId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('access_zones')
        .select('*')
        .eq('branch_id', branchId)
        .order('name');
        
      if (error) {
        throw error;
      }
      
      setZones(data || []);
    } catch (err) {
      console.error('Error fetching zones:', err);
      setError('Failed to load access zones. Please try again later.');
      toast.error('Failed to load access zones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (branchId) {
      fetchZones();
    }
  }, [branchId]);

  const handleOpenDialog = (zone?: Zone) => {
    if (zone) {
      setEditingZone(zone);
      setZoneName(zone.name);
      setZoneDescription(zone.description);
    } else {
      setEditingZone(null);
      setZoneName('');
      setZoneDescription('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingZone(null);
    setZoneName('');
    setZoneDescription('');
  };

  const handleSaveZone = async () => {
    if (!branchId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (!zoneName.trim()) {
        toast.error('Zone name is required');
        return;
      }
      
      if (editingZone) {
        // Update existing zone
        const { error } = await supabase
          .from('access_zones')
          .update({
            name: zoneName,
            description: zoneDescription,
          })
          .eq('id', editingZone.id);
          
        if (error) {
          throw error;
        }
        
        toast.success('Zone updated successfully');
      } else {
        // Create new zone
        const { error } = await supabase
          .from('access_zones')
          .insert({
            name: zoneName,
            description: zoneDescription,
            branch_id: branchId,
          });
          
        if (error) {
          throw error;
        }
        
        toast.success('Zone created successfully');
      }
      
      handleCloseDialog();
      fetchZones();
    } catch (err) {
      console.error('Error saving zone:', err);
      toast.error('Failed to save zone');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (zone: Zone) => {
    setZoneToDelete(zone);
    setDeleteDialogOpen(true);
  };

  const handleDeleteZone = async () => {
    if (!zoneToDelete) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('access_zones')
        .delete()
        .eq('id', zoneToDelete.id);
        
      if (error) {
        throw error;
      }
      
      toast.success('Zone deleted successfully');
      setDeleteDialogOpen(false);
      setZoneToDelete(null);
      fetchZones();
    } catch (err) {
      console.error('Error deleting zone:', err);
      toast.error('Failed to delete zone');
    } finally {
      setLoading(false);
    }
  };

  if (!branchId) {
    return (
      <div className="text-center p-4">
        Please select a branch to manage zones
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Access Zones</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Zone
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {zones.length === 0 ? (
        <Card>
          <CardContent className="text-center p-6">
            <p className="text-muted-foreground">No access zones found. Create your first zone to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zone Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zones.map((zone) => (
                  <TableRow key={zone.id}>
                    <TableCell className="font-medium">{zone.name}</TableCell>
                    <TableCell>{zone.description}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenDialog(zone)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteClick(zone)}
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
            <DialogTitle>{editingZone ? 'Edit Zone' : 'Add New Zone'}</DialogTitle>
            <DialogDescription>
              {editingZone 
                ? 'Update the details for this access zone' 
                : 'Create a new access zone for your facility'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="zoneName">Zone Name</Label>
              <Input
                id="zoneName"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                placeholder="e.g., Main Gym, Swimming Pool"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zoneDescription">Description</Label>
              <Textarea
                id="zoneDescription"
                value={zoneDescription}
                onChange={(e) => setZoneDescription(e.target.value)}
                placeholder="Describe this access zone"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveZone} disabled={loading}>
              {editingZone ? 'Update Zone' : 'Create Zone'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the zone "{zoneToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteZone}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ZoneManagement;
