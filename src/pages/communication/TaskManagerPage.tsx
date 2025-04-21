
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash, Calendar, CheckCircle, AlertCircle, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { format, addDays } from 'date-fns';

// Define the task interface
interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'inProgress' | 'completed';
  createdAt: string;
  relatedTo?: {
    type: 'member' | 'lead' | 'class' | 'payment';
    id: string;
    name: string;
  };
}

// Define the staff/user interface
interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

const TaskManagerPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'todo' | 'inProgress' | 'completed'>('all');
  
  // Form state
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: addDays(new Date(), 1).toISOString(),
    priority: 'medium',
    status: 'todo',
    relatedTo: undefined
  });

  // Mock data for tasks - will be replaced with Supabase data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Follow up with new lead',
      description: 'Call to discuss membership options',
      assignedTo: '1',
      dueDate: addDays(new Date(), 1).toISOString(),
      priority: 'high',
      status: 'todo',
      createdAt: new Date().toISOString(),
      relatedTo: {
        type: 'lead',
        id: 'lead1',
        name: 'James Wilson'
      }
    },
    {
      id: '2',
      title: 'Collect payment for invoice #1234',
      description: 'Membership fee is overdue by 3 days',
      assignedTo: '2',
      dueDate: new Date().toISOString(),
      priority: 'high',
      status: 'inProgress',
      createdAt: addDays(new Date(), -2).toISOString(),
      relatedTo: {
        type: 'payment',
        id: 'payment1',
        name: 'Invoice #1234'
      }
    },
    {
      id: '3',
      title: 'Prepare for yoga class',
      description: 'Set up equipment and check registrations',
      assignedTo: '3',
      dueDate: addDays(new Date(), 2).toISOString(),
      priority: 'medium',
      status: 'todo',
      createdAt: addDays(new Date(), -1).toISOString(),
      relatedTo: {
        type: 'class',
        id: 'class1',
        name: 'Yoga Basics'
      }
    },
    {
      id: '4',
      title: 'Reach out for membership renewal',
      description: 'Membership expires in 7 days',
      assignedTo: '2',
      dueDate: addDays(new Date(), 3).toISOString(),
      priority: 'medium',
      status: 'todo',
      createdAt: addDays(new Date(), -3).toISOString(),
      relatedTo: {
        type: 'member',
        id: 'member1',
        name: 'Sarah Johnson'
      }
    },
    {
      id: '5',
      title: 'Order more protein powder for shop',
      description: 'Running low on chocolate flavor',
      assignedTo: '1',
      dueDate: addDays(new Date(), -1).toISOString(),
      priority: 'low',
      status: 'completed',
      createdAt: addDays(new Date(), -5).toISOString()
    }
  ]);

  // Mock data for staff - will be replaced with Supabase data
  const staffMembers: User[] = [
    {
      id: '1',
      name: 'John Smith',
      role: 'Manager',
      avatar: ''
    },
    {
      id: '2',
      name: 'Emily Davis',
      role: 'Sales Rep',
      avatar: ''
    },
    {
      id: '3',
      name: 'Michael Johnson',
      role: 'Trainer',
      avatar: ''
    }
  ];

  const handleCreateTask = () => {
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: addDays(new Date(), 1).toISOString(),
      priority: 'medium',
      status: 'todo',
      relatedTo: undefined
    });
    setShowCreateDialog(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      relatedTo: task.relatedTo
    });
    setShowEditDialog(true);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
    }
  };

  const handleSaveNewTask = () => {
    const newTask: Task = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    setShowCreateDialog(false);
    toast.success('Task created successfully');
  };

  const handleUpdateTask = () => {
    if (!selectedTask) return;
    
    setTasks(tasks.map(task => 
      task.id === selectedTask.id ? { ...selectedTask, ...formData } : task
    ));
    setShowEditDialog(false);
    toast.success('Task updated successfully');
  };

  const handleStatusChange = (id: string, status: 'todo' | 'inProgress' | 'completed') => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
    toast.success(`Task status updated to ${status}`);
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const getStaffName = (id: string) => {
    const staff = staffMembers.find(s => s.id === id);
    return staff ? staff.name : 'Unassigned';
  };

  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const getStatusBadge = (status: 'todo' | 'inProgress' | 'completed') => {
    switch (status) {
      case 'todo':
        return <Badge variant="outline">To Do</Badge>;
      case 'inProgress':
        return <Badge variant="default">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
    }
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Task Manager</h1>
            <p className="text-muted-foreground">Track and manage follow-up tasks and to-dos</p>
          </div>
          <Button onClick={handleCreateTask}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Task
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Tasks
          </Button>
          <Button 
            variant={filter === 'todo' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('todo')}
          >
            To Do
          </Button>
          <Button 
            variant={filter === 'inProgress' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('inProgress')}
          >
            In Progress
          </Button>
          <Button 
            variant={filter === 'completed' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>
              {filter === 'all' ? 'All tasks' : 
               filter === 'todo' ? 'Tasks to do' : 
               filter === 'inProgress' ? 'Tasks in progress' : 
               'Completed tasks'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-2 text-lg font-medium">No tasks found</h3>
                <p className="mt-1">
                  {filter === 'all' ? 'Create a new task to get started' : `No ${filter} tasks available`}
                </p>
                {filter !== 'all' && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setFilter('all')}
                  >
                    View all tasks
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                    <TableHead className="hidden md:table-cell">Due Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <Checkbox 
                          checked={task.status === 'completed'}
                          onCheckedChange={(checked) => {
                            handleStatusChange(
                              task.id, 
                              checked ? 'completed' : 'todo'
                            );
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {task.description}
                        </div>
                        {task.relatedTo && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {task.relatedTo.type === 'member' && 'Member: '}
                            {task.relatedTo.type === 'lead' && 'Lead: '}
                            {task.relatedTo.type === 'class' && 'Class: '}
                            {task.relatedTo.type === 'payment' && 'Payment: '}
                            {task.relatedTo.name}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getStaffName(task.assignedTo)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(task.priority)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(task.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditTask(task)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Task Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task or follow-up item
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="taskTitle">Task Title</Label>
              <Input 
                id="taskTitle" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="What needs to be done?"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taskDescription">Description</Label>
              <Textarea 
                id="taskDescription" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Enter details about this task..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taskAssignee">Assign To</Label>
                <Select 
                  value={formData.assignedTo} 
                  onValueChange={value => setFormData({...formData, assignedTo: value})}
                >
                  <SelectTrigger id="taskAssignee">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name} ({staff.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taskDueDate">Due Date</Label>
                <Input 
                  id="taskDueDate" 
                  type="date" 
                  value={format(new Date(formData.dueDate), 'yyyy-MM-dd')} 
                  onChange={e => setFormData({
                    ...formData, 
                    dueDate: new Date(e.target.value).toISOString()
                  })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taskPriority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={value => setFormData({
                  ...formData, 
                  priority: value as 'low' | 'medium' | 'high'
                })}
              >
                <SelectTrigger id="taskPriority">
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
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button type="submit" onClick={handleSaveNewTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Modify task details and status
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="editTaskTitle">Task Title</Label>
              <Input 
                id="editTaskTitle" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editTaskDescription">Description</Label>
              <Textarea 
                id="editTaskDescription" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editTaskAssignee">Assign To</Label>
                <Select 
                  value={formData.assignedTo} 
                  onValueChange={value => setFormData({...formData, assignedTo: value})}
                >
                  <SelectTrigger id="editTaskAssignee">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name} ({staff.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editTaskDueDate">Due Date</Label>
                <Input 
                  id="editTaskDueDate" 
                  type="date" 
                  value={format(new Date(formData.dueDate), 'yyyy-MM-dd')} 
                  onChange={e => setFormData({
                    ...formData, 
                    dueDate: new Date(e.target.value).toISOString()
                  })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editTaskPriority">Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={value => setFormData({
                    ...formData, 
                    priority: value as 'low' | 'medium' | 'high'
                  })}
                >
                  <SelectTrigger id="editTaskPriority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editTaskStatus">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={value => setFormData({
                    ...formData, 
                    status: value as 'todo' | 'inProgress' | 'completed'
                  })}
                >
                  <SelectTrigger id="editTaskStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button type="submit" onClick={handleUpdateTask}>Update Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default TaskManagerPage;
