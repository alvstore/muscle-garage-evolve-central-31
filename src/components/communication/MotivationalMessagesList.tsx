
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { MotivationalMessage } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';

export interface MotivationalMessagesListProps {
  messages: MotivationalMessage[];
  isLoading: boolean;
  onEdit: (message: MotivationalMessage) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
}

const MotivationalMessagesList: React.FC<MotivationalMessagesListProps> = ({
  messages,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Motivational Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <span>Loading messages...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Motivational Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No motivational messages found</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first message to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Motivational Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="border rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{message.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {message.category} • {message.tags?.join(', ') || 'No tags'}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Badge variant={message.active ? "success" : "secondary"}>
                    {message.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              
              <p className="my-2">{message.content}</p>
              
              <div className="flex items-center justify-between text-sm pt-2 border-t mt-2">
                <span className="text-muted-foreground">
                  Created {message.created_at && formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                </span>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => onToggleActive(message.id, !message.active)}
                  >
                    {message.active ? (
                      <ToggleRight className="h-4 w-4" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onEdit(message)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(message.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationalMessagesList;
