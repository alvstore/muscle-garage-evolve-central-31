
import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, Trash, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { CreateStaffDialog } from '@/components/staff/CreateStaffDialog';
import { supabase } from '@/services/supabaseClient';
import type { StaffMember } from '@/types/staff';
import { useAuth } from '@/hooks/use-auth';

const StaffListPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const fetchStaffMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'staff');

      if (error) throw error;

      const formattedStaff: StaffMember[] = data.map(item => ({
        id: item.id,
        name: item.full_name || '',
        email: item.email || '',
        phone: item.phone || '',
        role: 'staff',
        position: item.position || '',
        department: item.department || '',
        branchId: item.branch_id || '',
        status: item.is_active !== false ? 'active' : 'inactive',
        avatar: item.avatar_url || '',
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString(),
      }));

      setStaffMembers(formattedStaff);
    } catch (error) {
      console.error('Error fetching staff members:', error);
      toast.error('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const handleCreateStaff = () => {
    setShowCreateDialog(true);
  };

  const handleEditStaff = (id: string) => {
    toast.info(`Edit staff member with ID: ${id}`);
  };

  const handleDeleteStaff = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        // First update the profile to inactive
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ is_active: false })
          .eq('id', id);
          
        if (updateError) throw updateError;
        
        toast.success('Staff member deactivated successfully');
        // Refresh the list
        fetchStaffMembers();
      } catch (error) {
        console.error('Error deleting staff member:', error);
        toast.error('Failed to delete staff member');
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
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading staff members...</p>
              </div>
            ) : staffMembers.length === 0 ? (
              <div className="text-center py-10">
                <p>No staff members found. Click "Add Staff Member" to create one.</p>
              </div>
            ) : (
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
                              {staff.position}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {staff.position}
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
            )}
          </CardContent>
        </Card>
      </div>

      <CreateStaffDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        onSuccess={fetchStaffMembers}
      />
    </Container>
  );
};

export default StaffListPage;
