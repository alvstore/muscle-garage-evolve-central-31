
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GeneralSettings from "@/components/settings/GeneralSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import IntegrationSettings from "@/components/settings/IntegrationSettings";
import BranchSettings from "@/components/settings/BranchSettings";
import PaymentSettings from "@/components/settings/PaymentSettings";
import AccessControlSettings from "@/components/settings/AccessControlSettings";
import CommunicationSettings from "@/components/settings/CommunicationSettings";
import { usePermissions } from "@/hooks/use-permissions";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { useBranch } from "@/hooks/use-branch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const UnifiedSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { can } = usePermissions();
  const { currentBranch } = useBranch();
  
  const isAdmin = can('manage_settings');
  const isGlobalAdmin = can('view_all_branches');

  return (
    <Container>
      <div className="py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            {isGlobalAdmin 
              ? "Global configuration settings for your entire organization" 
              : "Configuration settings for your branch"}
          </p>
        </div>

        {!currentBranch?.id && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Please select a branch first to view and modify branch-specific settings.
            </AlertDescription>
          </Alert>
        )}

        <Tabs 
          defaultValue="general" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <Card>
            <CardContent className="pt-6 pb-4 px-4">
              <TabsList className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-8 w-full">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="communication">Communication</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="access">Access Control</TabsTrigger>
                <PermissionGuard permission="manage_branch">
                  <TabsTrigger value="branch">Branch</TabsTrigger>
                </PermissionGuard>
                <PermissionGuard permission="manage_settings">
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </PermissionGuard>
                <PermissionGuard permission="manage_settings">
                  <TabsTrigger value="global" disabled={!isGlobalAdmin}>
                    Global
                  </TabsTrigger>
                </PermissionGuard>
              </TabsList>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Configure your basic gym settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <GeneralSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure notification preferences and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <NotificationSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communication">
              <Card>
                <CardHeader>
                  <CardTitle>Communication Settings</CardTitle>
                  <CardDescription>
                    Configure your email, SMS, and WhatsApp settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <CommunicationSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Settings</CardTitle>
                  <CardDescription>
                    Configure payment gateways and methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PaymentSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="access">
              <Card>
                <CardHeader>
                  <CardTitle>Access Control Settings</CardTitle>
                  <CardDescription>
                    Configure door access and attendance devices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AccessControlSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="branch">
              <PermissionGuard permission="manage_branch">
                <Card>
                  <CardHeader>
                    <CardTitle>Branch Settings</CardTitle>
                    <CardDescription>
                      Manage branch-specific configurations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <BranchSettings />
                  </CardContent>
                </Card>
              </PermissionGuard>
            </TabsContent>

            <TabsContent value="integrations">
              <PermissionGuard permission="manage_settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Integration Settings</CardTitle>
                    <CardDescription>
                      Connect with third-party services and APIs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <IntegrationSettings />
                  </CardContent>
                </Card>
              </PermissionGuard>
            </TabsContent>

            <TabsContent value="global">
              <PermissionGuard permission="manage_settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Global Settings</CardTitle>
                    <CardDescription>
                      Company-wide settings that apply to all branches
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!isGlobalAdmin ? (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Access Restricted</AlertTitle>
                        <AlertDescription>
                          You need super-admin privileges to modify global settings.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      // Global settings form will go here
                      <p>Global settings configuration will be available here.</p>
                    )}
                  </CardContent>
                </Card>
              </PermissionGuard>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Container>
  );
};

export default UnifiedSettingsPage;
