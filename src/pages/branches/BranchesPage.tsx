
import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import BranchManager from '@/components/branch/BranchManager';
import { Branch } from '@/types/branch';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

const BranchesPage = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      // Transform to Branch type
      const fetchedBranches: Branch[] = data.map(branch => ({
        id: branch.id,
        name: branch.name,
        address: branch.address || '',
        phone: branch.phone || '',
        email: branch.email || '',
        isActive: branch.is_active,
        manager: branch.manager || '',
        // Map other fields as needed
      }));
      
      setBranches(fetchedBranches);
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast.error('Failed to load branches');
      
      // Fallback to mock data
      setBranches([
        {
          id: 'branch-1',
          name: 'Main Branch',
          address: '123 Main St, Anytown, CA',
          phone: '+1 (555) 123-4567',
          email: 'main@musclegrgage.com',
          isActive: true,
          manager: 'John Manager',
        },
        {
          id: 'branch-2',
          name: 'Downtown Branch',
          address: '456 Center St, Anytown, CA',
          phone: '+1 (555) 987-6543',
          email: 'downtown@musclegrgage.com',
          isActive: true,
          manager: 'Jane Leader',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Branch Management</h1>
        
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 rounded-full border-4 border-t-accent animate-spin"></div>
              </div>
            ) : (
              <BranchManager 
                branches={branches}
                onBranchChange={fetchBranches}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default BranchesPage;
