
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Branch } from '@/types/branch';
import { useAuth } from './use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BranchContextType {
  branches: Branch[];
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch) => void;
  isLoading: boolean;
  fetchBranches: () => Promise<Branch[]>;
}

const BranchContext = createContext<BranchContextType>({
  branches: [],
  currentBranch: null,
  setCurrentBranch: () => {},
  isLoading: false,
  fetchBranches: async () => [],
});

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  const fetchBranches = async (): Promise<Branch[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('is_active', true)
        .order('name');
        
      if (error) {
        throw error;
      }
      
      const formattedBranches: Branch[] = data.map(branch => ({
        id: branch.id,
        name: branch.name,
        address: branch.address || '',
        phone: branch.phone || '',
        email: branch.email || '',
        manager: '',
        managerId: branch.manager_id || '',
        isActive: branch.is_active || true,
        createdAt: branch.created_at,
        updatedAt: branch.updated_at,
        maxCapacity: 0,
        openingHours: '',
        closingHours: ''
      }));
      
      setBranches(formattedBranches);
      return formattedBranches;
    } catch (error: any) {
      console.error("Error fetching branches:", error);
      toast.error("Could not load branches");
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const initializeBranches = async () => {
      const branchList = await fetchBranches();
      
      // Load last selected branch from localStorage if available
      const savedBranchId = localStorage.getItem('currentBranchId');
      const savedBranch = savedBranchId ? branchList.find(b => b.id === savedBranchId) : null;
      
      if (savedBranch) {
        setCurrentBranch(savedBranch);
      } else if (branchList.length > 0) {
        // Default to first branch if no saved preference
        setCurrentBranch(branchList[0]);
      }
    };
    
    if (user) {
      initializeBranches();
    }
  }, [user]);
  
  const handleSetCurrentBranch = (branch: Branch) => {
    setCurrentBranch(branch);
    localStorage.setItem('currentBranchId', branch.id);
  };
  
  return (
    <BranchContext.Provider
      value={{
        branches,
        currentBranch,
        setCurrentBranch: handleSetCurrentBranch,
        isLoading,
        fetchBranches,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);
