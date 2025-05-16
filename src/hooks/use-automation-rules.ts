
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { integrationsService } from '@/services';
import { useBranch } from './use-branch';
import { AutomationRule } from '@/types/crm';

export const useAutomationRules = () => {
  const { currentBranch } = useBranch();
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const fetchRules = useCallback(async () => {
    try {
      if (!currentBranch?.id) return [];
      
      const fetchedRules = await integrationsService.getAutomationRules(currentBranch.id);
      if (fetchedRules) {
        setRules(fetchedRules);
        return fetchedRules;
      }
      return [];
    } catch (error: any) {
      console.error('Error fetching automation rules:', error);
      setError(error);
      return [];
    }
  }, [currentBranch?.id]);

  const { isLoading, refetch } = useQuery({
    queryKey: ['automationRules', currentBranch?.id],
    queryFn: fetchRules,
    enabled: !!currentBranch?.id,
  });

  const saveRule = async (rule: AutomationRule): Promise<boolean> => {
    try {
      if (!currentBranch?.id) return false;
      
      const result = await integrationsService.saveAutomationRule({
        ...rule,
        branch_id: currentBranch.id
      });
      
      if (result) {
        refetch();
      }
      
      return !!result;
    } catch (error) {
      console.error('Error saving automation rule:', error);
      return false;
    }
  };

  const deleteRule = async (id: string): Promise<boolean> => {
    try {
      const result = await integrationsService.deleteAutomationRule(id);
      
      if (result) {
        refetch();
      }
      
      return result;
    } catch (error) {
      console.error('Error deleting automation rule:', error);
      return false;
    }
  };

  return {
    rules,
    isLoading,
    error,
    saveRule,
    deleteRule,
    refreshRules: refetch,
  };
};
