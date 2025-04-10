
import React from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Navigate, useNavigate } from "react-router-dom";
import { BarChart, Calendar, Users, FileText, Activity, Dumbbell, TrendingUp } from "lucide-react";
import { mockMembers, mockClasses } from "@/data/mockData";
import FitnessPlanManager from "@/components/fitness/FitnessPlanManager";

const ReportsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If the user is a member, they shouldn't access this page
  if (user?.role === "member") {
    return <Navigate to="/dashboard" replace />;
  }

  // For trainers, we want to show assigned members and trainer-specific content
  if (user?.role === "trainer") {
    // Mock data - in a real app, these would come from API calls
    const trainerId = user.id;
    const assignedMembers = mockMembers.filter(m => m.trainerId === trainerId);
    const trainerClasses = mockClasses.filter(c => c.trainerId === trainerId);
    
    // Performance stats (mock data)
    const stats = {
      membersCount: assignedMembers.length,
      classesCount: trainerClasses.length,
      sessionsTaken: 48,
      memberProgress: 78, // percentage as an example
      attendanceRate: 92, // percentage as an example
    };

    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    };

    return (
      <Container>
        <div className="py-6">
          <h1 className="text-2xl font-bold mb-6">Trainer Dashboard</h1>
          
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  Assigned Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.membersCount}</div>
                <p className="text-xs text-muted-foreground">Members under your guidance</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                  Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.classesCount}</div>
                <p className="text-xs text-muted-foreground">Classes you're leading</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                  Member Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.memberProgress}%</div>
                <p className="text-xs text-muted-foreground">Average improvement rate</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="members" className="space-y-4">
            <TabsList>
              <TabsTrigger value="members">Assigned Members</TabsTrigger>
              <TabsTrigger value="classes">My Classes</TabsTrigger>
              <TabsTrigger value="plans">Fitness Plans</TabsTrigger>
            </TabsList>
            
            <TabsContent value="members" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Assigned Members</h2>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/members")}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignedMembers.map(member => (
                  <Card key={member.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center p-4">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">Goal: {member.goal || "Not set"}</p>
                        </div>
                      </div>
                      <div className="border-t px-4 py-3 bg-muted/50">
                        <div className="flex justify-between items-center">
                          <Badge variant={member.membershipStatus === "active" ? "success" : "destructive"}>
                            {member.membershipStatus}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/members/${member.id}`)}
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="classes" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">My Classes</h2>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/classes")}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainerClasses.map(classItem => (
                  <Card key={classItem.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{classItem.name}</CardTitle>
                        <Badge>{classItem.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {new Date(classItem.startTime).toLocaleDateString()} at {new Date(classItem.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          {classItem.enrolled}/{classItem.capacity} enrolled
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="plans" className="space-y-4">
              <FitnessPlanManager members={mockMembers} trainerId={trainerId} />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    );
  }

  // For admin/staff, show the original reports view
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Membership Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p>View and analyze membership data, renewals, and churn rate.</p>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Financial Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Access revenue reports, expense tracking, and financial forecasts.</p>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Attendance Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Analyze check-in patterns, peak hours, and member attendance trends.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory & Sales Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Track inventory movements, product sales, and restocking needs.</p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default ReportsPage;
