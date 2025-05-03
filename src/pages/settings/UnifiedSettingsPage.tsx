
import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, 
  Shield, 
  Settings as SettingsIcon, 
  Users, 
  Layers, 
  LayoutTemplate, 
  Zap, 
  Smartphone 
} from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";
import CompanySettings from "@/components/settings/CompanySettings";
import BranchesSettings from "@/components/settings/BranchesSettings";
import UsersPermissionsSettings from "@/components/settings/UsersPermissionsSettings";
import IntegrationsSettings from "@/components/settings/IntegrationsSettings";
import TemplatesSettings from "@/components/settings/TemplatesSettings";
import AutomationSettings from "@/components/settings/AutomationSettings";
import AttendanceSettings from "@/components/settings/AttendanceSettings";

const UnifiedSettingsPage = () => {
  const { can } = usePermissions();
  const [activeTab, setActiveTab] = useState("company");

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">Unified configuration center</p>
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
                <TabsTrigger value="company" className="flex items-center gap-2">
                  <SettingsIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Company</span>
                </TabsTrigger>
                
                <TabsTrigger value="branches" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Branches</span>
                </TabsTrigger>
                
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Users</span>
                </TabsTrigger>

                <TabsTrigger value="integrations" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span className="hidden sm:inline">Integrations</span>
                </TabsTrigger>

                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <LayoutTemplate className="h-4 w-4" />
                  <span className="hidden sm:inline">Templates</span>
                </TabsTrigger>

                <TabsTrigger value="automation" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline">Automation</span>
                </TabsTrigger>
                
                <TabsTrigger value="attendance" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span className="hidden sm:inline">Attendance</span>
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          <TabsContent value="company">
            <CompanySettings />
          </TabsContent>
          
          <TabsContent value="branches">
            <BranchesSettings />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersPermissionsSettings />
          </TabsContent>
          
          <TabsContent value="integrations">
            <IntegrationsSettings />
          </TabsContent>
          
          <TabsContent value="templates">
            <TemplatesSettings />
          </TabsContent>
          
          <TabsContent value="automation">
            <AutomationSettings />
          </TabsContent>
          
          <TabsContent value="attendance">
            <AttendanceSettings />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default UnifiedSettingsPage;
