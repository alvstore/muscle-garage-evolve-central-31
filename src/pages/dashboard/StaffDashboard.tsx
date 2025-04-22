import React from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, FileText, Clock, Dumbbell, Bell, WalletIcon } from "lucide-react";

const StaffDashboard = () => {
  // Mock data for trainers list
  const trainersList = [
    {
      id: '1',
      full_name: 'Alex Johnson',
      avatar_url: '/avatars/trainer1.jpg'
    },
    {
      id: '2',
      full_name: 'Maria Garcia',
      avatar_url: '/avatars/trainer2.jpg'
    },
    {
      id: '3',
      full_name: 'James Wilson',
      avatar_url: '/avatars/trainer3.jpg'
    }
  ];

  // Mock data for recent members
  const recentMembers = [
    {
      id: '1',
      full_name: 'Ryan Thompson',
      avatar_url: '/avatars/member1.jpg',
      phone: '+91 9876543210'
    },
    {
      id: '2',
      full_name: 'Sophia Chen',
      avatar_url: '/avatars/member2.jpg',
      phone: '+91 9876543211'
    },
    {
      id: '3',
      full_name: 'David Kim',
      avatar_url: '/avatars/member3.jpg',
      phone: '+91 9876543212'
    }
  ];

  // Mock data for announcements
  const announcements = [
    {
      id: '1',
      title: 'New Yoga Class Schedule',
      content: 'We have updated our yoga class schedule. Check out the new timings!',
      createdAt: '2023-04-15T10:30:00.000Z',
      createdBy: 'admin',
      authorId: 'auth0|123456',
      authorName: 'Jane Smith',
      targetRoles: ['member'],
      channels: ['in-app'] as ['in-app'],
      priority: 'medium' as 'medium',
      forRoles: ['member'],
      sentCount: 156
    },
    {
      id: '2',
      title: 'Gym Maintenance',
      content: 'The gym will be closed for maintenance on Sunday from 2 PM to 5 PM.',
      createdAt: '2023-04-14T15:45:00.000Z',
      createdBy: 'admin',
      authorId: 'auth0|654321',
      authorName: 'John Doe',
      targetRoles: ['member', 'trainer'],
      channels: ['in-app'] as ['in-app'],
      priority: 'low' as 'low',
      forRoles: ['member', 'trainer'],
      sentCount: 234
    }
  ];

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Staff Dashboard</h1>
            <p className="text-muted-foreground">Overview of gym operations</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,450</div>
              <p className="text-xs text-muted-foreground">+20 this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">150</div>
              <p className="text-xs text-muted-foreground">+10 this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">320</div>
              <p className="text-xs text-muted-foreground">+5% from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Memberships</CardTitle>
              <WalletIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">+12 this week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Trainers</CardTitle>
              <CardDescription>Our top personal trainers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainersList.map((trainer, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={trainer.avatar_url} />
                      <AvatarFallback>{trainer.full_name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{trainer.full_name}</p>
                      <p className="text-xs text-muted-foreground">Personal Trainer</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Recent Members</CardTitle>
              <CardDescription>Newest members of our gym</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMembers.map((member, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.avatar_url} />
                      <AvatarFallback>{member.full_name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.full_name}</p>
                      <p className="text-xs text-muted-foreground">{member.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Latest gym announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{announcement.title}</h3>
                    <Badge>{announcement.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{announcement.content}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-muted-foreground">
                      By {announcement.authorName} on {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sent to {announcement.sentCount} members
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default StaffDashboard;
