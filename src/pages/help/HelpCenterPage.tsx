
import React from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, Users, Dumbbell, CalendarDays, 
  CreditCard, MessageSquare, Info, Phone 
} from 'lucide-react';

const HelpCenterPage = () => {
  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Help Center</h1>
            <p className="text-muted-foreground">Find guides, tutorials, and FAQs to help you use our platform</p>
          </div>
        </div>

        <Tabs defaultValue="getting-started">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 mb-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="admin-guide">Admin Guide</TabsTrigger>
            <TabsTrigger value="trainer-guide">Trainer Guide</TabsTrigger>
            <TabsTrigger value="member-guide">Member Guide</TabsTrigger>
            <TabsTrigger value="staff-guide">Staff Guide</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started with Muscle Garage</CardTitle>
                <CardDescription>Learn the basics of using Muscle Garage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
                        System Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Learn about the main features and capabilities of the Muscle Garage platform.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Users className="h-5 w-5 mr-2 text-indigo-600" />
                        User Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        How to create and manage user accounts including members, trainers, and staff.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Info className="h-5 w-5 mr-2 text-indigo-600" />
                        First Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Quick setup guide to help you get your gym management system running.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin-guide">
            <Card>
              <CardHeader>
                <CardTitle>Administrator Guide</CardTitle>
                <CardDescription>Comprehensive guide for gym administrators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Building2 className="h-5 w-5 mr-2 text-indigo-600" />
                        Branch Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        How to create and manage multiple branches for your fitness business.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-indigo-600" />
                        Billing & Payments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Setting up payment methods, managing invoices, and handling subscriptions.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Dumbbell className="h-5 w-5 mr-2 text-indigo-600" />
                        Facility Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Managing equipment, rooms, and overall facility maintenance.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Similar structure for other tabs, abbreviated for brevity */}
          {['trainer-guide', 'member-guide', 'staff-guide', 'integrations', 'faq', 'contact'].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardHeader>
                  <CardTitle>{tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</CardTitle>
                  <CardDescription>Content for {tab.split('-').join(' ')} will be displayed here</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 text-center text-gray-500">
                    Content for this section is being developed.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Container>
  );
};

export default HelpCenterPage;
