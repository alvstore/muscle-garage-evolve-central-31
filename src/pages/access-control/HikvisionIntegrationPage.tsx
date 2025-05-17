
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  SettingsIcon, 
  HardDriveIcon, 
  UsersIcon, 
  Activity 
} from 'lucide-react';
import { useBranch } from '@/hooks/settings/use-branches';
import HikvisionSettings from '@/components/access-control/HikvisionSettings';
import DeviceManagement from '@/components/access-control/DeviceManagement';
import MemberAccessControl from '@/components/access-control/MemberAccessControl';

const HikvisionIntegrationPage = () => {
  const { currentBranch } = useBranch();
  const [activeTab, setActiveTab] = useState('settings');
  
  return (
    <Container>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Access Control Integration</h1>
          <p className="text-muted-foreground">
            Set up and manage Hikvision access control devices for member entry
          </p>
        </div>
        
        {!currentBranch?.id ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Branch</h3>
                <p className="text-muted-foreground">
                  Please select a branch to configure access control
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="devices" className="flex items-center gap-2">
                <HardDriveIcon className="h-4 w-4" />
                Devices
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4" />
                Member Access
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings">
              <HikvisionSettings branchId={currentBranch?.id} />
            </TabsContent>
            
            <TabsContent value="devices">
              <DeviceManagement branchId={currentBranch?.id} />
            </TabsContent>
            
            <TabsContent value="members">
              <MemberAccessControl branchId={currentBranch?.id} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Container>
  );
};

export default HikvisionIntegrationPage;
