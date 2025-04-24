
import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { CreateStaffDialog } from '@/components/staff/CreateStaffDialog';
import { supabase } from '@/services/supabaseClient';
import type { StaffMember } from '@/types/staff';
import { PersonCard } from '@/components/shared/PersonCard';

interface ProfileData {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  role: string;
  department?: string;
  branch_id?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  position?: string;
  is_active?: boolean;
}

const StaffListPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchStaffMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'staff');

      if (error) throw error;

      if (!data) {
        setStaffMembers([]);
        return;
      }

      const formattedStaff: StaffMember[] = data.map((item: any) => ({
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

  const handleEdit = (id: string) => {
    toast.info(`Edit staff member ${id} - coming soon`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        // Use any type for the update operation since the is_active field might not be in the strict type
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ is_active: false } as any)
          .eq('id', id);
          
        if (updateError) throw updateError;
        
        toast.success('Staff member deactivated successfully');
        fetchStaffMembers();
      } catch (error) {
        console.error('Error deleting staff member:', error);
        toast.error('Failed to delete staff member');
      }
    }
  };

  const handleViewProfile = (id: string) => {
    toast.info(`View profile ${id} - coming soon`);
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground">Manage staff members across all branches</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Staff Member
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading staff members...</p>
          </div>
        ) : staffMembers.length === 0 ? (
          <div className="text-center py-10">
            <p>No staff members found. Click "Add Staff Member" to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffMembers.map((staff) => (
              <PersonCard
                key={staff.id}
                id={staff.id}
                name={staff.name}
                email={staff.email}
                phone={staff.phone}
                avatar={staff.avatar}
                role="Staff"
                department={staff.department}
                status={staff.status}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        )}
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
