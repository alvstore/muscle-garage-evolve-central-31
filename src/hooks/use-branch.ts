
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { createContext, useContext, ReactNode } from 'react';

export type Branch = {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  is_active?: boolean;
  phone?: string;
  email?: string;
  manager?: string;
  managerId?: string;
  openingHours?: string;
  closingHours?: string;
  maxCapacity?: number;
};

interface BranchContextType {
  branches: Branch[];
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch) => void;
  isLoading: boolean;
  error: string | null;
  switchBranch: (branchId: string) => boolean;
  fetchBranches: () => Promise<void>;
  createBranch: (branch: Omit<Branch, 'id'>) => Promise<Branch | null>;
  updateBranch: (id: string, branch: Partial<Branch>) => Promise<Branch | null>;
}

const BranchContext = createContext<BranchContextType>({
  branches: [],
  currentBranch: null,
  setCurrentBranch: () => {},
  isLoading: true,
  error: null,
  switchBranch: () => false,
  fetchBranches: async () => {},
  createBranch: async () => null,
  updateBranch: async () => null,
});

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBranches = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get user profile to determine branch access
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('branch_id, accessible_branch_ids, role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Determine which branches to fetch
      let branchesQuery;
      if (profile.role === 'admin') {
        // Admins can see all branches
        branchesQuery = supabase
          .from('branches')
          .select('*')
          .order('name');
      } else if (profile.accessible_branch_ids && profile.accessible_branch_ids.length > 0) {
        // Staff with multiple branch access
        branchesQuery = supabase
          .from('branches')
          .select('*')
          .in('id', [profile.branch_id, ...profile.accessible_branch_ids])
          .order('name');
      } else {
        // Users with single branch access
        branchesQuery = supabase
          .from('branches')
          .select('*')
          .eq('id', profile.branch_id)
          .order('name');
      }

      const { data: branchesData, error: branchesError } = await branchesQuery;
      
      if (branchesError) throw branchesError;

      // Format branch data for frontend use
      const formattedBranches: Branch[] = branchesData.map((branch: any) => ({
        id: branch.id,
        name: branch.name,
        address: branch.address || '',
        city: branch.city || '',
        state: branch.state || '',
        country: branch.country || '',
        is_active: branch.is_active || false,
        phone: branch.phone || '',
        email: branch.email || '',
        manager: branch.manager || '',
        managerId: branch.manager_id || '',
        openingHours: branch.opening_hours || '',
        closingHours: branch.closing_hours || '',
        maxCapacity: branch.max_capacity || 0
      }));

      // Set the branches and current branch
      setBranches(formattedBranches);

      // Set current branch (first from list or user's primary branch)
      if (formattedBranches.length > 0) {
        const primaryBranch = formattedBranches.find(b => b.id === profile.branch_id) || formattedBranches[0];
        setCurrentBranch(primaryBranch);
      }
    } catch (err: any) {
      console.error('Error fetching branches:', err);
      setError('Failed to load branch data');
      toast.error('Failed to load branch data');
    } finally {
      setIsLoading(false);
    }
  };

  const switchBranch = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranch(branch);
      return true;
    }
    return false;
  };

  const createBranch = async (branch: Omit<Branch, 'id'>): Promise<Branch | null> => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .insert({
          name: branch.name,
          address: branch.address,
          city: branch.city,
          state: branch.state,
          country: branch.country,
          is_active: branch.is_active,
          phone: branch.phone,
          email: branch.email,
          manager_id: branch.managerId,
          opening_hours: branch.openingHours,
          closing_hours: branch.closingHours,
          max_capacity: branch.maxCapacity
        })
        .select()
        .single();

      if (error) throw error;

      const newBranch: Branch = {
        id: data.id,
        name: data.name,
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        is_active: data.is_active || false,
        phone: data.phone || '',
        email: data.email || '',
        manager: branch.manager || '',
        managerId: data.manager_id || '',
        openingHours: data.opening_hours || '',
        closingHours: data.closing_hours || '',
        maxCapacity: data.max_capacity || 0
      };

      setBranches(prev => [...prev, newBranch]);
      toast.success("Branch created successfully");
      return newBranch;
    } catch (err: any) {
      console.error("Error creating branch:", err);
      toast.error(err.message || "Failed to create branch");
      return null;
    }
  };

  const updateBranch = async (id: string, branch: Partial<Branch>): Promise<Branch | null> => {
    try {
      const updates: any = {};
      
      if (branch.name !== undefined) updates.name = branch.name;
      if (branch.address !== undefined) updates.address = branch.address;
      if (branch.city !== undefined) updates.city = branch.city;
      if (branch.state !== undefined) updates.state = branch.state;
      if (branch.country !== undefined) updates.country = branch.country;
      if (branch.is_active !== undefined) updates.is_active = branch.is_active;
      if (branch.phone !== undefined) updates.phone = branch.phone;
      if (branch.email !== undefined) updates.email = branch.email;
      if (branch.managerId !== undefined) updates.manager_id = branch.managerId;
      if (branch.openingHours !== undefined) updates.opening_hours = branch.openingHours;
      if (branch.closingHours !== undefined) updates.closing_hours = branch.closingHours;
      if (branch.maxCapacity !== undefined) updates.max_capacity = branch.maxCapacity;
      
      const { data, error } = await supabase
        .from('branches')
        .update(updates)
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
        country: data.country || '',
        is_active: data.is_active || false,
        phone: data.phone || '',
        email: data.email || '',
        manager: branch.manager || '',
        managerId: data.manager_id || '',
        openingHours: data.opening_hours || '',
        closingHours: data.closing_hours || '',
        maxCapacity: data.max_capacity || 0
      };
      
      setBranches(prev => prev.map(b => b.id === id ? updatedBranch : b));
      
      if (currentBranch?.id === id) {
        setCurrentBranch(updatedBranch);
      }
      
      toast.success("Branch updated successfully");
      return updatedBranch;
    } catch (err: any) {
      console.error("Error updating branch:", err);
      toast.error(err.message || "Failed to update branch");
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchBranches();
    }
  }, [user]);

  return (
    <BranchContext.Provider
      value={{
        branches,
        currentBranch,
        setCurrentBranch,
        isLoading,
        error,
        switchBranch,
        fetchBranches,
        createBranch,
        updateBranch
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);
