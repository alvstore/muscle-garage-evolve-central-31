
export interface GymClass {
  id: string;
  name: string;
  description?: string;
  trainerId: string;
  trainer?: {
    id: string;
    name: string;
    avatar?: string;
  };
  capacity: number;
  enrolled: number;
  startTime: string;
  endTime: string;
  type: string;
  location: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  branchId?: string;
  trainerName?: string;
  trainerAvatar?: string;
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'waitlisted' | 'attended' | 'no-show' | 'pending' | 'booked';

export interface ClassBooking {
  id: string;
  classId: string;
  className?: string;
  memberId: string;
  memberName?: string;
  memberAvatar?: string;
  bookingDate: string;
  status: BookingStatus;
  attendanceStatus?: 'absent' | 'present' | 'late';
  attendanceTime?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
