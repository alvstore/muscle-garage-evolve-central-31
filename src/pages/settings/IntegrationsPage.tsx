
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
