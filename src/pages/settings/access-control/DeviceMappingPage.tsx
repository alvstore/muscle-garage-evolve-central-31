
import React from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BranchDeviceManager from '@/components/integrations/BranchDeviceManager';
import { usePermissions } from '@/hooks/auth/use-permissions';

const DeviceMappingPage = () => {
  const { can } = usePermissions();
  const canManageDevices = can('manage_integrations');
  
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Device Mapping</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Branch Device Configuration</CardTitle>
            <CardDescription>
              Map devices to branches and configure their settings
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="mapping">
              <TabsList>
                <TabsTrigger value="mapping">Device Mapping</TabsTrigger>
                <TabsTrigger value="settings">Access Rules</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mapping" className="mt-6">
                <BranchDeviceManager />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-6">
                <div className="space-y-4">
                  <p>Configure default access rules for branch devices.</p>
                  {/* Additional settings components can be added here */}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default DeviceMappingPage;
