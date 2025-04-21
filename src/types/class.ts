
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
  recurring?: boolean;
  recurringPattern?: string;
  duration?: number;
  level?: string;
  status?: string;
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'waitlisted' | 'attended' | 'no-show' | 'pending' | 'booked' | 'missed';

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

export interface AttendanceEntry {
  id?: string;
  memberId: string;
  memberName?: string;
  time: string;
  type: "check-in" | "check-out";
  location?: string;
  device?: string;
  status?: string;
  checkInTime?: string;
  checkOutTime?: string;
  branchId?: string;
}

export interface ProgressMetrics {
  id: string;
  memberId: string;
  date: string;
  metric: string;
  value: number;
  unit: string;
  notes?: string;
}
