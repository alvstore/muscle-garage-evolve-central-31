
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { format, isAfter, isPast, parseISO } from "date-fns";

// Mock task data
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  assignedBy: {
    id: string;
    name: string;
    role: "admin" | "staff";
    avatar?: string;
  };
}

const mockTasks: Task[] = [
  {
    id: "task1",
    title: "Create diet plan for new members",
    description: "Prepare initial diet plans for 5 new members who joined this week",
    dueDate: "2025-04-15T17:00:00Z",
    status: "pending",
    priority: "high",
    assignedBy: {
      id: "admin1",
      name: "John Admin",
      role: "admin",
    }
  },
  {
    id: "task2",
    title: "Update workout schedules",
    description: "Update the weekly workout schedules for the intermediate class",
    dueDate: "2025-04-12T17:00:00Z",
    status: "in_progress",
    priority: "medium",
    assignedBy: {
      id: "staff1",
      name: "Sarah Staff",
      role: "staff",
    }
  },
  {
    id: "task3",
    title: "Member progress review",
    description: "Review and document progress for assigned members for the monthly report",
    dueDate: "2025-04-08T17:00:00Z",
    status: "overdue",
    priority: "high",
    assignedBy: {
      id: "admin2",
      name: "Mike Manager",
      role: "admin",
    }
  },
  {
    id: "task4",
    title: "Equipment maintenance check",
    description: "Conduct weekly check of equipment in your assigned training area",
    dueDate: "2025-04-14T17:00:00Z",
    status: "completed",
    priority: "low",
    assignedBy: {
      id: "staff2",
      name: "Lisa Staff",
      role: "staff",
    }
  }
];

const TrainerTaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  
  // Function to update task status
  const updateTaskStatus = (taskId: string, newStatus: "pending" | "in_progress" | "completed" | "overdue") => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    
    toast.success(`Task status updated to ${newStatus.replace('_', ' ')}`);
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="flex items-center gap-1"><Calendar className="h-3 w-3" /> In Progress</Badge>;
      case 'completed':
        return <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" /> Completed
        </Badge>;
      case 'overdue':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">High</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
          <CardDescription>
            Tasks assigned to you by admin and staff members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No tasks assigned</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You don't have any tasks assigned to you at the moment.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Assigned By</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground">{task.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={task.assignedBy.avatar || ""} />
                            <AvatarFallback>
                              {task.assignedBy.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{task.assignedBy.name}</div>
                            <div className="text-xs text-muted-foreground capitalize">{task.assignedBy.role}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`text-sm ${isPast(parseISO(task.dueDate)) && task.status !== 'completed' ? 'text-red-500 font-medium' : ''}`}>
                          {format(parseISO(task.dueDate), "MMM dd, yyyy")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(parseISO(task.dueDate), "hh:mm a")}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(task.priority)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(task.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {task.status !== 'completed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateTaskStatus(task.id, "completed")}
                            >
                              Complete
                            </Button>
                          )}
                          {task.status === 'pending' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateTaskStatus(task.id, "in_progress")}
                            >
                              Start
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerTaskManagement;
