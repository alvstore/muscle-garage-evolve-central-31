
import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Eye, Edit, UserMinus, Mail, Phone, MoreVertical, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/services/supabaseClient";

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  avatar?: string;
  status: 'active' | 'inactive';
  branchId?: string;
}

const StaffListPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch staff/admin from Supabase (profiles table)
    const fetchStaff = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("role", ["staff", "admin"]);
      if (!error && data) {
        setStaffMembers(
          data.map((s: any) => ({
            id: s.id,
            name: s.full_name,
            email: s.email,
            phone: s.phone,
            role: s.role,
            department: s.department || "",
            avatar: s.avatar_url,
            status: s.status || "active",
            branchId: s.branch_id
          }))
        );
      }
      setLoading(false);
    };
    fetchStaff();
  }, []);

  const handleCreateStaff = () => {
    setShowCreateDialog(true);
  };

  const handleEditStaff = (id: string) => {
    toast.info(`Edit staff member with ID: ${id}`);
  };

  const handleDeactivateStaff = (id: string) => {
    toast("Staff member deactivated", { description: "Deactivation to be implemented." });
  };

  const handleSendLoginInfo = (id: string) => {
    toast("Login info sent", { description: "Login info sending to be implemented." });
  };

  const handleAttendance = (id: string) => {
    toast.info("Attendance view not yet implemented.");
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
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 rounded-full border-4 border-t-accent animate-spin"></div>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditStaff(staff.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAttendance(staff.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Attendance
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeactivateStaff(staff.id)}>
                            <UserMinus className="h-4 w-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendLoginInfo(staff.id)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Login Info
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
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
