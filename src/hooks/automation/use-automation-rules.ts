
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { integrationsService } from '@/services/integrationsService';
import { AutomationRule } from '@/types/crm';
import { useBranch } from '@/hooks/use-branches';
import { toast } from 'sonner';
import { useState } from 'react';

export const useAutomationRules = () => {
  const { currentBranch } = useBranch();
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const queryClient = useQueryClient();

  // Fetch automation rules
  const {
    data: automationRules,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['automationRules', currentBranch?.id],
    queryFn: () => integrationsService.getAutomationRules(currentBranch?.id),
    enabled: !!currentBranch?.id,
  });

  // Create/Update automation rule mutation
  const saveRuleMutation = useMutation({
    mutationFn: (rule: Partial<AutomationRule>) => integrationsService.saveAutomationRule(rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automationRules'] });
      toast.success('Automation rule saved successfully');
      setSelectedRule(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to save rule: ${error.message}`);
    },
  });

  // Delete automation rule mutation
  const deleteRuleMutation = useMutation({
    mutationFn: (id: string) => integrationsService.deleteAutomationRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automationRules'] });
      toast.success('Automation rule deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete rule: ${error.message}`);
    },
  });

  const selectRule = (rule: AutomationRule | null) => {
    setSelectedRule(rule);
  };

  const saveRule = (rule: Partial<AutomationRule>) => {
    saveRuleMutation.mutate({
      ...rule,
      branch_id: currentBranch?.id,
    });
  };

  const deleteRule = (id: string) => {
    if (window.confirm('Are you sure you want to delete this automation rule?')) {
      deleteRuleMutation.mutate(id);
    }
  };

  return {
    automationRules,
    isLoading,
    error,
    selectedRule,
    selectRule,
    saveRule,
    deleteRule,
    isSaving: saveRuleMutation.isPending,
    isDeleting: deleteRuleMutation.isPending,
  };
};
