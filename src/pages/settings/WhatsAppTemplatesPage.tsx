
import React from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight, MessageSquare, Settings } from "lucide-react";
import { Button } from '@/components/ui/button';

const WhatsAppTemplatesPage = () => {
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
            <BreadcrumbLink href="/settings/templates">
              Templates
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/templates/whatsapp" isCurrentPage>
              WhatsApp Templates
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">WhatsApp Templates</h1>
            <p className="text-muted-foreground">Manage WhatsApp message templates with custom tags</p>
          </div>
          <Button>Create Template</Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Template Management</CardTitle>
            <CardDescription>
              This feature will be implemented soon. Here you'll be able to create and manage WhatsApp message templates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border p-4 rounded-md bg-slate-50">
                <h3 className="font-medium mb-2">Coming Soon:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>WhatsApp Cloud API integration</li>
                  <li>Template creation and submission</li>
                  <li>Interactive message components</li>
                  <li>Media support (images, documents, etc.)</li>
                  <li>Test message functionality</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default WhatsAppTemplatesPage;
