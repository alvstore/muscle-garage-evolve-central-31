
import React, { useState } from 'react';
import { useBranch } from '@/hooks/auth/use-branches';
import BranchDeviceManager from '@/components/integrations/BranchDeviceManager';
import BranchSpecificSettings from '@/components/settings/branches/BranchSpecificSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Server, Settings2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { LocalTabs, LocalTabsList, LocalTabsTrigger, LocalTabsContent } from '@/components/ui/local-tabs';

const BranchIntegrationSettings = () => {
  const { currentBranch } = useBranch();
  const [activeTab, setActiveTab] = useState('settings');
  
  if (!currentBranch) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Branch Selected</h2>
              <p className="text-muted-foreground mb-4">
                Please select a branch to configure integration settings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          {currentBranch.name} Settings
        </h1>
        <p className="text-muted-foreground">
          Configure branch-specific settings and integrations
        </p>
      </div>
      
      <LocalTabs defaultValue="settings" onValueChange={setActiveTab}>
        <LocalTabsList className="grid w-full grid-cols-2 mb-8">
          <LocalTabsTrigger value="settings" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Branch Settings
          </LocalTabsTrigger>
          <LocalTabsTrigger value="devices" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Access Control Devices
          </LocalTabsTrigger>
        </LocalTabsList>
        <LocalTabsContent value="settings">
          <BranchSpecificSettings />
        </LocalTabsContent>
        <LocalTabsContent value="devices">
          <BranchDeviceManager />
        </LocalTabsContent>
      </LocalTabs>
    </div>
  );
};

export default BranchIntegrationSettings;
