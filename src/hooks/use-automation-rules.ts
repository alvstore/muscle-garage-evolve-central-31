
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branch';
import { useToast } from './use-toast';
import { AutomationRule } from '@/types/crm';

export const useAutomationRules = () => {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { currentBranch } = useBranch();
  const { toast } = useToast();
  
  const fetchAutomationRules = useCallback(async () => {
    if (!currentBranch?.id) {
      setAutomationRules([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('branch_id', currentBranch.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setAutomationRules(data as AutomationRule[]);
    } catch (err: any) {
      console.error('Error fetching automation rules:', err);
      setError('Failed to load automation rules');
      
      toast({
        title: 'Error',
        description: 'Failed to load automation rules',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id, toast]);
  
  const createAutomationRule = useCallback(async (rule: Omit<AutomationRule, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('automation_rules')
        .insert([{ ...rule, branch_id: currentBranch?.id }])
        .select()
        .single();
      
      if (error) throw error;
      
      setAutomationRules(prev => [data as AutomationRule, ...prev]);
      
      toast({
        title: 'Rule created',
        description: 'Automation rule has been created successfully',
      });
      
      return data as AutomationRule;
    } catch (err: any) {
      console.error('Error creating automation rule:', err);
      
      toast({
        title: 'Error',
        description: err.message || 'Failed to create automation rule',
        variant: 'destructive',
      });
      
      throw err;
    }
  }, [currentBranch?.id, toast]);
  
  const updateAutomationRule = useCallback(async (id: string, updates: Partial<AutomationRule>) => {
    try {
      const { data, error } = await supabase
        .from('automation_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setAutomationRules(prev =>
        prev.map(rule => (rule.id === id ? (data as AutomationRule) : rule))
      );
      
      toast({
        title: 'Rule updated',
        description: 'Automation rule has been updated successfully',
      });
      
      return data as AutomationRule;
    } catch (err: any) {
      console.error('Error updating automation rule:', err);
      
      toast({
        title: 'Error',
        description: err.message || 'Failed to update automation rule',
        variant: 'destructive',
      });
      
      throw err;
    }
  }, [toast]);
  
  const deleteAutomationRule = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setAutomationRules(prev => prev.filter(rule => rule.id !== id));
      
      toast({
        title: 'Rule deleted',
        description: 'Automation rule has been deleted successfully',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error deleting automation rule:', err);
      
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete automation rule',
        variant: 'destructive',
      });
      
      throw err;
    }
  }, [toast]);
  
  const toggleAutomationRule = useCallback(async (id: string, isActive: boolean) => {
    return updateAutomationRule(id, { is_active: isActive });
  }, [updateAutomationRule]);
  
  useEffect(() => {
    fetchAutomationRules();
  }, [fetchAutomationRules]);
  
  return {
    automationRules,
    isLoading,
    error,
    fetchAutomationRules,
    createAutomationRule,
    updateAutomationRule,
    deleteAutomationRule,
    toggleAutomationRule,
  };
};
