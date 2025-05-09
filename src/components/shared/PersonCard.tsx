
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin } from 'lucide-react';
import { getInitials } from '@/utils/stringUtils';

interface PersonCardProps {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  status?: 'active' | 'inactive' | 'pending';
  size?: 'sm' | 'md' | 'lg';
}

const PersonCard: React.FC<PersonCardProps> = ({
  name,
  role,
  email,
  phone,
  location,
  avatarUrl,
  status = 'active',
  size = 'md',
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const avatarSizes = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14',
    lg: 'h-20 w-20',
  };

  const nameSizes = {
    sm: 'text-sm font-medium',
    md: 'text-lg font-medium',
    lg: 'text-xl font-semibold',
  };

  return (
    <Card className="w-full">
      <CardContent className="flex items-center p-4">
        <Avatar className={avatarSizes[size]}>
          <AvatarImage src={avatarUrl || ''} alt={name} />
          <AvatarFallback className="bg-primary/10">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="ml-4 flex-grow">
          <div className="flex items-center justify-between">
            <h3 className={nameSizes[size]}>{name}</h3>
            {status && (
              <Badge className={getStatusColor()}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            )}
          </div>
          {role && <p className="text-sm text-muted-foreground">{role}</p>}
          <div className="mt-2 space-y-1">
            {email && (
              <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{phone}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonCard;
