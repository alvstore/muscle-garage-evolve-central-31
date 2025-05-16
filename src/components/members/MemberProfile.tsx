import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, User, Mail, Phone, Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Member } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { trainersService } from '@/services/trainersService';
import { Skeleton } from '@/components/ui/skeleton';

interface MemberProfileProps {
  member: Member | null;
  onEdit: () => void;
  isLoading?: boolean;
}

const MemberProfile: React.FC<MemberProfileProps> = ({ 
  member, 
  onEdit, 
  isLoading = false 
}) => {
  const { data: trainer, isLoading: isLoadingTrainer } = useQuery(
    ['trainer', member?.trainer_id],
    () => trainersService.getTrainer(member?.trainer_id || ''),
    {
      enabled: !!member?.trainer_id,
    }
  );
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Member Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!member) {
    return (
      <Card>
        <CardContent className="text-center p-6">
          No member selected.
        </CardContent>
      </Card>
    );
  }
  
  const displayTrainer = () => {
    // Use trainer_id or trainerId (backward compatibility)
    const hasTrainer = member?.trainer_id || member?.trainerId;
    
    if (hasTrainer) {
      return (
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={trainer?.avatar_url} />
            <AvatarFallback>{trainer?.name?.charAt(0) || 'T'}</AvatarFallback>
          </Avatar>
          <span>{trainer?.name || 'Assigned Trainer'}</span>
        </div>
      );
    }
    
    return <span className="text-muted-foreground">No trainer assigned</span>;
  };
  
  const getMembershipStatusBadge = () => {
    const isActive = member.membership_status === 'active';
    
    return (
      <Badge variant={isActive ? 'outline' : 'secondary'}>
        {isActive ? 'Active Member' : 'Inactive'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Member Profile</CardTitle>
        <Button variant="ghost" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={member.avatar} />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-3xl font-semibold">{member.name}</h4>
            <p className="text-muted-foreground">
              {member.email}
            </p>
            {getMembershipStatusBadge()}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-medium">Personal Information</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{member.gender}, {member.date_of_birth}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{member.email || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{member.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{member.address || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-medium">Membership Details</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                Start Date: {member.membership_start_date || 'N/A'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                End Date: {member.membership_end_date || 'N/A'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span>Status: {member.membership_status || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-lg font-medium">Assigned Trainer</h4>
          {isLoadingTrainer ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            displayTrainer()
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberProfile;
