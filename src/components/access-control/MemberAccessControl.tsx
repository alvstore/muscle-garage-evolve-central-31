
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useHikvisionSettings } from '@/hooks/use-hikvision-settings';
import { Search, RefreshCw, Calendar, User, Door } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { toast } from 'sonner';

interface MemberAccessControlProps {
  branchId: string;
}

interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  membership_status?: string;
  membership_end_date?: string;
}

interface AccessPermission {
  id: string;
  doorName: string;
  doorId: string;
  validFrom?: Date;
  validTo?: Date;
  status: 'active' | 'inactive';
}

const MemberAccessControl: React.FC<MemberAccessControlProps> = ({ branchId }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [memberPermissions, setMemberPermissions] = useState<AccessPermission[]>([]);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 365),
  });

  // Access the Hikvision settings and devices
  const { 
    devices, 
    getDevices, 
    settings, 
    isConnected,
    getMemberAccess,
    syncMemberToDevice,
    assignAccessPrivileges
  } = useHikvisionSettings(branchId);

  // Load members
  useEffect(() => {
    if (branchId) {
      fetchMembers();
      getDevices(branchId);
    }
  }, [branchId, getDevices]);

  // Filter members based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredMembers(
        members.filter(
          (member) =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (member.phone && member.phone.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    } else {
      setFilteredMembers(members);
    }
  }, [searchTerm, members]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('members')
        .select('id, name, email, phone, membership_status, membership_end_date')
        .eq('branch_id', branchId)
        .eq('status', 'active')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      setMembers(data || []);
      setFilteredMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const handleShowPermissions = async (member: Member) => {
    setSelectedMember(member);
    
    try {
      // Fetch member permissions
      if (getMemberAccess) {
        const permissions = await getMemberAccess(member.id);
        
        if (permissions) {
          setMemberPermissions(permissions.map((perm: any) => ({
            id: perm.id,
            doorName: perm.access_doors?.door_name || 'Unknown Door',
            doorId: perm.door_id,
            validFrom: perm.valid_start_time ? new Date(perm.valid_start_time) : undefined,
            validTo: perm.valid_end_time ? new Date(perm.valid_end_time) : undefined,
            status: perm.status
          })));
        }
      }
      
      setShowPermissionDialog(true);
    } catch (error) {
      console.error('Error fetching member permissions:', error);
      toast.error('Failed to fetch access permissions');
    }
  };

  const handleSyncMember = (member: Member) => {
    setSelectedMember(member);
    setSyncDialogOpen(true);
  };

  const handleDoSync = async () => {
    if (!selectedMember || !selectedDeviceId) {
      toast.error('Please select a device');
      return;
    }
    
    try {
      const result = await syncMemberToDevice(selectedMember.id, selectedDeviceId);
      
      if (result.success) {
        toast.success(`Successfully synced ${selectedMember.name} to the device`);
        setSyncDialogOpen(false);
      } else {
        toast.error(`Failed to sync: ${result.message}`);
      }
    } catch (error) {
      console.error('Error syncing member:', error);
      toast.error('Failed to sync member to device');
    }
  };

  const assignDoorAccess = async (doorId: string) => {
    if (!selectedMember || !dateRange) {
      toast.error('Missing required information');
      return;
    }
    
    try {
      const result = await assignAccessPrivileges(
        selectedMember.id,
        doorId,
        dateRange.from?.toISOString(),
        dateRange.to?.toISOString()
      );
      
      if (result.success) {
        toast.success('Access permission granted');
        
        // Refresh permissions
        if (selectedMember && getMemberAccess) {
          const permissions = await getMemberAccess(selectedMember.id);
          
          if (permissions) {
            setMemberPermissions(permissions.map((perm: any) => ({
              id: perm.id,
              doorName: perm.access_doors?.door_name || 'Unknown Door',
              doorId: perm.door_id,
              validFrom: perm.valid_start_time ? new Date(perm.valid_start_time) : undefined,
              validTo: perm.valid_end_time ? new Date(perm.valid_end_time) : undefined,
              status: perm.status
            })));
          }
        }
      } else {
        toast.error(`Failed to assign access: ${result.message}`);
      }
    } catch (error) {
      console.error('Error assigning access:', error);
      toast.error('Failed to assign door access');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Member Access Control</CardTitle>
          <CardDescription>
            Manage members' access to controlled areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">Loading members...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No members found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>
                        {member.email && <div>{member.email}</div>}
                        {member.phone && <div className="text-muted-foreground">{member.phone}</div>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.membership_status === 'active' ? 'outline' : 'secondary'}>
                          {member.membership_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleShowPermissions(member)}
                          >
                            <Door className="h-4 w-4 mr-1" />
                            Permissions
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSyncMember(member)}
                            disabled={!isConnected}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Sync
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Member Permissions Dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedMember?.name} - Access Permissions
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Current Permissions */}
            <div>
              <h3 className="text-lg font-medium mb-2">Current Access</h3>
              {memberPermissions.length === 0 ? (
                <p className="text-muted-foreground">No access permissions set</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Door</TableHead>
                      <TableHead>Valid Period</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberPermissions.map((perm) => (
                      <TableRow key={perm.id}>
                        <TableCell>{perm.doorName}</TableCell>
                        <TableCell>
                          {perm.validFrom ? (
                            <>
                              {perm.validFrom.toLocaleDateString()} - {perm.validTo?.toLocaleDateString() || 'Forever'}
                            </>
                          ) : (
                            'No time limit'
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={perm.status === 'active' ? 'default' : 'secondary'}>
                            {perm.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            
            {/* Assign New Access */}
            <div>
              <h3 className="text-lg font-medium mb-2">Assign Access</h3>
              {isConnected ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valid Period</Label>
                      <DatePickerWithRange
                        value={dateRange}
                        onChange={setDateRange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Access Door</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {devices.flatMap(device => 
                          device.doors?.map(door => (
                            <div key={door.id} className="flex items-center justify-between border rounded p-2">
                              <div className="flex items-center space-x-2">
                                <Door className="h-4 w-4" />
                                <span>{door.doorName || 'Door ' + door.doorNumber}</span>
                              </div>
                              <Button 
                                size="sm"
                                onClick={() => assignDoorAccess(door.id)}
                              >
                                Grant Access
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Hikvision integration is not connected. Please configure it in settings.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowPermissionDialog(false)}>
              Close
            </Button>
            {isConnected && (
              <Button onClick={() => {
                setShowPermissionDialog(false);
                handleSyncMember(selectedMember!);
              }}>
                Sync Member
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sync Member Dialog */}
      <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sync Member to Device</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Select Device</Label>
              <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a device" />
                </SelectTrigger>
                <SelectContent>
                  {devices.map((device) => (
                    <SelectItem key={device.id} value={device.deviceId}>
                      {device.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedMember && (
              <div className="space-y-2">
                <Label>Member Information</Label>
                <div className="rounded-md border p-4">
                  <div className="flex items-center space-x-4">
                    <User className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{selectedMember.name}</h3>
                      {selectedMember.email && <p className="text-sm">{selectedMember.email}</p>}
                      {selectedMember.phone && <p className="text-sm text-muted-foreground">{selectedMember.phone}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSyncDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDoSync} disabled={!selectedDeviceId}>
              Sync Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberAccessControl;
