
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  RefreshCw, 
  Mail, 
  MessageSquare, 
  Calendar 
} from "lucide-react";
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

const MembersListPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call to fetch members
    setLoading(true);
    
    setTimeout(() => {
      // Mock data
      const mockMembers: Member[] = [
        {
          id: "member-1",
          email: "john.doe@example.com",
          name: "John Doe",
          role: "member",
          phone: "+1 (555) 123-4567",
          dateOfBirth: "1990-05-15",
          goal: "Build muscle and improve overall fitness",
          trainerId: "trainer-123",
          membershipId: "platinum-12m",
          membershipStatus: "active",
          membershipStartDate: "2023-01-15",
          membershipEndDate: "2024-01-15",
        },
        {
          id: "member-2",
          email: "jane.smith@example.com",
          name: "Jane Smith",
          role: "member",
          phone: "+1 (555) 987-6543",
          dateOfBirth: "1988-09-22",
          goal: "Lose weight and increase endurance",
          trainerId: "trainer-456",
          membershipId: "gold-6m",
          membershipStatus: "active",
          membershipStartDate: "2023-06-01",
          membershipEndDate: "2023-12-01",
        },
        {
          id: "member-3",
          email: "mike.johnson@example.com",
          name: "Mike Johnson",
          role: "member",
          phone: "+1 (555) 456-7890",
          dateOfBirth: "1992-03-10",
          goal: "Build strength and improve athletic performance",
          trainerId: "trainer-789",
          membershipId: "silver-3m",
          membershipStatus: "expired",
          membershipStartDate: "2023-01-01",
          membershipEndDate: "2023-04-01",
        },
        {
          id: "member-4",
          email: "sarah.wilson@example.com",
          name: "Sarah Wilson",
          role: "member",
          phone: "+1 (555) 789-0123",
          dateOfBirth: "1995-11-18",
          goal: "Tone body and improve flexibility",
          trainerId: "trainer-123",
          membershipId: "gold-6m",
          membershipStatus: "inactive",
          membershipStartDate: "2023-02-15",
          membershipEndDate: "2023-08-15",
        },
        {
          id: "member-5",
          email: "alex.brown@example.com",
          name: "Alex Brown",
          role: "member",
          phone: "+1 (555) 321-6547",
          dateOfBirth: "1985-07-30",
          goal: "Maintain fitness and improve cardio",
          trainerId: "trainer-456",
          membershipId: "platinum-12m",
          membershipStatus: "active",
          membershipStartDate: "2023-05-01",
          membershipEndDate: "2024-05-01",
        }
      ];
      
      setMembers(mockMembers);
      setLoading(false);
    }, 1000);
  }, []);

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
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle quick actions for members
  const handleQuickAction = (memberId: string, action: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    
    switch (action) {
      case "message":
        toast.success(`Sending message to ${member.name}`);
        // In a real app, this would open a messaging interface
        break;
      case "checkin":
        toast.success(`Manual check-in recorded for ${member.name}`);
        // In a real app, this would record attendance
        break;
      case "renew":
        navigate(`/membership?memberId=${memberId}`);
        break;
      case "workout":
        navigate(`/fitness/workout-plans?memberId=${memberId}`);
        break;
      default:
        toast.error("Action not implemented");
    }
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
                      onClick={() => navigate(`/members/${member.id}`)}
                    >
                      View Profile
                    </Button>
                    <div className="border-r"></div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex-1 rounded-none py-2 h-auto font-normal text-xs"
                        >
                          Quick Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleQuickAction(member.id, "message")}>
                          <Mail className="h-4 w-4 mr-2" /> 
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleQuickAction(member.id, "checkin")}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Manual Check-in
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleQuickAction(member.id, "renew")}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Renew Membership
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleQuickAction(member.id, "workout")}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Assign Workout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="border-r"></div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-none h-auto py-2"
                      onClick={() => toast.info("More options coming soon")}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
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
