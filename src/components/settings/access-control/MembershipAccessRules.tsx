import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, Edit, Trash2, Clock, X } from 'lucide-react';

// Import Shadcn UI components
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MembershipAccessRulesProps {
  branchId: string | null;
}

interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
}

interface AccessZone {
  id: string;
  name: string;
  description?: string;
}

interface AccessPermission {
  id: string;
  membership_id: string;
  zone_id: string;
  access_type: 'allowed' | 'denied' | 'scheduled';
  schedule_start_time?: string;
  schedule_end_time?: string;
  schedule_days?: string[];
  membership_name?: string;
  zone_name?: string;
}

const weekdays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

const MembershipAccessRules = ({ branchId }: MembershipAccessRulesProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memberships, setMemberships] = useState<MembershipPlan[]>([]);
  const [accessZones, setAccessZones] = useState<AccessZone[]>([]);
  const [permissions, setPermissions] = useState<AccessPermission[]>([]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<AccessPermission | null>(null);
  
  const [selectedMembership, setSelectedMembership] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [accessType, setAccessType] = useState<'allowed' | 'denied' | 'scheduled'>('allowed');
  const [startTime, setStartTime] = useState<string>('08:00');
  const [endTime, setEndTime] = useState<string>('20:00');
  const [selectedDays, setSelectedDays] = useState<string[]>(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
  
  const [validationErrors, setValidationErrors] = useState<{
    membership?: string;
    zone?: string;
    schedule?: string;
  }>({});

  useEffect(() => {
    if (branchId) {
      fetchMemberships();
      fetchAccessZones();
      fetchPermissions();
    }
  }, [branchId]);

  const fetchMemberships = async () => {
    if (!branchId) return;
    
    try {
      const { data, error } = await supabase
        .from('memberships')
        .select('id, name, description')
        .eq('branch_id', branchId)
        .order('name');
        
      if (error) throw error;
      
      setMemberships(data || []);
    } catch (err) {
      console.error('Error fetching memberships:', err);
      setError('Failed to load membership plans');
      toast.error('Failed to load membership plans');
    }
  };

  const fetchAccessZones = async () => {
    if (!branchId) return;
    
    try {
      const { data, error } = await supabase
        .from('access_zones')
        .select('id, name, description')
        .eq('branch_id', branchId)
        .order('name');
        
      if (error) throw error;
      
      setAccessZones(data || []);
    } catch (err) {
      console.error('Error fetching access zones:', err);
      setError('Failed to load access zones');
      toast.error('Failed to load access zones');
    }
  };

  const fetchPermissions = async () => {
    if (!branchId) return;
    
    try {
      setLoading(true);
      
      // First get the permissions - note: membership_access_permissions doesn't have branch_id
      const { data, error } = await supabase
        .from('membership_access_permissions')
        .select('*');
        
      if (error) throw error;
      
      // Now get the names for memberships and zones to display
      const permissionsWithNames = await Promise.all((data || []).map(async (permission) => {
        // Get membership name
        const { data: membershipData } = await supabase
          .from('memberships')
          .select('name')
          .eq('id', permission.membership_id)
          .single();
          
        // Get zone name
        const { data: zoneData } = await supabase
          .from('access_zones')
          .select('name')
          .eq('id', permission.zone_id)
          .single();
          
        return {
          ...permission,
          membership_name: membershipData?.name || 'Unknown Membership',
          zone_name: zoneData?.name || 'Unknown Zone'
        };
      }));
      
      setPermissions(permissionsWithNames);
    } catch (err) {
      console.error('Error fetching permissions:', err);
      setError('Failed to load access permissions');
      toast.error('Failed to load access permissions');
    } finally {
      setLoading(false);
    }
  };

  const openAddDialog = () => {
    setEditingPermission(null);
    setSelectedMembership('');
    setSelectedZone('');
    setAccessType('allowed');
    setStartTime('08:00');
    setEndTime('20:00');
    setSelectedDays(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
    setValidationErrors({});
    setDialogOpen(true);
  };

  const openEditDialog = (permission: AccessPermission) => {
    setEditingPermission(permission);
    setSelectedMembership(permission.membership_id);
    setSelectedZone(permission.zone_id);
    setAccessType(permission.access_type);
    setStartTime(permission.schedule_start_time || '08:00');
    setEndTime(permission.schedule_end_time || '20:00');
    setSelectedDays(permission.schedule_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
    setValidationErrors({});
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const validateForm = () => {
    const errors: {
      membership?: string;
      zone?: string;
      schedule?: string;
    } = {};
    
    if (!selectedMembership) {
      errors.membership = 'Please select a membership plan';
    }
    
    if (!selectedZone) {
      errors.zone = 'Please select an access zone';
    }
    
    if (accessType === 'scheduled') {
      if (!startTime || !endTime || selectedDays.length === 0) {
        errors.schedule = 'Please complete the schedule details';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePermission = async () => {
    if (!branchId) return;
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Check if a permission already exists for this membership and zone
      const existingPermissionIndex = permissions.findIndex(
        p => p.membership_id === selectedMembership && 
             p.zone_id === selectedZone &&
             (editingPermission ? p.id !== editingPermission.id : true)
      );
      
      if (existingPermissionIndex >= 0) {
        toast.error('A permission already exists for this membership and zone');
        return;
      }
      
      const permissionData = {
        branch_id: branchId,
        membership_id: selectedMembership,
        zone_id: selectedZone,
        access_type: accessType,
        schedule_start_time: accessType === 'scheduled' ? startTime : null,
        schedule_end_time: accessType === 'scheduled' ? endTime : null,
        schedule_days: accessType === 'scheduled' ? selectedDays : null
      };
      
      if (editingPermission) {
        // Update existing permission
        const { error } = await supabase
          .from('membership_access_permissions')
          .update(permissionData)
          .eq('id', editingPermission.id);
          
        if (error) throw error;
        
        toast.success('Access permission updated successfully');
      } else {
        // Create new permission
        const { error } = await supabase
          .from('membership_access_permissions')
          .insert(permissionData);
          
        if (error) throw error;
        
        toast.success('Access permission created successfully');
      }
      
      closeDialog();
      fetchPermissions();
    } catch (err) {
      console.error('Error saving permission:', err);
      toast.error('Failed to save access permission');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePermission = async (permissionId: string) => {
    if (!branchId) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('membership_access_permissions')
        .delete()
        .eq('id', permissionId);
        
      if (error) throw error;
      
      toast.success('Access permission deleted successfully');
      fetchPermissions();
    } catch (err) {
      console.error('Error deleting permission:', err);
      toast.error('Failed to delete access permission');
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const formatTimeRange = (startTime?: string, endTime?: string) => {
    if (!startTime || !endTime) return 'N/A';
    return `${startTime} - ${endTime}`;
  };

  const formatDays = (days?: string[]) => {
    if (!days || days.length === 0) return 'No days selected';
    
    if (days.length === 7) return 'Every day';
    
    if (days.length === 5 && 
        days.includes('monday') && 
        days.includes('tuesday') && 
        days.includes('wednesday') && 
        days.includes('thursday') && 
        days.includes('friday') && 
        !days.includes('saturday') && 
        !days.includes('sunday')) {
      return 'Weekdays';
    }
    
    if (days.length === 2 && 
        days.includes('saturday') && 
        days.includes('sunday')) {
      return 'Weekends';
    }
    
    return days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ');
  };

  if (!branchId) {
    return (
      <div className="text-center p-4">
        Please select a branch to manage membership access rules
      </div>
    );
  }

  if (loading && permissions.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading access permissions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Membership Access Rules</h2>
          <p className="text-muted-foreground">
            Configure which membership plans have access to different zones
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Rule
        </Button>
      </div>
      
      <Separator />
      
      {permissions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">No access rules configured yet</p>
              <Button onClick={openAddDialog} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add your first rule
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membership Plan</TableHead>
                  <TableHead>Access Zone</TableHead>
                  <TableHead>Access Type</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">{permission.membership_name}</TableCell>
                    <TableCell>{permission.zone_name}</TableCell>
                    <TableCell>
                      <Badge variant={
                        permission.access_type === 'allowed' ? 'success' : 
                        permission.access_type === 'denied' ? 'destructive' : 
                        'outline'
                      }>
                        {permission.access_type === 'allowed' ? 'Allowed' : 
                         permission.access_type === 'denied' ? 'Denied' : 
                         'Scheduled'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {permission.access_type === 'scheduled' ? (
                        <div className="flex flex-col gap-1">
                          <div className="text-sm">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {formatTimeRange(permission.schedule_start_time, permission.schedule_end_time)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDays(permission.schedule_days)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openEditDialog(permission)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeletePermission(permission.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPermission ? 'Edit Access Rule' : 'Add Access Rule'}
            </DialogTitle>
            <DialogDescription>
              Configure access permissions for membership plans
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="membership">Membership Plan</Label>
              <Select 
                value={selectedMembership} 
                onValueChange={setSelectedMembership}
              >
                <SelectTrigger id="membership">
                  <SelectValue placeholder="Select a membership plan" />
                </SelectTrigger>
                <SelectContent>
                  {memberships.map((membership) => (
                    <SelectItem key={membership.id} value={membership.id}>
                      {membership.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.membership && (
                <p className="text-sm text-destructive">{validationErrors.membership}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zone">Access Zone</Label>
              <Select 
                value={selectedZone} 
                onValueChange={setSelectedZone}
              >
                <SelectTrigger id="zone">
                  <SelectValue placeholder="Select an access zone" />
                </SelectTrigger>
                <SelectContent>
                  {accessZones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.zone && (
                <p className="text-sm text-destructive">{validationErrors.zone}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="access-type">Access Type</Label>
              <Select 
                value={accessType} 
                onValueChange={(value) => setAccessType(value as 'allowed' | 'denied' | 'scheduled')}
              >
                <SelectTrigger id="access-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allowed">Always Allowed</SelectItem>
                  <SelectItem value="denied">Always Denied</SelectItem>
                  <SelectItem value="scheduled">Scheduled Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {accessType === 'scheduled' && (
              <div className="space-y-4 border rounded-md p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Days of the Week</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {weekdays.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`day-${day}`}
                          checked={selectedDays.includes(day)}
                          onCheckedChange={() => toggleDay(day)}
                        />
                        <Label htmlFor={`day-${day}`} className="capitalize">
                          {day}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {validationErrors.schedule && (
                  <p className="text-sm text-destructive">{validationErrors.schedule}</p>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={handleSavePermission} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembershipAccessRules;
