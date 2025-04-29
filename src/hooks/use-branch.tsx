
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Branch } from '@/types/branch';
import { useAuth } from '@/hooks/use-auth';

interface BranchContextType {
  branches: Branch[];
  currentBranch: Branch | null;
  isLoading: boolean;
  fetchBranches: () => Promise<void>;
  switchBranch: (branchId: string) => void;
  fetchBranchDetails: (branchId: string) => Promise<Branch | null>;
  createBranch: (branchData: Partial<Branch>) => Promise<Branch | null>;
  updateBranch: (branchId: string, branchData: Partial<Branch>) => Promise<boolean>;
}

const BranchContext = createContext<BranchContextType>({
  branches: [],
  currentBranch: null,
  isLoading: true,
  fetchBranches: async () => {},
  switchBranch: () => {},
  fetchBranchDetails: async () => null,
  createBranch: async () => null,
  updateBranch: async () => false,
});

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, updateUserBranch } = useAuth();
  
  const fetchBranches = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      let query = supabase.from('branches').select('*');
      
      // Filter branches based on user role
      if (user.role !== 'admin') {
        if (user.branchIds && user.branchIds.length > 0) {
          // For branch managers or users with access to multiple branches
          query = query.in('id', [user.branchId, ...user.branchIds]);
        } else {
          // For regular users with access to single branch
          query = query.eq('id', user.branchId);
        }
      }
      
      // Order by name
      query = query.order('name');
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Format the branch data
        const formattedBranches = data.map(formatBranchData);
        setBranches(formattedBranches);
        
        // Set current branch based on user's primary branch or first available branch
        const primaryBranchId = user.branchId;
        const primaryBranch = formattedBranches.find(b => b.id === primaryBranchId);
        
        if (primaryBranch) {
          setCurrentBranch(primaryBranch);
        } else if (formattedBranches.length > 0) {
          setCurrentBranch(formattedBranches[0]);
          // Update user's primary branch if not set
          if (user.id && !primaryBranchId) {
            await updateUserBranch(formattedBranches[0].id);
          }
        } else {
          setCurrentBranch(null);
        }
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast.error('Failed to load branches');
    } finally {
      setIsLoading(false);
    }
  };
  
  const switchBranch = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranch(branch);
      // Persist user's branch selection in database
      if (user?.id) {
        updateUserBranch(branchId);
      }
    }
  };
  
  const fetchBranchDetails = async (branchId: string): Promise<Branch | null> => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('id', branchId)
        .single();
      
      if (error) throw error;
      
      return data ? formatBranchData(data) : null;
    } catch (error) {
      console.error('Error fetching branch details:', error);
      toast.error('Failed to load branch details');
      return null;
    }
  };
  
  const createBranch = async (branchData: Partial<Branch>): Promise<Branch | null> => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .insert([branchData])
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Branch created successfully');
      await fetchBranches();
      
      return data ? formatBranchData(data) : null;
    } catch (error) {
      console.error('Error creating branch:', error);
      toast.error('Failed to create branch');
      return null;
    }
  };
  
  const updateBranch = async (branchId: string, branchData: Partial<Branch>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('branches')
        .update(branchData)
        .eq('id', branchId);
      
      if (error) throw error;
      
      toast.success('Branch updated successfully');
      await fetchBranches();
      
      return true;
    } catch (error) {
      console.error('Error updating branch:', error);
      toast.error('Failed to update branch');
      return false;
    }
  };
  
  // Format branch data to match Branch type
  const formatBranchData = (branch: any): Branch => ({
    id: branch.id,
    name: branch.name,
    address: branch.address || '',
    city: branch.city || '',
    state: branch.state || '',
    country: branch.country || '',
    is_active: branch.is_active || false,
    phone: branch.phone || '',
    email: branch.email || '',
    manager_id: branch.manager_id || '',
    manager_name: branch.manager_name || '',
    manager: branch.manager || '',
    openingHours: branch.opening_hours || '',
    closingHours: branch.closing_hours || '',
    maxCapacity: branch.max_capacity || 0,
    region: branch.region || '',
    branchCode: branch.branch_code || '',
    taxRate: branch.tax_rate || 0,
    timezone: branch.timezone || ''
  });
  
  useEffect(() => {
    if (user) {
      fetchBranches();
    } else {
      setBranches([]);
      setCurrentBranch(null);
    }
  }, [user?.id]);
  
  return (
    <BranchContext.Provider
      value={{
        branches,
        currentBranch,
        isLoading,
        fetchBranches,
        switchBranch,
        fetchBranchDetails,
        createBranch,
        updateBranch
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);
