
import { useState, useEffect } from 'react';
import settingsService from '@/services/settingsService';
import { useBranch } from './use-branch';
import { toast } from 'sonner';

export interface AutomationRule {
  id?: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_condition: any;
  actions: any[];
  is_active: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useAutomationRules = () => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { currentBranch } = useBranch();

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const data = await settingsService.getAutomationRules(currentBranch?.id);
      setRules(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRule = async (rule: AutomationRule) => {
    setIsSaving(true);
    try {
      // Ensure the branch_id is set
      const ruleToSave = {
        ...rule,
        branch_id: currentBranch?.id
      };
      
      const result = await settingsService.saveAutomationRule(ruleToSave);
      if (result) {
        await fetchRules(); // Refresh the rules list
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
      fetchRules();
    }
  }, [currentBranch?.id]);

  return {
    rules,
    isLoading,
    error,
    isSaving,
    fetchRules,
    saveRule,
    deleteRule,
    toggleRuleStatus,
  };
};
