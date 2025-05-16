
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Import Shadcn UI components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Container } from '@/components/ui/container';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

// Import access control components
import HikvisionSettings from '@/components/settings/access-control/HikvisionSettings';
import HikvisionDevices from '@/components/settings/access-control/HikvisionDevices';
import MemberAccessControl from '@/components/access-control/MemberAccessControl';

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
          
          {branches.length > 0 && (
            <div className="w-64">
              <Select value={branchId || undefined} onValueChange={handleBranchChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Access Control Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="settings" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="devices">Devices</TabsTrigger>
                <TabsTrigger value="members">Member Access</TabsTrigger>
              </TabsList>
              
              <TabsContent value="settings" className="mt-6">
                {branchId && <HikvisionSettings branchId={branchId} />}
              </TabsContent>
              
              <TabsContent value="devices" className="mt-6">
                {branchId && <HikvisionDevices branchId={branchId} />}
              </TabsContent>
              
              <TabsContent value="members" className="mt-6">
                {branchId && <MemberAccessControl />}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default AccessControlPage;
