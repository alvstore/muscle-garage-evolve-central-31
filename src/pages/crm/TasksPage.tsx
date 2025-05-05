
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, CheckSquare, Plus, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TaskStatus = "todo" | "in_progress" | "completed";

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  dueDate: string;
  assignedTo?: {
    name: string;
    avatar?: string;
  };
}

const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Follow up with potential client",
    description: "Call Rajesh from ABC Corp to discuss membership",
    status: "todo",
    priority: "high",
    dueDate: "2023-06-15",
    assignedTo: {
      name: "Anjali Patel",
    }
  },
  {
    id: "task-2",
    title: "Send renewal reminder emails",
    description: "Send reminders to members whose plans expire this month",
    status: "in_progress",
    priority: "medium",
    dueDate: "2023-06-10",
    assignedTo: {
      name: "Vikram Singh",
    }
  },
  {
    id: "task-3",
    title: "Prepare quarterly sales report",
    description: "Compile sales metrics for Q2 2023",
    status: "todo",
    priority: "medium",
    dueDate: "2023-06-28",
    assignedTo: {
      name: "Anjali Patel",
    }
  },
  {
    id: "task-4",
    title: "Call corporate clients",
    description: "Schedule a meeting with TechX regarding corporate plan",
    status: "completed",
    priority: "high",
    dueDate: "2023-06-05",
    assignedTo: {
      name: "Vikram Singh",
    }
  },
  {
    id: "task-5",
    title: "Update membership pricing",
    description: "Review and update pricing for premium plans",
    status: "in_progress",
    priority: "low",
    dueDate: "2023-06-20",
  }
];

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [timeFilter, setTimeFilter] = useState("all");

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusColumnTitle = (status: TaskStatus) => {
    switch(status) {
      case 'todo': return "To Do";
      case 'in_progress': return "In Progress";
      case 'completed': return "Completed";
    }
  };

  const handleDragEnd = (result: any) => {
    const { destination, source } = result;
    
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(source.index, 1);
    
    // Update task status based on destination column
    movedTask.status = destination.droppableId as TaskStatus;
    
    // Insert task at the new position
    newTasks.splice(destination.index, 0, movedTask);
    
    setTasks(newTasks);
  };

  // Filter tasks
  let filteredTasks = [...tasks];
  
  // Apply time filter
  if (timeFilter === "today") {
    const today = new Date().toISOString().split('T')[0];
    filteredTasks = filteredTasks.filter(task => task.dueDate === today);
  } else if (timeFilter === "week") {
    const today = new Date();
    const weekFromNow = new Date(today);
    weekFromNow.setDate(today.getDate() + 7);
    
    filteredTasks = filteredTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate <= weekFromNow;
    });
  } else if (timeFilter === "overdue") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    filteredTasks = filteredTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < today && task.status !== "completed";
    });
  }

  // Group the filtered tasks by status
  const tasksByStatus: Record<TaskStatus, Task[]> = {
    todo: filteredTasks.filter(task => task.status === "todo"),
    in_progress: filteredTasks.filter(task => task.status === "in_progress"),
    completed: filteredTasks.filter(task => task.status === "completed")
  };

  return (
    <Container>
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

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage and organize your follow-ups and tasks</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                <span>Task Board</span>
              </CardTitle>
              <CardDescription>
                Organize and track your tasks by status
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="today">Due Today</SelectItem>
                    <SelectItem value="week">Due This Week</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="board">
            <TabsList className="mb-4">
              <TabsTrigger value="board">Board View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="board">
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(["todo", "in_progress", "completed"] as TaskStatus[]).map(status => (
                    <div key={status}>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h3 className="font-medium mb-3">{getStatusColumnTitle(status)} ({tasksByStatus[status].length})</h3>
                        <Droppable droppableId={status}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="min-h-[200px]"
                            >
                              {tasksByStatus[status].map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="bg-card border rounded-md p-3 mb-2 shadow-sm"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-sm">{task.title}</h4>
                                        <Badge className={getPriorityColor(task.priority)}>
                                          {task.priority}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground mb-2">
                                        {task.description}
                                      </p>
                                      <div className="flex justify-between items-center text-xs">
                                        <div>
                                          Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </div>
                                        {task.assignedTo && (
                                          <div>
                                            {task.assignedTo.name}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              {tasksByStatus[status].length === 0 && (
                                <div className="h-20 border border-dashed rounded-md flex items-center justify-center text-muted-foreground text-sm">
                                  No tasks
                                </div>
                              )}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </div>
                  ))}
                </div>
              </DragDropContext>
            </TabsContent>
            
            <TabsContent value="list">
              <div className="border rounded-md">
                {filteredTasks.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No tasks match your current filter.
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredTasks.map(task => (
                      <div key={task.id} className="p-4 flex items-center gap-4">
                        <input type="checkbox" checked={task.status === "completed"} readOnly />
                        <div className="flex-1">
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground">{task.description}</div>
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <div className="text-sm">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                        {task.assignedTo && (
                          <div className="text-sm">
                            {task.assignedTo.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TasksPage;
