
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from '@/components/ui/data-table';
import { StaffMemberColumn } from '@/components/staff/StaffMemberColumn';
import CreateStaffForm from '@/components/staff/CreateStaffForm';
import { useStaff } from '@/hooks/use-staff';
import { useBranch } from '@/hooks/use-branch';
import { Check, Loader2, Plus, Search, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const StaffListPage = () => {
  const [isCreateStaffDialogOpen, setIsCreateStaffDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { staff, isLoading, fetchStaff } = useStaff();
  const { currentBranch } = useBranch();
  
  useEffect(() => {
    if (currentBranch) {
      fetchStaff();
    }
  }, [currentBranch, fetchStaff]);

  // Filter staff based on search query and active tab
  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.email && member.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (member.phone && member.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'staff') return matchesSearch && member.role === 'staff';
    if (activeTab === 'trainers') return matchesSearch && member.role === 'trainer';
    if (activeTab === 'admin') return matchesSearch && member.role === 'admin';
    
    return matchesSearch;
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleCreateSuccess = () => {
    setIsCreateStaffDialogOpen(false);
    fetchStaff(); // Refresh the staff list
  };

  return (
    <Container>
      <div className="py-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground">Manage your gym staff and trainers</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search staff..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button onClick={() => setIsCreateStaffDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Staff
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-md mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="pt-4">
            <StaffTable staff={filteredStaff} isLoading={isLoading} onRefresh={fetchStaff} />
          </TabsContent>
          
          <TabsContent value="staff" className="pt-4">
            <StaffTable 
              staff={filteredStaff.filter(member => member.role === 'staff')} 
              isLoading={isLoading} 
              onRefresh={fetchStaff} 
            />
          </TabsContent>
          
          <TabsContent value="trainers" className="pt-4">
            <StaffTable 
              staff={filteredStaff.filter(member => member.role === 'trainer')} 
              isLoading={isLoading} 
              onRefresh={fetchStaff} 
            />
          </TabsContent>
          
          <TabsContent value="admin" className="pt-4">
            <StaffTable 
              staff={filteredStaff.filter(member => member.role === 'admin')} 
              isLoading={isLoading} 
              onRefresh={fetchStaff} 
            />
          </TabsContent>
        </Tabs>

        <Dialog open={isCreateStaffDialogOpen} onOpenChange={setIsCreateStaffDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <CreateStaffForm onSuccess={handleCreateSuccess} />
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
};

const StaffTable = ({ staff, isLoading, onRefresh }: { staff: any[], isLoading: boolean, onRefresh: () => void }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Loading staff members...</p>
      </div>
    );
  }

  if (staff.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No staff members found</h3>
        <p className="text-muted-foreground mb-4">Add staff members to manage your gym effectively.</p>
      </div>
    );
  }

  return <DataTable columns={StaffMemberColumn(onRefresh)} data={staff} />;
};

export default StaffListPage;
