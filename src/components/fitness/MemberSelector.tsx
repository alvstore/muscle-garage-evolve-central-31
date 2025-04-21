
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Member } from "@/types";

interface MemberSelectorProps {
  onSelectMember: (member: Member) => void;
  selectedMemberId?: string;
}

const MemberSelector: React.FC<MemberSelectorProps> = ({ onSelectMember, selectedMemberId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

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
      ];
      
      setMembers(mockMembers);
      setLoading(false);
    }, 500);
  }, []);

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select a Member</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="h-8 w-8 rounded-full border-2 border-t-primary animate-spin"></div>
            </div>
          ) : filteredMembers.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredMembers.map(member => (
                <div 
                  key={member.id}
                  className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
                    selectedMemberId === member.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => onSelectMember(member)}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No members found matching your search
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberSelector;
