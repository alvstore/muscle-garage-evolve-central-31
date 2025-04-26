
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import devicesService, { HikvisionDevice, EsslDevice } from '@/services/devicesService';
import { toast } from 'sonner';

export const useDevices = (type: 'hikvision' | 'essl', branchId?: string) => {
  const queryClient = useQueryClient();

  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices', type, branchId],
    queryFn: () => type === 'hikvision' 
      ? devicesService.getHikvisionDevices(branchId)
      : devicesService.getEsslDevices(branchId),
  });

  const { mutateAsync: updateDevice } = useMutation({
    mutationFn: (device: Partial<HikvisionDevice | EsslDevice>) =>
      type === 'hikvision'
        ? devicesService.updateHikvisionDevice(device as Partial<HikvisionDevice>)
        : devicesService.updateEsslDevice(device as Partial<EsslDevice>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices', type] });
      toast.success('Device updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update device');
    }
  });

  const { mutateAsync: deleteDevice } = useMutation({
    mutationFn: (id: string) => devicesService.deleteDevice(type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices', type] });
      toast.success('Device deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete device');
    }
  });

  return {
    devices,
    isLoading,
    updateDevice,
    deleteDevice
  };
};
