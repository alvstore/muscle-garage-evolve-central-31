
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, Phone, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MemberData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  goal?: string;
  trainer_id?: string;
  membership_id?: string;
  membership_start_date?: string;
  membership_end_date?: string;
  status?: string;
  membership_status?: string;
}

const MemberProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [member, setMember] = useState<MemberData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMemberData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let memberId = id;
        
        // If no ID is provided and the current user is a member, show their own profile
        if (!memberId && user?.role === 'member') {
          const { data: memberData, error: memberError } = await supabase
            .from('members')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (memberError) throw memberError;
          if (memberData) {
            setMember(memberData);
            setIsLoading(false);
            return;
          }
        }
        
        // If ID is provided, fetch that specific member
        if (memberId) {
          const { data, error: memberError } = await supabase
            .from('members')
            .select('*')
            .eq('id', memberId)
            .single();
            
          if (memberError) throw memberError;
          setMember(data);
        } else {
          setError('No member ID provided');
        }
      } catch (err: any) {
        console.error('Error fetching member:', err);
        setError(err.message || 'Failed to load member data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMemberData();
  }, [id, user]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <p className="mt-4">Loading member data...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </Container>
    );
  }

  if (!member) {
    return (
      <Container>
        <div className="py-6">
          <Alert>
            <AlertDescription>Member not found</AlertDescription>
          </Alert>
        </div>
      </Container>
    );
  }

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
                <AvatarImage src="" alt={member.name} />
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {member.id}</p>
              </div>
            </div>

            <div className="space-y-1">
              {member.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{member.email}</span>
                </div>
              )}
              {member.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{member.phone}</span>
                </div>
              )}
              {member.date_of_birth && (
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>{new Date(member.date_of_birth).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div>
                <h4 className="text-sm font-medium">Membership Status</h4>
                <Badge variant="secondary">{member.membership_status || 'Unknown'}</Badge>
              </div>
              {member.goal && (
                <div>
                  <h4 className="text-sm font-medium">Goal</h4>
                  <p>{member.goal}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default MemberProfilePage;
