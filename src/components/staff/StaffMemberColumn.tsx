
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Edit, Trash2, UserCog, UserCheck, UserX } from 'lucide-react';
import { StaffMember } from '@/hooks/use-staff';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { useToast } from '@/hooks/ui/use-toast';
import { useStaff } from '@/hooks/use-staff';

// Helper function to get initials from a name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

export const StaffMemberColumn = (onRefresh: () => void): ColumnDef<StaffMember>[] => {
  return [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={staff.avatar_url || ''} alt={staff.name} />
              <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{staff.name}</p>
              <p className="text-sm text-muted-foreground">{staff.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      id: 'phone',
      header: 'Phone',
      accessorKey: 'phone',
      cell: ({ row }) => <div>{row.getValue('phone') || 'N/A'}</div>,
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return (
          <Badge
            variant="outline"
            className={
              role === 'admin'
                ? 'bg-purple-100 text-purple-800 border-purple-200'
                : role === 'trainer'
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-blue-100 text-blue-800 border-blue-200'
            }
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => {
        // Get the staff member object directly
        const staff = row.original;
        // Default to active if is_active is null or undefined
        const isActive = staff.is_active !== false;
        return (
          <Badge variant={isActive ? 'default' : 'secondary'} className={isActive ? 'bg-green-500' : ''}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <ActionMenu staffMember={row.original} onRefresh={onRefresh} />,
    },
  ];
};

interface ActionMenuProps {
  staffMember: StaffMember;
  onRefresh: () => void;
}

const ActionMenu = ({ staffMember, onRefresh }: ActionMenuProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { deleteStaffMember, updateStaffMember } = useStaff();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { success, error } = await deleteStaffMember(staffMember.id);
      if (success) {
        toast({
          title: 'Staff member deleted',
          description: `${staffMember.name} has been removed.`,
        });
        onRefresh();
      } else {
        throw new Error(error);
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete staff member',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const toggleActive = async () => {
    try {
      const { success, error } = await updateStaffMember(staffMember.id, {
        ...staffMember,
        is_active: !staffMember.is_active,
      });

      if (success) {
        toast({
          title: `Staff member ${staffMember.is_active ? 'deactivated' : 'activated'}`,
          description: `${staffMember.name} has been ${staffMember.is_active ? 'deactivated' : 'activated'}.`,
        });
        onRefresh();
      } else {
        throw new Error(error);
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update staff member',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="flex items-center cursor-pointer"
            onClick={() => window.location.href = `/staff/edit/${staffMember.id}`}
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            className="flex items-center cursor-pointer"
            onClick={toggleActive}
          >
            {staffMember.is_active ? (
              <>
                <UserX className="mr-2 h-4 w-4" />
                <span>Deactivate</span>
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                <span>Activate</span>
              </>
            )}
          </DropdownMenuItem>
          
          {staffMember.role === 'trainer' && (
            <DropdownMenuItem
              className="flex items-center cursor-pointer"
              onClick={() => window.location.href = `/trainers/allocate/${staffMember.id}`}
            >
              <UserCog className="mr-2 h-4 w-4" />
              <span>Manage Members</span>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Staff Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {staffMember.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
