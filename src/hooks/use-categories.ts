
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branches';
import { toast } from 'sonner';

export interface Category {
  id: string;
  name: string;
  description?: string;
  branch_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCategories = (type: 'income' | 'expense') => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentBranch } = useBranch();
  
  const tableName = `${type}_categories`;

  const fetchCategories = useCallback(async () => {
    if (!currentBranch?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('branch_id', currentBranch.id)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      setCategories(data);
    } catch (error) {
      console.error(`Error fetching ${type} categories:`, error);
      toast.error(`Failed to fetch ${type} categories`);
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id, tableName, type]);

  const createCategory = async (name: string, description?: string) => {
    if (!currentBranch?.id) {
      toast.error('No branch selected');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert([
          {
            name,
            description,
            branch_id: currentBranch.id,
            is_active: true
          }
        ])
        .select();

      if (error) throw error;
      
      const newCategory = data[0] as Category;
      setCategories([...categories, newCategory]);
      toast.success(`${type} category created successfully`);
      return newCategory;
    } catch (error) {
      console.error(`Error creating ${type} category:`, error);
      toast.error(`Failed to create ${type} category`);
      return null;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, ...updates } : cat
      ));
      
      toast.success(`${type} category updated successfully`);
      return true;
    } catch (error) {
      console.error(`Error updating ${type} category:`, error);
      toast.error(`Failed to update ${type} category`);
      return false;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from(tableName)
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      
      setCategories(categories.filter(cat => cat.id !== id));
      toast.success(`${type} category deleted successfully`);
      return true;
    } catch (error) {
      console.error(`Error deleting ${type} category:`, error);
      toast.error(`Failed to delete ${type} category`);
      return false;
    }
  };

  useEffect(() => {
    if (currentBranch?.id) {
      fetchCategories();
    }
  }, [currentBranch?.id, fetchCategories]);

  return {
    categories,
    isLoading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
};
