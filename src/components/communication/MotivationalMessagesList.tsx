
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Edit, 
  Trash2,
  MoreHorizontal 
} from "lucide-react";
import { MotivationalMessage, MotivationalCategory } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";

interface MotivationalMessagesListProps {
  messages: MotivationalMessage[];
  isLoading: boolean;
  onEdit: (message: MotivationalMessage) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

const getCategoryColor = (category: MotivationalCategory) => {
  switch (category) {
    case 'motivation':
      return "bg-blue-100 text-blue-800";
    case 'fitness':
      return "bg-green-100 text-green-800";
    case 'nutrition':
      return "bg-orange-100 text-orange-800";
    case 'wellness':
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const MotivationalMessageCard = ({ 
  message, 
  onEdit, 
  onDelete, 
  onToggleActive 
}: { 
  message: MotivationalMessage; 
  onEdit: (message: MotivationalMessage) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}) => {
  const active = message.active || message.isActive || false;
  const createdDate = message.created_at || message.createdAt || '';
  
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold">{message.title}</h3>
          <div className="flex items-center space-x-2">
            <Badge variant={active ? "success" : "secondary"}>
              {active ? "Active" : "Inactive"}
            </Badge>
            <Switch
              checked={active}
              onCheckedChange={() => onToggleActive(message.id, active)}
            />
          </div>
        </div>
        
        <p className="mt-2 text-gray-600">{message.content}</p>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getCategoryColor(message.category)}>
              {message.category}
            </Badge>
            {message.tags && message.tags.length > 0 && (
              <div className="text-sm text-gray-500">
                Tags: {message.tags.join(', ')}
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            By {message.author || 'Unknown'} • {createdDate && formatDistanceToNow(new Date(createdDate), { addSuffix: true })}
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(message)}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(message.id)}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const MotivationalMessagesList: React.FC<MotivationalMessagesListProps> = ({
  messages,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-lg font-medium">No motivational messages found</p>
          <p className="text-muted-foreground">Create your first message to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {messages.map((message) => (
        <MotivationalMessageCard
          key={message.id}
          message={message}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
};

export default MotivationalMessagesList;
