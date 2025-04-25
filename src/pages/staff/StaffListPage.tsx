
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { useStaff } from '@/hooks/use-staff';
import CreateStaffDialog from '@/components/staff/CreateStaffDialog';

const StaffListPage = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { staff, isLoading, error, fetchStaff } = useStaff();
  const [filteredStaff, setFilteredStaff] = useState(staff);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  useEffect(() => {
    if (staff) {
      const filtered = staff.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStaff(filtered);
    }
  }, [searchQuery, staff]);

  if (isLoading) {
    return <Container>Loading staff...</Container>;
  }

  if (error) {
    return <Container>Error: {error.message}</Container>;
  }

  return (
    <Container>
      <div className="md:flex items-center justify-between space-y-4 md:space-y-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Staff Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-1 relative">
                <Input
                  type="search"
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="md:w-auto pr-8"
                />
                {searchQuery ? (
                  <SearchIcon className="absolute top-2.5 right-2 h-5 w-5 text-gray-500" />
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={() => setOpenCreateDialog(true)} className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>

      <div className="grid gap-4 mt-4">
        {filteredStaff && filteredStaff.length > 0 ? (
          filteredStaff.map((staffMember) => (
            <Card key={staffMember.id}>
              <CardHeader>
                <CardTitle>{staffMember.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Email: {staffMember.email}</p>
                <p>Role: {staffMember.role}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent>No staff members found.</CardContent>
          </Card>
        )}
      </div>

      <CreateStaffDialog 
        open={openCreateDialog} 
        onOpenChange={setOpenCreateDialog} 
        onSuccess={() => {
          fetchStaff();
          setSearchQuery('');
        }} 
      />
    </Container>
  );
};

export default StaffListPage;
