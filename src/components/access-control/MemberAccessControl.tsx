
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Loader2, RefreshCw, FingerPrint, UserPlus, Key, UserX } from "lucide-react";
import { toast } from 'sonner';
import { supabase } from '@/services/supabaseClient';
import { useMemberAccess } from '@/hooks/use-member-access';
import { useHikvisionSettings } from '@/hooks/use-hikvision-settings';

interface MemberAccessControlProps {
  branchId?: string;
}

const MemberAccessControl = ({ branchId }: MemberAccessControlProps) => {
  const { settings } = useHikvisionSettings();
  const { registerMember, unregisterMember, grantAccess, revokeAccess, isProcessing } = useMemberAccess();
  
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [accessDoors, setAccessDoors] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAssignAccessOpen, setIsAssignAccessOpen] = useState(false);
  const [isRevokeAccessOpen, setIsRevokeAccessOpen] = useState(false);

  const [assignAccessForm, setAssignAccessForm] = useState({
    deviceId: '',
    doorIds: [] as number[],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  });

  // Fetch members and access doors
  useEffect(() => {
    if (branchId) {
      fetchMembers();
      fetchAccessDoors();
    }
  }, [branchId]);

  const fetchMembers = async () => {
    if (!branchId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('members')
        .select(`
          id,
          name,
          email,
          phone,
          gender,
          status,
          profile_picture
        `)
        .eq('branch_id', branchId)
        .eq('status', 'active');
        
      if (error) throw error;
      
      // Get access credentials for each member
      const membersWithCredentials = await Promise.all(data.map(async (member) => {
        const { data: credentials } = await supabase
          .from('member_access_credentials')
          .select('*')
          .eq('member_id', member.id)
          .eq('credential_type', 'hikvision_person_id')
          .eq('is_active', true)
          .maybeSingle();
          
        return {
          ...member,
          hasAccessCredential: !!credentials
        };
      }));
      
      setMembers(membersWithCredentials);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccessDoors = async () => {
    if (!branchId) return;
    
    try {
      const { data, error } = await supabase
        .from('access_doors')
        .select('*')
        .eq('branch_id', branchId)
        .eq('is_active', true);
        
      if (error) throw error;
      setAccessDoors(data);
    } catch (error) {
      console.error('Error fetching access doors:', error);
      toast.error('Failed to load access doors');
    }
  };

  const handleRegisterMember = async () => {
    if (!selectedMember) return;
    
    try {
      const success = await registerMember(selectedMember);
      if (success) {
        setIsRegisterOpen(false);
        fetchMembers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error registering member:', error);
      toast.error('Failed to register member');
    }
  };

  const handleUnregisterMember = async () => {
    if (!selectedMember) return;
    
    try {
      const success = await unregisterMember(selectedMember.id);
      if (success) {
        setIsRevokeAccessOpen(false);
        fetchMembers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error unregistering member:', error);
      toast.error('Failed to unregister member');
    }
  };

  const handleAssignAccess = async () => {
    if (!selectedMember || !assignAccessForm.deviceId) return;
    
    try {
      // Find the selected door
      const door = accessDoors.find(door => door.id === assignAccessForm.deviceId);
      if (!door) {
        toast.error('Selected door not found');
        return;
      }
      
      // Format dates for API
      const startTime = `${assignAccessForm.startDate}T00:00:00Z`;
      const endTime = `${assignAccessForm.endDate}T23:59:59Z`;
      
      // Default to door 1 if not specified
      const doorNumbers = assignAccessForm.doorIds.length > 0 
        ? assignAccessForm.doorIds 
        : [1];
      
      const success = await grantAccess(
        selectedMember.id,
        door.hikvision_door_id,
        doorNumbers,
        startTime,
        endTime
      );
      
      if (success) {
        setIsAssignAccessOpen(false);
        toast.success(`Access granted to ${selectedMember.name}`);
      }
    } catch (error) {
      console.error('Error assigning access:', error);
      toast.error('Failed to assign access');
    }
  };

  if (!settings?.is_active) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <FingerPrint className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Control Not Configured</h3>
            <p className="text-muted-foreground">
              Please configure and enable the Hikvision integration in settings
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading members...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Member Access Control</CardTitle>
            <CardDescription>Manage biometric access for gym members</CardDescription>
          </div>
          <Button onClick={() => fetchMembers()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Access Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No active members found
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.phone || member.email || 'No contact info'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.hasAccessCredential 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.hasAccessCredential ? 'Registered' : 'Not Registered'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {member.hasAccessCredential ? (
                        <div className="space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsAssignAccessOpen(true);
                            }}
                          >
                            <Key className="h-4 w-4 mr-1" /> Assign Access
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsRevokeAccessOpen(true);
                            }}
                          >
                            <UserX className="h-4 w-4 mr-1" /> Revoke
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMember(member);
                            setIsRegisterOpen(true);
                          }}
                        >
                          <UserPlus className="h-4 w-4 mr-1" /> Register
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Register Member Dialog */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register Member</DialogTitle>
            <DialogDescription>
              Register this member with the access control system
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center space-x-4 mb-4">
              {selectedMember?.profile_picture && (
                <img 
                  src={selectedMember.profile_picture} 
                  alt={selectedMember.name}
                  className="h-16 w-16 rounded-full object-cover" 
                />
              )}
              <div>
                <h3 className="font-medium text-lg">{selectedMember?.name}</h3>
                <p className="text-muted-foreground">
                  {selectedMember?.phone || selectedMember?.email || 'No contact info'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p>
                This will register the member in the Hikvision access control system.
                Once registered, you can assign access permissions to doors.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRegisterOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRegisterMember}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register Member
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Access Dialog */}
      <Dialog open={isAssignAccessOpen} onOpenChange={setIsAssignAccessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Access</DialogTitle>
            <DialogDescription>
              Grant access permissions for {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="deviceId">Access Door</Label>
              <Select
                value={assignAccessForm.deviceId}
                onValueChange={(value) => setAssignAccessForm(prev => ({ ...prev, deviceId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a door" />
                </SelectTrigger>
                <SelectContent>
                  {accessDoors.map((door) => (
                    <SelectItem key={door.id} value={door.id}>
                      {door.door_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  type="date"
                  id="startDate"
                  value={assignAccessForm.startDate}
                  onChange={(e) => setAssignAccessForm(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  type="date"
                  id="endDate"
                  value={assignAccessForm.endDate}
                  onChange={(e) => setAssignAccessForm(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label className="block mb-2">Door Numbers</Label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((doorNum) => (
                  <label key={doorNum} className="flex items-center space-x-2 border rounded-md p-2">
                    <input
                      type="checkbox"
                      checked={assignAccessForm.doorIds.includes(doorNum)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAssignAccessForm(prev => ({
                            ...prev,
                            doorIds: [...prev.doorIds, doorNum]
                          }));
                        } else {
                          setAssignAccessForm(prev => ({
                            ...prev,
                            doorIds: prev.doorIds.filter(id => id !== doorNum)
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-primary"
                    />
                    <span>Door {doorNum}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                If none selected, access will be granted to Door 1
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignAccessOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignAccess}
              disabled={isProcessing || !assignAccessForm.deviceId}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Grant Access
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Access Dialog */}
      <Dialog open={isRevokeAccessOpen} onOpenChange={setIsRevokeAccessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Access</DialogTitle>
            <DialogDescription>
              Remove {selectedMember?.name} from the access control system
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-2">
              <p className="text-amber-600 font-medium">Warning:</p>
              <p>
                This will remove the member's credentials from the access control system. 
                All assigned permissions will be revoked.
              </p>
              <p className="font-medium mt-4">
                Are you sure you want to continue?
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRevokeAccessOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleUnregisterMember}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Revoking...
                </>
              ) : (
                <>
                  <UserX className="h-4 w-4 mr-2" />
                  Revoke Access
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemberAccessControl;
