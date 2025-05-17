import { useMemo, useState } from 'react';
import { useMembershipPlans } from '@/hooks/use-membership-operations.tsx';
import type { Member } from '@/hooks/use-members';
import { Users, UserCheck, UserSearch, Crown, Monitor, PieChart, Edit, UserPlus as UserPlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Eye,
  FileEdit,
  Trash2,
  MoreVertical,
  UserPlus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  LayoutGrid,
  LayoutList,
} from 'lucide-react';

// Services
import { useBranch } from '@/hooks/use-branches';
import { useMembers } from '@/hooks/use-members';

type ViewMode = 'list' | 'grid';



const getStatusColor = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case 'active': return 'bg-success';
    case 'inactive': return 'bg-secondary';
    case 'expired': return 'bg-error';
    case 'pending': return 'bg-warning';
    default: return 'bg-secondary';
  }
};

const calculateMemberStats = (members: Member[]) => {
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  // Current stats
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active' && m.membership_end_date && new Date(m.membership_end_date) > now).length;
  const expiredMembers = members.filter(m => m.membership_end_date && new Date(m.membership_end_date) < now).length;
  const pendingMembers = members.filter(m => m.status === 'pending').length;
  const newMembers = members.filter(m => m.created_at && new Date(m.created_at) > oneMonthAgo).length;

  // Calculate month-over-month changes
  const lastMonthMembers = members.filter(m => m.created_at && new Date(m.created_at) < oneMonthAgo).length;
  const totalChange = lastMonthMembers ? ((totalMembers - lastMonthMembers) / lastMonthMembers) * 100 : 0;
  const activeChange = activeMembers ? ((activeMembers - (lastMonthMembers * 0.7)) / (lastMonthMembers * 0.7)) * 100 : 0;
  const expiredChange = expiredMembers ? ((expiredMembers - (lastMonthMembers * 0.2)) / (lastMonthMembers * 0.2)) * 100 : 0;
  const newMembersLastMonth = members.filter(m => 
    m.created_at && new Date(m.created_at) > new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth() - 1, oneMonthAgo.getDate()) &&
    m.created_at && new Date(m.created_at) < oneMonthAgo
  ).length;
  const newMembersChange = newMembersLastMonth ? ((newMembers - newMembersLastMonth) / newMembersLastMonth) * 100 : 0;

  return [
    { 
      title: 'Total Members', 
      value: totalMembers.toString(), 
      change: Math.round(totalChange), 
      desc: 'All registered members', 
      icon: Users, 
      color: 'primary' 
    },
    { 
      title: 'Active Members', 
      value: activeMembers.toString(), 
      change: Math.round(activeChange), 
      desc: 'Current active memberships', 
      icon: UserCheck, 
      color: 'success' 
    },
    { 
      title: 'Expired Members', 
      value: expiredMembers.toString(), 
      change: Math.round(expiredChange), 
      desc: 'Memberships needing renewal', 
      icon: UserPlusIcon, 
      color: 'destructive' 
    },
    { 
      title: 'New Members', 
      value: newMembers.toString(), 
      change: Math.round(newMembersChange), 
      desc: 'Joined this month', 
      icon: UserSearch, 
      color: 'warning' 
    },
  ];
};

const roles = [
  { title: 'Admin', value: 'admin' },
  { title: 'Author', value: 'author' },
  { title: 'Editor', value: 'editor' },
  { title: 'Maintainer', value: 'maintainer' },
  { title: 'Subscriber', value: 'subscriber' },
];

const plans = [
  { title: 'Basic', value: 'basic' },
  { title: 'Company', value: 'company' },
  { title: 'Enterprise', value: 'enterprise' },
  { title: 'Team', value: 'team' },
];

const status = [
  { title: 'Pending', value: 'pending' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
];

const resolveUserRoleVariant = (role: string) => {
  const roleLowerCase = role.toLowerCase();
  if (roleLowerCase === 'subscriber') return { color: 'success', icon: 'user' };
  if (roleLowerCase === 'author') return { color: 'destructive', icon: Monitor };
  if (roleLowerCase === 'maintainer') return { color: 'info', icon: PieChart };
  if (roleLowerCase === 'editor') return { color: 'warning', icon: Edit };
  if (roleLowerCase === 'admin') return { color: 'primary', icon: Crown };
  return { color: 'primary', icon: 'user' };
};

const resolveUserStatusVariant = (stat: string) => {
  const statLowerCase = stat.toLowerCase();
  if (statLowerCase === 'pending') return 'warning';
  if (statLowerCase === 'active') return 'success';
  if (statLowerCase === 'inactive') return 'secondary';
  return 'primary';
};

const MembersListPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { currentBranch } = useBranch();
  const { members, isLoading, fetchMembers, deleteMember } = useMembers();
  const { membershipPlans } = useMembershipPlans();

  // Get membership plan name
  const getMembershipPlanName = (planId: string | null) => {
    if (!planId) return 'No Plan';
    const plan = membershipPlans?.find(p => p.id === planId);
    return plan?.name || 'Unknown Plan';
  };

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    
    return members
      .filter(member => 
        (searchQuery === '' ||
         member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
         member.phone.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .filter(member => 
        filterStatus === 'all' ||
        filterStatus === member.status.toLowerCase()
      );
  }, [members, searchQuery, filterStatus]);

  const handleDelete = async (id: string) => {
    try {
      await deleteMember(id);
      toast.success('Member deleted successfully');
      setDeletingMemberId(null);
      setIsDeleteDialogOpen(false);
      fetchMembers();
    } catch (error) {
      toast.error('Failed to delete member');
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      return format(date, 'PP');
    } catch {
      return '';
    }
  };

  const handleExport = () => {
    if (!members?.length) return;

    const csvContent = [
      ['Name', 'Email', 'Phone', 'Status', 'Membership ID', 'Joined Date'],
      ...members.map(member => [
        member.name,
        member.email,
        member.phone,
        member.status,
        member.membership_id,
        formatDate(member.created_at)
      ])
    ].map(row => row.join(','));

    const blob = new Blob([csvContent.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Container>
      <div className="flex flex-col space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {calculateMemberStats(members || []).map((data, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-y-1">
                    <div className="text-base font-medium text-muted-foreground">{data.title}</div>
                    <div className="flex items-center gap-x-2">
                      <h4 className="text-2xl font-semibold">{data.value}</h4>
                      <div className={`text-sm ${data.change > 0 ? 'text-success' : 'text-destructive'}`}>
                        ({data.change > 0 ? '+' : ''}{data.change}%)
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{data.desc}</div>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-${data.color}/20`}>
                    <data.icon className={`h-6 w-6 text-${data.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Members</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            >
              {viewMode === 'list' ? <LayoutGrid size={20} /> : <LayoutList size={20} />}
            </Button>
            <Button onClick={() => navigate('/members/new')}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex space-x-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Membership ID</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          {member.avatar ? (
                            <AvatarImage src={member.avatar} alt={member.name} />
                          ) : (
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                          {member.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                          {member.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{getMembershipPlanName(member.membership_id)}</span>
                        {member.membership_end_date && (
                          <span className="text-sm text-muted-foreground">
                            Expires: {formatDate(member.membership_end_date)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(member.created_at)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/members/${member.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/members/edit/${member.id}`)}>
                            <FileEdit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setDeletingMemberId(member.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        {member.avatar ? (
                          <AvatarImage src={member.avatar} alt={member.name} />
                        ) : (
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.membership_id}</div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/members/${member.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/members/edit/${member.id}`)}>
                          <FileEdit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setDeletingMemberId(member.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      {member.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      {member.phone}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant="secondary" className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Joined {formatDate(member.created_at)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this member? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingMemberId && handleDelete(deletingMemberId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MembersListPage;
