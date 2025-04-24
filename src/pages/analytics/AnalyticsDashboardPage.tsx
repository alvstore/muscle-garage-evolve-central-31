
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
import { useSupabaseData } from '@/hooks/use-supabase-data';

const AnalyticsDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: members } = useSupabaseData('members', {
    columns: '*',
    limit: 10
  });
  
  const { data: trainers } = useSupabaseData('profiles', {
    columns: '*',
    filters: { role: 'trainer' },
    limit: 10
  });
  
  const { data: classes } = useSupabaseData('class_schedules', {
    columns: '*',
    limit: 10
  });

  // If the user is a member, they shouldn't access this page
  if (user?.role === "member") {
    return <Navigate to="/dashboard" replace />;
  }
  
  const memberCount = members?.length || 0;
  const trainerCount = trainers?.length || 0;
  const classCount = classes?.length || 0;

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                Total Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{memberCount}</div>
              <p className="text-xs text-muted-foreground">Active members in the system</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Dumbbell className="h-4 w-4 mr-2 text-purple-500" />
                Trainers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trainerCount}</div>
              <p className="text-xs text-muted-foreground">Active trainers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                Active Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classCount}</div>
              <p className="text-xs text-muted-foreground">Scheduled classes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <FileText className="h-4 w-4 mr-2 text-green-500" />
                Pending Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Unpaid invoices</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="classes">Classes & Programs</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
            <TabsTrigger value="reports">Analytics</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>User Management</CardTitle>
                  <Button 
                    onClick={() => navigate("/members/new")}
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Add New User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate("/members")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Members
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate("/trainers")}
                    >
                      <Dumbbell className="h-4 w-4 mr-2" />
                      Manage Trainers
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate("/settings/roles")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Roles & Permissions
                    </Button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate("/attendance")}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Attendance Logs
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate("/fitness-plans")}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Fitness Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Classes & Programs</CardTitle>
                  <Button 
                    onClick={() => navigate("/classes/new")}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Create New Class
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate("/classes")}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Manage Classes
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate("/memberships")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Membership Plans
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="finances" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Financial Management</CardTitle>
                  <Button 
                    onClick={() => navigate("/finance/invoices/new")}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Create Invoice
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate("/finance/invoices")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Invoices
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate("/finance/transactions")}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Transactions
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate("/finance/dashboard")}
                    >
                      <BarChart className="h-4 w-4 mr-2" />
                      Finance Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate("/reports")}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Generate Reports
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate("/reports?type=revenue")}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Revenue Reports
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate("/reports?type=membership")}
                    >
                      <BarChart className="h-4 w-4 mr-2" />
                      Membership Analysis
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate("/settings/integrations")}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Integrations & APIs
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate("/settings/email")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Email Configuration
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate("/settings")}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      General Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default AnalyticsDashboardPage;
