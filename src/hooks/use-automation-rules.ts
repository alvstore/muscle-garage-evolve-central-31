
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AutomationRule {
  id?: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_condition: Record<string, any>;
  actions: {
    type: string;
    config: Record<string, any>;
  }[];
  is_active: boolean;
  branch_id?: string | null;
  created_by?: string;
}

export const useAutomationRules = (branchId: string | null = null) => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchRules = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase.from('automation_rules').select('*');

      // Filter by branch if provided
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      setRules(data || []);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error('Error fetching automation rules:', err);
      toast.error(`Failed to load automation rules: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveRule = async (rule: AutomationRule): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);

      let response;
      if (rule.id) {
        // Update existing rule
        const { data, error: updateError } = await supabase
          .from('automation_rules')
          .update(rule)
          .eq('id', rule.id)
          .select();

        if (updateError) throw updateError;
        response = data?.[0];
      } else {
        // Insert new rule with branch_id if provided
        const newRule = {
          ...rule,
          branch_id: branchId || null
        };

        const { data, error: insertError } = await supabase
          .from('automation_rules')
          .insert(newRule)
          .select();

        if (insertError) throw insertError;
        response = data?.[0];
      }

      if (response) {
        // Update rules array
        const updatedRules = [...rules];
        const index = updatedRules.findIndex(r => r.id === response.id);
        
        if (index >= 0) {
          updatedRules[index] = response;
        } else {
          updatedRules.push(response);
        }
        
        setRules(updatedRules);
        toast.success(`Rule "${rule.name}" saved successfully`);
        return true;
      }
      
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error('Error saving automation rule:', err);
      toast.error(`Failed to save rule: ${errorMessage}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRule = async (id: string): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('automation_rules')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update rules array
      setRules(rules.filter(rule => rule.id !== id));
      toast.success('Rule deleted successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error('Error deleting automation rule:', err);
      toast.error(`Failed to delete rule: ${errorMessage}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRuleStatus = async (id: string, isActive: boolean): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('automation_rules')
        .update({ is_active: isActive })
        .eq('id', id)
        .select();

      if (updateError) throw updateError;

      if (data && data[0]) {
        // Update rules array
        const updatedRules = rules.map(rule => 
          rule.id === id ? { ...rule, is_active: isActive } : rule
        );
        
        setRules(updatedRules);
        toast.success(`Rule ${isActive ? 'activated' : 'deactivated'} successfully`);
        return true;
      }

      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error('Error toggling automation rule status:', err);
      toast.error(`Failed to update rule status: ${errorMessage}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Initial fetch of rules
  useEffect(() => {
    fetchRules();
  }, [branchId]);

  return {
    rules,
    isLoading,
    error,
    isSaving,
    fetchRules,
    saveRule,
    deleteRule,
    toggleRuleStatus
  };
};
