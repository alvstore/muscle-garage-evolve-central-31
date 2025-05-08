
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Settings, Mail, MessageCircle, MessageSquare, CreditCard, 
  Store, Bell, Users, Building2, ChevronRight
} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';

interface SettingCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
}

const SettingCard = ({ title, description, icon, to }: SettingCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="cursor-pointer hover:bg-secondary/10 transition-colors" onClick={() => navigate(to)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="rounded-full p-2 bg-primary/10">
          {icon}
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const UnifiedSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  
  return (
    <Container>
      <Breadcrumb className="mb-4">
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/settings" isCurrentPage>Settings</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage app settings and configurations</p>
      </div>
      
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notification">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SettingCard
              title="Email Settings"
              description="Configure email providers and templates"
              icon={<Mail className="h-4 w-4 text-primary" />}
              to="/settings/email"
            />
            <SettingCard
              title="SMS Settings"
              description="Set up SMS gateway and templates"
              icon={<MessageCircle className="h-4 w-4 text-primary" />}
              to="/settings/sms"
            />
            <SettingCard
              title="WhatsApp Settings"
              description="Configure WhatsApp business integration"
              icon={<MessageSquare className="h-4 w-4 text-primary" />}
              to="/settings/whatsapp"
            />
            <SettingCard
              title="Email Templates"
              description="Create and manage email notification templates"
              icon={<Mail className="h-4 w-4 text-primary" />}
              to="/settings/templates/email"
            />
            <SettingCard
              title="SMS Templates"
              description="Create and manage SMS templates"
              icon={<MessageCircle className="h-4 w-4 text-primary" />}
              to="/settings/templates/sms"
            />
            <SettingCard
              title="WhatsApp Templates"
              description="Set up WhatsApp message templates"
              icon={<MessageSquare className="h-4 w-4 text-primary" />}
              to="/settings/templates/whatsapp"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="notification">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SettingCard
              title="Notifications Settings"
              description="Configure push and in-app notifications"
              icon={<Bell className="h-4 w-4 text-primary" />}
              to="/settings/notifications"
            />
            <SettingCard
              title="Reminder Rules"
              description="Set up automated reminders and alerts"
              icon={<Bell className="h-4 w-4 text-primary" />}
              to="/communication/reminders"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="integrations">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SettingCard
              title="Attendance Devices"
              description="Configure biometric and access control devices"
              icon={<Settings className="h-4 w-4 text-primary" />}
              to="/settings/attendance-devices"
            />
            <SettingCard
              title="API Integrations"
              description="Manage third-party API connections"
              icon={<Settings className="h-4 w-4 text-primary" />}
              to="/settings/api-integrations"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="payments">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SettingCard
              title="Payment Gateways"
              description="Configure Razorpay and other payment methods"
              icon={<CreditCard className="h-4 w-4 text-primary" />}
              to="/settings/integrations/payment"
            />
            <SettingCard
              title="Invoice Settings"
              description="Customize invoice templates and settings"
              icon={<CreditCard className="h-4 w-4 text-primary" />}
              to="/finance/invoices"
            />
            <SettingCard
              title="Store Settings"
              description="Configure online store and product settings"
              icon={<Store className="h-4 w-4 text-primary" />}
              to="/store"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="branches">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SettingCard
              title="Branch Management"
              description="Add, edit, and manage gym branches"
              icon={<Building2 className="h-4 w-4 text-primary" />}
              to="/branches"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SettingCard
              title="User Management"
              description="Manage user accounts and permissions"
              icon={<Users className="h-4 w-4 text-primary" />}
              to="/admin/user-management"
            />
            <SettingCard
              title="Role Management"
              description="Configure user roles and permissions"
              icon={<Users className="h-4 w-4 text-primary" />}
              to="/settings/roles"
            />
          </div>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default UnifiedSettingsPage;
