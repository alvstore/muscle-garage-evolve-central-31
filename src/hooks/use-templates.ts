
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import templatesService, { Template } from '@/services/templatesService';
import { toast } from 'sonner';

export const useTemplates = (type: 'email' | 'sms' | 'whatsapp') => {
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates', type],
    queryFn: () => templatesService.getTemplates(type),
  });

  const { mutateAsync: updateTemplate } = useMutation({
    mutationFn: (template: Partial<Template>) => 
      templatesService.updateTemplate(type, template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates', type] });
      toast.success('Template updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update template');
    }
  });

  const { mutateAsync: deleteTemplate } = useMutation({
    mutationFn: (id: string) => templatesService.deleteTemplate(type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates', type] });
      toast.success('Template deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete template');
    }
  });

  return {
    templates,
    isLoading,
    updateTemplate,
    deleteTemplate
  };
};
