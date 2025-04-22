
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight, Mail, MessageCircle, MessageSquare, Settings } from "lucide-react";
import { Navigate } from 'react-router-dom';

const TemplatesPage = () => {
  const [activeTab, setActiveTab] = useState("email");
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Redirect to the specific template page based on the selected tab
    return <Navigate to={`/settings/templates/${value}`} replace />;
  };
  
  return (
    <Container>
      <div className="py-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/templates" isCurrentPage>
              Message Templates
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Message Templates</h1>
            <p className="text-muted-foreground">Manage email, SMS and WhatsApp message templates</p>
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <TabsList className="grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </TabsTrigger>
                <TabsTrigger value="sms" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>SMS</span>
                </TabsTrigger>
                <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>WhatsApp</span>
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          <TabsContent value="email">
            <Navigate to="/settings/templates/email" replace />
          </TabsContent>
          
          <TabsContent value="sms">
            <Navigate to="/settings/templates/sms" replace />
          </TabsContent>
          
          <TabsContent value="whatsapp">
            <Navigate to="/settings/templates/whatsapp" replace />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default TemplatesPage;
