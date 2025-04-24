import React from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, Phone } from 'lucide-react';

const MemberProfilePage = () => {

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // When creating a mock member, add the status property
  const mockMember = {
    id: "member1",
    email: "member@example.com",
    name: "Jordan Lee",
    role: "member",
    phone: "+1234567890",
    dateOfBirth: "1990-05-15",
    goal: "Weight loss and muscle toning",
    trainerId: "trainer1",
    membershipId: "membership1",
    membershipStatus: "active",
    membershipStartDate: "2023-01-01",
    membershipEndDate: "2023-12-31",
    status: "active"
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Member Profile</h1>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Details about the member's profile</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" alt={mockMember.name} />
                <AvatarFallback>{getInitials(mockMember.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{mockMember.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {mockMember.id}</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>{mockMember.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>{mockMember.phone}</span>
              </div>
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                <span>{mockMember.dateOfBirth}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div>
                <h4 className="text-sm font-medium">Membership Status</h4>
                <Badge variant="secondary">{mockMember.membershipStatus}</Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium">Goal</h4>
                <p>{mockMember.goal}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default MemberProfilePage;
