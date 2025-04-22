
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Define a local Member interface for this component
interface MembersList {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar_url?: string;
  dateOfBirth: string;
  membershipId: string;
  membershipStatus: "active" | "inactive" | "expired";
  membershipStartDate: string;
  membershipEndDate: string;
}

const MembersListPage = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<MembersList[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<MembersList[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch members
    const fetchMembers = async () => {
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          const mockMembers = [
            {
              id: "1",
              name: "John Doe",
              email: "john.doe@example.com",
              phone: "+91 9876543210",
              role: "member",
              avatar_url: "/placeholder.svg",
              dateOfBirth: "1990-05-15",
              membershipId: "platinum-12m",
              membershipStatus: "active" as const,
              membershipStartDate: "2023-01-15",
              membershipEndDate: "2024-01-15",
            },
            {
              id: "2",
              name: "Jane Smith",
              email: "jane.smith@example.com",
              phone: "+91 9876543211",
              role: "member",
              avatar_url: "/placeholder.svg",
              dateOfBirth: "1992-08-23",
              membershipId: "gold-6m",
              membershipStatus: "inactive" as const,
              membershipStartDate: "2023-05-01",
              membershipEndDate: "2023-11-01",
            },
            {
              id: "3",
              name: "Alice Johnson",
              email: "alice.johnson@example.com",
              phone: "+91 9876543212",
              role: "member",
              avatar_url: "/placeholder.svg",
              dateOfBirth: "1985-12-10",
              membershipId: "silver-3m",
              membershipStatus: "expired" as const,
              membershipStartDate: "2023-07-15",
              membershipEndDate: "2023-10-15",
            },
          ];
          setMembers(mockMembers);
          setFilteredMembers(mockMembers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching members:", error);
        toast.error("Failed to load members");
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Filter members based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = members.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.phone.includes(searchTerm)
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(members);
    }
  }, [searchTerm, members]);

  const handleViewMember = (id: string) => {
    navigate(`/members/${id}`);
  };

  const handleAddMember = () => {
    navigate("/members/new");
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-yellow-500";
      case "expired":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Members</h1>
        <div className="flex justify-center items-center h-64">
          <p>Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Members</h1>
        <Button onClick={handleAddMember}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Members List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search members..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar_url} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{member.name}</div>
                          <div className="text-xs text-gray-500">
                            {member.role === "member" ? "Member" : member.role}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{member.email}</div>
                      <div className="text-xs text-gray-500">{member.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getBadgeVariant(member.membershipStatus)}>
                        {member.membershipStatus.charAt(0).toUpperCase() +
                          member.membershipStatus.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{member.membershipId}</div>
                      <div className="text-xs text-gray-500">
                        {member.membershipEndDate && (
                          <>
                            Expires:{" "}
                            {format(
                              new Date(member.membershipEndDate),
                              "MMM dd, yyyy"
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewMember(member.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembersListPage;
