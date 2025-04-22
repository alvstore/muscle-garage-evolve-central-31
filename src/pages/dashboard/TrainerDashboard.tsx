import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, Clock, CheckCircle2, UserCircle, BarChart3, ActivitySquare } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import UpcomingClasses from "@/components/dashboard/UpcomingClasses";
import Announcements from "@/components/dashboard/Announcements";
import TaskManagement from "@/components/dashboard/TaskManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockClasses, mockMembers } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import MemberProgressChart from "@/components/dashboard/MemberProgressChart";
import { Announcement } from "@/types/notification";

const TrainerDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const trainerClasses = mockClasses.filter(c => c.trainerId === user?.id || c.trainerId === "trainer1");
  
  const assignedMembers = mockMembers.filter(m => m.trainerId === user?.id || m.trainerId === "trainer1");

  const ptMembers = assignedMembers.filter(m => 
    m.id === "member-1" || 
    (m.membershipId && m.membershipId.includes("pt"))
  );

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

  const progressData = [
    { date: '2025-01-01', metrics: { weight: 80, bodyFatPercentage: 22, bmi: 26.4, muscleGain: 0 } },
    { date: '2025-02-01', metrics: { weight: 78, bodyFatPercentage: 21, bmi: 25.8, muscleGain: 1.5 } },
    { date: '2025-03-01', metrics: { weight: 77, bodyFatPercentage: 20, bmi: 25.4, muscleGain: 2.2 } },
    { date: '2025-04-01', metrics: { weight: 76, bodyFatPercentage: 19, bmi: 25.1, muscleGain: 2.8 } },
    { date: '2025-05-01', metrics: { weight: 75, bodyFatPercentage: 18, bmi: 24.8, muscleGain: 3.5 } },
    { date: '2025-06-01', metrics: { weight: 74, bodyFatPercentage: 17, bmi: 24.4, muscleGain: 4.2 } }
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const mockAnnouncements: Announcement[] = [
    {
      id: "announcement1",
      title: "Trainer Meeting",
      content: "All trainers are required to attend the monthly meeting on Friday.",
      authorId: "admin1",
      authorName: "Admin User",
      createdAt: "2023-07-10T10:00:00Z",
      priority: "high",
      targetRoles: ["trainer"],
      channels: ["in-app", "email"],
      sentCount: 15,
      forRoles: ["trainer"],
      createdBy: "admin1"
    },
    {
      id: "announcement2",
      title: "New Workout Program",
      content: "We're launching a new specialized workout program next month. Sign up for training.",
      authorId: "admin1",
      authorName: "Admin User",
      createdAt: "2023-07-12T14:30:00Z",
      priority: "medium",
      targetRoles: ["trainer"],
      channels: ["in-app"],
      sentCount: 15,
      forRoles: ["trainer"],
      createdBy: "admin1"
    }
  ];

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
          value={3}
          description="Tasks requiring attention"
          iconColor="text-amber-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-6">
        <Card className="md:col-span-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your appointments for today</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/trainers/classes")}>
                Manage Classes
              </Button>
            </div>
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
                  ))}
                
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
            <TaskManagement />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">Assigned Members</TabsTrigger>
          <TabsTrigger value="classes">My Classes</TabsTrigger>
          <TabsTrigger value="pt-members">PT Members</TabsTrigger>
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
                        <Button variant="secondary" size="sm" onClick={() => navigate("/fitness/workout-plans")}>Workout Plan</Button>
                        <Button variant="outline" size="sm" onClick={() => navigate("/fitness/diet")}>Diet Plan</Button>
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
        
        <TabsContent value="pt-members" className="pt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Personal Training Members</CardTitle>
                  <CardDescription>Members with PT subscription</CardDescription>
                </div>
                <Button onClick={() => navigate("/trainers/pt-plans")}>Manage PT Plans</Button>
              </div>
            </CardHeader>
            <CardContent>
              {ptMembers.length > 0 ? (
                <div className="space-y-6">
                  {ptMembers.map(member => (
                    <div key={member.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-lg">{member.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                PT Member
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Since {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/members/progress/${member.id}`)}>
                            View Progress
                          </Button>
                          <Button size="sm" onClick={() => navigate(`/members/${member.id}`)}>
                            Profile
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Progress Overview</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Weight Loss</span>
                              <span>75%</span>
                            </div>
                            <Progress value={75} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Muscle Gain</span>
                              <span>60%</span>
                            </div>
                            <Progress value={60} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Overall Goal</span>
                              <span>68%</span>
                            </div>
                            <Progress value={68} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <UserCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No PT Members</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    You don't have any personal training members assigned yet.
                  </p>
                  <Button onClick={() => navigate("/trainers/pt-plans")}>Manage PT Plans</Button>
                </div>
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

      {ptMembers.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Member Progress</CardTitle>
              <CardDescription>Recent progress of your PT members</CardDescription>
            </CardHeader>
            <CardContent>
              <MemberProgressChart 
                data={progressData}
                memberId={ptMembers[0].id}
                memberName={ptMembers[0].name}
              />
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => navigate(`/members/progress/${ptMembers[0].id}`)}>
                  View Detailed Progress
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>My Attendance</CardTitle>
              <CardDescription>Your attendance record</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-500 mr-2" />
                      <span className="text-2xl font-bold">24</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Days Present</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center">
                      <Clock className="h-8 w-8 text-amber-500 mr-2" />
                      <span className="text-2xl font-bold">2</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Days Absent</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Recent Attendance</h3>
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - i);
                      return (
                        <div key={i} className="flex justify-between items-center p-2 bg-muted/40 rounded">
                          <span>{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${i === 3 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
                            {i === 3 ? 'Absent' : 'Present'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="text-center">
                  <Button onClick={() => navigate("/trainers/attendance")}>
                    View Full Attendance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;
