
import React from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight, MessageCircle, Settings } from "lucide-react";
import { Button } from '@/components/ui/button';

const SmsTemplatesPage = () => {
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
            <BreadcrumbLink href="/settings/templates/sms" isCurrentPage>
              SMS Templates
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">SMS Templates</h1>
            <p className="text-muted-foreground">Manage SMS notification templates with custom tags</p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Membership Renewal Reminder</CardTitle>
            <CardDescription>
              Sent to members before their membership expires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border p-4 rounded-md bg-slate-50">
                <h3 className="font-medium mb-2">Available tags:</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{"{member_name}"}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{"{expiry_date}"}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{"{plan_name}"}</span>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">Preview Template</Button>
                <Button>Edit Template</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default SmsTemplatesPage;
