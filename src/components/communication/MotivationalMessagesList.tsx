
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MoreVertical, Pencil, Trash2, RefreshCcw, Quote, PlayCircle } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MotivationalMessage } from "@/types/notification";

// Mock data for motivational messages
const mockMessages: MotivationalMessage[] = [
  {
    id: "1",
    message: "The only bad workout is the one that didn't happen.",
    content: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
    category: "motivation",
    tags: ["workout", "consistency"],
    targetRoles: ["member"],
    frequency: "daily",
    enabled: true,
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2023-01-15T10:00:00Z",
    channels: ["push", "email"],
    active: true,
    isActive: true,
    createdBy: "admin1",
    title: "Workout Motivation"
  },
  {
    id: "2",
    message: "Your body can stand almost anything. It's your mind that you have to convince.",
    content: "Your body can stand almost anything. It's your mind that you have to convince.",
    author: "Andrew Murphy",
    category: "motivation",
    tags: ["mindset", "strength"],
    targetRoles: ["member"],
    frequency: "weekly",
    enabled: true,
    createdAt: "2023-02-10T15:30:00Z",
    updatedAt: "2023-02-10T15:30:00Z",
    channels: ["push", "email"],
    active: true,
    isActive: true,
    createdBy: "admin1",
    title: "Mind Over Matter"
  },
  {
    id: "3",
    message: "Proper nutrition is the foundation of a healthy lifestyle.",
    content: "Proper nutrition is the foundation of a healthy lifestyle.",
    author: "Unknown",
    category: "nutrition",
    tags: ["food", "health"],
    targetRoles: ["member"],
    frequency: "weekly",
    enabled: true,
    createdAt: "2023-03-05T09:45:00Z",
    updatedAt: "2023-03-05T09:45:00Z",
    channels: ["push", "email"],
    active: true,
    isActive: true,
    createdBy: "admin1",
    title: "Nutrition Basics"
  },
  {
    id: "4",
    message: "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success.",
    content: "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success.",
    author: "Dwayne Johnson",
    category: "motivation",
    tags: ["consistency", "success"],
    targetRoles: ["member"],
    frequency: "monthly",
    enabled: false,
    createdAt: "2023-04-20T14:20:00Z",
    updatedAt: "2023-04-20T14:20:00Z",
    channels: ["push", "email"],
    active: false,
    isActive: false,
    createdBy: "admin1",
    title: "Consistency is Key"
  },
  {
    id: "5",
    message: "To enjoy the glow of good health, you must exercise.",
    content: "To enjoy the glow of good health, you must exercise.",
    author: "Gene Tunney",
    category: "wellness",
    tags: ["health", "exercise"],
    targetRoles: ["member"],
    frequency: "weekly",
    enabled: true,
    createdAt: "2023-05-12T11:15:00Z",
    updatedAt: "2023-05-12T11:15:00Z",
    channels: ["push", "email"],
    active: true,
    isActive: true,
    createdBy: "admin1",
    title: "Health Benefits"
  }
];

interface MotivationalMessagesListProps {
  onEdit: (message: MotivationalMessage) => void;
}

const MotivationalMessagesList = ({ onEdit }: MotivationalMessagesListProps) => {
  const [messages, setMessages] = useState<MotivationalMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);
  }, []);

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    // In a real app, this would be an API call
    const updatedMessages = messages.map(message => 
      message.id === id ? { ...message, active: !currentStatus } : message
    );
    setMessages(updatedMessages);
    
    toast.success(`Message ${currentStatus ? 'disabled' : 'enabled'} successfully`);
  };

  const handleDelete = (id: string) => {
    // In a real app, this would be an API call
    setMessages(messages.filter(message => message.id !== id));
    toast.success("Message deleted successfully");
  };

  const handleSendNow = (message: MotivationalMessage) => {
    // Simulate sending the message manually
    toast.success(`Message "${message.content.substring(0, 30)}..." sent to all active members`);
  };

  const filteredMessages = filter === "all" 
    ? messages 
    : messages.filter(message => message.category === filter);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Motivational Messages</CardTitle>
            <CardDescription>Schedule and manage motivational messages for members</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button 
              variant={filter === "motivation" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilter("motivation")}
            >
              Motivation
            </Button>
            <Button 
              variant={filter === "fitness" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilter("fitness")}
            >
              Fitness
            </Button>
            <Button 
              variant={filter === "nutrition" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilter("nutrition")}
            >
              Nutrition
            </Button>
            <Button 
              variant={filter === "wellness" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilter("wellness")}
            >
              Wellness
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 rounded-full border-4 border-t-primary mx-auto animate-spin"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading messages...</p>
            </div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-10">
            <Quote className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No messages found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {filter === "all" 
                ? "No motivational messages have been created yet." 
                : `No messages found in the "${filter}" category.`}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Message</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">
                      {message.content.length > 50 
                        ? `${message.content.substring(0, 50)}...` 
                        : message.content}
                    </TableCell>
                    <TableCell>{message.author || "Unknown"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {message.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {message.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="capitalize">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={message.active} 
                        onCheckedChange={() => handleToggleActive(message.id, message.active)} 
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(message)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendNow(message)}>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Send Now
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(message.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MotivationalMessagesList;
