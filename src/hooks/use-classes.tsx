
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classService } from '@/services/classService';
import { GymClass, ClassBooking } from '@/types/class';

export const useClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: classService.getClasses,
  });
};

export const useClassDetails = (classId: string) => {
  return useQuery({
    queryKey: ['classes', classId],
    queryFn: () => classService.getClassById(classId),
    enabled: !!classId,
  });
};

export const useClassBookings = (classId: string) => {
  return useQuery({
    queryKey: ['classes', classId, 'bookings'],
    queryFn: () => classService.getClassBookings(classId),
    enabled: !!classId,
  });
};

export const useMemberBookings = (memberId: string) => {
  return useQuery({
    queryKey: ['members', memberId, 'bookings'],
    queryFn: () => classService.getMemberBookings(memberId),
    enabled: !!memberId,
  });
};

export const useBookClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ classId, memberId }: { classId: string; memberId: string }) => 
      classService.bookClass(classId, memberId),
    onSuccess: (data, variables) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['classes', variables.classId, 'bookings'] });
        queryClient.invalidateQueries({ queryKey: ['members', variables.memberId, 'bookings'] });
        queryClient.invalidateQueries({ queryKey: ['classes', variables.classId] });
      }
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bookingId: string) => classService.cancelBooking(bookingId),
    onSuccess: (data, bookingId) => {
      if (data) {
        // Since we don't know exactly which class and member this booking belongs to,
        // we invalidate all bookings queries
        queryClient.invalidateQueries({ queryKey: ['classes'] });
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      }
    },
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bookingId: string) => classService.markAttendance(bookingId),
    onSuccess: (data, bookingId) => {
      if (data) {
        // Invalidate all bookings queries
        queryClient.invalidateQueries({ queryKey: ['classes'] });
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      }
    },
  });
};
