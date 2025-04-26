
import { supabase } from '@/services/supabaseClient';
import { Branch } from '@/types/branch';
import { toast } from 'sonner';
import { formatBranchData } from '@/utils/branchOperations';

export const useBranchOperations = () => {
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
          manager_id: branch.manager_id,
          opening_hours: branch.openingHours,
          closing_hours: branch.closingHours,
          max_capacity: branch.maxCapacity,
          region: branch.region,
          branch_code: branch.branchCode,
          tax_rate: branch.taxRate,
          timezone: branch.timezone
        })
        .select()
        .single();

      if (error) throw error;
      
      const newBranch = formatBranchData(data);
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
      const mappings = {
        name: 'name',
        address: 'address',
        city: 'city',
        state: 'state',
        country: 'country',
        is_active: 'is_active',
        phone: 'phone',
        email: 'email',
        managerId: 'manager_id',
        openingHours: 'opening_hours',
        closingHours: 'closing_hours',
        maxCapacity: 'max_capacity',
        region: 'region',
        branchCode: 'branch_code',
        taxRate: 'tax_rate',
        timezone: 'timezone'
      } as const;

      Object.entries(mappings).forEach(([key, dbField]) => {
        if (branch[key as keyof typeof branch] !== undefined) {
          updates[dbField] = branch[key as keyof typeof branch];
        }
      });

      const { data, error } = await supabase
        .from('branches')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      const updatedBranch = formatBranchData(data);
      toast.success("Branch updated successfully");
      return updatedBranch;
    } catch (err: any) {
      console.error("Error updating branch:", err);
      toast.error(err.message || "Failed to update branch");
      return null;
    }
  };

  return {
    createBranch,
    updateBranch
  };
};
