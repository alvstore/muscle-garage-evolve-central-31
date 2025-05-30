
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBranch } from './use-branches';
import { leadService } from '@/services/leadService';
import { Lead } from '@/types/crm';
import { toast } from 'sonner';

export const useLeads = () => {
  const { currentBranch } = useBranch();
  const queryClient = useQueryClient();

  const { 
    data: leads = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['leads', currentBranch?.id],
    queryFn: () => leadService.getLeads(currentBranch?.id),
    enabled: !!currentBranch?.id
  });

  const createLeadMutation = useMutation({
    mutationFn: (lead: Partial<Lead>) => leadService.createLead({
      ...lead,
      branch_id: currentBranch?.id
    }),
    onSuccess: () => {
      toast.success('Lead created successfully');
      queryClient.invalidateQueries({ queryKey: ['leads', currentBranch?.id] });
    },
    onError: (error: any) => {
      toast.error(`Failed to create lead: ${error.message}`);
    }
  });

  const updateLeadMutation = useMutation({
    mutationFn: ({ id, lead }: { id: string, lead: Partial<Lead> }) => 
      leadService.updateLead(id, lead),
    onSuccess: () => {
      toast.success('Lead updated successfully');
      queryClient.invalidateQueries({ queryKey: ['leads', currentBranch?.id] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update lead: ${error.message}`);
    }
  });

  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => leadService.deleteLead(id),
    onSuccess: () => {
      toast.success('Lead deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['leads', currentBranch?.id] });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete lead: ${error.message}`);
    }
  });

  return {
    leads,
    isLoading,
    error,
    createLead: createLeadMutation.mutate,
    updateLead: updateLeadMutation.mutate,
    deleteLead: deleteLeadMutation.mutate,
    isCreating: createLeadMutation.isPending,
    isUpdating: updateLeadMutation.isPending,
    isDeleting: deleteLeadMutation.isPending
  };
};
