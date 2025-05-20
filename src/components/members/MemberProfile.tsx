
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isValid } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Mail, MapPin, Phone, User, Briefcase, Droplets } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface Trainer {
  id: string;
  name: string;
  avatar_url?: string;
}

const MemberProfile = ({ member, onEdit }: { member: any, onEdit: () => void }) => {
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  
  useEffect(() => {
    const fetchTrainerData = async () => {
      if (member?.trainer_id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', member.trainer_id)
            .single();
            
          if (!error && data) {
            setTrainer({
              id: data.id,
              name: data.full_name || 'Unnamed Trainer',
              avatar_url: data.avatar_url
            });
          }
        } catch (error) {
          console.error("Error fetching trainer data:", error);
        }
      }
    };
    
    fetchTrainerData();
  }, [member?.trainer_id]);

  // Format date safely
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided';
    
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'dd MMM yyyy');
      }
      return 'Invalid date';
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get avatar initials
  const getInitials = (name?: string) => {
    if (!name) return 'M';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

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
                <AvatarImage 
                  src={member?.profile_picture || member?.avatar} 
                  alt={member?.name} 
                />
                <AvatarFallback className="text-2xl">
                  {getInitials(member?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold">{member?.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Member since {member?.created_at ? formatDate(member.created_at) : 'N/A'}
                </p>
              </div>
              <Badge variant={member?.membership_status === 'active' ? 'default' : 'destructive'}>
                {member?.membership_status || 'Unknown Status'}
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
                    <p>{member?.date_of_birth ? formatDate(member.date_of_birth) : 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Occupation</p>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <p>{member?.occupation || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Blood Group</p>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-muted-foreground" />
                    <p>{member?.blood_group || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium">Membership Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Membership Plan</p>
                    <p>{member?.membership_name || member?.memberships?.name || 'No plan'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                    <p>{member?.membership_end_date ? formatDate(member.membership_end_date) : 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium">Assigned Trainer</h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={trainer?.avatar_url || ''} alt={trainer?.name} />
                    <AvatarFallback>
                      {getInitials(trainer?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{trainer?.name || 'No trainer assigned'}</p>
                    {trainer && <p className="text-sm text-muted-foreground">Personal Trainer</p>}
                  </div>
                </div>
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
