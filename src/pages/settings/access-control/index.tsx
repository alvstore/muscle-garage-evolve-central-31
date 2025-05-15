
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import HikvisionSettings from '@/components/settings/access-control/HikvisionSettings';
import HikvisionDevices from '@/components/settings/access-control/HikvisionDevices';
import { useBranch } from '@/hooks/use-branch';

const AccessControlPage = () => {
  const { currentBranch } = useBranch();
  const [activeTab, setActiveTab] = useState('settings');
  
  if (!currentBranch?.id) {
    return (
      <Container>
        <div className="py-6">
          <Card>
            <CardContent className="py-10 text-center">
              <p>Please select a branch to manage access control settings</p>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Access Control Settings</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="settings">API Settings</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="zones">Access Zones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings">
            <HikvisionSettings branchId={currentBranch.id} />
          </TabsContent>
          
          <TabsContent value="devices">
            <HikvisionDevices branchId={currentBranch.id} />
          </TabsContent>
          
          <TabsContent value="zones">
            <Card>
              <CardHeader>
                <CardTitle>Access Zones</CardTitle>
                <CardDescription>
                  Configure access zones for different areas of your gym
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Zone management will be available in a future update.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default AccessControlPage;
