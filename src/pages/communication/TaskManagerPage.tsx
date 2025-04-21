
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Check, 
  CheckCircle2, 
  Clock, 
  Edit, 
  Filter, 
  Plus, 
  Search, 
  SortAsc, 
  Trash2, 
  User, 
  UserPlus, 
  X 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBranch } from "@/hooks/use-branch";

type TaskPriority = "low" | "medium" | "high";
type TaskStatus = "pending" | "in-progress" | "completed" | "overdue";

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar?: string;
  createdBy: string;
  createdAt: string;
  branchId: string;
  relatedTo?: {
    type: "member" | "lead" | "class" | "trainer" | "other";
    id: string;
    name: string;
  };
}

const MOCK_TASKS: Task[] = [
  {
    id: "task1",
    title: "Follow up with potential member James",
    description: "Call James to discuss membership options and offer a free trial",
    status: "pending",
    priority: "high",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    assigneeId: "staff1",
    assigneeName: "Daniel Wilson",
    assigneeAvatar: "/placeholder.svg",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    branchId: "branch-1",
    relatedTo: {
      type: "lead",
      id: "lead1",
      name: "James Thompson"
    }
  },
  {
    id: "task2",
    title: "Order new yoga mats",
    description: "Order 20 new yoga mats from supplier XYZ",
    status: "in-progress",
    priority: "medium",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    assigneeId: "staff2",
    assigneeName: "Sophia Martinez",
    assigneeAvatar: "/placeholder.svg",
    createdBy: "admin",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    branchId: "branch-1"
  },
  {
    id: "task3",
    title: "Membership renewal call",
    description: "Call Emily to remind about membership renewal due next week",
    status: "completed",
    priority: "high",
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    assigneeId: "staff3",
    assigneeName: "James Taylor",
    assigneeAvatar: "/placeholder.svg",
    createdBy: "admin",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    branchId: "branch-1",
    relatedTo: {
      type: "member",
      id: "member3",
      name: "Emily Johnson"
    }
  },
  {
    id: "task4",
    title: "Schedule maintenance for treadmills",
    description: "Contact maintenance company to schedule routine service for all treadmills",
    status: "overdue",
    priority: "medium",
    dueDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    assigneeId: "staff1",
    assigneeName: "Daniel Wilson",
    assigneeAvatar: "/placeholder.svg",
    createdBy: "admin",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    branchId: "branch-1"
  }
];

// Mock staff list for assignment
const MOCK_STAFF = [
  { id: "staff1", name: "Daniel Wilson", avatar: "/placeholder.svg" },
  { id: "staff2", name: "Sophia Martinez", avatar: "/placeholder.svg" },
  { id: "staff3", name: "James Taylor", avatar: "/placeholder.svg" },
  { id: "staff4", name: "Emily Davis", avatar: "/placeholder.svg" }
];

const TaskManagerPage = () => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({});
  const { currentBranch } = useBranch();
  
  // Filter tasks
  const filteredTasks = tasks.filter(task => 
    (currentBranch?.id ? task.branchId === currentBranch.id : true) &&
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const pendingTasks = filteredTasks.filter(task => task.status === "pending");
  const inProgressTasks = filteredTasks.filter(task => task.status === "in-progress");
  const completedTasks = filteredTasks.filter(task => task.status === "completed");
  const overdueTasks = filteredTasks.filter(task => task.status === "overdue");
  
  const handleOpenCreateDialog = (task?: Task) => {
    if (task) {
      setCurrentTask(task);
      setFormData({ ...task });
    } else {
      setCurrentTask(null);
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
        assigneeId: "",
        branchId: currentBranch?.id || "branch-1"
      });
    }
    setIsCreateDialogOpen(true);
  };
  
  const handleFormChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleSaveTask = () => {
    if (!formData.title) {
      toast.error("Task title is required");
      return;
    }
    
    if (!formData.assigneeId) {
      toast.error("Please assign the task to someone");
      return;
    }
    
    const assignee = MOCK_STAFF.find(staff => staff.id === formData.assigneeId);
    
    if (currentTask) {
      // Update existing task
      setTasks(tasks.map(task => 
        task.id === currentTask.id ? 
          {
            ...task,
            ...formData,
            assigneeName: assignee?.name || task.assigneeName,
            assigneeAvatar: assignee?.avatar || task.assigneeAvatar
          } as Task : 
          task
      ));
      toast.success("Task updated successfully");
    } else {
      // Add new task
      const newTask: Task = {
        id: `task${tasks.length + 1}`,
        title: formData.title || "",
        description: formData.description || "",
        status: formData.status as TaskStatus || "pending",
        priority: formData.priority as TaskPriority || "medium",
        dueDate: formData.dueDate || new Date().toISOString(),
        assigneeId: formData.assigneeId || "",
        assigneeName: assignee?.name || "Unassigned",
        assigneeAvatar: assignee?.avatar,
        createdBy: "current-user",
        createdAt: new Date().toISOString(),
        branchId: formData.branchId || currentBranch?.id || "branch-1",
        relatedTo: formData.relatedTo
      };
      
      setTasks([...tasks, newTask]);
      toast.success("Task created successfully");
    }
    
    setIsCreateDialogOpen(false);
  };
  
  const handleConfirmDelete = (task: Task) => {
    setCurrentTask(task);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteTask = () => {
    if (currentTask) {
      setTasks(tasks.filter(task => task.id !== currentTask.id));
      toast.success("Task deleted successfully");
    }
    setIsDeleteDialogOpen(false);
  };
  
  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
    
    toast.success(`Task status updated to ${status}`);
  };
  
  const getPriorityBadge = (priority: TaskPriority) => {
    const variants: Record<TaskPriority, string> = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge variant="outline" className={variants[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };
  
  const getStatusBadge = (status: TaskStatus) => {
    const variants: Record<TaskStatus, string> = {
      pending: "bg-gray-100 text-gray-800",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };
  
  const TaskCard = ({ task }: { task: Task }) => {
    const dueDate = new Date(task.dueDate);
    const isPastDue = dueDate < new Date() && task.status !== "completed";
    
    return (
      <Card className={`mb-3 ${isPastDue ? 'border-red-300' : ''}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Checkbox 
                  checked={task.status === "completed"}
                  onCheckedChange={(checked) => {
                    handleStatusChange(task.id, checked ? "completed" : "pending");
                  }}
                />
                <h3 className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </h3>
              </div>
              
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  {task.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {getPriorityBadge(task.priority)}
                {getStatusBadge(task.status)}
                <span className="text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
                
                {task.relatedTo && (
                  <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
                    {task.relatedTo.type.charAt(0).toUpperCase() + task.relatedTo.type.slice(1)}: {task.relatedTo.name}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="ml-4">
              <div className="flex items-center mb-2">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={task.assigneeAvatar} alt={task.assigneeName} />
                  <AvatarFallback>{task.assigneeName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs">{task.assigneeName}</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <SortAsc className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleOpenCreateDialog(task)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, "pending")}>
                    <Clock className="mr-2 h-4 w-4" />
                    Mark as Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, "in-progress")}>
                    <Activity className="mr-2 h-4 w-4" />
                    Mark as In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, "completed")}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Complete
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleConfirmDelete(task)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Task Manager</h1>
            <p className="text-muted-foreground">Manage follow-ups and to-dos</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Check className="mr-2 h-4 w-4" />
                  High Priority
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Assigned to Me
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clock className="mr-2 h-4 w-4" />
                  Due Today
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button onClick={() => handleOpenCreateDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Tasks ({filteredTasks.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({inProgressTasks.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
            <TabsTrigger value="overdue">Overdue ({overdueTasks.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="space-y-2">
              {filteredTasks.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No tasks found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredTasks.map(task => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="pending">
            <div className="space-y-2">
              {pendingTasks.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No pending tasks</p>
                  </CardContent>
                </Card>
              ) : (
                pendingTasks.map(task => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="in-progress">
            <div className="space-y-2">
              {inProgressTasks.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No in-progress tasks</p>
                  </CardContent>
                </Card>
              ) : (
                inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="space-y-2">
              {completedTasks.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No completed tasks</p>
                  </CardContent>
                </Card>
              ) : (
                completedTasks.map(task => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="overdue">
            <div className="space-y-2">
              {overdueTasks.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No overdue tasks</p>
                  </CardContent>
                </Card>
              ) : (
                overdueTasks.map(task => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Create/Edit Task Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input 
                id="title"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                placeholder="Enter task title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleFormChange("description", e.target.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={formData.priority || "medium"}
                  onValueChange={(value) => handleFormChange("priority", value)}
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
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status || "pending"}
                  onValueChange={(value) => handleFormChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate"
                  type="date"
                  value={formData.dueDate ? formData.dueDate.toString().split('T')[0] : ""}
                  onChange={(e) => handleFormChange("dueDate", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignee">Assign To</Label>
                <Select 
                  value={formData.assigneeId || ""}
                  onValueChange={(value) => handleFormChange("assigneeId", value)}
                >
                  <SelectTrigger id="assignee">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_STAFF.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask}>
              {currentTask ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this task? This action cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTask}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default TaskManagerPage;
