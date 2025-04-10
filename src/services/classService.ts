
import api from './api';
import { GymClass, ClassBooking } from '@/types/class';
import { toast } from 'sonner';

export const classService = {
  // Fetch all classes
  async getClasses(): Promise<GymClass[]> {
    try {
      const response = await api.get<GymClass[]>('/classes');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch classes';
      toast.error(errorMessage);
      return [];
    }
  },
  
  // Fetch a specific class by ID
  async getClassById(classId: string): Promise<GymClass | null> {
    try {
      const response = await api.get<GymClass>(`/classes/${classId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch class details';
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Create a new class booking
  async bookClass(classId: string, memberId: string): Promise<ClassBooking | null> {
    try {
      const response = await api.post<ClassBooking>('/bookings', { classId, memberId });
      toast.success('Class booked successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to book class';
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Cancel a class booking
  async cancelBooking(bookingId: string): Promise<boolean> {
    try {
      await api.delete(`/bookings/${bookingId}`);
      toast.success('Booking cancelled successfully');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel booking';
      toast.error(errorMessage);
      return false;
    }
  },
  
  // Get all bookings for a class
  async getClassBookings(classId: string): Promise<ClassBooking[]> {
    try {
      const response = await api.get<ClassBooking[]>(`/classes/${classId}/bookings`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch class bookings';
      toast.error(errorMessage);
      return [];
    }
  },
  
  // Get all bookings for a member
  async getMemberBookings(memberId: string): Promise<ClassBooking[]> {
    try {
      const response = await api.get<ClassBooking[]>(`/members/${memberId}/bookings`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch member bookings';
      toast.error(errorMessage);
      return [];
    }
  },
  
  // Mark attendance for a booking
  async markAttendance(bookingId: string): Promise<boolean> {
    try {
      await api.post(`/bookings/${bookingId}/attendance`);
      toast.success('Attendance marked successfully');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to mark attendance';
      toast.error(errorMessage);
      return false;
    }
  }
};
