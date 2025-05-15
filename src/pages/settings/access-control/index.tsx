
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Import Shadcn UI components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Container } from '@/components/ui/container';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

// Import access control components
import ZoneManagement from '@/components/settings/access-control/ZoneManagement';
import DoorManagement from '@/components/settings/access-control/DoorManagement';
import MembershipAccessRules from '@/components/settings/access-control/MembershipAccessRules';
import MemberAccessOverrides from '@/components/settings/access-control/MemberAccessOverrides';
import HikvisionSettings from '@/components/settings/access-control/HikvisionSettings';
import HikvisionDevices from '@/components/settings/access-control/HikvisionDevices';
import ESSLSettings from '@/components/settings/access-control/ESSLSettings';

const AccessControlPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('branches').select('id, name');
        
        if (error) {
          throw error;
        }
        
        setBranches(data || []);
        
        // Set default branch
        if (data && data.length > 0) {
          setBranchId(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Failed to load branches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBranches();
  }, []);

  const handleBranchChange = (value: string) => {
    setBranchId(value);
  };

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading access control settings...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Access Control Management</h1>
            <p className="text-muted-foreground">Configure and manage access control for your gym facilities</p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Access Control Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="access-rules" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="access-rules">Access Rules</TabsTrigger>
                <TabsTrigger value="devices">Devices</TabsTrigger>
                <TabsTrigger value="integrations">API Integrations</TabsTrigger>
              </TabsList>
              
              {/* Access Rules Tab - Contains Zones, Doors, Membership Rules, Member Overrides */}
              <TabsContent value="access-rules" className="mt-6">
                <Tabs defaultValue="zones" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="zones">Zones</TabsTrigger>
                    <TabsTrigger value="doors">Doors</TabsTrigger>
                    <TabsTrigger value="membership-rules">Membership Rules</TabsTrigger>
                    <TabsTrigger value="member-overrides">Member Overrides</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="zones">
                    {branchId && <ZoneManagement branchId={branchId} />}
                  </TabsContent>
                  
                  <TabsContent value="doors">
                    {branchId && <DoorManagement branchId={branchId} />}
                  </TabsContent>
                  
                  <TabsContent value="membership-rules">
                    {branchId && <MembershipAccessRules branchId={branchId} />}
                  </TabsContent>
                  
                  <TabsContent value="member-overrides">
                    {branchId && <MemberAccessOverrides branchId={branchId} />}
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              {/* Devices Tab - Contains Hikvision Devices and ESSL Devices */}
              <TabsContent value="devices" className="mt-6">
                <Tabs defaultValue="hikvision-devices" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="hikvision-devices">Hikvision Devices</TabsTrigger>
                    <TabsTrigger value="essl-devices">ESSL Devices</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="hikvision-devices">
                    {branchId && <HikvisionDevices branchId={branchId} />}
                  </TabsContent>
                  
                  <TabsContent value="essl-devices">
                    <Card>
                      <CardHeader>
                        <CardTitle>ESSL Devices</CardTitle>
                        <CardDescription>Manage your ESSL access control devices</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>ESSL device management coming soon...</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              {/* API Integrations Tab - Contains Hikvision API and ESSL API settings */}
              <TabsContent value="integrations" className="mt-6">
                <Tabs defaultValue="hikvision-api" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="hikvision-api">Hikvision API</TabsTrigger>
                    <TabsTrigger value="essl-api">ESSL API</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="hikvision-api">
                    {branchId && <HikvisionSettings branchId={branchId} />}
                  </TabsContent>
                  
                  <TabsContent value="essl-api">
                    {branchId && <ESSLSettings branchId={branchId} />}
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default AccessControlPage;
