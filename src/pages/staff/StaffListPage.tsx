
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Search, Loader2 } from 'lucide-react';
import { useStaff } from '@/hooks/use-staff';
import CreateStaffForm from '@/components/staff/CreateStaffForm';
import { Badge } from '@/components/ui/badge';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  branch_id?: string;
  avatar_url?: string;
}

const StaffListPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { staff, isLoading, fetchStaff, createStaffMember } = useStaff();
  
  useEffect(() => {
    fetchStaff();
  }, []);
  
  const filteredStaff = staff.filter((staffMember) => 
    staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length > 1 
      ? `${parts[0][0]}${parts[1][0]}` 
      : parts[0].substring(0, 2);
  };
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground">
              Manage your gym's staff and their roles
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <CreateStaffForm 
                  onSuccess={() => {
                    fetchStaff();
                    setIsDialogOpen(false);
                  }}
                  onCancel={() => setIsDialogOpen(false)} 
                  staff={[]} 
                  refetch={fetchStaff} 
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center my-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((staffMember) => (
              <Card key={staffMember.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      {staffMember.avatar_url ? (
                        <AvatarImage src={staffMember.avatar_url} alt={staffMember.name} />
                      ) : (
                        <AvatarFallback>{getInitials(staffMember.name)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{staffMember.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{staffMember.email}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Role</span>
                      <Badge variant="outline" className="capitalize">
                        {staffMember.role}
                      </Badge>
                    </div>
                    {staffMember.department && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Department</span>
                        <span className="text-sm">{staffMember.department}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredStaff.length === 0 && (
              <Card className="col-span-1 md:col-span-3">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <p className="text-muted-foreground my-4">
                    {searchTerm ? 'No staff members match your search term.' : 'No staff members found.'}
                  </p>
                  <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => setIsDialogOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Staff
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default StaffListPage;
