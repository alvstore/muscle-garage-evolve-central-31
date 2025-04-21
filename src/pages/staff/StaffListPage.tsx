
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, Trash, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  avatar: string;
  status: 'active' | 'inactive';
  branchId: string;
}

const StaffListPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Mock data for staff - will be replaced with Supabase data
  const [staffMembers, setStaffMembers] = useState<Staff[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      role: 'Manager',
      department: 'Operations',
      avatar: '',
      status: 'active',
      branchId: 'branch1'
    },
    {
      id: '2',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '(555) 987-6543',
      role: 'Sales Representative',
      department: 'Sales',
      avatar: '',
      status: 'active',
      branchId: 'branch1'
    },
    {
      id: '3',
      name: 'Michael Johnson',
      email: 'michael.j@example.com',
      phone: '(555) 456-7890',
      role: 'Front Desk',
      department: 'Member Services',
      avatar: '',
      status: 'active',
      branchId: 'branch2'
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah.w@example.com',
      phone: '(555) 234-5678',
      role: 'Cleaner',
      department: 'Maintenance',
      avatar: '',
      status: 'inactive',
      branchId: 'branch1'
    },
    {
      id: '5',
      name: 'Robert Brown',
      email: 'robert.b@example.com',
      phone: '(555) 345-6789',
      role: 'Assistant Manager',
      department: 'Operations',
      avatar: '',
      status: 'active',
      branchId: 'branch3'
    },
  ]);

  const handleCreateStaff = () => {
    setShowCreateDialog(true);
  };

  const handleEditStaff = (id: string) => {
    toast.info(`Edit staff member with ID: ${id}`);
  };

  const handleDeleteStaff = (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setStaffMembers(staffMembers.filter(staff => staff.id !== id));
      toast.success('Staff member deleted successfully');
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
