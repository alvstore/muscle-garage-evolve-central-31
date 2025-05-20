
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Mail, MapPin, Phone, User, Loader2 } from "lucide-react";
import trainersService from '@/services/trainersService';

interface Trainer {
  id: string;
  name: string;
  avatar_url?: string;
}

const MemberProfile = ({ member, onEdit }: { member: any, onEdit: () => void }) => {
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchTrainerData = async () => {
      if (member?.trainer_id || member?.trainerId) {
        try {
          setIsLoading(true);
          const trainerData = await trainersService.getTrainerById(member.trainer_id || member.trainerId);
          setTrainer(trainerData);
        } catch (error) {
          console.error("Error fetching trainer data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchTrainerData();
  }, [member?.trainer_id, member?.trainerId]);

  // Safe access to member properties
  const memberName = member?.name || 'Unknown Member';
  const memberInitials = memberName.substring(0, 2).toUpperCase();
  const memberAvatar = member?.avatar_url || member?.profile_picture || member?.avatar || '';
  const membershipStatus = member?.membership_status || 'unknown';
  const memberCreatedAt = member?.created_at ? format(parseISO(member.created_at), 'MMM yyyy') : 'N/A';
  
  // Safe access to trainer properties
  const trainerAvatar = trainer?.avatar_url || '';
  const trainerName = trainer?.name || 'No Trainer Assigned';
  const displayTrainerName = trainer?.name || 'No Trainer Assigned';

  if (!member) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Member Profile</CardTitle>
          <Button onClick={onEdit}>Edit Profile</Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={memberAvatar} alt={memberName} />
                <AvatarFallback className="text-2xl">{memberInitials}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold">{memberName}</h2>
                <p className="text-sm text-muted-foreground">Member since {memberCreatedAt}</p>
              </div>
              <Badge variant={membershipStatus === 'active' ? 'default' : 'destructive'}>
                {membershipStatus}
              </Badge>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{member?.email || 'No email provided'}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{member?.phone || 'No phone provided'}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p>{member?.address ? `${member.address}, ${member.city || ''}, ${member.state || ''}` : 'No address provided'}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <p>{member?.date_of_birth ? format(parseISO(member.date_of_birth), 'dd MMM yyyy') : 
                       (member?.dateOfBirth ? format(parseISO(member.dateOfBirth), 'dd MMM yyyy') : 'Not provided')}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium">Membership Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Membership Plan</p>
                    <p>{member?.membership_name || 'No plan'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                    <p>{member?.membership_end_date ? format(parseISO(member.membership_end_date), 'dd MMM yyyy') : 
                       (member?.membershipEndDate ? format(parseISO(member.membershipEndDate), 'dd MMM yyyy') : 'N/A')}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium">Assigned Trainer</h3>
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <p>Loading trainer information...</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={trainerAvatar} alt={trainerName} />
                      <AvatarFallback>{trainerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{displayTrainerName}</p>
                      {trainer && <p className="text-sm text-muted-foreground">Personal Trainer</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="attendance">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No attendance records found.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No payment records found.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="fitness">
          <Card>
            <CardHeader>
              <CardTitle>Fitness Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No fitness data available.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberProfile;
