
import React from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Download, Calendar, Users, Dumbbell, DollarSign } from "lucide-react";

const ReportsPage = () => {
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>
        
        <Tabs defaultValue="membership">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="membership">Membership</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="fitness">Fitness</TabsTrigger>
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="membership" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Membership Reports
                </CardTitle>
                <CardDescription>
                  View and analyze membership trends, renewals, and member demographics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Member Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">View new member acquisitions over time.</p>
                      <Button variant="outline" className="w-full">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Membership Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Distribution of different membership plans.</p>
                      <Button variant="outline" className="w-full">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Churn Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Analyze membership cancellation patterns.</p>
                      <Button variant="outline" className="w-full">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="attendance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Attendance Reports
                </CardTitle>
                <CardDescription>
                  Monitor gym usage patterns, peak hours, and class attendance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-12">Select a report type to generate detailed attendance analytics.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financial" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Financial Reports
                </CardTitle>
                <CardDescription>
                  Track revenue, expenses, and financial performance metrics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-12">Select a report type to generate detailed financial analytics.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fitness" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Dumbbell className="mr-2 h-5 w-5" />
                  Fitness Reports
                </CardTitle>
                <CardDescription>
                  Analyze member fitness progress and goal achievement rates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-12">Select a report type to generate detailed fitness analytics.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trainers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Trainer Reports</CardTitle>
                <CardDescription>
                  Evaluate trainer performance, client retention, and feedback scores.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-12">Select a report type to generate detailed trainer analytics.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="custom" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Reports</CardTitle>
                <CardDescription>
                  Create and save custom reports with specific metrics and filters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Custom Reports Yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                    Create your first custom report by selecting metrics and filters relevant to your business needs.
                  </p>
                  <Button className="mt-4">
                    Create Custom Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default ReportsPage;
