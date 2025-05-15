
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Branch } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BranchContextType {
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch | null) => void;
  branches: Branch[];
  setBranches: (branches: Branch[]) => void;
  isLoading: boolean;
  fetchBranches: () => Promise<Branch[]>;
  createBranch: (branchData: Partial<Branch>) => Promise<Branch | null>;
  updateBranch: (id: string, branchData: Partial<Branch>) => Promise<Branch | null>;
  deleteBranch: (id: string) => Promise<boolean>;
  switchBranch: (branchId: string) => void;
}

const BranchContext = createContext<BranchContextType>({
  currentBranch: null,
  setCurrentBranch: () => {},
  branches: [],
  setBranches: () => {},
  isLoading: false,
  fetchBranches: async () => [],
  createBranch: async () => null,
  updateBranch: async () => null,
  deleteBranch: async () => false,
  switchBranch: () => {}
});

export const BranchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch branches from Supabase
  const fetchBranches = useCallback(async (): Promise<Branch[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('name');

      if (error) throw error;

      // Transform the data to match the Branch type if needed
      const branchesData: Branch[] = data.map(branch => ({
        id: branch.id,
        name: branch.name,
        address: branch.address || '',
        city: branch.city || '',
        state: branch.state || '',
        country: branch.country || 'India',
        email: branch.email || '',
        phone: branch.phone || '',
        is_active: branch.is_active ?? true,
        manager_id: branch.manager_id || '',
        branch_code: branch.branch_code || '',
        opening_hours: branch.opening_hours || '',
        closing_hours: branch.closing_hours || '',
        tax_rate: branch.tax_rate || 0,
        max_capacity: branch.max_capacity || 0,
        created_at: branch.created_at || new Date().toISOString(),
        updated_at: branch.updated_at || new Date().toISOString()
      }));

      setBranches(branchesData);

      // If no current branch is set and we have branches, set the first one as current
      if (!currentBranch && branchesData.length > 0) {
        setCurrentBranch(branchesData[0]);
      }

      return branchesData;
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast.error('Failed to fetch branches');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch]);

  // Create a branch
  const createBranch = async (branchData: Partial<Branch>): Promise<Branch | null> => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .insert([{
          name: branchData.name,
          address: branchData.address,
          city: branchData.city,
          state: branchData.state,
          country: branchData.country || 'India',
          email: branchData.email,
          phone: branchData.phone,
          is_active: branchData.is_active !== undefined ? branchData.is_active : true,
          manager_id: branchData.manager_id,
          branch_code: branchData.branch_code,
          opening_hours: branchData.opening_hours,
          closing_hours: branchData.closing_hours,
          tax_rate: branchData.tax_rate,
          max_capacity: branchData.max_capacity
        }])
        .select()
        .single();

      if (error) throw error;

      const newBranch: Branch = {
        id: data.id,
        name: data.name,
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || 'India',
        email: data.email || '',
        phone: data.phone || '',
        is_active: data.is_active ?? true,
        manager_id: data.manager_id || '',
        branch_code: data.branch_code || '',
        opening_hours: data.opening_hours || '',
        closing_hours: data.closing_hours || '',
        tax_rate: data.tax_rate || 0,
        max_capacity: data.max_capacity || 0,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };

      setBranches(prev => [...prev, newBranch]);
      toast.success('Branch created successfully');
      return newBranch;
    } catch (error) {
      console.error('Error creating branch:', error);
      toast.error('Failed to create branch');
      return null;
    }
  };

  // Update a branch
  const updateBranch = async (id: string, branchData: Partial<Branch>): Promise<Branch | null> => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .update({
          name: branchData.name,
          address: branchData.address,
          city: branchData.city,
          state: branchData.state,
          country: branchData.country,
          email: branchData.email,
          phone: branchData.phone,
          is_active: branchData.is_active,
          manager_id: branchData.manager_id,
          branch_code: branchData.branch_code,
          opening_hours: branchData.opening_hours,
          closing_hours: branchData.closing_hours,
          tax_rate: branchData.tax_rate,
          max_capacity: branchData.max_capacity,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedBranch: Branch = {
        id: data.id,
        name: data.name,
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || 'India',
        email: data.email || '',
        phone: data.phone || '',
        is_active: data.is_active ?? true,
        manager_id: data.manager_id || '',
        branch_code: data.branch_code || '',
        opening_hours: data.opening_hours || '',
        closing_hours: data.closing_hours || '',
        tax_rate: data.tax_rate || 0,
        max_capacity: data.max_capacity || 0,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };

      setBranches(prev =>
        prev.map(branch =>
          branch.id === id ? updatedBranch : branch
        )
      );

      // Update current branch if it's the one being updated
      if (currentBranch?.id === id) {
        setCurrentBranch(updatedBranch);
      }

      toast.success('Branch updated successfully');
      return updatedBranch;
    } catch (error) {
      console.error('Error updating branch:', error);
      toast.error('Failed to update branch');
      return null;
    }
  };

  // Delete a branch
  const deleteBranch = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBranches(prev => prev.filter(branch => branch.id !== id));

      // Reset current branch if it's the one being deleted
      if (currentBranch?.id === id) {
        setCurrentBranch(branches.length > 1 ? branches[0] : null);
      }

      toast.success('Branch deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting branch:', error);
      toast.error('Failed to delete branch');
      return false;
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  useEffect(() => {
    // Set the first branch as current if available and none is selected
    if (branches.length > 0 && !currentBranch) {
      setCurrentBranch(branches[0]);
    }
  }, [branches, currentBranch]);

  // Function to switch to a different branch by ID
  const switchBranch = useCallback((branchId: string) => {
    if (!branchId) return;
    
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranch(branch);
      // Save the selected branch ID to localStorage for persistence
      localStorage.setItem('selectedBranchId', branchId);
    } else {
      console.error(`Branch with ID ${branchId} not found`);
    }
  }, [branches, setCurrentBranch]);

  return (
    <BranchContext.Provider 
      value={{ 
        currentBranch, 
        setCurrentBranch, 
        branches, 
        setBranches, 
        isLoading,
        fetchBranches,
        createBranch,
        updateBranch,
        deleteBranch,
        switchBranch
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);

export default BranchContext;
