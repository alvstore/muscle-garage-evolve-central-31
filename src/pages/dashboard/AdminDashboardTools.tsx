
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClassManager from '@/components/admin/ClassManager';
import DatabaseSetupInfo from '@/components/admin/DatabaseSetupInfo';
import { toast } from 'sonner';

const AdminDashboardTools = () => {
  const [activeTab, setActiveTab] = useState('database');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleClassSuccess = () => {
    toast.success('Class saved successfully');
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="database">Database Setup</TabsTrigger>
            <TabsTrigger value="classes">Class Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="database" className="space-y-4">
            <DatabaseSetupInfo key={`db-${refreshKey}`} />
          </TabsContent>
          
          <TabsContent value="classes" className="space-y-4">
            <ClassManager key={`class-${refreshKey}`} onSuccess={handleClassSuccess} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminDashboardTools;
