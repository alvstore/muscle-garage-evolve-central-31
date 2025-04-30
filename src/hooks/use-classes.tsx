
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';
import { useState, useEffect } from 'react';
import { ClassBooking, GymClass } from '@/types/class';
import { toast } from 'sonner';

interface Class {
  id: string;
  name: string;
  description: string;
  trainerId: string;
  schedule: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export const useClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchClasses = async () => {
      if (!currentBranch?.id) {
        setClasses([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('classes')
          .select('*')
          .eq('branch_id', currentBranch.id);

        if (error) throw error;

        const formattedClasses = data?.map(c => ({
          id: c.id,
          name: c.name,
          description: c.description || '',
          trainerId: c.trainer_id,
          schedule: c.recurrence || '',
          capacity: c.capacity,
          createdAt: c.created_at,
          updatedAt: c.updated_at
        })) || [];

        setClasses(formattedClasses);
      } catch (err: any) {
        console.error('Error fetching classes:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();

    // Set up real-time subscription
    if (currentBranch?.id) {
      const channel = supabase
        .channel('classes_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'classes',
          filter: `branch_id=eq.${currentBranch.id}`
        }, () => {
          fetchClasses();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentBranch?.id]);

  return {
    classes,
    isLoading,
    error
  };
};

// New hook to fetch class bookings
export const useClassBookings = (classId: string) => {
  return useQuery({
    queryKey: ['classBookings', classId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('class_bookings')
          .select(`
            id,
            class_id,
            member_id,
            status,
            attended,
            created_at,
            updated_at,
            members:member_id (
              id,
              name,
              email
            )
          `)
          .eq('class_id', classId);
          
        if (error) throw error;
        
        // Format the bookings to match the expected structure
        const formattedBookings = data?.map(booking => ({
          id: booking.id,
          classId: booking.class_id,
          memberId: booking.member_id,
          memberName: booking.members?.name || 'Unknown',
          memberAvatar: '', // No avatar field in the data, set to empty
          status: booking.status as BookingStatus,
          bookingDate: booking.created_at,
          createdAt: booking.created_at,
          updatedAt: booking.updated_at,
          attendanceTime: booking.attended ? booking.updated_at : undefined
        })) || [];
        
        return formattedBookings;
      } catch (err) {
        console.error('Error fetching class bookings:', err);
        throw err;
      }
    },
    enabled: !!classId
  });
};

// Booking types
type BookingStatus = "pending" | "confirmed" | "cancelled" | "attended" | "missed" | "booked" | "no-show";

// Hook to book a class
export const useBookClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ classId, memberId }: { classId: string; memberId: string }) => {
      try {
        // First get the class details to check availability
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('*')
          .eq('id', classId)
          .single();
          
        if (classError) throw classError;
        
        // Check if class is full
        if (classData.enrolled >= classData.capacity) {
          throw new Error('This class is already full');
        }
        
        // Create booking
        const { data, error } = await supabase
          .from('class_bookings')
          .insert([
            { 
              class_id: classId, 
              member_id: memberId, 
              status: 'confirmed',
              branch_id: classData.branch_id
            }
          ])
          .select(`
            id,
            class_id,
            member_id,
            status,
            created_at,
            updated_at,
            members:member_id (
              id,
              name
            )
          `)
          .single();
          
        if (error) throw error;
        
        // Update class enrollment count
        await supabase
          .from('classes')
          .update({ enrolled: classData.enrolled + 1 })
          .eq('id', classId);
        
        // Format the response to match expected structure  
        const booking: ClassBooking = {
          id: data.id,
          classId: data.class_id,
          memberId: data.member_id,
          memberName: data.members?.name || 'Unknown',
          memberAvatar: '',
          bookingDate: data.created_at,
          status: data.status as BookingStatus,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        return booking;
      } catch (err) {
        console.error('Error booking class:', err);
        throw err;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['classBookings', variables.classId] });
      toast.success('Class booked successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to book class');
    }
  });
};
