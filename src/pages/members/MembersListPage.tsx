import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  FileEdit, 
  Trash2, 
  Mail, 
  Phone, 
  Eye,
  LayoutGrid,
  LayoutList
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { useMembers, Member } from '@/hooks/use-members';
import { toast } from 'sonner';
import { useBranch } from '@/hooks/use-branch';

const MembersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const { members, isLoading, fetchMembers, deleteMember } = useMembers();
  const { currentBranch } = useBranch();

  const handleDelete = async () => {
    if (!deletingMemberId) return;
    
    const success = await deleteMember(deletingMemberId);
    if (success) {
      setDeletingMemberId(null);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && member.status === 'active') ||
      (filterStatus === 'inactive' && member.status === 'inactive') ||
      (filterStatus === 'expiring' && member.membership_end_date && 
        new Date(member.membership_end_date) < new Date(new Date().setDate(new Date().getDate() + 30)));
    
    return matchesSearch && matchesFilter;
  });

  const exportToCSV = () => {
    try {
      // Create CSV header row
      const headers = ['Name', 'Email', 'Phone', 'Status', 'Membership Status', 'Membership End Date'];
      
      // Convert members to CSV rows
      const csvData = filteredMembers.map(member => [
        member.name,
        member.email || '',
        member.phone || '',
        member.status || '',
        member.membership_status || '',
        member.membership_end_date ? format(new Date(member.membership_end_date), 'yyyy-MM-dd') : ''
      ]);
      
      // Combine header and data
      const csvContent = [headers, ...csvData]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `members_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Members data exported successfully');
    } catch (error) {
      console.error('Error exporting members:', error);
      toast.error('Failed to export members data');
    }
  };

  // Function to create initials from name
  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  // Function to get status color
  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-400';
      case 'expired': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Members</h1>
            <p className="text-muted-foreground">Manage your gym members and their profiles.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                className="pl-9 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setViewMode('list')}
                aria-pressed={viewMode === 'list'}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                className="sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              className="sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            
            <Button 
              variant="outline" 
              className="sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" 
              onClick={exportToCSV}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Link to="/members/new">
              <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-medium">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </Link>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Members Directory</CardTitle>
            <Tabs defaultValue="all" onValueChange={setFilterStatus}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : !currentBranch ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Please select a branch to view members</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No members found matching your search</p>
              </div>
            ) : (
              viewMode === 'list' ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead className="hidden md:table-cell">Contact</TableHead>
                      <TableHead className="hidden md:table-cell">Membership</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="hidden md:table-cell">Expires</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow 
                        key={member.id} 
                        className="cursor-pointer hover:bg-accent/50" 
                        onClick={() => navigate(`/members/${member.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              {member.avatar ? (
                                <AvatarImage src={member.avatar} alt={member.name} />
                              ) : (
                                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground md:hidden">{member.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-col text-sm">
                            {member.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span>{member.email}</span>
                              </div>
                            )}
                            {member.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span>{member.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell className="hidden md:table-cell">
                          {member.membership_id ? (
                            <Badge variant="outline" className="font-normal bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
                              {member.membership_id}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground font-normal bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                              No Plan
                            </Badge>
                          )}
                        </TableCell>
                        
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`}></div>
                            <span className="capitalize">{member.status || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell className="hidden md:table-cell">
                          {member.membership_end_date ? (
                            format(new Date(member.membership_end_date), 'dd MMM yyyy')
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                              <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/members/${member.id}`);
                              }}>
                                <Eye className="mr-2 h-4 w-4" /> View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/members/${member.id}/edit`);
                              }}>
                                <FileEdit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingMemberId(member.id);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {filteredMembers.map((member) => (
                    <Card 
                      key={member.id} 
                      className="cursor-pointer hover:bg-accent/50 transition-colors" 
                      onClick={() => navigate(`/members/${member.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center gap-3 mb-3 pt-3">
                          <Avatar className="h-16 w-16">
                            {member.avatar ? (
                              <AvatarImage src={member.avatar} alt={member.name} />
                            ) : (
                              <AvatarFallback className="text-lg">{getInitials(member.name)}</AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium text-lg">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                            {member.phone && (
                              <div className="text-sm text-muted-foreground">{member.phone}</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`}></div>
                            <span className="capitalize text-sm">{member.status || 'Unknown'}</span>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                              <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/members/${member.id}`);
                              }}>
                                <Eye className="mr-2 h-4 w-4" /> View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/members/${member.id}/edit`);
                              }}>
                                <FileEdit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingMemberId(member.id);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingMemberId} onOpenChange={(open) => !open && setDeletingMemberId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the member
              and all associated data from your database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setDeletingMemberId(null)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MembersListPage;
