import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useStaff } from '@/hooks/use-staff';
import CreateStaffDialog from '@/components/staff/CreateStaffDialog';
import { supabase } from "@/integrations/supabase/client";

const StaffListPage = () => {
  const [open, setOpen] = useState(false);
  const { staff, isLoading, fetchStaff } = useStaff();
  const { toast } = useToast();
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleEdit = (staffMember: any) => {
    setSelectedStaff(staffMember);
    setOpen(true);
  };

  const handleDelete = async (staffMember: any) => {
    try {
      // Optimistically update the UI
      const optimisticStaffList = staff.filter((s) => s.id !== staffMember.id);
      // setStaff(optimisticStaffList);

      // Delete the staff member from Supabase
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', staffMember.id);

      if (error) {
        // If there's an error, revert the UI
        // setStaff(staff);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to delete staff member. Please try again.",
        });
      } else {
        // If the deletion was successful, show a success message
        toast({
          title: "Success",
          description: "Staff member deleted successfully.",
        });
        fetchStaff();
      }
    } catch (error) {
      // If there's an error, revert the UI
      // setStaff(staff);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to delete staff member. Please try again.",
      });
    }
  };

  return (
    <Container>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Staff Members</CardTitle>
          <Button onClick={() => setOpen(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : staff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No staff members found.
                    </TableCell>
                  </TableRow>
                ) : (
                  staff.map((staffMember) => (
                    <TableRow key={staffMember.id}>
                      <TableCell className="font-medium">{staffMember.name}</TableCell>
                      <TableCell>{staffMember.email}</TableCell>
                      <TableCell>{staffMember.role}</TableCell>
                      <TableCell>{staffMember.department}</TableCell>
                      <TableCell>
                        {staffMember.is_active ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(staffMember)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(staffMember)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <CreateStaffDialog open={open} onOpenChange={setOpen} onSuccess={() => {
        fetchStaff();
        setSelectedStaff(null);
      }} />
    </Container>
  );
};

export default StaffListPage;
