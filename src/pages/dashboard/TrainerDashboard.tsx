
import { useState, useEffect } from "react";
import { Users, Calendar, Clock, CheckCircle2 } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import UpcomingClasses from "@/components/dashboard/UpcomingClasses";
import Announcements from "@/components/dashboard/Announcements";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockClasses, mockAnnouncements, mockMembers } from "@/data/mockData";

const TrainerDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate fetching data
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter classes for this trainer (using trainer1 ID)
  const trainerClasses = mockClasses.filter(c => c.trainerId === "trainer1");
  
  // Filter members assigned to this trainer
  const assignedMembers = mockMembers.filter(m => m.trainerId === "trainer1");

  // Upcoming appointments
  const appointments = [
    {
      id: "appt1",
      memberName: "Jordan Lee",
      memberAvatar: "/placeholder.svg",
      type: "Training Session",
      time: "09:00 AM - 10:00 AM",
      date: "Today"
    },
    {
      id: "appt2",
      memberName: "Emily Davidson",
      memberAvatar: "/placeholder.svg",
      type: "Fitness Assessment",
      time: "11:30 AM - 12:15 PM",
      date: "Today"
    },
    {
      id: "appt3",
      memberName: "Sarah Parker",
      memberAvatar: "/placeholder.svg", 
      type: "Training Session",
      time: "02:00 PM - 03:00 PM",
      date: "Today"
    },
    {
      id: "appt4",
      memberName: "Michael Wong",
      memberAvatar: "/placeholder.svg",
      type: "Diet Consultation",
      time: "09:30 AM - 10:15 AM",
      date: "Tomorrow"
    }
  ];

  // Tasks
  const tasks = [
    {
      id: "task1",
      title: "Update Jordan's workout plan",
      dueDate: "Today",
      priority: "High",
      completed: false
    },
    {
      id: "task2",
      title: "Review Sarah's progress photos",
      dueDate: "Today",
      priority: "Medium",
      completed: true
    },
    {
      id: "task3",
      title: "Create meal plan for Michael",
      dueDate: "Tomorrow",
      priority: "High",
      completed: false
    },
    {
      id: "task4",
      title: "Plan next week's HIIT class",
      dueDate: "Friday",
      priority: "Medium",
      completed: false
    }
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getPriorityColor = (priority: string) => {
    return priority === "High" 
      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" 
      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Trainer Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          title="Assigned Members"
          value={assignedMembers.length}
          description="Members under your guidance"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Calendar}
          title="Today's Classes"
          value={trainerClasses.filter(c => new Date(c.startTime).toDateString() === new Date().toDateString()).length}
          description="Classes you're leading today"
          iconColor="text-purple-600"
        />
        <StatCard
          icon={Clock}
          title="Appointments"
          value={appointments.filter(a => a.date === "Today").length}
          description="Scheduled for today"
          iconColor="text-green-600"
        />
        <StatCard
          icon={CheckCircle2}
          title="Pending Tasks"
          value={tasks.filter(t => !t.completed).length}
          description="Tasks requiring attention"
          iconColor="text-amber-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-6">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments
                  .filter(a => a.date === "Today")
                  .map(appointment => (
                    <div key={appointment.id} className="flex items-center justify-between space-x-4 p-3 bg-accent/10 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={appointment.memberAvatar} alt={appointment.memberName} />
                          <AvatarFallback>{getInitials(appointment.memberName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{appointment.memberName}</h3>
                          <p className="text-sm text-muted-foreground">{appointment.type}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">{appointment.time}</span>
                        <Button variant="secondary" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))
                }
                
                {appointments.filter(a => a.date === "Today").length < appointments.length && (
                  <Button variant="outline" className="w-full mt-2">
                    View All Appointments
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">No appointments scheduled for today</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Your to-do list</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`p-2 border rounded-md flex items-start justify-between ${task.completed ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start space-x-2">
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      readOnly
                    />
                    <div>
                      <p className={`text-sm ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-muted-foreground">Due: {task.dueDate}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full">
                Add New Task
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">Assigned Members</TabsTrigger>
          <TabsTrigger value="classes">My Classes</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>
        <TabsContent value="members" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Members Assigned to You</CardTitle>
              <CardDescription>Members you are training</CardDescription>
            </CardHeader>
            <CardContent>
              {assignedMembers.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {assignedMembers.map(member => (
                    <div key={member.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            <span className={`inline-block px-1.5 py-0.5 rounded ${
                              member.membershipStatus === 'active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : member.membershipStatus === 'inactive'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {member.membershipStatus.charAt(0).toUpperCase() + member.membershipStatus.slice(1)}
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <p><span className="text-muted-foreground">Goal:</span> {member.goal}</p>
                        <p className="mt-1"><span className="text-muted-foreground">Contact:</span> {member.phone}</p>
                      </div>
                      
                      <div className="pt-2 flex gap-2">
                        <Button variant="secondary" size="sm">Workout Plan</Button>
                        <Button variant="outline" size="sm">Diet Plan</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-6">No members assigned to you yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classes" className="pt-4">
          <UpcomingClasses classes={trainerClasses} />
        </TabsContent>
        
        <TabsContent value="announcements" className="pt-4">
          <Announcements announcements={mockAnnouncements.filter(a => a.targetRoles.includes('trainer'))} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainerDashboard;
