
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Shield, 
  MessageSquare, 
  Mail, 
  MessageCircle, 
  Bell, 
  Brain, 
  Settings, 
  Sliders, 
  MessageText,
  MailCheck
} from "lucide-react";
import GeneralSettings from "@/components/settings/GeneralSettings";
import AccessControlSettings from "@/components/settings/AccessControlSettings";
import WhatsAppSettings from "@/components/settings/WhatsAppSettings";
import EmailSettings from "@/components/settings/EmailSettings";
import SmsSettings from "@/components/settings/SmsSettings";
import SmsTemplateManager from "@/components/settings/SmsTemplateManager";
import EmailTemplateManager from "@/components/settings/EmailTemplateManager";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AutomationSettings from "@/components/settings/AutomationSettings";
import PermissionsSettings from "@/components/settings/PermissionsSettings";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/use-permissions";
import { PermissionGuard } from "@/components/auth/PermissionGuard";

const SettingsPage = () => {
  const { user } = useAuth();
  const { can, isSystemAdmin } = usePermissions();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");

  // Redirect if user is not admin
  if (!user || user.role !== "admin") {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">Configure your Muscle Garage system settings</p>
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-10 gap-2">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Sliders className="h-4 w-4" />
                  <span className="hidden md:inline">General</span>
                </TabsTrigger>
                <TabsTrigger value="access" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden md:inline">Access Control</span>
                </TabsTrigger>
                <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden md:inline">WhatsApp</span>
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="hidden md:inline">Email</span>
                </TabsTrigger>
                <TabsTrigger value="email-templates" className="flex items-center gap-2">
                  <MailCheck className="h-4 w-4" />
                  <span className="hidden md:inline">Email Templates</span>
                </TabsTrigger>
                <TabsTrigger value="sms" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden md:inline">SMS</span>
                </TabsTrigger>
                <TabsTrigger value="sms-templates" className="flex items-center gap-2">
                  <MessageText className="h-4 w-4" />
                  <span className="hidden md:inline">SMS Templates</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden md:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="automation" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="hidden md:inline">Automation</span>
                </TabsTrigger>
                <PermissionGuard permission="manage_roles">
                  <TabsTrigger value="permissions" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden md:inline">Permissions</span>
                  </TabsTrigger>
                </PermissionGuard>
              </TabsList>
            </CardContent>
          </Card>

          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
          
          <TabsContent value="access">
            <AccessControlSettings />
          </TabsContent>
          
          <TabsContent value="whatsapp">
            <WhatsAppSettings />
          </TabsContent>
          
          <TabsContent value="email">
            <EmailSettings />
          </TabsContent>
          
          <TabsContent value="email-templates">
            <EmailTemplateManager />
          </TabsContent>
          
          <TabsContent value="sms">
            <SmsSettings />
          </TabsContent>
          
          <TabsContent value="sms-templates">
            <SmsTemplateManager />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="automation">
            <AutomationSettings />
          </TabsContent>
          
          <TabsContent value="permissions">
            <PermissionGuard permission="manage_roles" fallback={<Navigate to="/unauthorized" replace />}>
              <PermissionsSettings />
            </PermissionGuard>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default SettingsPage;
