
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';
import { useBranch } from '@/hooks/use-branches';
import { usePermissions } from '@/hooks/use-permissions';

// Mock data for staff members
const mockStaffMembers = [
  { id: 'staff1', name: 'John Smith', role: 'staff', branches: ['branch1'], isPrimaryBranch: true, isBranchManager: false },
  { id: 'staff2', name: 'Sarah Johnson', role: 'staff', branches: ['branch1', 'branch2'], isPrimaryBranch: true, isBranchManager: true },
  { id: 'staff3', name: 'Michael Brown', role: 'staff', branches: ['branch3'], isPrimaryBranch: true, isBranchManager: false },
];

// Mock data for trainers
const mockTrainers = [
  { id: 'trainer1', name: 'Emma Wilson', speciality: 'Yoga', branches: ['branch1', 'branch2'], isPrimaryBranch: true },
  { id: 'trainer2', name: 'David Miller', speciality: 'Weight Training', branches: ['branch2'], isPrimaryBranch: true },
  { id: 'trainer3', name: 'Lisa Thompson', speciality: 'Cardio', branches: ['branch1', 'branch3'], isPrimaryBranch: false },
];

// Mock data for members
const mockMembers = [
  { id: 'member1', name: 'James Wilson', membershipType: 'Premium', branches: ['branch1'], isPrimaryBranch: true },
  { id: 'member2', name: 'Emily Davis', membershipType: 'Standard', branches: ['branch2'], isPrimaryBranch: true },
  { id: 'member3', name: 'Robert Johnson', membershipType: 'Premium', branches: ['branch1', 'branch2', 'branch3'], isPrimaryBranch: true },
];

const BranchAssignmentPage = () => {
  const { branches } = useBranch();
  const { can } = usePermissions();
  const [activeTab, setActiveTab] = useState('staff');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [primaryBranch, setPrimaryBranch] = useState<string>('');
  const [isBranchManager, setIsBranchManager] = useState(false);

  const handleEditBranches = (user: any) => {
    setSelectedUser(user);
    setSelectedBranches(user.branches || []);
    setPrimaryBranch(user.branches?.[0] || '');
    setIsBranchManager(user.isBranchManager || false);
    setIsDialogOpen(true);
  };

  const handleSaveBranches = () => {
    // In a real app, this would save the changes to the database
    console.log('Saving branch assignments:', {
      userId: selectedUser?.id,
      branches: selectedBranches,
      primaryBranch,
      isBranchManager,
    });
    
    setIsDialogOpen(false);
    // In a real app, you would refresh the data here
  };

  const toggleBranchSelection = (branchId: string) => {
    if (selectedBranches.includes(branchId)) {
      setSelectedBranches(selectedBranches.filter(id => id !== branchId));
      // If removing the primary branch, reset the primary branch
      if (primaryBranch === branchId) {
        setPrimaryBranch('');
      }
    } else {
      setSelectedBranches([...selectedBranches, branchId]);
      // If this is the first branch being added, make it the primary branch
      if (selectedBranches.length === 0) {
        setPrimaryBranch(branchId);
      }
    }
  };

  const renderStaffTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Assigned Branches</TableHead>
          <TableHead>Branch Manager</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockStaffMembers.map((staff) => (
          <TableRow key={staff.id}>
            <TableCell className="font-medium">{staff.name}</TableCell>
            <TableCell>Staff</TableCell>
            <TableCell>
              {staff.branches.map(branchId => {
                const branch = branches.find(b => b.id === branchId);
                return (
                  <span key={branchId} className="inline-block mr-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                    {branch?.name || 'Unknown Branch'}
                  </span>
                );
              })}
            </TableCell>
            <TableCell>
              {staff.isBranchManager ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-gray-400" />
              )}
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEditBranches(staff)}
                disabled={!can('manage_branches')}
              >
                Edit Branches
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderTrainersTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Speciality</TableHead>
          <TableHead>Assigned Branches</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockTrainers.map((trainer) => (
          <TableRow key={trainer.id}>
            <TableCell className="font-medium">{trainer.name}</TableCell>
            <TableCell>{trainer.speciality}</TableCell>
            <TableCell>
              {trainer.branches.map(branchId => {
                const branch = branches.find(b => b.id === branchId);
                return (
                  <span key={branchId} className="inline-block mr-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                    {branch?.name || 'Unknown Branch'}
                    {trainer.isPrimaryBranch && branchId === trainer.branches[0] && (
                      <span className="ml-1 font-semibold">(Primary)</span>
                    )}
                  </span>
                );
              })}
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEditBranches(trainer)}
                disabled={!can('manage_branches')}
              >
                Edit Branches
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderMembersTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Membership Type</TableHead>
          <TableHead>Accessible Branches</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockMembers.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">{member.name}</TableCell>
            <TableCell>{member.membershipType}</TableCell>
            <TableCell>
              {member.branches.map(branchId => {
                const branch = branches.find(b => b.id === branchId);
                return (
                  <span key={branchId} className="inline-block mr-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                    {branch?.name || 'Unknown Branch'}
                    {member.isPrimaryBranch && branchId === member.branches[0] && (
                      <span className="ml-1 font-semibold">(Primary)</span>
                    )}
                  </span>
                );
              })}
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEditBranches(member)}
                disabled={!can('manage_branches')}
              >
                Edit Branches
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Branch Assignment</h1>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>
          
          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Staff Branch Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                {renderStaffTable()}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trainers">
            <Card>
              <CardHeader>
                <CardTitle>Trainer Branch Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTrainersTable()}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Member Branch Access</CardTitle>
              </CardHeader>
              <CardContent>
                {renderMembersTable()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Branch Assignments</DialogTitle>
              <DialogDescription>
                Assign {selectedUser?.name} to branches and set their primary branch.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Branches</Label>
                <div className="grid grid-cols-1 gap-3 pt-1">
                  {branches.map((branch) => (
                    <div key={branch.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`branch-${branch.id}`}
                        checked={selectedBranches.includes(branch.id)}
                        onCheckedChange={() => toggleBranchSelection(branch.id)}
                      />
                      <Label htmlFor={`branch-${branch.id}`} className="flex-1">{branch.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedBranches.length > 0 && (
                <div className="space-y-2">
                  <Label>Primary Branch</Label>
                  <Select value={primaryBranch} onValueChange={setPrimaryBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedBranches.map(branchId => {
                        const branch = branches.find(b => b.id === branchId);
                        return (
                          <SelectItem key={branchId} value={branchId}>
                            {branch?.name || 'Unknown Branch'}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {selectedUser?.role === 'staff' && (
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="branch-manager"
                    checked={isBranchManager}
                    onCheckedChange={(checked) => setIsBranchManager(checked as boolean)}
                  />
                  <Label htmlFor="branch-manager">Is Branch Manager</Label>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveBranches} disabled={selectedBranches.length === 0 || !primaryBranch}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
};

export default BranchAssignmentPage;
