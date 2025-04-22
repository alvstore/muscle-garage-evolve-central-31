
import React from 'react';
import { Container } from "@/components/ui/container";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight, Settings, Zap } from "lucide-react";
import AutomationSettings from '@/components/settings/AutomationSettings';

const AutomationRulesPage = () => {
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
            <BreadcrumbLink href="/settings/automation" isCurrentPage>
              <Zap className="h-4 w-4 mr-1" />
              Automation Rules
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Automation Rules</h1>
            <p className="text-muted-foreground">Configure automated actions and notifications</p>
          </div>
        </div>
        
        <AutomationSettings />
      </div>
    </Container>
  );
};

export default AutomationRulesPage;
