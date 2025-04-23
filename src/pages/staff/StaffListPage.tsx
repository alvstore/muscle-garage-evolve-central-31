import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, Trash, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Staff, staffService } from '@/services/staffService';
import { useBranch } from '@/hooks/use-branch';

const StaffListPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentBranch } = useBranch();
  
  useEffect(() => {
    fetchStaff();
  }, [currentBranch]);
  
  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const staff = await staffService.getStaff(currentBranch?.id);
      setStaffMembers(staff);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Failed to load staff members");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStaff = () => {
    setShowCreateDialog(true);
  };

  const handleEditStaff = (id: string) => {
    toast.info(`Edit staff member with ID: ${id}`);
    // Implement edit functionality
  };

  const handleDeleteStaff = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const success = await staffService.deleteStaff(id);
        if (success) {
          setStaffMembers(staffMembers.filter(staff => staff.id !== id));
          toast.success('Staff member deleted successfully');
        } else {
          toast.error('Failed to delete staff member');
        }
      } catch (error) {
        console.error("Error deleting staff:", error);
        toast.error('An error occurred while deleting staff member');
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground">Manage staff members across all branches</p>
          </div>
          <Button onClick={handleCreateStaff}>
            <Plus className="mr-2 h-4 w-4" />
            Add Staff Member
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Staff Members</CardTitle>
            <CardDescription>
              View and manage all staff members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffMembers.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={staff.avatar} alt={staff.name} />
                          <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{staff.name}</div>
                          <div className="text-sm text-muted-foreground md:hidden">
                            {staff.role}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {staff.role}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {staff.department}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col text-sm">
                        <div className="flex items-center">
                          <Mail className="mr-1 h-3 w-3" />
                          {staff.email}
                        </div>
                        <div className="flex items-center mt-1">
                          <Phone className="mr-1 h-3 w-3" />
                          {staff.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={staff.status === 'active' ? 'default' : 'outline'}>
                        {staff.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditStaff(staff.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteStaff(staff.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create Staff Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p>Staff creation form will be implemented with Supabase integration</p>
            <Button
              className="mt-4"
              onClick={() => {
                setShowCreateDialog(false);
                toast.success('Form will be implemented with Supabase integration');
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default StaffListPage;
