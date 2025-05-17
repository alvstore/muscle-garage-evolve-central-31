
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Branch } from '@/types/settings/branch';
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
    // Prevent multiple simultaneous fetches
    if (isLoading) return branches;
    
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
      return branches; // Return current branches on error to prevent state churn
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, branches, currentBranch]); // Add proper dependencies

  // Create a branch
  const createBranch = async (branchData: Partial<Branch>): Promise<Branch | null> => {
    try {
      console.log('Creating branch with data:', branchData);
      
      // Validate required fields with specific error messages
      if (!branchData.name?.trim()) {
        const errorMsg = 'Branch name is required';
        console.error(errorMsg);
        toast.error(errorMsg);
        return null;
      }

      if (!branchData.address?.trim()) {
        const errorMsg = 'Branch address is required';
        console.error(errorMsg);
        toast.error(errorMsg);
        return null;
      }

      // Prepare the data to be inserted
      const insertData: any = {
        name: branchData.name.trim(),
        address: branchData.address.trim(),
        city: branchData.city?.trim() || null,
        state: branchData.state?.trim() || null,
        country: branchData.country?.trim() || 'India',
        email: branchData.email?.trim() || null,
        phone: branchData.phone?.trim() || null,
        is_active: branchData.is_active !== undefined ? branchData.is_active : true,
        manager_id: branchData.manager_id?.trim() || null,
        branch_code: branchData.branch_code?.trim() || null,
        opening_hours: branchData.opening_hours?.trim() || null,
        closing_hours: branchData.closing_hours?.trim() || null,
        tax_rate: branchData.tax_rate || null,
        max_capacity: branchData.max_capacity || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Prepared insert data:', insertData);

      // Remove undefined values
      Object.keys(insertData).forEach(key => {
        if (insertData[key] === undefined) {
          delete insertData[key];
        }
      });

      console.log('Final insert data after cleanup:', insertData);

      const { data, error } = await supabase
        .from('branches')
        .insert([insertData])
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        let errorMessage = 'Failed to create branch';
        
        // Handle specific error codes
        if (error.code === '23505') { // Unique violation
          errorMessage = 'A branch with this name or code already exists';
        } else if (error.message.includes('violates not-null constraint')) {
          errorMessage = 'Required field is missing';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

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

  // Only fetch branches on initial mount, not on every fetchBranches change
  useEffect(() => {
    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once on mount

  // Load the selected branch from localStorage when branches are loaded
  useEffect(() => {
    // Only run this effect when branches change and we have branches available
    if (branches.length === 0) return;
    
    const savedBranchId = localStorage.getItem('selectedBranchId');
    
    // Avoid unnecessary state updates if we already have a current branch
    if (currentBranch) return;
    
    if (savedBranchId) {
      // Find the saved branch in the branches list
      const savedBranch = branches.find(branch => branch.id === savedBranchId);
      
      if (savedBranch) {
        // If the saved branch exists, set it as the current branch
        setCurrentBranch(savedBranch);
      } else {
        // If the saved branch doesn't exist (maybe it was deleted), set the first branch as current
        setCurrentBranch(branches[0]);
        localStorage.setItem('selectedBranchId', branches[0].id);
      }
    } else {
      // If no saved branch ID is set, set the first branch as current
      setCurrentBranch(branches[0]);
      localStorage.setItem('selectedBranchId', branches[0].id);
    }
  }, [branches, currentBranch]); // Keep both dependencies, but add early returns to prevent unnecessary work

  // Function to switch to a different branch by ID
  const switchBranch = useCallback((branchId: string) => {
    if (!branchId) return;
    
    // Don't do anything if we're already on this branch
    if (currentBranch?.id === branchId) return;
    
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      // Save the selected branch ID to localStorage for persistence
      localStorage.setItem('selectedBranchId', branchId);
      
      // Set the new branch as current - do this only once
      setCurrentBranch(branch);
      
      // Use a debounced event to prevent multiple rapid events
      // This helps prevent cascading re-renders across the application
      const notifyBranchChange = () => {
        const branchChangeEvent = new CustomEvent('branchChanged', { 
          detail: { branchId, timestamp: Date.now() } 
        });
        window.dispatchEvent(branchChangeEvent);
        
        // Show a success message
        toast.success(`Switched to ${branch.name} branch`);
      };
      
      // Use setTimeout to debounce the event
      setTimeout(notifyBranchChange, 50);
    } else {
      console.error(`Branch with ID ${branchId} not found`);
      toast.error(`Branch not found`);
    }
  }, [branches, currentBranch]);

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
