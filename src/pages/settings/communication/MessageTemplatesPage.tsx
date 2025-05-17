
import React from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight, LayoutTemplate, Mail, MessageCircle, MessageSquare, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const MessageTemplatesPage = () => {
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
              <LayoutTemplate className="h-4 w-4 mr-1" />
              Message Templates
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Message Templates</h1>
            <p className="text-muted-foreground">Manage templates for email, SMS, and WhatsApp communications</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/settings/templates/email">
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                <Mail className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Email Templates</h3>
                <p className="text-muted-foreground">
                  Manage email notification templates with custom tags for personalized messages
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/settings/templates/sms">
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                <MessageCircle className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">SMS Templates</h3>
                <p className="text-muted-foreground">
                  Create and manage SMS templates including DLT templates for regulatory compliance
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/settings/templates/whatsapp">
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                <MessageSquare className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">WhatsApp Templates</h3>
                <p className="text-muted-foreground">
                  Configure WhatsApp message templates with interactive elements
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default MessageTemplatesPage;
