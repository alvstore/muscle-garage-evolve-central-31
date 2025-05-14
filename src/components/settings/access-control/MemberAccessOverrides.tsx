import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, Edit, Trash2, Clock, X, Calendar } from 'lucide-react';
import { format } from 'date-fns';

// Import Shadcn UI components
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface MemberAccessOverridesProps {
  branchId: string | null;
}

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
}

interface AccessZone {
  id: string;
  name: string;
  description?: string;
}

interface AccessOverride {
  id: string;
  member_id: string;
  zone_id: string;
  access_type: 'allowed' | 'denied' | 'scheduled';
  reason?: string;
  valid_from: string;
  valid_until?: string;
  schedule_start_time?: string;
  schedule_end_time?: string;
  schedule_days?: string[];
  member_name?: string;
  zone_name?: string;
  created_by?: string;
  created_at: string;
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

const MemberAccessOverrides = ({ branchId }: MemberAccessOverridesProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [accessZones, setAccessZones] = useState<AccessZone[]>([]);
  const [overrides, setOverrides] = useState<AccessOverride[]>([]);
  const [filteredOverrides, setFilteredOverrides] = useState<AccessOverride[]>([]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOverride, setEditingOverride] = useState<AccessOverride | null>(null);
  
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [accessType, setAccessType] = useState<'allowed' | 'denied' | 'scheduled'>('allowed');
  const [reason, setReason] = useState<string>('');
  const [validFrom, setValidFrom] = useState<Date>(new Date());
  const [validUntil, setValidUntil] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>('08:00');
  const [endTime, setEndTime] = useState<string>('20:00');
  const [selectedDays, setSelectedDays] = useState<string[]>(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('active');
  
  const [validationErrors, setValidationErrors] = useState<{
    member?: string;
    zone?: string;
    dates?: string;
    schedule?: string;
  }>({});

  useEffect(() => {
    if (branchId) {
      fetchMembers();
      fetchAccessZones();
      fetchOverrides();
    }
  }, [branchId]);

  useEffect(() => {
    filterOverrides();
  }, [overrides, searchQuery, filterStatus]);

  const fetchMembers = async () => {
    if (!branchId) return;
    
    try {
      // The members table uses branch_id instead of gym_id
      const { data, error } = await supabase
        .from('members')
        .select('id, name, email')
        .eq('branch_id', branchId)
        .order('name');
        
      if (error) throw error;
      
      // Map the data to match our expected format
      const processedMembers = (data || []).map(member => ({
        id: member.id,
        // Split the name into first and last name for display purposes
        first_name: member.name?.split(' ')[0] || '',
        last_name: member.name?.split(' ').slice(1).join(' ') || '',
        email: member.email
      }));
      
      setMembers(processedMembers);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members');
      toast.error('Failed to load members');
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

  const fetchOverrides = async () => {
    if (!branchId) return;
    
    try {
      setLoading(true);
      
      // Get the overrides using branch_id
      const { data, error } = await supabase
        .from('member_access_overrides')
        .select('*')
        .eq('branch_id', branchId);
        
      if (error) throw error;
      
      // Now get the names for members and zones to display
      const overridesWithNames = await Promise.all((data || []).map(async (override) => {
        // Get member name
        const { data: memberData } = await supabase
          .from('members')
          .select('name')
          .eq('id', override.member_id)
          .single();
          
        // Get zone name
        const { data: zoneData } = await supabase
          .from('access_zones')
          .select('name')
          .eq('id', override.zone_id)
          .single();
          
        // Split the name into first and last name for display purposes
        const firstName = memberData?.name?.split(' ')[0] || '';
        const lastName = memberData?.name?.split(' ').slice(1).join(' ') || '';
        
        return {
          ...override,
          member_name: memberData?.name ? memberData.name : 'Unknown Member',
          zone_name: zoneData?.name || 'Unknown Zone'
        };
      }));
      
      setOverrides(overridesWithNames);
    } catch (err) {
      console.error('Error fetching overrides:', err);
      setError('Failed to load access overrides');
      toast.error('Failed to load access overrides');
    } finally {
      setLoading(false);
    }
  };

  const filterOverrides = () => {
    let filtered = [...overrides];
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(override => 
        override.member_name?.toLowerCase().includes(query) ||
        override.zone_name?.toLowerCase().includes(query) ||
        override.reason?.toLowerCase().includes(query)
      );
    }
    
    // Filter by status
    const now = new Date();
    if (filterStatus === 'active') {
      filtered = filtered.filter(override => {
        const validUntil = override.valid_until ? new Date(override.valid_until) : null;
        return !validUntil || validUntil >= now;
      });
    } else if (filterStatus === 'expired') {
      filtered = filtered.filter(override => {
        const validUntil = override.valid_until ? new Date(override.valid_until) : null;
        return validUntil && validUntil < now;
      });
    }
    
    setFilteredOverrides(filtered);
  };

  const openAddDialog = () => {
    setEditingOverride(null);
    setSelectedMember('');
    setSelectedZone('');
    setAccessType('allowed');
    setReason('');
    setValidFrom(new Date());
    setValidUntil(undefined);
    setStartTime('08:00');
    setEndTime('20:00');
    setSelectedDays(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
    setValidationErrors({});
    setDialogOpen(true);
  };

  const openEditDialog = (override: AccessOverride) => {
    setEditingOverride(override);
    setSelectedMember(override.member_id);
    setSelectedZone(override.zone_id);
    setAccessType(override.access_type);
    setReason(override.reason || '');
    setValidFrom(new Date(override.valid_from));
    setValidUntil(override.valid_until ? new Date(override.valid_until) : undefined);
    setStartTime(override.schedule_start_time || '08:00');
    setEndTime(override.schedule_end_time || '20:00');
    setSelectedDays(override.schedule_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
    setValidationErrors({});
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const validateForm = () => {
    const errors: {
      member?: string;
      zone?: string;
      dates?: string;
      schedule?: string;
    } = {};
    
    if (!selectedMember) {
      errors.member = 'Please select a member';
    }
    
    if (!selectedZone) {
      errors.zone = 'Please select an access zone';
    }
    
    if (!validFrom) {
      errors.dates = 'Valid from date is required';
    }
    
    if (validUntil && validFrom && validUntil < validFrom) {
      errors.dates = 'Valid until date must be after valid from date';
    }
    
    if (accessType === 'scheduled') {
      if (!startTime || !endTime || selectedDays.length === 0) {
        errors.schedule = 'Please complete the schedule details';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveOverride = async () => {
    if (!branchId) return;
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const overrideData = {
        gym_id: branchId, // Using gym_id instead of branch_id
        member_id: selectedMember,
        zone_id: selectedZone,
        access_type: accessType,
        reason: reason.trim() || null,
        valid_from: validFrom.toISOString(),
        valid_until: validUntil ? validUntil.toISOString() : null,
        schedule_start_time: accessType === 'scheduled' ? startTime : null,
        schedule_end_time: accessType === 'scheduled' ? endTime : null,
        schedule_days: accessType === 'scheduled' ? selectedDays : null
      };
      
      if (editingOverride) {
        // Update existing override
        const { error } = await supabase
          .from('member_access_overrides')
          .update(overrideData)
          .eq('id', editingOverride.id);
          
        if (error) throw error;
        
        toast.success('Access override updated successfully');
      } else {
        // Create new override
        const { error } = await supabase
          .from('member_access_overrides')
          .insert(overrideData);
          
        if (error) throw error;
        
        toast.success('Access override created successfully');
      }
      
      closeDialog();
      fetchOverrides();
    } catch (err) {
      console.error('Error saving override:', err);
      toast.error('Failed to save access override');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOverride = async (overrideId: string) => {
    if (!branchId) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('member_access_overrides')
        .delete()
        .eq('id', overrideId);
        
      if (error) throw error;
      
      toast.success('Access override deleted successfully');
      fetchOverrides();
    } catch (err) {
      console.error('Error deleting override:', err);
      toast.error('Failed to delete access override');
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const isOverrideExpired = (override: AccessOverride) => {
    if (!override.valid_until) return false;
    return new Date(override.valid_until) < new Date();
  };

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? `${member.first_name} ${member.last_name}` : 'Unknown Member';
  };

  if (!branchId) {
    return (
      <div className="text-center p-4">
        Please select a branch to manage member access overrides
      </div>
    );
  }

  if (loading && overrides.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading access overrides...</span>
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
          <h2 className="text-2xl font-bold tracking-tight">Member Access Overrides</h2>
          <p className="text-muted-foreground">
            Configure special access permissions for individual members
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Override
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by member, zone or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as 'all' | 'active' | 'expired')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Overrides</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="expired">Expired Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Separator />
      
      {filteredOverrides.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                {overrides.length === 0 
                  ? 'No access overrides configured yet' 
                  : 'No overrides match your search criteria'}
              </p>
              {overrides.length === 0 && (
                <Button onClick={openAddDialog} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add your first override
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Access Zone</TableHead>
                  <TableHead>Access Type</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOverrides.map((override) => (
                  <TableRow key={override.id} className={isOverrideExpired(override) ? "opacity-60" : ""}>
                    <TableCell className="font-medium">{override.member_name}</TableCell>
                    <TableCell>{override.zone_name}</TableCell>
                    <TableCell>
                      <Badge variant={
                        override.access_type === 'allowed' ? 'success' : 
                        override.access_type === 'denied' ? 'destructive' : 
                        'outline'
                      }>
                        {override.access_type === 'allowed' ? 'Allowed' : 
                         override.access_type === 'denied' ? 'Denied' : 
                         'Scheduled'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="text-sm">
                          <span className="font-medium">From:</span> {formatDate(override.valid_from)}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Until:</span> {formatDate(override.valid_until)}
                        </div>
                        {isOverrideExpired(override) && (
                          <Badge variant="outline" className="w-fit">Expired</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {override.access_type === 'scheduled' ? (
                        <div className="flex flex-col gap-1">
                          <div className="text-sm">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {formatTimeRange(override.schedule_start_time, override.schedule_end_time)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDays(override.schedule_days)}
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
                                onClick={() => openEditDialog(override)}
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
                                onClick={() => handleDeleteOverride(override.id)}
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingOverride ? 'Edit Access Override' : 'Add Access Override'}
            </DialogTitle>
            <DialogDescription>
              Configure special access permissions for individual members
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="member">Member</Label>
              <Select 
                value={selectedMember} 
                onValueChange={setSelectedMember}
              >
                <SelectTrigger id="member">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {`${member.first_name} ${member.last_name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.member && (
                <p className="text-sm text-destructive">{validationErrors.member}</p>
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
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Override (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for this access override"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valid From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {validFrom ? format(validFrom, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={validFrom}
                      onSelect={(date) => date && setValidFrom(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Valid Until (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {validUntil ? format(validUntil, 'PPP') : 'No end date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="p-2">
                      <Button 
                        variant="ghost" 
                        className="mb-2"
                        onClick={() => setValidUntil(undefined)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear end date
                      </Button>
                    </div>
                    <CalendarComponent
                      mode="single"
                      selected={validUntil}
                      onSelect={(date) => date && setValidUntil(date)}
                      initialFocus
                      disabled={(date) => date < validFrom}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {validationErrors.dates && (
              <p className="text-sm text-destructive">{validationErrors.dates}</p>
            )}
            
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
            <Button onClick={handleSaveOverride} disabled={loading}>
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

export default MemberAccessOverrides;
