
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branches';
import { toast } from 'sonner';
import { FinancialTransaction } from '@/types';

export const useIncomeRecords = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();
  
  const fetchIncomeRecords = async (branchId?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const targetBranchId = branchId || currentBranch?.id;
      
      if (!targetBranchId) {
        throw new Error('No branch ID provided');
      }
      
      const { data, error } = await supabase
        .from('income_records')
        .select('*')
        .eq('branch_id', targetBranchId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return data;
    } catch (err: any) {
      setError(err);
      console.error('Error fetching income records:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchIncomeCategories = async (branchId?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const targetBranchId = branchId || currentBranch?.id;
      
      // For categories, we might want to get global categories as well
      let query = supabase
        .from('income_categories')
        .select('*')
        .order('name');
      
      if (targetBranchId) {
        // Either no branch ID (global) or matches the target branch
        query = query.or(`branch_id.is.null,branch_id.eq.${targetBranchId}`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data;
    } catch (err: any) {
      setError(err);
      console.error('Error fetching income categories:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const createIncomeRecord = async (record: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const targetBranchId = record.branch_id || currentBranch?.id;
      
      if (!targetBranchId) {
        throw new Error('No branch ID provided');
      }
      
      // Remove any attachment field as it doesn't exist in the table
      const { data, error } = await supabase
        .from('income_records')
        .insert([{
          ...record,
          branch_id: targetBranchId
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Income record created successfully');
      return data;
    } catch (err: any) {
      setError(err);
      console.error('Error creating income record:', err);
      toast.error(`Failed to create income record: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateIncomeRecord = async (id: string, updates: Partial<FinancialTransaction>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Remove attachment field if present
      const { data, error } = await supabase
        .from('income_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Income record updated successfully');
      return data;
    } catch (err: any) {
      setError(err);
      console.error('Error updating income record:', err);
      toast.error(`Failed to update income record: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteIncomeRecord = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('income_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Income record deleted successfully');
      return true;
    } catch (err: any) {
      setError(err);
      console.error('Error deleting income record:', err);
      toast.error(`Failed to delete income record: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const createIncomeCategory = async (
    name: string, 
    description?: string, 
    branchId?: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const targetBranchId = branchId || currentBranch?.id;
      
      const { data, error } = await supabase
        .from('income_categories')
        .insert([{
          name,
          description,
          branch_id: targetBranchId // Can be null for global categories
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Income category created successfully');
      return data;
    } catch (err: any) {
      setError(err);
      console.error('Error creating income category:', err);
      toast.error(`Failed to create income category: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchIncomeRecords,
    fetchIncomeCategories,
    createIncomeRecord,
    updateIncomeRecord,
    deleteIncomeRecord,
    createIncomeCategory,
    isLoading,
    error,
  };
};
