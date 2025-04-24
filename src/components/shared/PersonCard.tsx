
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Calendar, Mail, Phone, Star, MoreHorizontal } from "lucide-react";
import { getInitials } from "@/utils/stringUtils";

interface PersonCardProps {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  specialty?: string;
  department?: string;
  status: 'active' | 'inactive';
  rating?: number;
  stats?: {
    label: string;
    value: number;
  }[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewProfile?: (id: string) => void;
}

export function PersonCard({
  id,
  name,
  email,
  phone,
  avatar,
  role,
  specialty,
  department,
  status,
  rating,
  stats,
  onEdit,
  onDelete,
  onViewProfile,
}: PersonCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <Badge 
              variant={status === 'active' ? 'default' : 'secondary'}
              className={status === 'active' ? 'bg-green-500' : 'bg-gray-500'}
            >
              {status}
            </Badge>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{role}</p>
            {(specialty || department) && (
              <p className="text-sm text-muted-foreground">{specialty || department}</p>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="h-4 w-4 mr-2" />
              {email}
            </div>
            {phone && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                {phone}
              </div>
            )}
          </div>

          {rating && (
            <div className="mt-3 flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="font-medium">{rating}</span>
              <span className="text-sm text-muted-foreground ml-1">rating</span>
            </div>
          )}

          {stats && stats.length > 0 && (
            <div className="mt-3 flex gap-2">
              {stats.map((stat, index) => (
                <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {stat.value} {stat.label}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex border-t">
          <Button
            variant="ghost"
            className="flex-1 rounded-none py-2 h-auto font-normal text-xs"
            onClick={() => onViewProfile?.(id)}
          >
            View Profile
          </Button>
          <div className="border-r" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none h-auto py-2"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete?.(id)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
