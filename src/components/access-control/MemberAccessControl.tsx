
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useHikvision } from '@/hooks/use-hikvision';
import { useBranch } from '@/hooks/use-branch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, UserCheck, UserX } from 'lucide-react';
import { memberService } from '@/services/memberService';
import { Member } from '@/types/member';

interface MemberAccessStatus {
  id: string;
  member_id: string;
  hikvision_person_id: string;
  device_serial: string;
  face_registered: boolean;
  card_registered: boolean;
  fingerprint_registered: boolean;
}

export default function MemberAccessControl() {
  const { currentBranch } = useBranch();
  const { memberAccess, settings } = useHikvision({ branchId: currentBranch?.id });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accessDetails, setAccessDetails] = useState<MemberAccessStatus[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSearch = async () => {
    if (!searchQuery.trim() || !currentBranch?.id) return;
    
    setIsLoading(true);
    try {
      const members = await memberService.getMembersByBranch(currentBranch.id);
      
      // Find member by name, email, or phone
      const found = members.find(m => 
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone?.includes(searchQuery)
      );
      
      if (found) {
        setSelectedMember(found);
        // Load access details if found
        if (found.id) {
          const accessStatus = await memberAccess.getStatus(found.id);
          setAccessDetails(accessStatus);
        }
      } else {
        setSelectedMember(null);
        setAccessDetails([]);
      }
    } catch (error) {
      console.error('Error searching for member:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSyncMember = async () => {
    if (!selectedMember?.id || !currentBranch?.id) return;
    
    setIsProcessing(true);
    try {
      // Get device serials from settings
      const deviceSerials = settings?.devices?.map(d => d.serialNumber) || [];
      
      if (deviceSerials.length === 0) {
        alert('No devices configured. Please add devices first.');
        return;
      }
      
      // Sync member to all devices
      await memberAccess.syncMember(selectedMember.id, deviceSerials);
      
      // Refresh access details
      const accessStatus = await memberAccess.getStatus(selectedMember.id);
      setAccessDetails(accessStatus);
    } catch (error) {
      console.error('Error syncing member:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRemoveMember = async () => {
    if (!selectedMember?.id || !currentBranch?.id || !confirm('Are you sure you want to remove this member from access control?')) {
      return;
    }
    
    setIsProcessing(true);
    try {
      await memberAccess.removeMember(selectedMember.id);
      
      // Refresh access details (should be empty)
      const accessStatus = await memberAccess.getStatus(selectedMember.id);
      setAccessDetails(accessStatus);
    } catch (error) {
      console.error('Error removing member:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Access Control</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Search Member */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email or phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
              Search
            </Button>
          </div>
          
          {/* Selected Member */}
          {selectedMember && (
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{selectedMember.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedMember.phone}</p>
                </div>
                <div className="space-x-2">
                  <Button
                    onClick={handleSyncMember}
                    disabled={isProcessing}
                    className="flex items-center"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <UserCheck className="h-4 w-4 mr-2" />
                    )}
                    Grant Access
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleRemoveMember}
                    disabled={isProcessing || accessDetails.length === 0}
                    className="flex items-center"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <UserX className="h-4 w-4 mr-2" />
                    )}
                    Remove Access
                  </Button>
                </div>
              </div>
              
              {/* Access Details Table */}
              {accessDetails.length > 0 ? (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Access Details</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device</TableHead>
                        <TableHead>Person ID</TableHead>
                        <TableHead>Face</TableHead>
                        <TableHead>Card</TableHead>
                        <TableHead>Fingerprint</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accessDetails.map((detail) => {
                        const device = settings?.devices?.find(d => d.serialNumber === detail.device_serial);
                        
                        return (
                          <TableRow key={detail.id}>
                            <TableCell>{device?.deviceName || detail.device_serial}</TableCell>
                            <TableCell>{detail.hikvision_person_id}</TableCell>
                            <TableCell>{detail.face_registered ? '✅' : '❌'}</TableCell>
                            <TableCell>{detail.card_registered ? '✅' : '❌'}</TableCell>
                            <TableCell>{detail.fingerprint_registered ? '✅' : '❌'}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="mt-4 text-center p-4 bg-muted rounded-md">
                  <p>No access control details found for this member.</p>
                  <p className="text-sm text-muted-foreground">
                    Click "Grant Access" to add this member to access control.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {!selectedMember && searchQuery && !isLoading && (
            <div className="text-center p-4 border rounded-md">
              <p>No member found with those details.</p>
            </div>
          )}
          
          {(!searchQuery || searchQuery.trim() === '') && !selectedMember && (
            <div className="text-center p-4">
              <p className="text-muted-foreground">
                Search for a member to manage their access control privileges.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
