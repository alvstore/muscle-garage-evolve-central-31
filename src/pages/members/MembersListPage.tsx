
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Filter, MoreVertical, Eye, CreditCard, CalendarDays, TrashIcon } from "lucide-react";
import { Member } from "@/types";
import { toast } from "sonner";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/services/supabaseClient";
import { useBranch } from "@/hooks/use-branch";

const MembersListPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { currentBranch } = useBranch();

  useEffect(() => {
    fetchMembers();
  }, [currentBranch?.id]);

  const fetchMembers = async () => {
    setLoading(true);
    
    try {
      const branchFilter = currentBranch?.id ? { branch_id: currentBranch.id } : {};
      
      // Get all members with their latest membership status
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          date_of_birth,
          avatar_url,
          role,
          member_memberships (
            id,
            membership_id,
            status,
            start_date,
            end_date,
            memberships (
              name
            )
          )
        `)
        .eq('role', 'member')
        .eq(currentBranch?.id ? 'branch_id' : '', currentBranch?.id || '')
        .order('full_name');
      
      if (error) throw error;
      
      // Format member data for display
      const formattedMembers = data.map(member => {
        const latestMembership = member.member_memberships && member.member_memberships.length > 0 
          ? member.member_memberships.sort((a, b) => 
              new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
            )[0] 
          : null;
        
        return {
          id: member.id,
          name: member.full_name,
          email: member.email,
          phone: member.phone,
          role: member.role,
          avatar: member.avatar_url,
          dateOfBirth: member.date_of_birth,
          membershipId: latestMembership?.memberships?.name || 'No Membership',
          membershipStatus: latestMembership?.status || 'inactive',
          membershipStartDate: latestMembership?.start_date || null,
          membershipEndDate: latestMembership?.end_date || null,
        };
      });
      
      setMembers(formattedMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const filteredMembers = members.filter(member => 
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProfile = (memberId: string) => {
    navigate(`/members/${memberId}`);
  };

  const handleRenewMembership = (memberId: string) => {
    navigate(`/finance/invoices/new?memberId=${memberId}`);
    toast.info('Creating new invoice for membership renewal');
  };

  const handleAddToClass = (memberId: string) => {
    navigate(`/classes?memberId=${memberId}`);
    toast.info('Add member to class');
  };

  const handleDeleteMember = (memberId: string) => {
    toast.info('This action would delete the member account');
    // Implementation for deleting member would go here
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Members</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button onClick={() => navigate("/members/new")}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 rounded-full border-4 border-t-accent animate-spin"></div>
          </div>
        ) : filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map(member => (
              <Card key={member.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <Badge className={getStatusColor(member.membershipStatus)}>
                        {member.membershipStatus.charAt(0).toUpperCase() + member.membershipStatus.slice(1)}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium text-lg mt-3">{member.name}</h3>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                    {member.phone && (
                      <div className="text-sm text-muted-foreground">{member.phone}</div>
                    )}
                    
                    <div className="mt-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Membership:</span>
                        <span>{member.membershipId || "None"}</span>
                      </div>
                      {member.membershipEndDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expires:</span>
                          <span>{new Date(member.membershipEndDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex border-t">
                    <Button 
                      variant="ghost" 
                      className="flex-1 rounded-none py-2 h-auto font-normal text-xs"
                      onClick={() => handleViewProfile(member.id)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View Profile
                    </Button>
                    <div className="border-r"></div>
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none py-2 h-auto font-normal text-xs"
                      onClick={() => handleRenewMembership(member.id)}
                    >
                      <CreditCard className="h-3.5 w-3.5 mr-1" />
                      Renew
                    </Button>
                    <div className="border-r"></div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-none h-auto py-2"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAddToClass(member.id)}>
                          <CalendarDays className="h-4 w-4 mr-2" />
                          Add to Class
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteMember(member.id)} className="text-destructive">
                          <TrashIcon className="h-4 w-4 mr-2" />
                          Delete Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">No members found matching your search criteria</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default MembersListPage;
