
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner';
import { User } from '@/types/auth/user';
import { supabase } from '@/services/api/supabaseClient';

interface BulkLeadActionsProps {
  leadIds: string[];
  onSuccess: () => void;
  onClose: () => void;
}

const BulkLeadActions: React.FC<BulkLeadActionsProps> = ({ leadIds, onSuccess, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  
  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or('role.eq.admin,role.eq.staff');
      
      if (error) throw error;
      setUsers(data as User[]);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteLeads = async (leadIds: string[]) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .in('id', leadIds);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting leads:", error);
      throw error;
    }
  };

  const assignLeads = async (leadIds: string[], userId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ assigned_to: userId })
        .in('id', leadIds);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error assigning leads:", error);
      throw error;
    }
  };

  const updateLeadStatus = async (leadIds: string[], status: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .in('id', leadIds);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating lead status:", error);
      throw error;
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await deleteLeads(leadIds);
      toast.success("Successfully deleted selected leads");
    } catch (error) {
      console.error("Error deleting leads:", error);
      toast.error("Failed to delete leads: " + ((error as any)?.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
      onSuccess();
      onClose();
    }
  };

  const handleAssign = async () => {
    if (!selectedUser) {
      toast.error("Please select a team member to assign");
      return;
    }
    
    setIsProcessing(true);
    try {
      await assignLeads(leadIds, selectedUser);
      toast.success("Successfully assigned leads");
    } catch (error) {
      console.error("Error assigning leads:", error);
      toast.error("Failed to assign leads: " + ((error as any)?.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
      onSuccess();
      onClose();
    }
  };

  const handleStatus = async () => {
    if (!selectedStatus) {
      toast.error("Please select a status");
      return;
    }
    
    setIsProcessing(true);
    try {
      await updateLeadStatus(leadIds, selectedStatus);
      toast.success("Successfully updated lead status");
    } catch (error) {
      console.error("Error updating lead status:", error);
      toast.error("Failed to update lead status: " + ((error as any)?.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
      onSuccess();
      onClose();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={leadIds.length === 0}>
          Bulk Actions
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bulk Actions</AlertDialogTitle>
          <AlertDialogDescription>
            Choose an action to perform on the selected leads.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Assign to
            </Label>
            <Select onValueChange={setSelectedUser}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a team member" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user: User) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name || user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleAssign} disabled={isProcessing}>
              Assign
            </Button>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Update Status
            </Label>
            <Select onValueChange={setSelectedStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="unqualified">Unqualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleStatus} disabled={isProcessing}>
              Update
            </Button>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isProcessing} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BulkLeadActions;
