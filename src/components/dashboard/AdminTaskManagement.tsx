
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar as CalendarIcon, Plus, Clock, CheckCircle, XCircle, AlertCircle, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'completed' | 'overdue';
  assignedTo: string;
  assignedToName: string;
  assignedToAvatar?: string;
  assignedToRole: 'staff' | 'trainer';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

const mockStaffAndTrainers = [
  { id: 'staff1', name: 'John Staff', role: 'staff' },
  { id: 'staff2', name: 'Sarah Admin', role: 'staff' },
  { id: 'trainer1', name: 'Alex Trainer', role: 'trainer' },
  { id: 'trainer2', name: 'Mike Fitness', role: 'trainer' },
];

const AdminTaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Create monthly class schedule',
      description: 'Design the class schedule for next month including all new classes',
      dueDate: new Date('2025-04-15'),
      status: 'pending',
      assignedTo: 'staff1',
      assignedToName: 'John Staff',
      assignedToRole: 'staff',
      priority: 'high',
      createdAt: new Date('2025-04-08')
    },
    {
      id: '2',
      title: 'Prepare nutrition plans',
      description: 'Create nutrition plans for 5 new members',
      dueDate: new Date('2025-04-20'),
      status: 'pending',
      assignedTo: 'trainer1',
      assignedToName: 'Alex Trainer',
      assignedToRole: 'trainer',
      priority: 'medium',
      createdAt: new Date('2025-04-07')
    }
  ]);
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
    assignedTo: '',
    priority: 'medium',
  });
  
  const { toast } = useToast();
  
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData({
        ...formData,
        dueDate: date
      });
    }
  };
  
  const createTask = () => {
    // Validate form
    if (!formData.title) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.assignedTo) {
      toast({
        title: "Error",
        description: "Please assign the task to someone",
        variant: "destructive"
      });
      return;
    }
    
    // Find the assigned user
    const assignedUser = mockStaffAndTrainers.find(u => u.id === formData.assignedTo);
    
    if (!assignedUser) {
      toast({
        title: "Error",
        description: "Selected user not found",
        variant: "destructive"
      });
      return;
    }
    
    // Create new task
    const newTask: Task = {
      id: (tasks.length + 1).toString(),
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      status: 'pending',
      assignedTo: formData.assignedTo,
      assignedToName: assignedUser.name,
      assignedToRole: assignedUser.role as 'staff' | 'trainer',
      priority: formData.priority as 'low' | 'medium' | 'high',
      createdAt: new Date()
    };
    
    // Add to tasks
    setTasks([...tasks, newTask]);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      dueDate: new Date(),
      assignedTo: '',
      priority: 'medium',
    });
    setSelectedDate(undefined);
    
    // Close dialog
    setIsOpen(false);
    
    // Show success notification
    toast({
      title: "Task Created",
      description: `Task assigned to ${assignedUser.name}`,
    });
  };
  
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "The task has been deleted successfully",
    });
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
      case 'overdue':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Overdue</Badge>;
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Task Management</CardTitle>
          <CardDescription>Assign tasks to staff and trainers</CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Assign a task to a staff member or trainer
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title</Label>
                <Input 
                  id="title" 
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter task title" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter task description" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select 
                  value={formData.assignedTo}
                  onValueChange={(value) => handleInputChange('assignedTo', value)}
                >
                  <SelectTrigger id="assignedTo">
                    <SelectValue placeholder="Select a person" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select a person</SelectItem>
                    {mockStaffAndTrainers.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name} ({person.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange('priority', value)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={createTask}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-6">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-semibold">No tasks</h3>
            <p className="text-sm text-muted-foreground">Create your first task to get started.</p>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Assigned To</TableHead>
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
                          <AvatarImage src={task.assignedToAvatar} />
                          <AvatarFallback>{getInitials(task.assignedToName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{task.assignedToName}</div>
                          <div className="text-xs text-muted-foreground capitalize">{task.assignedToRole}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(task.dueDate, 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(task.priority)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(task.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

export default AdminTaskManagement;
