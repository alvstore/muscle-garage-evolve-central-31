
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Task, taskService } from '@/services/taskService';
import { useParams } from 'react-router-dom';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { branchId } = useParams<{ branchId?: string }>();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const data = await taskService.getTasks(branchId);
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: 'Error',
          description: 'Failed to load tasks.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [toast, branchId]);

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(task => {
      if (activeTab === 'all') return true;
      if (activeTab === 'todo') return task.status === 'todo';
      if (activeTab === 'in-progress') return task.status === 'in-progress';
      if (activeTab === 'done') return task.status === 'done';
      return true;
    })
    .sort((a, b) => {
      // Sort by due date (overdue first)
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      } else if (a.due_date) {
        return -1;
      } else if (b.due_date) {
        return 1;
      }
      
      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const aPriority = a.priority && priorityOrder[a.priority as 'high' | 'medium' | 'low'] || 999;
      const bPriority = b.priority && priorityOrder[b.priority as 'high' | 'medium' | 'low'] || 999;
      
      return aPriority - bPriority;
    });

  // Get counts for tabs
  const todoCount = tasks.filter(task => task.status === 'todo').length;
  const inProgressCount = tasks.filter(task => task.status === 'in-progress').length;
  const doneCount = tasks.filter(task => task.status === 'done').length;
  
  // Helper for priority badge
  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    
    switch (priority.toLowerCase()) {
      case 'high':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  // Helper to check if task is overdue
  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    return due < today;
  };
  
  return (
    <Container>
      <div className="py-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/crm">CRM</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/crm/tasks" isCurrentPage>Tasks</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Task Management</h1>
            <p className="text-muted-foreground">
              Manage and track your team's tasks and assignments
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <CardTitle className="text-xl">Tasks</CardTitle>
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-8 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  All Tasks ({tasks.length})
                </TabsTrigger>
                <TabsTrigger value="todo">
                  To Do ({todoCount})
                </TabsTrigger>
                <TabsTrigger value="in-progress">
                  In Progress ({inProgressCount})
                </TabsTrigger>
                <TabsTrigger value="done">
                  Done ({doneCount})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading tasks...
                        </TableCell>
                      </TableRow>
                    ) : filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-medium">{task.title}</div>
                              {task.description && (
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {task.description}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getPriorityBadge(task.priority)}
                          </TableCell>
                          <TableCell>
                            {task.due_date ? (
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className={isOverdue(task.due_date) && task.status !== 'done' ? "text-red-600 font-medium" : ""}>
                                  {new Date(task.due_date).toLocaleDateString()}
                                </span>
                                {isOverdue(task.due_date) && task.status !== 'done' && (
                                  <Badge variant="destructive" className="ml-1">Overdue</Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No due date</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {task.assigned_to ? (
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>Assigned</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={task.status === 'done' ? 'default' : task.status === 'in-progress' ? 'outline' : 'secondary'}
                            >
                              {task.status === 'todo' && 'To Do'}
                              {task.status === 'in-progress' && 'In Progress'}
                              {task.status === 'done' && 'Done'}
                              {!['todo', 'in-progress', 'done'].includes(task.status || '') && task.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          {searchQuery ? 'No tasks match your search.' : 'No tasks found.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default TasksPage;
