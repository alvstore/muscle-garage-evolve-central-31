
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Edit, Trash2, RefreshCw, Check, X, AccessPoint } from 'lucide-react';
import { useHikvisionSettings } from '@/hooks/use-hikvision-settings';
import { HikvisionDevice } from '@/types/settings/hikvision-types';
import HikvisionDevices from '@/components/settings/access-control/HikvisionDevices';
import AccessEventWebhook from './AccessEventWebhook';
import { toast } from 'sonner';

interface DeviceManagementProps {
  branchId: string;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ branchId }) => {
  const [activeTab, setActiveTab] = useState('devices');
  const { 
    devices, 
    getDevices,
    isLoadingDevices,
    isConnected,
    settings
  } = useHikvisionSettings(branchId);

  useEffect(() => {
    if (branchId) {
      getDevices(branchId);
    }
  }, [branchId, getDevices]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="devices">Access Points</TabsTrigger>
          <TabsTrigger value="events">Event Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <HikvisionDevices branchId={branchId} />
        </TabsContent>

        <TabsContent value="events">
          <AccessEventWebhook branchId={branchId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceManagement;
