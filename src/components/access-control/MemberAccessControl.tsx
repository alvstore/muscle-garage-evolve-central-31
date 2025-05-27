
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Users, 
  Plus, 
  Search, 
  Shield, 
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useHikvisionSettings } from '@/hooks/use-hikvision-settings';

interface MemberAccess {
  id: string;
  memberName: string;
  memberId: string;
  email: string;
  accessStatus: 'active' | 'inactive' | 'pending';
  lastAccess: string | null;
  devices: string[];
}

interface MemberAccessControlProps {
  branchId: string;
}

const MemberAccessControl: React.FC<MemberAccessControlProps> = ({ branchId }) => {
  const [members, setMembers] = useState<MemberAccess[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<MemberAccess | null>(null);
  
  const { 
    settings, 
    isLoading: settingsLoading 
  } = useHikvisionSettings(branchId);

  useEffect(() => {
    if (branchId) {
      fetchMembers();
    }
  }, [branchId]);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      
      // Mock data for demonstration
      const mockMembers: MemberAccess[] = [
        {
          id: '1',
          memberName: 'John Doe',
          memberId: 'MEM001',
          email: 'john.doe@example.com',
          accessStatus: 'active',
          lastAccess: new Date().toISOString(),
          devices: ['Main Entry', 'Gym Floor']
        },
        {
          id: '2',
          memberName: 'Jane Smith',
          memberId: 'MEM002',
          email: 'jane.smith@example.com',
          accessStatus: 'pending',
          lastAccess: null,
          devices: []
        }
      ];
      
      setMembers(mockMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to fetch member access data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncMember = async (member: MemberAccess) => {
    try {
      console.log('Syncing member to Hikvision devices:', member.memberId);
      
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update member status
      setMembers(prev => prev.map(m => 
        m.id === member.id 
          ? { ...m, accessStatus: 'active' as const }
          : m
      ));
      
      toast.success(`Member ${member.memberName} synced successfully`);
    } catch (error) {
      console.error('Error syncing member:', error);
      toast.error('Failed to sync member');
    }
  };

  const handleRevokeAccess = async (member: MemberAccess) => {
    try {
      console.log('Revoking access for member:', member.memberId);
      
      // Simulate revoke process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update member status
      setMembers(prev => prev.map(m => 
        m.id === member.id 
          ? { ...m, accessStatus: 'inactive' as const }
          : m
      ));
      
      toast.success(`Access revoked for ${member.memberName}`);
    } catch (error) {
      console.error('Error revoking access:', error);
      toast.error('Failed to revoke access');
    }
  };

  const filteredMembers = members.filter(member =>
    member.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'inactive':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (settingsLoading || !settings?.isActive) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Control Not Configured</h3>
            <p className="text-muted-foreground">
              Please configure Hikvision settings first to manage member access
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Member Access Control
          </CardTitle>
          <CardDescription>
            Manage member access to Hikvision devices and monitor entry/exit events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={fetchMembers} disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Sync All Members
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 rounded-full border-4 border-t-accent animate-spin"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Access</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{member.memberName}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{member.memberId}</TableCell>
                    <TableCell>{getStatusBadge(member.accessStatus)}</TableCell>
                    <TableCell>
                      {member.lastAccess 
                        ? new Date(member.lastAccess).toLocaleDateString()
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {member.devices.map((device, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {device}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {member.accessStatus === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleSyncMember(member)}
                            disabled={isLoading}
                          >
                            Sync
                          </Button>
                        )}
                        {member.accessStatus === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRevokeAccess(member)}
                            disabled={isLoading}
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {filteredMembers.length === 0 && !isLoading && (
            <div className="text-center py-10 text-muted-foreground">
              No members found matching your search criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberAccessControl;
