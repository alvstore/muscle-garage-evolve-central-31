
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MoreVertical, Pencil, Trash2, Quote, PlayCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { MotivationalMessage } from "@/types/notification";
import { useMotivationalMessages } from "@/hooks/use-motivational-messages";
import { toast } from 'sonner';

interface MotivationalMessagesListProps {
  onEdit: (message: MotivationalMessage) => void;
}

const MotivationalMessagesList = ({ onEdit }: MotivationalMessagesListProps) => {
  const { messages, isLoading, toggleActive, deleteMessage } = useMotivationalMessages();
  const [filter, setFilter] = useState<string>("all");

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await toggleActive(id, currentStatus);
      toast.success(`Message ${currentStatus ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      console.error("Error toggling active status:", error);
      toast.error("Failed to toggle active status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id);
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleSendNow = (message: MotivationalMessage) => {
    // Simulate sending the message manually
    toast.success(`Message "${message.content.substring(0, 30)}..." sent to all active members`);
  };

  const filteredMessages = filter === "all"
    ? messages
    : messages?.filter(message => message.category === filter);

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
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 rounded-full border-4 border-t-primary mx-auto animate-spin"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading messages...</p>
            </div>
          </div>
        ) : filteredMessages?.length === 0 ? (
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
                {filteredMessages?.map((message) => (
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
