import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Filter, MoreVertical } from "lucide-react";
import { Member } from "@/types";
import { toast } from "sonner";

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
          status: "active",
          membershipStatus: "active",
          membershipId: "platinum-12m",
          membershipStartDate: new Date("2023-01-15"),
          membershipEndDate: new Date("2024-01-15"),
        },
        {
          id: "member-2",
          email: "jane.smith@example.com",
          name: "Jane Smith",
          role: "member",
          phone: "+1 (555) 987-6543",
          status: "active",
          membershipStatus: "active",
          membershipId: "gold-6m",
          membershipStartDate: new Date("2023-06-01"),
          membershipEndDate: new Date("2023-12-01"),
        },
        {
          id: "member-3",
          email: "mike.johnson@example.com",
          name: "Mike Johnson",
          role: "member",
          phone: "+1 (555) 456-7890",
          status: "active",
          membershipStatus: "expired",
          membershipId: "silver-3m",
          membershipStartDate: new Date("2023-01-01"),
          membershipEndDate: new Date("2023-04-01"),
        },
        {
          id: "member-4",
          email: "sarah.wilson@example.com",
          name: "Sarah Wilson",
          role: "member",
          phone: "+1 (555) 789-0123",
          status: "active",
          membershipStatus: "inactive",
          membershipId: "gold-6m",
          membershipStartDate: new Date("2023-02-15"),
          membershipEndDate: new Date("2023-08-15"),
        },
        {
          id: "member-5",
          email: "alex.brown@example.com",
          name: "Alex Brown",
          role: "member",
          phone: "+1 (555) 321-6547",
          status: "active",
          membershipStatus: "active",
          membershipId: "platinum-12m",
          membershipStartDate: new Date("2023-05-01"),
          membershipEndDate: new Date("2024-05-01"),
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
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none py-2 h-auto font-normal text-xs"
                      onClick={() => toast.info("Quick actions coming soon")}
                    >
                      Quick Actions
                    </Button>
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
