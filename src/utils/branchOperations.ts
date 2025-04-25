
import { supabase } from '@/services/supabaseClient';
import { Branch } from '@/types/branch';

export const fetchUserBranches = async (userId: string) => {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('branch_id, accessible_branch_ids, role')
    .eq('id', userId)
    .single();

  if (profileError) throw profileError;

  let branchesQuery;
  if (profile.role === 'admin') {
    branchesQuery = supabase.from('branches').select('*').order('name');
  } else if (profile.accessible_branch_ids?.length > 0) {
    branchesQuery = supabase
      .from('branches')
      .select('*')
      .in('id', [profile.branch_id, ...profile.accessible_branch_ids])
      .order('name');
  } else {
    branchesQuery = supabase
      .from('branches')
      .select('*')
      .eq('id', profile.branch_id)
      .order('name');
  }

  const { data: branchesData, error: branchesError } = await branchesQuery;
  if (branchesError) throw branchesError;

  return {
    branchesData,
    primaryBranchId: profile.branch_id
  };
};

export const formatBranchData = (branch: any): Branch => ({
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
  maxCapacity: branch.max_capacity || 0,
  region: branch.region || '',
  branchCode: branch.branch_code || '',
  taxRate: branch.tax_rate || 0,
  timezone: branch.timezone || '',
  createdAt: branch.created_at || '',
  updatedAt: branch.updated_at || ''
});
