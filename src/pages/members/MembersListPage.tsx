
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Filter, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useMembers } from "@/hooks/use-members";
import { useBranch } from "@/hooks/use-branch";

const MembersListPage = () => {
  const { members, isLoading, error } = useMembers();
  const { currentBranch } = useBranch();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Map profile/member status for badge color
  const getStatusColor = (status?: string) => {
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

  const getInitials = (name?: string) => {
    if (!name) return "M";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const filteredMembers = members.filter(
    (member) =>
      (member.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.phone || "").toLowerCase().includes(searchTerm.toLowerCase())
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
            <Button variant="outline" size="icon" type="button">
              <Filter className="h-4 w-4" />
            </Button>
            <Button onClick={() => navigate("/members/new")} disabled={!currentBranch}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>

        {!currentBranch && (
          <div className="text-center py-12 border rounded-lg text-amber-500">
            No branch selected. Please select a branch to view members.
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 rounded-full border-4 border-t-accent animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 border rounded-lg text-red-500">{error}</div>
        ) : filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={""} alt={member.name || "Member"} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <Badge className={getStatusColor(member.membership_status)}>
                        {member.membership_status
                          ? member.membership_status.charAt(0).toUpperCase() + member.membership_status.slice(1)
                          : "Active"}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-lg mt-3">{member.name || "Unnamed"}</h3>
                    <div className="text-sm text-muted-foreground">{member.email || "—"}</div>
                    {member.phone && (
                      <div className="text-sm text-muted-foreground">{member.phone}</div>
                    )}
                    <div className="mt-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Membership:</span>
                        <span>{member.membership_id || "—"}</span>
                      </div>
                      {member.membership_end_date && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expires:</span>
                          <span>
                            {new Date(member.membership_end_date).toLocaleDateString()}
                          </span>
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
                        <Button variant="ghost" className="flex-1 rounded-none py-2 h-auto font-normal text-xs">
                          Quick Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="z-40">
                        <DropdownMenuItem onClick={() => navigate(`/members/${member.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Suspend member – logic coming soon!")}>Suspend</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Renew member – logic coming soon!")}>Renew</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="border-r"></div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-none h-auto py-2"
                          aria-label="More options"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="z-40">
                        <DropdownMenuItem onClick={() => navigate(`/members/${member.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toast.info("Member history coming soon")}>View History</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Delete member coming soon")}>Delete</DropdownMenuItem>
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
