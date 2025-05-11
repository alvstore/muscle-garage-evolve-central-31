
import { useState, useEffect, useCallback, createContext, ReactNode, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Branch } from '@/types/branch';
import { toast } from 'sonner';
import { useAuth } from './use-auth';

// Create a context for branch data
export const BranchContext = createContext<ReturnType<typeof useBranchData>>({
  branches: [],
  currentBranch: null,
  setCurrentBranch: () => {},
  isLoading: true,
  error: null,
  fetchBranches: async () => [],
  fetchCurrentBranch: async () => null,
  createBranch: async () => null,
  updateBranch: async () => null,
  deleteBranch: async () => false,
  switchBranch: () => {},
  getImageUrl: () => ''
});

// Create the actual hook functionality
const useBranchData = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch branches
  const fetchBranches = useCallback(async () => {
    console.log('Fetching branches from database');
    setIsLoading(true);
    setError(null);

    try {
      if (!user) {
        console.log('No user, cannot fetch branches');
        setIsLoading(false);
        return [];
      }
      
      console.log('User found, getting user profile for branches');
      
      // First get the user's profile to check their role and accessible branches
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, branch_id, accessible_branch_ids')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error getting user profile:', profileError);
        setError('Failed to get user profile');
        return [];
      }
      
      console.log('User profile:', profile);
      
      // Set up query for branches
      let query = supabase
        .from('branches')
        .select('*')
        .order('name');
      
      // Filter branches based on user role and permissions
      if (profile?.role !== 'admin') {
        console.log('User is not admin, filtering branches');
        const accessibleIds = [profile?.branch_id];
        if (profile?.accessible_branch_ids && profile.accessible_branch_ids.length > 0) {
          accessibleIds.push(...profile.accessible_branch_ids);
        }
        
        if (accessibleIds.length > 0 && accessibleIds[0] !== null) {
          console.log('Filtering by branch IDs:', accessibleIds);
          query = query.in('id', accessibleIds);
        }
      }
      
      const { data: branchesData, error: branchesError } = await query;

      if (branchesError) {
        console.error('Error fetching branches:', branchesError);
        setError('Failed to load branches');
        return [];
      }

      if (!branchesData || branchesData.length === 0) {
        console.log('No branches found');
      } else {
        console.log(`Found ${branchesData.length} branches`);
        setBranches(branchesData);
      }
      
      // Try to set current branch if we don't have one yet
      if (!currentBranch && branchesData && branchesData.length > 0) {
        // Try to get from local storage first
        const savedBranchId = localStorage.getItem('currentBranchId');
        const savedBranch = savedBranchId 
          ? branchesData.find(b => b.id === savedBranchId)
          : null;
        
        // Default to primary branch or first branch
        const defaultBranch = savedBranch || 
          (profile?.branch_id ? branchesData.find(b => b.id === profile.branch_id) : null) || 
          branchesData[0];
          
        if (defaultBranch) {
          console.log('Setting current branch to:', defaultBranch.name);
          setCurrentBranch(defaultBranch);
          localStorage.setItem('currentBranchId', defaultBranch.id);
        }
      }
      
      return branchesData || [];
    } catch (err: any) {
      console.error('Error in fetchBranches:', err);
      setError('Error fetching branches');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user, currentBranch]);

  // Fetch current branch details
  const fetchCurrentBranch = useCallback(async () => {
    if (!user) return null;
    
    const savedBranchId = localStorage.getItem('currentBranchId');
    if (!savedBranchId) return null;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('id', savedBranchId)
        .single();
        
      if (error) {
        console.error('Error fetching current branch:', error);
        return null;
      }
      
      if (data) {
        setCurrentBranch(data);
        return data;
      }
      return null;
    } catch (err) {
      console.error('Error in fetchCurrentBranch:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Create a new branch
  const createBranch = async (branch: Omit<Branch, 'id'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('branches')
        .insert([branch])
        .select()
        .single();

      if (error) {
        console.error('Error creating branch:', error);
        setError('Failed to create branch');
        toast.error('Failed to create branch');
        return null;
      }

      setBranches(prev => [...prev, data]);
      toast.success('Branch created successfully');
      return data;
    } catch (err) {
      console.error('Error creating branch:', err);
      setError('Failed to create branch');
      toast.error('Failed to create branch');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing branch
  const updateBranch = async (id: string, updates: Partial<Branch>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('branches')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating branch:', error);
        setError('Failed to update branch');
        toast.error('Failed to update branch');
        return null;
      }

      setBranches(prev => prev.map(branch => branch.id === id ? data : branch));
      setCurrentBranch(prev => prev?.id === id ? { ...prev, ...data } : prev);
      toast.success('Branch updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating branch:', err);
      setError('Failed to update branch');
      toast.error('Failed to update branch');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a branch
  const deleteBranch = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting branch:', error);
        setError('Failed to delete branch');
        toast.error('Failed to delete branch');
        return false;
      }

      setBranches(prev => prev.filter(branch => branch.id !== id));
      if (currentBranch?.id === id) {
        setCurrentBranch(branches[0] || null);
        localStorage.removeItem('currentBranchId');
      }
      toast.success('Branch deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting branch:', err);
      setError('Failed to delete branch');
      toast.error('Failed to delete branch');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Switch branch
  const switchBranch = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranch(branch);
      localStorage.setItem('currentBranchId', branchId);
      console.log('Switched to branch:', branch.name);
    } else {
      console.error('Branch not found:', branchId);
      toast.error('Branch not found');
    }
  };
  
  const getImageUrl = (bucket: string, path: string) => {
    if (!supabase) return '';
    
    // Use the proper supabase URL construction for files
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || '';
  };

  // Fetch branches on mount if user is available
  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching branches');
      fetchBranches();
    }
  }, [user, fetchBranches]);

  // Check for saved branch in localStorage
  useEffect(() => {
    if (user && !currentBranch) {
      fetchCurrentBranch();
    }
  }, [user, currentBranch, fetchCurrentBranch]);

  return {
    branches,
    currentBranch,
    setCurrentBranch,
    isLoading,
    error,
    fetchBranches,
    fetchCurrentBranch,
    createBranch,
    updateBranch,
    deleteBranch,
    switchBranch,
    getImageUrl
  };
};

// Create a provider component
export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const branchData = useBranchData();
  
  return (
    <BranchContext.Provider value={branchData}>
      {children}
    </BranchContext.Provider>
  );
};

// Export the hook that uses the context
export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};
