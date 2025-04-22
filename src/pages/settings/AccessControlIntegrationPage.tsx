
import React from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AccessControlSettings from '@/components/settings/AccessControlSettings';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight, Home, Settings } from "lucide-react";

const AccessControlIntegrationPage = () => {
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
            <BreadcrumbLink href="/settings/integrations">
              Integrations
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/integrations/access-control" isCurrentPage>
              Access Control
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Access Control Integration</h1>
            <p className="text-muted-foreground">Configure Hikvision access control integration for your facility</p>
          </div>
        </div>

        <AccessControlSettings />
      </div>
    </Container>
  );
};

export default AccessControlIntegrationPage;
