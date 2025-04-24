import React from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrainerAnnouncementForm from '@/components/communication/TrainerAnnouncementForm';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import Announcements from '@/components/dashboard/Announcements';
import FeedbackList from '@/components/communication/FeedbackList';
import { Announcement } from '@/types/notification';
import { Member } from '@/types';
import { useAuth } from '@/hooks/use-auth';

// Mock data
const mockAnnouncements: Announcement[] = [
  {
    id: "announcement1",
    title: "New Workout Program",
    content: "I've created a new workout program focused on strength building. Check it out!",
    authorId: "trainer1",
    authorName: "Alex Trainer",
    createdAt: "2023-07-10T10:00:00Z",
    priority: "medium",
    targetRoles: ["member"],
    channels: ["in-app", "email"],
    sentCount: 15,
    forRoles: ["member"],
    createdBy: "trainer1"
  },
  {
    id: "announcement2",
    title: "Holiday Schedule",
    content: "Please note that I'll be away on vacation from July 20-25. Make sure to follow your workout plan during this time.",
    authorId: "trainer1",
    authorName: "Alex Trainer",
    createdAt: "2023-07-12T14:30:00Z",
    priority: "high",
    targetRoles: ["member"],
    channels: ["in-app", "email", "sms"],
    sentCount: 15,
    forRoles: ["member"],
    createdBy: "trainer1"
  }
];

// Update mock members to include required status property
const mockMembers: Member[] = [
  {
    id: 'member1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'member',
    membershipStatus: 'active',
    trainerId: 'trainer1',
    goal: 'Weight Loss',
    status: 'active' // Add the required status property
  },
  {
    id: 'member2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'member',
    membershipStatus: 'active',
    trainerId: 'trainer1',
    goal: 'Muscle Gain',
    status: 'active' // Add the required status property
  },
  {
    id: 'member3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'member',
    membershipStatus: 'active',
    trainerId: 'trainer2',
    goal: 'Strength',
    status: 'active' // Add the required status property
  }
];

const TrainerAnnouncementPage = () => {
  const { user } = useAuth();
  
  // Filter members to only show those assigned to this trainer
  const trainerMembers = mockMembers.filter(member => member.trainerId === user?.id);
  
  // Filter announcements to only show those created by this trainer
  const trainerAnnouncements = mockAnnouncements.filter(announcement => announcement.authorId === user?.id);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Member Communications</h1>
          <p className="text-muted-foreground">Manage communications with your assigned members</p>
        </div>
      </div>
      
      <Tabs defaultValue="announcements">
        <TabsList className="mb-6">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="feedback">Member Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="announcements" className="space-y-6">
          <TrainerAnnouncementForm members={trainerMembers} />
          
          <Card>
            <CardHeader>
              <CardTitle>My Announcements</CardTitle>
              <CardDescription>Previous announcements you've sent to members</CardDescription>
            </CardHeader>
            <CardContent>
              <Announcements announcements={trainerAnnouncements} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback">
          <FeedbackList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainerAnnouncementPage;
