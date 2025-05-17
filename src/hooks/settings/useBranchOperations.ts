
import { useState } from 'react';
import { Branch } from '@/types/settings/branch';
import { toast } from '@/utils/toast-manager';
import { createBranchInDb, updateBranchInDb } from '@/utils/branchOperations';

export const useBranchOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const createBranch = async (branchData: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>): Promise<Branch | null> => {
    try {
      setIsLoading(true);
      const newBranch = await createBranchInDb(branchData);
      toast.success(`Branch "${branchData.name}" created successfully`);
      return newBranch;
    } catch (error: any) {
      console.error('Error creating branch:', error);
      toast.error(error.message || 'Failed to create branch');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateBranch = async (id: string, branchData: Partial<Branch>): Promise<Branch | null> => {
    try {
      setIsLoading(true);
      const updatedBranch = await updateBranchInDb(id, branchData);
      toast.success(`Branch updated successfully`);
      return updatedBranch;
    } catch (error: any) {
      console.error('Error updating branch:', error);
      toast.error(error.message || 'Failed to update branch');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    createBranch,
    updateBranch,
    isLoading
  };
};
