import { supabase } from '@/services/supabaseClient';
import { Branch, normalizeBranch } from '@/types/branch';

export const fetchUserBranches = async (userId: string): Promise<{ branchesData: any[], primaryBranchId: string | null }> => {
  try {
    // First get the user's profile to check their primary branch and accessible branches
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('branch_id, accessible_branch_ids')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return { branchesData: [], primaryBranchId: null };
    }

    const primaryBranchId = profile?.branch_id || null;
    const accessibleBranchIds = profile?.accessible_branch_ids || [];

    // Get all branches this user has access to
    let query = supabase
      .from('branches')
      .select('*');

    // Admin users can see all branches, others only see their accessible branches
    if (accessibleBranchIds.length > 0) {
      query = query.or(`id.eq.${primaryBranchId},id.in.(${accessibleBranchIds.join(',')})`);
    } else if (primaryBranchId) {
      query = query.eq('id', primaryBranchId);
    }

    const { data: branches, error: branchesError } = await query;
    
    if (branchesError) {
      console.error('Error fetching branches:', branchesError);
      return { branchesData: [], primaryBranchId };
    }

    // Normalize branch data
    const normalizedBranches = branches ? branches.map(branch => normalizeBranch(branch as Branch)) : [];
    return { branchesData: normalizedBranches, primaryBranchId };
  } catch (error) {
    console.error('Error in fetchUserBranches:', error);
    return { branchesData: [], primaryBranchId: null };
  }
};

export const formatBranchData = (branch: any): Branch => {
  // Make sure we handle both snake_case and camelCase properties
  return normalizeBranch({
    id: branch.id,
    name: branch.name,
    address: branch.address || '',
    city: branch.city || '',
    state: branch.state || '',
    country: branch.country || 'India',
    manager_id: branch.manager_id || null,
    is_active: branch.is_active !== false
  } as Branch);
};

export const createBranchInDb = async (branchData: Omit<Branch, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('branches')
      .insert([{
        name: branchData.name,
        address: branchData.address,
        city: branchData.city,
        state: branchData.state,
        country: branchData.country || 'India',
        manager_id: branchData.manager_id || branchData.managerId,
        is_active: branchData.is_active !== undefined ? branchData.is_active : branchData.isActive !== false
      }])
      .select();

    if (error) throw error;
    return formatBranchData(data[0]);
  } catch (error) {
    console.error('Error creating branch:', error);
    throw error;
  }
};

export const updateBranchInDb = async (id: string, branchData: Partial<Branch>) => {
  try {
    const updates: any = {};
    
    if (branchData.name !== undefined) updates.name = branchData.name;
    if (branchData.address !== undefined) updates.address = branchData.address;
    if (branchData.city !== undefined) updates.city = branchData.city;
    if (branchData.state !== undefined) updates.state = branchData.state;
    if (branchData.country !== undefined) updates.country = branchData.country;
    if (branchData.manager_id !== undefined) updates.manager_id = branchData.manager_id;
    if (branchData.managerId !== undefined) updates.manager_id = branchData.managerId;
    if (branchData.is_active !== undefined) updates.is_active = branchData.is_active;
    if (branchData.isActive !== undefined) updates.is_active = branchData.isActive;

    const { data, error } = await supabase
      .from('branches')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return formatBranchData(data[0]);
  } catch (error) {
    console.error('Error updating branch:', error);
    throw error;
  }
};
