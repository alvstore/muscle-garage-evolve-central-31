
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  User,
  Building2,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// Mock data for staff members
const mockStaffMembers = [
  {
    id: 'staff-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    department: 'Front Desk',
    position: 'Receptionist',
    branch: 'Main Branch',
    isActive: true,
    avatar: null
  },
  {
    id: 'staff-2',
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    phone: '+1 (555) 987-6543',
    department: 'Administration',
    position: 'Office Manager',
    branch: 'Downtown',
    isActive: true,
    avatar: null
  },
  {
    id: 'staff-3',
    name: 'Michael Davis',
    email: 'michael.davis@example.com',
    phone: '+1 (555) 456-7890',
    department: 'Maintenance',
    position: 'Facilities Manager',
    branch: 'Main Branch',
    isActive: true,
    avatar: null
  },
  {
    id: 'staff-4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    phone: '+1 (555) 789-0123',
    department: 'Front Desk',
    position: 'Receptionist',
    branch: 'Uptown',
    isActive: false,
    avatar: null
  }
];

const StaffListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);

  // Filter staff members based on search term
  const filteredStaff = mockStaffMembers.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to get avatar initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Staff Management</h1>
            <p className="text-muted-foreground">
              Manage your gym staff members and their roles
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search staff..."
                className="pl-8 w-[200px] md:w-[260px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Dialog open={isAddStaffDialogOpen} onOpenChange={setIsAddStaffDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new staff member.
                  </DialogDescription>
                </DialogHeader>
                <div className="p-4 text-center text-muted-foreground">
                  Staff form will be implemented here.
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map(staff => (
            <Card key={staff.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={staff.avatar || undefined} alt={staff.name} />
                      <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{staff.name}</CardTitle>
                      <CardDescription>{staff.position}</CardDescription>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Staff
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Trash className="h-4 w-4" />
                        Delete Staff
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        {staff.isActive ? (
                          <>
                            <XCircle className="h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`mailto:${staff.email}`} className="hover:underline">{staff.email}</a>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`tel:${staff.phone}`} className="hover:underline">{staff.phone}</a>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{staff.department}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{staff.branch}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <Badge variant={staff.isActive ? "default" : "destructive"}>
                    {staff.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredStaff.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 p-8 text-center text-muted-foreground">
              <p className="text-lg font-medium">No staff members found</p>
              <p className="text-sm">Try adjusting your search or add a new staff member.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsAddStaffDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default StaffListPage;
