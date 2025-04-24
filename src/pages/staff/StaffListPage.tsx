
import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/services/supabaseClient';
import { CreateStaffDialog } from '@/components/staff/CreateStaffDialog';
import { PersonCard } from '@/components/shared/PersonCard';
import { useAuth } from '@/hooks/use-auth';

interface StaffProfile {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  branch_id?: string;
  department?: string;
  position?: string;
  is_active?: boolean;
  accessible_branch_ids?: string[];
  address?: string;
  city?: string;
  country?: string;
  created_at?: string;
  date_of_birth?: string;
  gender?: string;
  role?: string;
  state?: string;
  updated_at?: string;
}

const StaffListPage = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  useEffect(() => {
    fetchStaff();
  }, []);
  
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'staff');
      
      if (error) throw error;
      
      if (data) {
        setStaff(data.map(staff => ({
          ...staff,
          position: staff.position || staff.department || 'Staff',
          is_active: staff.is_active !== false
        })));
      } else {
        setStaff([]);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (id: string) => {
    toast.info(`Edit staff ${id} - coming soon`);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            is_active: false
          })
          .eq('id', id);
        
        if (error) throw error;
        
        toast.success('Staff member deactivated successfully');
        fetchStaff();
      } catch (error) {
        console.error('Error deactivating staff member:', error);
        toast.error('Failed to deactivate staff member');
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
        ) : staff.length === 0 ? (
          <div className="text-center py-10">
            <p>No staff members found. Click "Add Staff Member" to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((staff) => (
              <PersonCard
                key={staff.id}
                id={staff.id}
                name={staff.full_name}
                email={staff.email}
                phone={staff.phone}
                avatar={staff.avatar_url}
                role="Staff"
                department={staff.department}
                status={staff.is_active ? 'active' : 'inactive'}
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
        onSuccess={fetchStaff}
      />
    </Container>
  );
};

export default StaffListPage;
