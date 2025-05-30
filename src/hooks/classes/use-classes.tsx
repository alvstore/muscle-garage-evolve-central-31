
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classService } from '@/services/classes/classService';
import { GymClass, ClassBooking } from '@/types/class';
import { toast } from 'sonner';

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

interface BookClassVariables {
  classId: string;
  memberId: string;
}

export const useBookClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ClassBooking | null, Error, BookClassVariables>({
    mutationFn: ({ classId, memberId }) => classService.bookClass(classId, memberId),
    onSuccess: (data, variables) => {
      if (data) {
        toast.success('Class booked successfully');
        // Invalidate affected queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['classes', variables.classId, 'bookings'] });
        queryClient.invalidateQueries({ queryKey: ['members', variables.memberId, 'bookings'] });
        queryClient.invalidateQueries({ queryKey: ['classes', variables.classId] });
        queryClient.invalidateQueries({ queryKey: ['classes'] }); // Refresh all classes to update enrolled count
      }
    },
    onError: (error: any) => {
      console.error('Booking error:', error);
      
      // Detailed error handling based on error type
      const errorMessage = error?.response?.data?.message || 
                        'Failed to book class. Please try again later.';
      toast.error(errorMessage);
    }
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bookingId: string) => classService.cancelBooking(bookingId),
    onSuccess: (data, bookingId) => {
      if (data) {
        toast.success('Booking cancelled successfully');
        // Invalidate all related queries
        queryClient.invalidateQueries({ queryKey: ['classes'] });
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      }
    },
    onError: (error: any) => {
      console.error('Cancellation error:', error);
      const errorMessage = error?.response?.data?.message || 
                        'Failed to cancel booking. Please try again later.';
      toast.error(errorMessage);
    }
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bookingId: string) => classService.markAttendance(bookingId),
    onSuccess: (data, bookingId) => {
      if (data) {
        toast.success('Attendance marked successfully');
        // Invalidate all related queries
        queryClient.invalidateQueries({ queryKey: ['classes'] });
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      }
    },
    onError: (error: any) => {
      console.error('Attendance marking error:', error);
      const errorMessage = error?.response?.data?.message || 
                        'Failed to mark attendance. Please try again later.';
      toast.error(errorMessage);
    }
  });
};
