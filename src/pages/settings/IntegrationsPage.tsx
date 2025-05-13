
import React from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ArrowRight, Bell, ChevronRight, CreditCard, Layers, MessageCircle, Settings, Shield } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  status: "configured" | "not-configured" | "partially-configured";
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  title,
  description,
  icon,
  link,
  status
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="p-2 rounded-md bg-primary/10">
            {icon}
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${
            status === "configured" 
              ? "bg-green-100 text-green-800" 
              : status === "partially-configured" 
                ? "bg-amber-100 text-amber-800"
                : "bg-slate-100 text-slate-800"
          }`}>
            {status === "configured" 
              ? "Configured" 
              : status === "partially-configured" 
                ? "Partially Configured"
                : "Not Configured"}
          </div>
        </div>
        <CardTitle className="text-lg mt-3">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-1 pb-4">
        <Button asChild variant="ghost" className="w-full justify-between">
          <Link to={link}>
            Configure
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const IntegrationsPage = () => {
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
            <BreadcrumbLink href="/settings/integrations" isCurrentPage>
              <Layers className="h-4 w-4 mr-1" />
              Integration Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Integration Settings</h1>
            <p className="text-muted-foreground">Configure third-party integrations and services</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <IntegrationCard
            title="AI Services"
            description="Configure AI providers for workout and diet plans"
            icon={<svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>}
            link="/settings/ai-services"
            status="not-configured"
          />
          
          <IntegrationCard
            title="Access Control"
            description="Configure Hikvision access control integration"
            icon={<Shield className="h-5 w-5 text-primary" />}
            link="/settings/integrations/access-control"
            status="configured"
          />
          
          <IntegrationCard
            title="Payment Gateways"
            description="Configure payment providers like Razorpay"
            icon={<CreditCard className="h-5 w-5 text-primary" />}
            link="/settings/integrations/payment"
            status="partially-configured"
          />
          
          <IntegrationCard
            title="Messaging Services"
            description="Configure SMS and WhatsApp integrations"
            icon={<MessageCircle className="h-5 w-5 text-primary" />}
            link="/settings/integrations/messaging"
            status="partially-configured"
          />
          
          <IntegrationCard
            title="Push Notifications"
            description="Configure Firebase and OneSignal for push notifications"
            icon={<Bell className="h-5 w-5 text-primary" />}
            link="/settings/integrations/push"
            status="not-configured"
          />
        </div>
      </div>
    </Container>
  );
};

export default IntegrationsPage;
