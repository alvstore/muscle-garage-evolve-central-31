import { useState, useEffect } from 'react';
import settingsService from '@/services/settingsService';
import { useBranch } from './use-branch';
import { toast } from 'sonner';
import { AutomationRule } from '@/types/crm';

export const useAutomationRules = () => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { currentBranch } = useBranch();

  // Fix the issue with setting automation rules
  const fetchAutomationRules = async () => {
    setLoading(true);
    try {
      const result = await settingsService.getAutomationRules(currentBranch?.id);
      
      if (result.data) {
        // Cast the data to AutomationRule[]
        setRules(result.data as AutomationRule[]);
      }
      
      if (result.error) {
        console.error('Error fetching automation rules:', result.error);
        throw result.error;
      }
    } catch (error) {
      console.error('Error in fetchAutomationRules:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveRule = async (rule: Omit<AutomationRule, 'id'> & { id?: string }) => {
    setIsSaving(true);
    try {
      // Ensure the branch_id is set
      const ruleToSave = {
        ...rule,
        branch_id: currentBranch?.id,
      };
      
      const result = await settingsService.saveAutomationRule(ruleToSave as AutomationRule);
      if (result) {
        await fetchAutomationRules(); // Refresh the rules list
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      const success = await settingsService.deleteAutomationRule(ruleId);
      if (success) {
        setRules(rules.filter(rule => rule.id !== ruleId));
      }
      return success;
    } catch (err: any) {
      setError(err);
      return false;
    }
  };

  const toggleRuleStatus = async (ruleId: string, isActive: boolean) => {
    const ruleToUpdate = rules.find(rule => rule.id === ruleId);
    if (!ruleToUpdate) {
      toast.error("Rule not found");
      return false;
    }

    try {
      const result = await saveRule({
        ...ruleToUpdate,
        is_active: isActive
      });
      
      if (result) {
        setRules(rules.map(rule => 
          rule.id === ruleId ? { ...rule, is_active: isActive } : rule
        ));
      }
      
      return result;
    } catch (err) {
      console.error("Error toggling rule status:", err);
      return false;
    }
  };

  useEffect(() => {
    if (currentBranch?.id) {
      fetchAutomationRules();
    }
  }, [currentBranch?.id]);

  return {
    rules,
    isLoading,
    error,
    isSaving,
    fetchAutomationRules,
    saveRule,
    deleteRule,
    toggleRuleStatus,
  };
};
