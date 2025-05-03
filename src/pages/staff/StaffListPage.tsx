
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, SearchIcon, Star } from 'lucide-react';
import { useStaff } from '@/hooks/use-staff';
import CreateStaffDialog from '@/components/staff/CreateStaffDialog';
import { useBranch } from '@/hooks/use-branch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const StaffListPage = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { staff, isLoading, error, fetchStaff } = useStaff();
  const [filteredStaff, setFilteredStaff] = useState(staff);
  const { currentBranch } = useBranch();

  useEffect(() => {
    if (currentBranch?.id) {
      fetchStaff();
    }
  }, [fetchStaff, currentBranch]);

  useEffect(() => {
    if (staff) {
      const filtered = staff.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStaff(filtered);
    }
  }, [searchQuery, staff]);

  const getInitials = (name: string): string => {
    if (!name) return "";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const renderContent = () => {
    if (!currentBranch) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <p className="mb-4">Please select a branch to view staff members.</p>
          </CardContent>
        </Card>
      );
    }
    
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse overflow-hidden">
              <CardHeader className="p-0">
                <div className="bg-gradient-to-r from-primary/20 to-primary/10 h-24"></div>
              </CardHeader>
              <CardContent className="p-6 pt-14 relative">
                <div className="absolute -top-10 left-6">
                  <div className="h-16 w-16 rounded-full bg-muted"></div>
                </div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return <Card><CardContent>Error: {error.message}</CardContent></Card>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredStaff && filteredStaff.length > 0 ? (
          filteredStaff.map((staffMember) => (
            <Card key={staffMember.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="bg-gradient-to-r from-primary/20 to-primary/10 h-24 flex items-center justify-center">
                  {/* Role badge at the top */}
                  <Badge variant={
                    staffMember.role === 'admin' ? 'destructive' : 
                    staffMember.role === 'staff' ? 'default' : 'secondary'
                  } className="absolute top-2 right-2">
                    {staffMember.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-14 relative">
                <div className="absolute -top-10 left-6">
                  <Avatar className="h-16 w-16 border-4 border-background">
                    {staffMember.avatar_url ? (
                      <AvatarImage src={staffMember.avatar_url} alt={staffMember.name} />
                    ) : (
                      <AvatarFallback className="text-lg font-medium">
                        {getInitials(staffMember.name || '')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{staffMember.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {staffMember.email}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {staffMember.department && (
                      <Badge variant="secondary">{staffMember.department}</Badge>
                    )}
                    {staffMember.is_branch_manager && (
                      <Badge variant="outline" className="bg-green-100">Branch Manager</Badge>
                    )}
                    {currentBranch && (
                      <Badge variant="outline">{currentBranch.name}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-3">
            <CardContent className="p-6 text-center">
              <p>No staff members found for this branch.</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <Container>
      <div className="md:flex items-center justify-between space-y-4 md:space-y-0 mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Button 
          onClick={() => setOpenCreateDialog(true)} 
          className="bg-blue-500 hover:bg-blue-600"
          disabled={!currentBranch}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Staff Members</CardTitle>
          <div className="text-sm text-muted-foreground">
            {currentBranch ? `Branch: ${currentBranch.name}` : 'No branch selected'}
          </div>
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
              <SearchIcon className="absolute top-2.5 right-2 h-5 w-5 text-gray-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {renderContent()}

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
