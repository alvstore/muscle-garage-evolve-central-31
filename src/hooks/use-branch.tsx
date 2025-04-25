
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
  createBranch: (branch: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Branch | null>;
  updateBranch: (id: string, branch: Partial<Branch>) => Promise<Branch | null>;
}

const BranchContext = createContext<BranchContextType>({
  branches: [],
  currentBranch: null,
  setCurrentBranch: () => {},
  isLoading: false,
  fetchBranches: async () => [],
  createBranch: async () => null,
  updateBranch: async () => null,
});

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  
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
        maxCapacity: branch.max_capacity || 0,
        openingHours: branch.opening_hours || '',
        closingHours: branch.closing_hours || ''
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

  const createBranch = async (branch: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>): Promise<Branch | null> => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .insert({
          name: branch.name,
          address: branch.address,
          phone: branch.phone,
          email: branch.email,
          manager_id: branch.managerId,
          is_active: branch.isActive,
          max_capacity: branch.maxCapacity,
          opening_hours: branch.openingHours,
          closing_hours: branch.closingHours
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      const newBranch: Branch = {
        id: data.id,
        name: data.name,
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
        manager: '',
        managerId: data.manager_id || '',
        isActive: data.is_active || true,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        maxCapacity: data.max_capacity || 0,
        openingHours: data.opening_hours || '',
        closingHours: data.closing_hours || ''
      };
      
      setBranches(prev => [...prev, newBranch]);
      toast.success("Branch created successfully");
      return newBranch;
    } catch (error: any) {
      console.error("Error creating branch:", error);
      toast.error(error.message || "Failed to create branch");
      return null;
    }
  };

  const updateBranch = async (id: string, branch: Partial<Branch>): Promise<Branch | null> => {
    try {
      const updates: any = {};
      
      if (branch.name) updates.name = branch.name;
      if (branch.address !== undefined) updates.address = branch.address;
      if (branch.phone !== undefined) updates.phone = branch.phone;
      if (branch.email !== undefined) updates.email = branch.email;
      if (branch.managerId !== undefined) updates.manager_id = branch.managerId;
      if (branch.isActive !== undefined) updates.is_active = branch.isActive;
      if (branch.maxCapacity !== undefined) updates.max_capacity = branch.maxCapacity;
      if (branch.openingHours !== undefined) updates.opening_hours = branch.openingHours;
      if (branch.closingHours !== undefined) updates.closing_hours = branch.closingHours;
      
      const { data, error } = await supabase
        .from('branches')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      const updatedBranch: Branch = {
        id: data.id,
        name: data.name,
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
        manager: '',
        managerId: data.manager_id || '',
        isActive: data.is_active || true,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        maxCapacity: data.max_capacity || 0,
        openingHours: data.opening_hours || '',
        closingHours: data.closing_hours || ''
      };
      
      setBranches(prev => prev.map(b => b.id === id ? updatedBranch : b));
      
      if (currentBranch?.id === id) {
        setCurrentBranch(updatedBranch);
      }
      
      toast.success("Branch updated successfully");
      return updatedBranch;
    } catch (error: any) {
      console.error("Error updating branch:", error);
      toast.error(error.message || "Failed to update branch");
      return null;
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
    
    if (isAuthenticated) {
      initializeBranches();
    }
  }, [isAuthenticated]);
  
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
        createBranch,
        updateBranch,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);
