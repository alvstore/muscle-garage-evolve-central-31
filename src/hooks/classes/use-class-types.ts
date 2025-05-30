import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classTypesService } from '@/services/classes/class-types-service';
import { ClassType } from '@/types/classes';
import { toast } from 'sonner';

export const useClassTypes = (branchId?: string) => {
  return useQuery({
    queryKey: ['class-types', branchId],
    queryFn: () => classTypesService.fetchClassTypes(branchId),
    enabled: true, // Always enabled, even if branchId is undefined
  });
};

export const useCreateClassType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (classType: Partial<ClassType>) => 
      classTypesService.createClassType(classType),
    onSuccess: () => {
      toast.success('Class type created successfully');
      queryClient.invalidateQueries({ queryKey: ['class-types'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to create class type: ${error.message}`);
    }
  });
};

export const useUpdateClassType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ClassType> }) => 
      classTypesService.updateClassType(id, updates),
    onSuccess: () => {
      toast.success('Class type updated successfully');
      queryClient.invalidateQueries({ queryKey: ['class-types'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update class type: ${error.message}`);
    }
  });
};

export const useDeleteClassType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => 
      classTypesService.deleteClassType(id),
    onSuccess: () => {
      toast.success('Class type deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['class-types'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete class type: ${error.message}`);
    }
  });
};
