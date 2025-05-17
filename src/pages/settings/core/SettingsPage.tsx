
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Settings, 
  Shield, 
  MessageSquare, 
  Mail, 
  MessageCircle, 
  Bell, 
  Brain, 
  Building2,
  Layers,
  LayoutTemplate,
  Zap,
  Smartphone
} from "lucide-react";
import { toast } from "sonner";
import { usePermissions, Permission } from "@/hooks/use-permissions";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import GeneralSettings from "@/components/settings/GeneralSettings";
import AccessControlSettings from "@/components/settings/AccessControlSettings";
import WhatsAppSettings from "@/components/settings/WhatsAppSettings";
import EmailSettings from "@/components/settings/EmailSettings";
import SmsSettings from "@/components/settings/SmsSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AutomationSettings from "@/components/settings/AutomationSettings";
import PermissionsSettings from "@/components/settings/PermissionsSettings";
import BranchSection from "@/components/settings/BranchSection";

const SettingsPage = () => {
  const { user } = useAuth();
  const { can } = usePermissions();
  const [activeTab, setActiveTab] = useState("general");

  // Redirect if user doesn't have permission
  if (!user || !can('manage_settings')) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">Configure your system settings</p>
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <TabsList className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-9 gap-2">
                <PermissionGuard permission="manage_settings">
                  <TabsTrigger value="general" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden md:inline">General</span>
                  </TabsTrigger>
                </PermissionGuard>
                
                <PermissionGuard permission="manage_branches">
                  <TabsTrigger value="branches" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="hidden md:inline">Branches</span>
                  </TabsTrigger>
                </PermissionGuard>
                
                <PermissionGuard permission="manage_roles">
                  <TabsTrigger value="permissions" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden md:inline">Permissions</span>
                  </TabsTrigger>
                </PermissionGuard>

                <TabsTrigger value="integrations" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span className="hidden md:inline">Integrations</span>
                </TabsTrigger>

                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <LayoutTemplate className="h-4 w-4" />
                  <span className="hidden md:inline">Templates</span>
                </TabsTrigger>

                <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden md:inline">WhatsApp</span>
                </TabsTrigger>
                
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="hidden md:inline">Email</span>
                </TabsTrigger>
                
                <TabsTrigger value="sms" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden md:inline">SMS</span>
                </TabsTrigger>
                
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden md:inline">Notifications</span>
                </TabsTrigger>
                
                <TabsTrigger value="automation" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="hidden md:inline">Automation</span>
                </TabsTrigger>
                
                <TabsTrigger value="access" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden md:inline">Access</span>
                </TabsTrigger>
                
                <TabsTrigger value="attendance" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span className="hidden md:inline">Attendance</span>
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
          
          <TabsContent value="branches">
            <BranchSection />
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
          
          <TabsContent value="sms">
            <SmsSettings />
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
          
          <TabsContent value="integrations">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Integration Settings</h2>
                <p className="text-muted-foreground mb-4">
                  Manage all your third-party integrations from here. Select a specific integration type from the sidebar or tabs above.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <Shield className="h-10 w-10 mx-auto text-primary mb-2" />
                      <h3 className="font-medium">Access Control</h3>
                      <p className="text-sm text-muted-foreground">Configure Hikvision access control integration</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <MessageSquare className="h-10 w-10 mx-auto text-primary mb-2" />
                      <h3 className="font-medium">WhatsApp</h3>
                      <p className="text-sm text-muted-foreground">Set up WhatsApp Cloud API integration</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <Mail className="h-10 w-10 mx-auto text-primary mb-2" />
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-muted-foreground">Configure SMTP or SendGrid for email delivery</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Message Templates</h2>
                <p className="text-muted-foreground mb-4">
                  Manage templates for email, SMS, and WhatsApp communications. Create and edit message templates with custom tags.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <Mail className="h-10 w-10 mx-auto text-primary mb-2" />
                      <h3 className="font-medium">Email Templates</h3>
                      <p className="text-sm text-muted-foreground">Manage email notification templates</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <MessageCircle className="h-10 w-10 mx-auto text-primary mb-2" />
                      <h3 className="font-medium">SMS Templates</h3>
                      <p className="text-sm text-muted-foreground">Manage SMS notification templates</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <MessageSquare className="h-10 w-10 mx-auto text-primary mb-2" />
                      <h3 className="font-medium">WhatsApp Templates</h3>
                      <p className="text-sm text-muted-foreground">Manage WhatsApp message templates</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="attendance">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Attendance Settings</h2>
                <p className="text-muted-foreground mb-4">
                  Configure attendance devices and access rules for your branches.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <Smartphone className="h-10 w-10 mx-auto text-primary mb-2" />
                      <h3 className="font-medium">Device Mapping</h3>
                      <p className="text-sm text-muted-foreground">Map access control devices to branches</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <Shield className="h-10 w-10 mx-auto text-primary mb-2" />
                      <h3 className="font-medium">Access Rules</h3>
                      <p className="text-sm text-muted-foreground">Configure access rules based on membership plans</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default SettingsPage;
