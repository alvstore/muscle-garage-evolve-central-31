
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import settingsService, { Setting } from '@/services/settingsService';
import { toast } from 'sonner';

export const useSettings = (category?: string) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings', category],
    queryFn: () => settingsService.getSettings(category),
  });

  const { mutateAsync: updateSetting } = useMutation({
    mutationFn: ({ category, key, value, branchId }: { 
      category: string;
      key: string;
      value: any;
      branchId?: string;
    }) => settingsService.updateSetting(category, key, value, branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update settings');
    }
  });

  const getSetting = useCallback((key: string): Setting | undefined => {
    return settings?.find(s => s.key === key);
  }, [settings]);

  return {
    settings,
    isLoading,
    isSubmitting,
    getSetting,
    updateSetting
  };
};
